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
import { TraverseProperty } from "./Reflection.js";
import { ContainerReflection } from "./ContainerReflection.js";
import { ReferenceReflection } from "./ReferenceReflection.js";
import { IntrinsicType, makeRecursiveVisitor } from "./types.js";
import { ReflectionKind } from "./kind.js";
import { Comment } from "./Comment.js";
import { ReflectionSymbolId } from "./ReflectionSymbolId.js";
import { assertNever, DefaultMap, i18n, NonEnumerable, removeIfPresent, StableKeyMap, } from "#utils";
// Keep this in sync with JSONOutput.SCHEMA_VERSION
export const JSON_SCHEMA_VERSION = "2.0";
/**
 * A reflection that represents the root of the project.
 *
 * The project reflection acts as a global index, one may receive all reflections
 * and source files of the processed project through this reflection.
 * @category Reflections
 */
let ProjectReflection = (() => {
    let _classSuper = ContainerReflection;
    let _symbolToReflectionIdMap_decorators;
    let _symbolToReflectionIdMap_initializers = [];
    let _symbolToReflectionIdMap_extraInitializers = [];
    let _reflectionIdToSymbolIdMap_decorators;
    let _reflectionIdToSymbolIdMap_initializers = [];
    let _reflectionIdToSymbolIdMap_extraInitializers = [];
    let _removedSymbolIds_decorators;
    let _removedSymbolIds_initializers = [];
    let _removedSymbolIds_extraInitializers = [];
    let _referenceGraph_decorators;
    let _referenceGraph_initializers = [];
    let _referenceGraph_extraInitializers = [];
    let _reflectionChildren_decorators;
    let _reflectionChildren_initializers = [];
    let _reflectionChildren_extraInitializers = [];
    let _reflections_decorators;
    let _reflections_initializers = [];
    let _reflections_extraInitializers = [];
    return class ProjectReflection extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _symbolToReflectionIdMap_decorators = [NonEnumerable];
            _reflectionIdToSymbolIdMap_decorators = [NonEnumerable];
            _removedSymbolIds_decorators = [NonEnumerable];
            _referenceGraph_decorators = [NonEnumerable];
            _reflectionChildren_decorators = [NonEnumerable];
            _reflections_decorators = [NonEnumerable];
            __esDecorate(null, null, _symbolToReflectionIdMap_decorators, { kind: "field", name: "symbolToReflectionIdMap", static: false, private: false, access: { has: obj => "symbolToReflectionIdMap" in obj, get: obj => obj.symbolToReflectionIdMap, set: (obj, value) => { obj.symbolToReflectionIdMap = value; } }, metadata: _metadata }, _symbolToReflectionIdMap_initializers, _symbolToReflectionIdMap_extraInitializers);
            __esDecorate(null, null, _reflectionIdToSymbolIdMap_decorators, { kind: "field", name: "reflectionIdToSymbolIdMap", static: false, private: false, access: { has: obj => "reflectionIdToSymbolIdMap" in obj, get: obj => obj.reflectionIdToSymbolIdMap, set: (obj, value) => { obj.reflectionIdToSymbolIdMap = value; } }, metadata: _metadata }, _reflectionIdToSymbolIdMap_initializers, _reflectionIdToSymbolIdMap_extraInitializers);
            __esDecorate(null, null, _removedSymbolIds_decorators, { kind: "field", name: "removedSymbolIds", static: false, private: false, access: { has: obj => "removedSymbolIds" in obj, get: obj => obj.removedSymbolIds, set: (obj, value) => { obj.removedSymbolIds = value; } }, metadata: _metadata }, _removedSymbolIds_initializers, _removedSymbolIds_extraInitializers);
            __esDecorate(null, null, _referenceGraph_decorators, { kind: "field", name: "referenceGraph", static: false, private: false, access: { has: obj => "referenceGraph" in obj, get: obj => obj.referenceGraph, set: (obj, value) => { obj.referenceGraph = value; } }, metadata: _metadata }, _referenceGraph_initializers, _referenceGraph_extraInitializers);
            __esDecorate(null, null, _reflectionChildren_decorators, { kind: "field", name: "reflectionChildren", static: false, private: false, access: { has: obj => "reflectionChildren" in obj, get: obj => obj.reflectionChildren, set: (obj, value) => { obj.reflectionChildren = value; } }, metadata: _metadata }, _reflectionChildren_initializers, _reflectionChildren_extraInitializers);
            __esDecorate(null, null, _reflections_decorators, { kind: "field", name: "reflections", static: false, private: false, access: { has: obj => "reflections" in obj, get: obj => obj.reflections, set: (obj, value) => { obj.reflections = value; } }, metadata: _metadata }, _reflections_initializers, _reflections_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        variant = "project";
        // Used to resolve references.
        symbolToReflectionIdMap = __runInitializers(this, _symbolToReflectionIdMap_initializers, new StableKeyMap());
        reflectionIdToSymbolIdMap = (__runInitializers(this, _symbolToReflectionIdMap_extraInitializers), __runInitializers(this, _reflectionIdToSymbolIdMap_initializers, new Map()));
        removedSymbolIds = (__runInitializers(this, _reflectionIdToSymbolIdMap_extraInitializers), __runInitializers(this, _removedSymbolIds_initializers, new StableKeyMap()));
        // Maps a reflection ID to all references eventually referring to it.
        referenceGraph = (__runInitializers(this, _removedSymbolIds_extraInitializers), __runInitializers(this, _referenceGraph_initializers, void 0));
        // Maps a reflection ID to all reflections with it as their parent.
        reflectionChildren = (__runInitializers(this, _referenceGraph_extraInitializers), __runInitializers(this, _reflectionChildren_initializers, new DefaultMap(() => [])));
        /**
         * A list of all reflections within the project. DO NOT MUTATE THIS OBJECT.
         * All mutation should be done via {@link registerReflection} and {@link removeReflection}
         * to ensure that links to reflections remain valid.
         *
         * This may be replaced with a `Map<number, Reflection>` someday.
         */
        reflections = (__runInitializers(this, _reflectionChildren_extraInitializers), __runInitializers(this, _reflections_initializers, {}));
        /**
         * The name of the package that this reflection documents according to package.json.
         */
        packageName = __runInitializers(this, _reflections_extraInitializers);
        /**
         * The version of the package that this reflection documents according to package.json.
         */
        packageVersion;
        /**
         * The contents of the readme.md file of the project when found.
         */
        readme;
        /**
         * Object which describes where to find content for relative links.
         */
        files;
        constructor(name, registry) {
            super(name, ReflectionKind.Project);
            this.reflections[this.id] = this;
            this.files = registry;
        }
        /**
         * Return whether this reflection is the root / project reflection.
         */
        isProject() {
            return true;
        }
        /**
         * Return a list of all reflections in this project of a certain kind.
         *
         * @param kind  The desired kind of reflection.
         * @returns     An array containing all reflections with the desired kind.
         */
        getReflectionsByKind(kind) {
            return Object.values(this.reflections).filter((reflection) => reflection.kindOf(kind));
        }
        /**
         * Registers the given reflection so that it can be quickly looked up by helper methods.
         * Should be called for *every* reflection added to the project.
         *
         * Note: During conversion, `Context.registerReflection` should be used instead so
         * that symbols can be saved for later use.
         */
        registerReflection(reflection, id, filePath) {
            this.referenceGraph = undefined;
            if (reflection.parent) {
                this.reflectionChildren
                    .get(reflection.parent.id)
                    .push(reflection.id);
            }
            this.reflections[reflection.id] = reflection;
            if (id) {
                this.registerSymbolId(reflection, id);
            }
            if (filePath) {
                this.files.registerReflection(filePath, reflection);
            }
        }
        /**
         * Removes references to reflections contained within the provided type.
         * Plugins which overwrite types on reflections should pass the type to this
         * method before overwriting the property.
         * @since 0.26.6
         */
        removeTypeReflections(type) {
            type?.visit(makeRecursiveVisitor({
                reflection: (type) => {
                    this.removeReflection(type.declaration);
                },
            }));
        }
        /**
         * Removes a reflection from the documentation. Can be used by plugins to filter reflections
         * out of the generated documentation. Has no effect if the reflection is not present in the
         * project.
         */
        removeReflection(reflection) {
            // Remove the reflection...
            this._removeReflection(reflection);
            // And now try to remove references to it in the parent reflection.
            // This might not find anything if someone called removeReflection on a member of a union
            // but I think that could only be caused by a plugin doing something weird, not by a regular
            // user... so this is probably good enough for now. Reflections that live on types are
            // kind of half-real anyways.
            const parent = reflection.parent;
            parent?.traverse((child, property) => {
                if (child !== reflection) {
                    return true; // Continue iteration
                }
                switch (property) {
                    case TraverseProperty.Children:
                    case TraverseProperty.Documents:
                        parent.removeChild(reflection);
                        break;
                    case TraverseProperty.GetSignature:
                        delete parent.getSignature;
                        break;
                    case TraverseProperty.IndexSignature:
                        removeIfPresent(parent.indexSignatures, reflection);
                        if (!parent.indexSignatures?.length) {
                            delete parent.indexSignatures;
                        }
                        break;
                    case TraverseProperty.Parameters:
                        removeIfPresent(reflection.parent.parameters, reflection);
                        if (!reflection.parent.parameters
                            ?.length) {
                            delete reflection.parent
                                .parameters;
                        }
                        break;
                    case TraverseProperty.SetSignature:
                        delete parent.setSignature;
                        break;
                    case TraverseProperty.Signatures:
                        removeIfPresent(parent.signatures, reflection);
                        if (!parent.signatures?.length) {
                            delete parent.signatures;
                        }
                        break;
                    case TraverseProperty.TypeLiteral:
                        parent.type = new IntrinsicType("Object");
                        break;
                    case TraverseProperty.TypeParameter:
                        removeIfPresent(parent.typeParameters, reflection);
                        if (!parent.typeParameters?.length) {
                            delete parent.typeParameters;
                        }
                        break;
                    default:
                        assertNever(property);
                }
                return false; // Stop iteration
            });
        }
        /** @internal */
        mergeReflections(source, target) {
            // First, tell the children about their new parent
            delete this.referenceGraph;
            const oldChildrenIds = this.reflectionChildren.getNoInsert(source.id) || [];
            const newChildren = this.reflectionChildren.get(target.id);
            for (const childId of oldChildrenIds) {
                const childRefl = this.getReflectionById(childId);
                // To avoid conflicting with some plugins which do this surgery somewhat incorrectly
                // (typedoc-plugin-merge-modules and likely others I'm not aware of) only move children
                // which are still children
                if (childRefl?.parent === source) {
                    childRefl.parent = target;
                    newChildren.push(childId);
                    target.addChild(childRefl);
                }
            }
            // Then remove the now-empty parent
            this.reflectionChildren.delete(source.id);
            this.removeReflection(source);
            // And remove any outdated collections of children on the new parent.
            // So long as this is used before REVIVE(-100) or EVENT_BEGIN_RESOLVE(-100)
            // this will make the appropriate plugin rebuild the lists.
            delete target.groups;
            delete target.categories;
        }
        /**
         * Remove a reflection without updating the parent reflection to remove references to the removed reflection.
         */
        _removeReflection(reflection) {
            this.files.removeReflection(reflection);
            // Remove references pointing to this reflection
            const graph = this.getReferenceGraph();
            for (const id of graph.get(reflection.id) ?? []) {
                const ref = this.getReflectionById(id);
                if (ref) {
                    this.removeReflection(ref);
                }
            }
            graph.delete(reflection.id);
            // Remove children of this reflection
            for (const childId of this.reflectionChildren.getNoInsert(reflection.id) || []) {
                const child = this.getReflectionById(childId);
                // Only remove if the child's parent is still actually this reflection.
                // This might not be the case if a plugin has moved this reflection to another parent.
                // (typedoc-plugin-merge-modules)
                if (child?.parent === reflection) {
                    this._removeReflection(child);
                }
            }
            this.reflectionChildren.delete(reflection.id);
            // Remove references from the TS symbol to this reflection.
            const symbolId = this.reflectionIdToSymbolIdMap.get(reflection.id);
            if (symbolId) {
                const saved = this.symbolToReflectionIdMap.get(symbolId);
                if (saved === reflection.id) {
                    this.symbolToReflectionIdMap.delete(symbolId);
                    this.removedSymbolIds.set(symbolId, true);
                }
                else if (typeof saved === "object") {
                    removeIfPresent(saved, reflection.id);
                    if (saved.length === 0) {
                        this.removedSymbolIds.set(symbolId, true);
                    }
                }
            }
            this.reflectionIdToSymbolIdMap.delete(reflection.id);
            delete this.reflections[reflection.id];
        }
        /**
         * Gets the reflection registered for the given reflection ID, or undefined if it is not present
         * in the project.
         */
        getReflectionById(id) {
            return this.reflections[id];
        }
        /**
         * Gets the reflection associated with the given symbol id, if it exists.
         * If there are multiple reflections associated with this symbol, gets the first one.
         * @internal
         */
        getReflectionFromSymbolId(symbolId) {
            return this.getReflectionsFromSymbolId(symbolId)[0];
        }
        /** @internal */
        getReflectionsFromSymbolId(symbolId) {
            const id = this.symbolToReflectionIdMap.get(symbolId);
            if (typeof id === "number") {
                return [this.getReflectionById(id)];
            }
            else if (typeof id === "object") {
                return id.map((id) => this.getReflectionById(id));
            }
            return [];
        }
        /** @internal */
        getSymbolIdFromReflection(reflection) {
            return this.reflectionIdToSymbolIdMap.get(reflection.id);
        }
        /** @internal */
        registerSymbolId(reflection, id) {
            this.removedSymbolIds.delete(id);
            this.reflectionIdToSymbolIdMap.set(reflection.id, id);
            const previous = this.symbolToReflectionIdMap.get(id);
            if (typeof previous !== "undefined") {
                if (typeof previous === "number") {
                    this.symbolToReflectionIdMap.set(id, [previous, reflection.id]);
                }
                else {
                    previous.push(reflection.id);
                }
            }
            else {
                this.symbolToReflectionIdMap.set(id, reflection.id);
            }
        }
        symbolIdHasBeenRemoved(id) {
            return this.removedSymbolIds.has(id);
        }
        getReferenceGraph() {
            if (!this.referenceGraph) {
                this.referenceGraph = new Map();
                for (const id in this.reflections) {
                    const ref = this.reflections[id];
                    if (ref instanceof ReferenceReflection) {
                        const target = ref.tryGetTargetReflection();
                        if (target) {
                            const refs = this.referenceGraph.get(target.id) ?? [];
                            refs.push(ref.id);
                            this.referenceGraph.set(target.id, refs);
                        }
                    }
                }
            }
            return this.referenceGraph;
        }
        toObject(serializer) {
            const symbolIdMap = {};
            this.reflectionIdToSymbolIdMap.forEach((sid, id) => {
                symbolIdMap[id] = sid.toObject();
            });
            return {
                schemaVersion: JSON_SCHEMA_VERSION,
                ...super.toObject(serializer),
                variant: this.variant,
                packageName: this.packageName,
                packageVersion: this.packageVersion,
                readme: Comment.serializeDisplayParts(this.readme),
                symbolIdMap,
                files: serializer.toObject(this.files),
            };
        }
        fromObject(de, obj) {
            super.fromObject(de, obj);
            // If updating this, also check the block in DeclarationReflection.fromObject.
            this.packageName = obj.packageName;
            this.packageVersion = obj.packageVersion;
            if (obj.readme) {
                this.readme = Comment.deserializeDisplayParts(de, obj.readme);
            }
            this.files.fromObject(de, obj.files || {});
            de.defer(() => {
                // Unnecessary conditional in release
                for (const [id, sid] of Object.entries(obj.symbolIdMap || {})) {
                    const refl = this.getReflectionById(de.oldIdToNewId[+id] ?? -1);
                    if (refl) {
                        this.registerSymbolId(refl, new ReflectionSymbolId(sid));
                    }
                    else {
                        de.logger.warn(i18n.serialized_project_referenced_0_not_part_of_project(id));
                    }
                }
            });
        }
    };
})();
export { ProjectReflection };
