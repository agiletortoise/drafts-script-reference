var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import ts from "typescript";
import { ok } from "assert";
import { Comment, DocumentReflection, ProjectReflection, Reflection, ReflectionKind, } from "../models/index.js";
import { Context } from "./context.js";
import { AbstractComponent } from "../utils/component.js";
import { getDocumentEntryPoints, Option, readFile } from "../utils/index.js";
import { convertType } from "./types.js";
import { ConverterEvents } from "./converter-events.js";
import { convertSymbol } from "./symbols.js";
import { MinimatchSet, nicePath, normalizePath } from "../utils/paths.js";
import { hasAllFlags, hasAnyFlag, i18n, MinimalSourceFile, NormalizedPathUtils, partition, unique, } from "#utils";
import { parseCommentString } from "./comments/parser.js";
import { lexCommentString } from "./comments/rawLexer.js";
import { resolveLinks, resolvePartLinks, } from "./comments/linkResolver.js";
import { meaningToString } from "#utils";
import { basename, dirname, resolve } from "path";
import { GroupPlugin } from "./plugins/GroupPlugin.js";
import { CategoryPlugin } from "./plugins/CategoryPlugin.js";
import { CommentPlugin } from "./plugins/CommentPlugin.js";
import { ImplementsPlugin } from "./plugins/ImplementsPlugin.js";
import { InheritDocPlugin } from "./plugins/InheritDocPlugin.js";
import { LinkResolverPlugin } from "./plugins/LinkResolverPlugin.js";
import { PackagePlugin } from "./plugins/PackagePlugin.js";
import { SourcePlugin } from "./plugins/SourcePlugin.js";
import { TypePlugin } from "./plugins/TypePlugin.js";
import { IncludePlugin } from "./plugins/IncludePlugin.js";
import { MergeModuleWithPlugin } from "./plugins/MergeModuleWithPlugin.js";
import { resolveAliasedSymbol } from "./utils/symbols.js";
/**
 * Compiles source files using TypeScript and converts compiler symbols to reflections.
 *
 * @group None
 * @summary Responsible for converting TypeScript symbols into {@link Reflection}s and {@link Type}s.
 */
