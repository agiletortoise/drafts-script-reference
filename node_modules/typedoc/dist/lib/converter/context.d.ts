import ts from "typescript";
import { Comment, DeclarationReflection, type DocumentReflection, type ProjectReflection, ReferenceType, type Reflection, ReflectionKind } from "../models/index.js";
import type { Converter } from "./converter.js";
import { type NormalizedPath } from "#utils";
/**
 * The context describes the current state the converter is in.
 */
export declare class Context {
    /**
     * The converter instance that has created the context.
     */
    readonly converter: Converter;
    /**
     * The TypeChecker instance returned by the TypeScript compiler.
     */
    get checker(): ts.TypeChecker;
    /**
     * The program currently being converted.
     * Accessing this property will throw if a source file is not currently being converted.
     */
    get program(): ts.Program;
    private _program?;
    /**
     * All programs being converted.
     */
    readonly programs: readonly ts.Program[];
    /**
     * The project that is currently processed.
     */
    readonly project: ProjectReflection;
    /**
     * The scope or parent reflection that is currently processed.
     */
    readonly scope: Reflection;
    convertingTypeNode: boolean;
    convertingClassOrInterface: boolean;
    shouldBeStatic: boolean;
    inlineType: Set<string>;
    preventInline: Set<string>;
    private reflectionIdToSymbolMap;
    /**
     * Create a new Context instance.
     *
     * @param converter  The converter instance that has created the context.
     * @internal
     */
    constructor(converter: Converter, programs: readonly ts.Program[], project: ProjectReflection, scope?: Reflection);
    /** @internal */
    get logger(): import("#utils").Logger;
    /**
     * Return the type declaration of the given node.
     *
     * @param node  The TypeScript node whose type should be resolved.
     * @returns The type declaration of the given node.
     */
    getTypeAtLocation(node: ts.Node): ts.Type | undefined;
    getSymbolAtLocation(node: ts.Node): ts.Symbol | undefined;
    expectSymbolAtLocation(node: ts.Node): ts.Symbol;
    resolveAliasedSymbol(symbol: ts.Symbol): ts.Symbol;
    createDeclarationReflection(kind: ReflectionKind, symbol: ts.Symbol | undefined, exportSymbol: ts.Symbol | undefined, nameOverride?: string): DeclarationReflection;
    postReflectionCreation(reflection: Reflection, symbol: ts.Symbol | undefined, exportSymbol: ts.Symbol | undefined): void;
    finalizeDeclarationReflection(reflection: DeclarationReflection): void;
    /**
     * Create a {@link ReferenceType} which points to the provided symbol.
     *
     * @privateRemarks
     * This is available on Context so that it can be monkey-patched by typedoc-plugin-missing-exports
     */
    createSymbolReference(symbol: ts.Symbol, context: Context, name?: string): ReferenceType;
    addChild(reflection: DeclarationReflection | DocumentReflection): void;
    shouldIgnore(symbol: ts.Symbol): boolean;
    /**
     * Register a newly generated reflection. All created reflections should be
     * passed to this method to ensure that the project helper functions work correctly.
     *
     * @param reflection  The reflection that should be registered.
     * @param symbol  The symbol the given reflection was resolved from.
     */
    registerReflection(reflection: Reflection, symbol: ts.Symbol | undefined, filePath?: NormalizedPath): void;
    getReflectionFromSymbol(symbol: ts.Symbol): Reflection | undefined;
    getSymbolFromReflection(reflection: Reflection): ts.Symbol | undefined;
    /** @internal */
    setActiveProgram(program: ts.Program | undefined): void;
    getComment(symbol: ts.Symbol, kind: ReflectionKind): Comment | undefined;
    getNodeComment(node: ts.Node, moduleComment: boolean): Comment | undefined;
    getFileComment(node: ts.SourceFile): Comment | undefined;
    getJsDocComment(declaration: ts.JSDocPropertyLikeTag | ts.JSDocCallbackTag | ts.JSDocTypedefTag | ts.JSDocTemplateTag | ts.JSDocEnumTag): Comment | undefined;
    getSignatureComment(declaration: ts.SignatureDeclaration | ts.JSDocSignature): Comment | undefined;
    shouldInline(symbol: ts.Symbol, name: string): boolean;
    withScope(scope: Reflection): Context;
}
