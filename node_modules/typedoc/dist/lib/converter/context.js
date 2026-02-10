import { ok as assert } from "assert";
import ts from "typescript";
import { Comment, ContainerReflection, DeclarationReflection, ReferenceType, ReflectionFlag, ReflectionKind, } from "../models/index.js";
import { isNamedNode } from "./utils/nodes.js";
import { ConverterEvents } from "./converter-events.js";
import { resolveAliasedSymbol } from "./utils/symbols.js";
import { getComment, getFileComment, getJsDocComment, getNodeComment, getSignatureComment, } from "./comments/index.js";
import { getHumanName, getQualifiedName } from "../utils/tsutils.js";
import { findPackageForPath, normalizePath } from "#node-utils";
import { createSymbolIdImpl } from "./factories/symbol-id.js";
import { removeIf } from "#utils";
/**
 * The context describes the current state the converter is in.
 */
export class Context {
    /**
     * The converter instance that has created the context.
     */
    converter;
    /**
     * The TypeChecker instance returned by the TypeScript compiler.
     */
    get checker() {
        return this.program.getTypeChecker();
    }
    /**
     * The program currently being converted.
     * Accessing this property will throw if a source file is not currently being converted.
     */
    get program() {
        assert(this._program, "Tried to access Context.program when not converting a source file");
        return this._program;
    }
    _program;
    /**
     * All programs being converted.
     */
    programs;
    /**
     * The project that is currently processed.
     */
    project;
    /**
     * The scope or parent reflection that is currently processed.
     */
    scope;
    convertingTypeNode = false; // Inherited by withScope
    convertingClassOrInterface = false; // Not inherited
    shouldBeStatic = false; // Not inherited
    inlineType = new Set(); // Inherited by withScope
    preventInline = new Set(); // Inherited by withScope
    reflectionIdToSymbolMap = new Map();
    /**
     * Create a new Context instance.
     *
     * @param converter  The converter instance that has created the context.
     * @internal
     */
    constructor(converter, programs, project, scope = project) {
        this.converter = converter;
        this.programs = programs;
        this.project = project;
        this.scope = scope;
    }
    /** @internal */
    get logger() {
        return this.converter.application.logger;
    }
    /**
     * Return the type declaration of the given node.
     *
     * @param node  The TypeScript node whose type should be resolved.
     * @returns The type declaration of the given node.
     */
    getTypeAtLocation(node) {
        let nodeType;
        try {
            nodeType = this.checker.getTypeAtLocation(node);
        }
        catch {
            // ignore
        }
        if (!nodeType) {
            if (node.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.symbol);
                // The TS types lie due to ts.SourceFile
            }
            else if (node.parent?.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.parent.symbol);
                // The TS types lie due to ts.SourceFile
            }
            else if (node.parent?.parent?.symbol) {
                nodeType = this.checker.getDeclaredTypeOfSymbol(node.parent.parent.symbol);
            }
        }
        return nodeType;
    }
    getSymbolAtLocation(node) {
        let symbol = this.checker.getSymbolAtLocation(node);
        if (!symbol && isNamedNode(node)) {
            symbol = this.checker.getSymbolAtLocation(node.name);
        }
        return symbol;
    }
    expectSymbolAtLocation(node) {
        const symbol = this.getSymbolAtLocation(node);
        if (!symbol) {
            const { line } = ts.getLineAndCharacterOfPosition(node.getSourceFile(), node.pos);
            throw new Error(`Expected a symbol for node with kind ${ts.SyntaxKind[node.kind]} at ${node.getSourceFile().fileName}:${line + 1}`);
        }
        return symbol;
    }
    resolveAliasedSymbol(symbol) {
        return resolveAliasedSymbol(symbol, this.checker);
    }
    createDeclarationReflection(kind, symbol, exportSymbol, 
    // We need this because modules don't always have symbols.
    nameOverride) {
        const name = getHumanName(nameOverride ?? exportSymbol?.name ?? symbol?.name ?? "unknown");
        if (this.convertingClassOrInterface) {
            if (kind === ReflectionKind.Function) {
                kind = ReflectionKind.Method;
            }
            if (kind === ReflectionKind.Variable) {
                kind = ReflectionKind.Property;
            }
        }
        const reflection = new DeclarationReflection(name, kind, this.scope);
        this.postReflectionCreation(reflection, symbol, exportSymbol);
        return reflection;
    }
    postReflectionCreation(reflection, symbol, exportSymbol) {
        // Allow comments on export declarations to take priority over comments directly
        // on the symbol to enable overriding comments on modules/references, #1504
        if (!reflection.comment &&
            exportSymbol &&
            (reflection.kind &
                (ReflectionKind.SomeModule | ReflectionKind.Reference))) {
            reflection.comment = this.getComment(exportSymbol, reflection.kind);
        }
        // If that didn't get us a comment (the normal case), then get the comment from
        // the source declarations, this is the common case.
        if (symbol && !reflection.comment) {
            reflection.comment = this.getComment(symbol, reflection.kind);
        }
        // If we still don't have a comment, check for any comments on the export declaration,
        // we don't have to worry about functions being weird in this case as the regular declaration
        // doesn't have any comment.
        if (exportSymbol && !reflection.comment) {
            reflection.comment = this.getComment(exportSymbol, ReflectionKind.Reference);
        }
        if (this.shouldBeStatic) {
            reflection.setFlag(ReflectionFlag.Static);
        }
        if (reflection instanceof DeclarationReflection) {
            reflection.escapedName = symbol?.escapedName ? String(symbol.escapedName) : undefined;
            this.addChild(reflection);
        }
        if (symbol && this.converter.isExternal(symbol, this.checker)) {
            reflection.setFlag(ReflectionFlag.External);
        }
        if (exportSymbol) {
            this.registerReflection(reflection, exportSymbol, void 0);
        }
        const path = reflection.kindOf(ReflectionKind.Namespace | ReflectionKind.Module)
            ? symbol?.declarations?.find(ts.isSourceFile)?.fileName
            : undefined;
        if (path) {
            this.registerReflection(reflection, symbol, normalizePath(path));
        }
        else {
            this.registerReflection(reflection, symbol, undefined);
        }
    }
    finalizeDeclarationReflection(reflection) {
        this.converter.trigger(ConverterEvents.CREATE_DECLARATION, this, reflection);
        if (reflection.kindOf(ReflectionKind.MayContainDocuments)) {
            this.converter.processDocumentTags(reflection, reflection);
        }
    }
    /**
     * Create a {@link ReferenceType} which points to the provided symbol.
     *
     * @privateRemarks
     * This is available on Context so that it can be monkey-patched by typedoc-plugin-missing-exports
     */
    createSymbolReference(symbol, context, name) {
        const ref = ReferenceType.createUnresolvedReference(name ?? symbol.name, this.createSymbolId(symbol), context.project, getQualifiedName(symbol, name ?? symbol.name));
        ref.refersToTypeParameter = !!(symbol.flags & ts.SymbolFlags.TypeParameter);
        const symbolPath = symbol.declarations?.[0]?.getSourceFile().fileName;
        if (!symbolPath)
            return ref;
        ref.package = findPackageForPath(symbolPath)?.[0];
        return ref;
    }
    /**
     * Create a stable {@link ReflectionSymbolId} for the provided symbol,
     * optionally targeting a specific declaration.
     *
     * @privateRemarks
     * This is available on Context so that it can be monkey-patched by typedoc-plugin-missing-exports
     * It might also turn out to be generally useful for other plugin users.
     */
    createSymbolId(symbol, declaration) {
        return createSymbolIdImpl(symbol, declaration);
    }
    addChild(reflection) {
        if (this.scope instanceof ContainerReflection) {
            this.scope.addChild(reflection);
        }
    }
    shouldIgnore(symbol) {
        return this.converter.shouldIgnore(symbol, this.checker);
    }
    /**
     * Register a newly generated reflection. All created reflections should be
     * passed to this method to ensure that the project helper functions work correctly.
     *
     * @param reflection  The reflection that should be registered.
     * @param symbol  The symbol the given reflection was resolved from.
     */
    registerReflection(reflection, symbol, filePath) {
        if (symbol) {
            this.reflectionIdToSymbolMap.set(reflection.id, symbol);
            const id = this.createSymbolId(symbol);
            // #2466
            // If we just registered a member of a class or interface, then we need to check if
            // we've registered this symbol before under the wrong parent reflection.
            // This can happen because the compiler API will use non-dependently-typed symbols
            // for properties of classes/interfaces which inherit them, so we can't rely on the
            // property being unique for each class.
            if (reflection.parent?.kindOf(ReflectionKind.ClassOrInterface) &&
                reflection.kindOf(ReflectionKind.SomeMember)) {
                const saved = this.project["symbolToReflectionIdMap"].get(id);
                const parentSymbolReflection = symbol.parent &&
                    this.getReflectionFromSymbol(symbol.parent);
                if (typeof saved === "object" &&
                    saved.length > 1 &&
                    parentSymbolReflection) {
                    removeIf(saved, (item) => this.project.getReflectionById(item)?.parent !==
                        parentSymbolReflection);
                }
            }
            this.project.registerReflection(reflection, id, filePath);
        }
        else {
            this.project.registerReflection(reflection, void 0, filePath);
        }
    }
    getReflectionFromSymbol(symbol) {
        return this.project.getReflectionFromSymbolId(this.createSymbolId(symbol));
    }
    getSymbolFromReflection(reflection) {
        return this.reflectionIdToSymbolMap.get(reflection.id);
    }
    /** @internal */
    setActiveProgram(program) {
        this._program = program;
    }
    createCommentContext() {
        return {
            config: this.converter.config,
            logger: this.logger,
            checker: this.checker,
            files: this.project.files,
            createSymbolId: (s, d) => this.createSymbolId(s, d),
        };
    }
    getComment(symbol, kind) {
        return getComment(symbol, kind, this.createCommentContext());
    }
    getNodeComment(node, moduleComment) {
        return getNodeComment(node, moduleComment, this.createCommentContext());
    }
    getFileComment(node) {
        return getFileComment(node, this.createCommentContext());
    }
    getJsDocComment(declaration) {
        return getJsDocComment(declaration, this.createCommentContext());
    }
    getSignatureComment(declaration) {
        return getSignatureComment(declaration, this.createCommentContext());
    }
    shouldInline(symbol, name) {
        if (this.preventInline.has(name))
            return false;
        if (this.inlineType.has(name))
            return true;
        return this
            .getComment(symbol, ReflectionKind.Interface)
            ?.hasModifier("@inline") ?? false;
    }
    withScope(scope) {
        assert(scope.parent === this.scope || scope === this.scope, "Incorrect context used for withScope");
        const context = new Context(this.converter, this.programs, this.project, scope);
        context.convertingTypeNode = this.convertingTypeNode;
        context.setActiveProgram(this._program);
        context.reflectionIdToSymbolMap = this.reflectionIdToSymbolMap;
        context.preventInline = new Set(this.preventInline);
        context.inlineType = new Set(this.inlineType);
        for (const tag of scope.comment?.blockTags || []) {
            if (tag.tag === "@preventInline") {
                context.preventInline.add(Comment.combineDisplayParts(tag.content));
            }
            else if (tag.tag === "@inlineType") {
                context.inlineType.add(Comment.combineDisplayParts(tag.content));
            }
        }
        return context;
    }
}