let Converter = (() => {
    let _classSuper = AbstractComponent;
    let _externalPattern_decorators;
    let _externalPattern_initializers = [];
    let _externalPattern_extraInitializers = [];
    let _excludeExternals_decorators;
    let _excludeExternals_initializers = [];
    let _excludeExternals_extraInitializers = [];
    let _excludePrivate_decorators;
    let _excludePrivate_initializers = [];
    let _excludePrivate_extraInitializers = [];
    let _excludeProtected_decorators;
    let _excludeProtected_initializers = [];
    let _excludeProtected_extraInitializers = [];
    let _excludeReferences_decorators;
    let _excludeReferences_initializers = [];
    let _excludeReferences_extraInitializers = [];
    let _commentStyle_decorators;
    let _commentStyle_initializers = [];
    let _commentStyle_extraInitializers = [];
    let _validation_decorators;
    let _validation_initializers = [];
    let _validation_extraInitializers = [];
    let _externalSymbolLinkMappings_decorators;
    let _externalSymbolLinkMappings_initializers = [];
    let _externalSymbolLinkMappings_extraInitializers = [];
    let _preserveLinkText_decorators;
    let _preserveLinkText_initializers = [];
    let _preserveLinkText_extraInitializers = [];
    let _maxTypeConversionDepth_decorators;
    let _maxTypeConversionDepth_initializers = [];
    let _maxTypeConversionDepth_extraInitializers = [];
    return class Converter extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _externalPattern_decorators = [Option("externalPattern")];
            _excludeExternals_decorators = [Option("excludeExternals")];
            _excludePrivate_decorators = [Option("excludePrivate")];
            _excludeProtected_decorators = [Option("excludeProtected")];
            _excludeReferences_decorators = [Option("excludeReferences")];
            _commentStyle_decorators = [Option("commentStyle")];
            _validation_decorators = [Option("validation")];
            _externalSymbolLinkMappings_decorators = [Option("externalSymbolLinkMappings")];
            _preserveLinkText_decorators = [Option("preserveLinkText")];
            _maxTypeConversionDepth_decorators = [Option("maxTypeConversionDepth")];
            __esDecorate(this, null, _externalPattern_decorators, { kind: "accessor", name: "externalPattern", static: false, private: false, access: { has: obj => "externalPattern" in obj, get: obj => obj.externalPattern, set: (obj, value) => { obj.externalPattern = value; } }, metadata: _metadata }, _externalPattern_initializers, _externalPattern_extraInitializers);
            __esDecorate(this, null, _excludeExternals_decorators, { kind: "accessor", name: "excludeExternals", static: false, private: false, access: { has: obj => "excludeExternals" in obj, get: obj => obj.excludeExternals, set: (obj, value) => { obj.excludeExternals = value; } }, metadata: _metadata }, _excludeExternals_initializers, _excludeExternals_extraInitializers);
            __esDecorate(this, null, _excludePrivate_decorators, { kind: "accessor", name: "excludePrivate", static: false, private: false, access: { has: obj => "excludePrivate" in obj, get: obj => obj.excludePrivate, set: (obj, value) => { obj.excludePrivate = value; } }, metadata: _metadata }, _excludePrivate_initializers, _excludePrivate_extraInitializers);
            __esDecorate(this, null, _excludeProtected_decorators, { kind: "accessor", name: "excludeProtected", static: false, private: false, access: { has: obj => "excludeProtected" in obj, get: obj => obj.excludeProtected, set: (obj, value) => { obj.excludeProtected = value; } }, metadata: _metadata }, _excludeProtected_initializers, _excludeProtected_extraInitializers);
            __esDecorate(this, null, _excludeReferences_decorators, { kind: "accessor", name: "excludeReferences", static: false, private: false, access: { has: obj => "excludeReferences" in obj, get: obj => obj.excludeReferences, set: (obj, value) => { obj.excludeReferences = value; } }, metadata: _metadata }, _excludeReferences_initializers, _excludeReferences_extraInitializers);
            __esDecorate(this, null, _commentStyle_decorators, { kind: "accessor", name: "commentStyle", static: false, private: false, access: { has: obj => "commentStyle" in obj, get: obj => obj.commentStyle, set: (obj, value) => { obj.commentStyle = value; } }, metadata: _metadata }, _commentStyle_initializers, _commentStyle_extraInitializers);
            __esDecorate(this, null, _validation_decorators, { kind: "accessor", name: "validation", static: false, private: false, access: { has: obj => "validation" in obj, get: obj => obj.validation, set: (obj, value) => { obj.validation = value; } }, metadata: _metadata }, _validation_initializers, _validation_extraInitializers);
            __esDecorate(this, null, _externalSymbolLinkMappings_decorators, { kind: "accessor", name: "externalSymbolLinkMappings", static: false, private: false, access: { has: obj => "externalSymbolLinkMappings" in obj, get: obj => obj.externalSymbolLinkMappings, set: (obj, value) => { obj.externalSymbolLinkMappings = value; } }, metadata: _metadata }, _externalSymbolLinkMappings_initializers, _externalSymbolLinkMappings_extraInitializers);
            __esDecorate(this, null, _preserveLinkText_decorators, { kind: "accessor", name: "preserveLinkText", static: false, private: false, access: { has: obj => "preserveLinkText" in obj, get: obj => obj.preserveLinkText, set: (obj, value) => { obj.preserveLinkText = value; } }, metadata: _metadata }, _preserveLinkText_initializers, _preserveLinkText_extraInitializers);
            __esDecorate(this, null, _maxTypeConversionDepth_decorators, { kind: "accessor", name: "maxTypeConversionDepth", static: false, private: false, access: { has: obj => "maxTypeConversionDepth" in obj, get: obj => obj.maxTypeConversionDepth, set: (obj, value) => { obj.maxTypeConversionDepth = value; } }, metadata: _metadata }, _maxTypeConversionDepth_initializers, _maxTypeConversionDepth_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #externalPattern_accessor_storage = __runInitializers(this, _externalPattern_initializers, void 0);
        /** @internal */
        get externalPattern() { return this.#externalPattern_accessor_storage; }
        set externalPattern(value) { this.#externalPattern_accessor_storage = value; }
        externalPatternCache = __runInitializers(this, _externalPattern_extraInitializers);
        excludeCache;
        #excludeExternals_accessor_storage = __runInitializers(this, _excludeExternals_initializers, void 0);
        /** @internal */
        get excludeExternals() { return this.#excludeExternals_accessor_storage; }
        set excludeExternals(value) { this.#excludeExternals_accessor_storage = value; }
        #excludePrivate_accessor_storage = (__runInitializers(this, _excludeExternals_extraInitializers), __runInitializers(this, _excludePrivate_initializers, void 0));
        /** @internal */
        get excludePrivate() { return this.#excludePrivate_accessor_storage; }
        set excludePrivate(value) { this.#excludePrivate_accessor_storage = value; }
        #excludeProtected_accessor_storage = (__runInitializers(this, _excludePrivate_extraInitializers), __runInitializers(this, _excludeProtected_initializers, void 0));
        /** @internal */
        get excludeProtected() { return this.#excludeProtected_accessor_storage; }
        set excludeProtected(value) { this.#excludeProtected_accessor_storage = value; }
        #excludeReferences_accessor_storage = (__runInitializers(this, _excludeProtected_extraInitializers), __runInitializers(this, _excludeReferences_initializers, void 0));
        /** @internal */
        get excludeReferences() { return this.#excludeReferences_accessor_storage; }
        set excludeReferences(value) { this.#excludeReferences_accessor_storage = value; }
        #commentStyle_accessor_storage = (__runInitializers(this, _excludeReferences_extraInitializers), __runInitializers(this, _commentStyle_initializers, void 0));
        /** @internal */
        get commentStyle() { return this.#commentStyle_accessor_storage; }
        set commentStyle(value) { this.#commentStyle_accessor_storage = value; }
        #validation_accessor_storage = (__runInitializers(this, _commentStyle_extraInitializers), __runInitializers(this, _validation_initializers, void 0));
        /** @internal */
        get validation() { return this.#validation_accessor_storage; }
        set validation(value) { this.#validation_accessor_storage = value; }
        #externalSymbolLinkMappings_accessor_storage = (__runInitializers(this, _validation_extraInitializers), __runInitializers(this, _externalSymbolLinkMappings_initializers, void 0));
        /** @internal */
        get externalSymbolLinkMappings() { return this.#externalSymbolLinkMappings_accessor_storage; }
        set externalSymbolLinkMappings(value) { this.#externalSymbolLinkMappings_accessor_storage = value; }
        #preserveLinkText_accessor_storage = (__runInitializers(this, _externalSymbolLinkMappings_extraInitializers), __runInitializers(this, _preserveLinkText_initializers, void 0));
        /** @internal */
        get preserveLinkText() { return this.#preserveLinkText_accessor_storage; }
        set preserveLinkText(value) { this.#preserveLinkText_accessor_storage = value; }
        #maxTypeConversionDepth_accessor_storage = (__runInitializers(this, _preserveLinkText_extraInitializers), __runInitializers(this, _maxTypeConversionDepth_initializers, void 0));
        /** @internal */
        get maxTypeConversionDepth() { return this.#maxTypeConversionDepth_accessor_storage; }
        set maxTypeConversionDepth(value) { this.#maxTypeConversionDepth_accessor_storage = value; }
        _config = __runInitializers(this, _maxTypeConversionDepth_extraInitializers);
        _externalSymbolResolvers = [];
        // We try to document symbols which are exported from multiple locations
        // in modules/namespaces which declare them, rather than those which re-export them.
        // To do this, when converting a symbol, that might be re-exported, we first defer it
        // to the second conversion pass.
        _deferPermitted = false;
        _defer = [];
        get config() {
            return this._config || this._buildCommentParserConfig();
        }
        /**
         * General events
         */
        /**
         * Triggered when the converter begins converting a project.
         * The listener will be given a {@link Context} object.
         * @event
         */
        static EVENT_BEGIN = ConverterEvents.BEGIN;
        /**
         * Triggered when the converter has finished converting a project.
         * The listener will be given a {@link Context} object.
         * @event
         */
        static EVENT_END = ConverterEvents.END;
        /**
         * Factory events
         */
        /**
         * Triggered when the converter has created a project reflection.
         * The listener will be given {@link Context} and a {@link Models.ProjectReflection}.
         * @event
         */
        static EVENT_CREATE_PROJECT = ConverterEvents.CREATE_PROJECT;
        /**
         * Triggered when the converter has created a declaration reflection.
         * The listener will be given {@link Context} and a {@link Models.DeclarationReflection}.
         * @event
         */
        static EVENT_CREATE_DECLARATION = ConverterEvents.CREATE_DECLARATION;
        /**
         * Triggered when the converter has created a document reflection.
         * The listener will be given `undefined` (for consistency with the
         * other create events) and a {@link Models.DocumentReflection}.
         * @event
         */
        static EVENT_CREATE_DOCUMENT = ConverterEvents.CREATE_DOCUMENT;
        /**
         * Triggered when the converter has created a signature reflection.
         * The listener will be given {@link Context}, {@link Models.SignatureReflection} | {@link Models.ProjectReflection} the declaration,
         * `ts.SignatureDeclaration | ts.IndexSignatureDeclaration | ts.JSDocSignature | undefined`,
         * and `ts.Signature | undefined`. The signature will be undefined if the created signature is an index signature.
         * @event
         */
        static EVENT_CREATE_SIGNATURE = ConverterEvents.CREATE_SIGNATURE;
        /**
         * Triggered when the converter has created a parameter reflection.
         * The listener will be given {@link Context}, {@link Models.ParameterReflection} and a `ts.Node?`
         * @event
         */
        static EVENT_CREATE_PARAMETER = ConverterEvents.CREATE_PARAMETER;
        /**
         * Triggered when the converter has created a type parameter reflection.
         * The listener will be given {@link Context} and a {@link Models.TypeParameterReflection}
         * @event
         */
        static EVENT_CREATE_TYPE_PARAMETER = ConverterEvents.CREATE_TYPE_PARAMETER;
        /**
         * Resolve events
         */
        /**
         * Triggered when the converter begins resolving a project.
         * The listener will be given {@link Context}.
         * @event
         */
        static EVENT_RESOLVE_BEGIN = ConverterEvents.RESOLVE_BEGIN;
        /**
         * Triggered when the converter resolves a reflection.
         * The listener will be given {@link Context} and a {@link Reflection}.
         * @event
         */
        static EVENT_RESOLVE = ConverterEvents.RESOLVE;
        /**
         * Triggered when the converter has finished resolving a project.
         * The listener will be given {@link Context}.
         * @event
         */
        static EVENT_RESOLVE_END = ConverterEvents.RESOLVE_END;
        /** @internal @hidden */
        includePlugin;
        constructor(owner) {
            super(owner);
            const userConfiguredSymbolResolver = (ref, refl, _part, symbolId) => {
                if (symbolId) {
                    return userConfiguredSymbolResolver(symbolId.toDeclarationReference(), refl, undefined, undefined);
                }
                // Require global links, matching local ones will likely hide mistakes where the
                // user meant to link to a local type.
                if (ref.resolutionStart !== "global" || !ref.symbolReference) {
                    return;
                }
                const modLinks = this.externalSymbolLinkMappings[ref.moduleSource ?? "global"];
                if (typeof modLinks !== "object") {
                    return;
                }
                let name = "";
                if (ref.symbolReference.path) {
                    name += ref.symbolReference.path.map((p) => p.path).join(".");
                }
                if (ref.symbolReference.meaning) {
                    name += meaningToString(ref.symbolReference.meaning);
                }
                if (typeof modLinks[name] === "string") {
                    return modLinks[name];
                }
                if (typeof modLinks["*"] === "string") {
                    return modLinks["*"];
                }
            };
            this.addUnknownSymbolResolver(userConfiguredSymbolResolver);
            new CategoryPlugin(this);
            new CommentPlugin(this);
            new GroupPlugin(this);
            new ImplementsPlugin(this);
            new InheritDocPlugin(this);
            new LinkResolverPlugin(this);
            new PackagePlugin(this);
            new SourcePlugin(this);
            new TypePlugin(this);
            this.includePlugin = new IncludePlugin(this);
            new MergeModuleWithPlugin(this);
        }
        /**
         * Compile the given source files and create a project reflection for them.
         */
        convert(entryPoints) {
            const programs = unique(entryPoints.map((e) => e.program));
            this.externalPatternCache = void 0;
            const project = new ProjectReflection(this.application.options.getValue("name"), this.application.files);
            if (this.owner.options.packageDir) {
                project.files.registerReflectionPath(normalizePath(this.owner.options.packageDir), project);
            }
            const context = new Context(this, programs, project);
            this.trigger(Converter.EVENT_BEGIN, context);
            this.addProjectDocuments(project);
            this.compile(entryPoints, context);
            this.resolve(context);
            this.trigger(Converter.EVENT_END, context);
            // Delete caches of options so that test usage which changes options
            // doesn't have confusing behavior where tests run in isolation work
            // but break when run as a batch.
            delete this._config;
            delete this.excludeCache;
            delete this.externalPatternCache;
            return project;
        }
        /** @internal */
        addProjectDocuments(project) {
            const projectDocuments = getDocumentEntryPoints(this.application.logger, this.application.options);
            for (const { displayName, path } of projectDocuments) {
                let file;
                try {
                    file = new MinimalSourceFile(readFile(path), path);
                }
                catch (error) {
                    this.application.logger.error(i18n.failed_to_read_0_when_processing_project_document(path));
                    continue;
                }
                this.addDocument(project, file, displayName);
            }
        }
        /** @internal */
        convertSymbol(context, symbol, exportSymbol) {
            convertSymbol(context, symbol, exportSymbol);
        }
        convertType(context, typeOrNode, maybeNode) {
            return convertType(context, typeOrNode, maybeNode);
        }
        /**
         * Parse the given file into a comment. Intended to be used with markdown files.
         */
        parseRawComment(file, files) {
            return parseCommentString(lexCommentString(file.text), this.config, file, this.application.logger, files);
        }
        /**
         * Adds a new resolver that the theme can use to try to figure out how to link to a symbol declared
         * by a third-party library which is not included in the documentation.
         *
         * The resolver function will be passed a declaration reference which it can attempt to resolve. If
         * resolution fails, the function should return undefined.
         *
         * Note: This will be used for both references to types declared in node_modules (in which case the
         * reference passed will have the `moduleSource` set and the `symbolReference` will navigate via `.`)
         * and user defined \{\@link\} tags which cannot be resolved. If the link being resolved is inferred
         * from a type, then no `part` will be passed to the resolver function.
         */
        addUnknownSymbolResolver(resolver) {
            this._externalSymbolResolvers.push(resolver);
        }
        /** @internal */
        resolveExternalLink(ref, refl, part, symbolId) {
            for (const resolver of this._externalSymbolResolvers) {
                const resolved = resolver(ref, refl, part, symbolId);
                if (resolved)
                    return resolved;
            }
        }
        resolveLinks(comment, owner) {
            if (comment instanceof Reflection) {
                resolveLinks(comment, (ref, part, refl, id) => this.resolveExternalLink(ref, part, refl, id), { preserveLinkText: this.preserveLinkText });
            }
            else if (comment instanceof Comment) {
                resolveLinks(owner, (ref, part, refl, id) => this.resolveExternalLink(ref, part, refl, id), { preserveLinkText: this.preserveLinkText });
            }
            else {
                return resolvePartLinks(owner, comment, (ref, part, refl, id) => this.resolveExternalLink(ref, part, refl, id), { preserveLinkText: this.preserveLinkText });
            }
        }
        /**
         * Permit deferred conversion steps to take place. Until this is called, {@link deferConversion}
         * will throw if used.
         * @since 0.28.1
         */
        permitDeferredConversion() {
            ok(!this._deferPermitted, "Attempted to allow deferred conversion when already permitted");
            this._deferPermitted = true;
        }
        /**
         * Finalize deferred conversion, must be called by the caller of {@link permitDeferredConversion}
         * @since 0.28.1
         */
        finalizeDeferredConversion() {
            this.application.logger.verbose(`Have ${this._defer.length} initial deferred tasks`);
            let count = 0;
            while (this._defer.length) {
                ++count;
                const first = this._defer.shift();
                first();
            }
            this.application.logger.verbose(`Ran ${count} total deferred tasks`);
            this._deferPermitted = false;
        }
        /**
         * Defer a conversion step until later. This may only be called during conversion.
         * @since 0.28.0
         */
        deferConversion(cb) {
            ok(this._deferPermitted, "Attempted to defer conversion when not permitted");
            this._defer.push(cb);
        }
        /**
         * Compile the files within the given context and convert the compiler symbols to reflections.
         *
         * @param context  The context object describing the current state the converter is in.
         * @returns An array containing all errors generated by the TypeScript compiler.
         */
        compile(entryPoints, context) {
            this.permitDeferredConversion();
            let createModuleReflections = entryPoints.length > 1;
            if (!createModuleReflections) {
                const opts = this.application.options;
                createModuleReflections = opts.isSet("alwaysCreateEntryPointModule")
                    ? opts.getValue("alwaysCreateEntryPointModule")
                    : !!context.scope.documents;
            }
            if (createModuleReflections) {
                this.trigger(ConverterEvents.CREATE_PROJECT, context, context.project);
            }
            for (const entry of entryPoints) {
                // Clone context in case deferred conversion uses different programs
                const entryContext = context.withScope(context.scope);
                entryContext.setActiveProgram(entry.program);
                this.convertExports(entryContext, entry, createModuleReflections);
            }
            this.finalizeDeferredConversion();
        }
        convertExports(context, entryPoint, createModuleReflections) {
            const node = entryPoint.sourceFile;
            const entryName = entryPoint.displayName;
            const symbol = getSymbolForModuleLike(context, node);
            let moduleContext;
            if (createModuleReflections === false) {
                // Special case for when we're giving a single entry point, we don't need to
                // create modules for each entry. Register the project as this module.
                context.registerReflection(context.project, symbol, normalizePath(entryPoint.sourceFile.fileName));
                context.project.comment = symbol
                    ? context.getComment(symbol, context.project.kind)
                    : context.getFileComment(node);
                this.processDocumentTags(context.project, context.project);
                this.trigger(ConverterEvents.CREATE_PROJECT, context, context.project);
                moduleContext = context;
            }
            else {
                const reflection = context.createDeclarationReflection(ReflectionKind.Module, symbol, void 0, entryName);
                if (!reflection.comment && !symbol) {
                    reflection.comment = context.getFileComment(node);
                }
                context.finalizeDeclarationReflection(reflection);
                moduleContext = context.withScope(reflection);
            }
            const allExports = getExports(context, node, symbol);
            const [directExport, indirectExports] = partition(allExports, exp => isDirectExport(context.resolveAliasedSymbol(exp), node));
            for (const exp of directExport) {
                this.convertSymbol(moduleContext, exp);
            }
            if (indirectExports.length) {
                this.deferConversion(() => {
                    for (const exp of indirectExports) {
                        this.convertSymbol(moduleContext, exp);
                    }
                });
            }
        }
        /**
         * Resolve the project within the given context.
         *
         * @param context  The context object describing the current state the converter is in.
         * @returns The final project reflection.
         */
        resolve(context) {
            this.trigger(Converter.EVENT_RESOLVE_BEGIN, context);
            const project = context.project;
            for (const id in project.reflections) {
                this.trigger(Converter.EVENT_RESOLVE, context, project.reflections[id]);
            }
            this.trigger(Converter.EVENT_RESOLVE_END, context);
        }
        /**
         * Used to determine if we should immediately bail when creating a reflection.
         * Note: This should not be used for excludeNotDocumented because we don't have enough
         * information at this point since comment discovery hasn't happened.
         * @internal
         */
        shouldIgnore(symbol, checker) {
            symbol = resolveAliasedSymbol(symbol, checker);
            if (this.isExcluded(symbol)) {
                return true;
            }
            return this.excludeExternals && this.isExternal(symbol, checker);
        }
        isExcluded(symbol) {
            this.excludeCache ??= new MinimatchSet(this.application.options.getValue("exclude"));
            const cache = this.excludeCache;
            return (symbol.getDeclarations() ?? []).some((node) => cache.matchesAny(node.getSourceFile().fileName));
        }
        /** @internal */
        isExternal(symbol, checker) {
            this.externalPatternCache ??= new MinimatchSet(this.externalPattern);
            const cache = this.externalPatternCache;
            const declarations = resolveAliasedSymbol(symbol, checker).getDeclarations();
            // `undefined` has no declarations, if someone does `export default undefined`
            // the symbol ends up as having no declarations (the export symbol does, but
            // not the source symbol)
            if (!declarations?.length) {
                return false;
            }
            // If there are any non-external declarations, treat it as non-external
            // This is possible with declaration merging against external namespaces
            // (e.g. merging with HTMLElementTagNameMap)
            return declarations.every((node) => cache.matchesAny(node.getSourceFile().fileName));
        }
        processDocumentTags(reflection, parent) {
            let relativeTo = reflection.comment?.sourcePath;
            if (relativeTo) {
                relativeTo = NormalizedPathUtils.dirname(relativeTo);
                const tags = reflection.comment?.getTags("@document") || [];
                reflection.comment?.removeTags("@document");
                for (const tag of tags) {
                    const path = Comment.combineDisplayParts(tag.content);
                    let file;
                    try {
                        const resolved = normalizePath(resolve(relativeTo, path));
                        file = new MinimalSourceFile(readFile(resolved), resolved);
                    }
                    catch {
                        this.application.logger.warn(i18n.failed_to_read_0_when_processing_document_tag_in_1(nicePath(path), nicePath(reflection.comment.sourcePath)));
                        continue;
                    }
                    this.addDocument(parent, file, basename(file.fileName).replace(/\.[^.]+$/, ""));
                }
            }
        }
        addDocument(parent, file, displayName) {
            const { content, frontmatter } = this.parseRawComment(file, parent.project.files);
            const children = frontmatter["children"];
            delete frontmatter["children"];
            const docRefl = new DocumentReflection(displayName, parent, content, frontmatter);
            this.application.watchFile(file.fileName);
            parent.addChild(docRefl);
            parent.project.registerReflection(docRefl, undefined, file.fileName);
            this.trigger(ConverterEvents.CREATE_DOCUMENT, undefined, docRefl);
            const childrenToAdd = [];
            if (children && typeof children === "object") {
                if (Array.isArray(children)) {
                    for (const child of children) {
                        if (typeof child === "string") {
                            childrenToAdd.push([
                                basename(child).replace(/\.[^.]+$/, ""),
                                child,
                            ]);
                        }
                        else {
                            this.application.logger.error(i18n
                                .frontmatter_children_0_should_be_an_array_of_strings_or_object_with_string_values(nicePath(file.fileName)));
                            return;
                        }
                    }
                }
                else {
                    for (const [name, path] of Object.entries(children)) {
                        if (typeof path === "string") {
                            childrenToAdd.push([name, path]);
                        }
                        else {
                            this.application.logger.error(i18n
                                .frontmatter_children_0_should_be_an_array_of_strings_or_object_with_string_values(nicePath(file.fileName)));
                            return;
                        }
                    }
                }
            }
            for (const [displayName, path] of childrenToAdd) {
                const absPath = normalizePath(resolve(dirname(file.fileName), path));
                let childFile;
                try {
                    childFile = new MinimalSourceFile(readFile(absPath), absPath);
                }
                catch (error) {
                    this.application.logger.error(i18n.failed_to_read_0_when_processing_document_child_in_1(path, nicePath(file.fileName)));
                    continue;
                }
                this.addDocument(docRefl, childFile, displayName);
            }
        }
        _buildCommentParserConfig() {
            this._config = {
                blockTags: new Set(this.application.options.getValue("blockTags")),
                inlineTags: new Set(this.application.options.getValue("inlineTags")),
                modifierTags: new Set(this.application.options.getValue("modifierTags")),
                jsDocCompatibility: this.application.options.getValue("jsDocCompatibility"),
                suppressCommentWarningsInDeclarationFiles: this.application.options.getValue("suppressCommentWarningsInDeclarationFiles"),
                useTsLinkResolution: this.application.options.getValue("useTsLinkResolution"),
                commentStyle: this.application.options.getValue("commentStyle"),
            };
            // Can't be included in options because the TSDoc parser blows up if we do.
            // TypeDoc supports it as one, so it should always be included here.
            this._config.blockTags.add("@inheritDoc");
            return this._config;
        }
    };
})();
export { Converter };
function getSymbolForModuleLike(context, node) {
    const symbol = context.checker.getSymbolAtLocation(node) ?? node.symbol;
    if (symbol) {
        return symbol;
    }
    // This is a global file, get all symbols declared in this file...
    // this isn't the best solution, it would be nice to have all globals given to a special
    // "globals" file, but this is uncommon enough that I'm skipping it for now.
    const sourceFile = node.getSourceFile();
    const globalSymbols = context.checker
        .getSymbolsInScope(node, ts.SymbolFlags.ModuleMember)
        .filter((s) => s.getDeclarations()?.some((d) => d.getSourceFile() === sourceFile));
    // Detect declaration files with declare module "foo" as their only export
    // and lift that up one level as the source file symbol
    if (globalSymbols.length === 1 &&
        globalSymbols[0]
            .getDeclarations()
            ?.every((declaration) => ts.isModuleDeclaration(declaration) &&
            ts.isStringLiteral(declaration.name))) {
        return globalSymbols[0];
    }
}
function getExports(context, node, symbol) {
    let result;
    // The generated docs aren't great, but you really ought not be using
    // this in the first place... so it's better than nothing.
    const exportEq = symbol?.exports?.get("export=");
    if (exportEq) {
        // JS users might also have exported types here.
        // We need to filter for types because otherwise static methods can show up as both
        // members of the export= class and as functions if a class is directly exported.
        result = [exportEq].concat(context.checker
            .getExportsOfModule(symbol)
            .filter((s) => !hasAnyFlag(s.flags, ts.SymbolFlags.Prototype | ts.SymbolFlags.Value)));
    }
    else if (symbol) {
        result = context.checker
            .getExportsOfModule(symbol)
            .filter((s) => !hasAllFlags(s.flags, ts.SymbolFlags.Prototype));
        if (result.length === 0) {
            const globalDecl = node.statements.find((s) => ts.isModuleDeclaration(s) &&
                s.flags & ts.NodeFlags.GlobalAugmentation);
            if (globalDecl) {
                const globalSymbol = context.getSymbolAtLocation(globalDecl);
                if (globalSymbol) {
                    result = context.checker
                        .getExportsOfModule(globalSymbol)
                        .filter((exp) => exp.declarations?.some((d) => d.getSourceFile() === node))
                        .map((s) => context.checker.getMergedSymbol(s));
                }
            }
        }
    }
    else {
        // Global file with no inferred top level symbol, get all symbols declared in this file.
        const sourceFile = node.getSourceFile();
        result = context.checker
            .getSymbolsInScope(node, ts.SymbolFlags.ModuleMember)
            .filter((s) => s
            .getDeclarations()
            ?.some((d) => d.getSourceFile() === sourceFile));
    }
    // Put symbols named "default" last, #1795
    result.sort((a, b) => {
        if (a.name === "default") {
            return 1;
        }
        else if (b.name === "default") {
            return -1;
        }
        return 0;
    });
    return result;
}
function isDirectExport(symbol, file) {
    return (symbol
        .getDeclarations()
        ?.every((decl) => decl.getSourceFile() === file) ?? false);
}
