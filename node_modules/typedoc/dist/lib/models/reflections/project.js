"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectReflection = void 0;
const abstract_1 = require("./abstract");
const container_1 = require("./container");
const reference_1 = require("./reference");
const types_1 = require("../types");
const utils_1 = require("../../utils");
const kind_1 = require("./kind");
const comments_1 = require("../comments");
const ReflectionSymbolId_1 = require("./ReflectionSymbolId");
const map_1 = require("../../utils/map");
/**
 * A reflection that represents the root of the project.
 *
 * The project reflection acts as a global index, one may receive all reflections
 * and source files of the processed project through this reflection.
 * @category Reflections
 */
class ProjectReflection extends container_1.ContainerReflection {
    constructor(name, registry) {
        super(name, kind_1.ReflectionKind.Project);
        this.variant = "project";
        // Used to resolve references.
        this.symbolToReflectionIdMap = new map_1.StableKeyMap();
        this.reflectionIdToSymbolIdMap = new Map();
        this.reflectionIdToSymbolMap = new Map();
        // Maps a reflection ID to all reflections with it as their parent.
        this.reflectionChildren = new map_1.DefaultMap(() => []);
        /**
         * A list of all reflections within the project. DO NOT MUTATE THIS OBJECT.
         * All mutation should be done via {@link registerReflection} and {@link removeReflection}
         * to ensure that links to reflections remain valid.
         *
         * This may be replaced with a `Map<number, Reflection>` someday.
         */
        this.reflections = { [this.id]: this };
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
     */
    registerReflection(reflection, symbol, filePath) {
        this.referenceGraph = undefined;
        if (reflection.parent) {
            this.reflectionChildren
                .get(reflection.parent.id)
                .push(reflection.id);
        }
        this.reflections[reflection.id] = reflection;
        if (symbol) {
            this.reflectionIdToSymbolMap.set(reflection.id, symbol);
            const id = new ReflectionSymbolId_1.ReflectionSymbolId(symbol);
            this.registerSymbolId(reflection, id);
            // #2466
            // If we just registered a member of a class or interface, then we need to check if
            // we've registered this symbol before under the wrong parent reflection.
            // This can happen because the compiler API will use non-dependently-typed symbols
            // for properties of classes/interfaces which inherit them, so we can't rely on the
            // property being unique for each class.
            if (reflection.parent?.kindOf(kind_1.ReflectionKind.ClassOrInterface) &&
                reflection.kindOf(kind_1.ReflectionKind.SomeMember)) {
                const saved = this.symbolToReflectionIdMap.get(id);
                const parentSymbolReflection = symbol.parent &&
                    this.getReflectionFromSymbol(symbol.parent);
                if (typeof saved === "object" &&
                    saved.length > 1 &&
                    parentSymbolReflection) {
                    (0, utils_1.removeIf)(saved, (item) => this.getReflectionById(item)?.parent !==
                        parentSymbolReflection);
                }
            }
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
        type?.visit((0, types_1.makeRecursiveVisitor)({
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
                case abstract_1.TraverseProperty.Children:
                case abstract_1.TraverseProperty.Documents:
                    parent.removeChild(reflection);
                    break;
                case abstract_1.TraverseProperty.GetSignature:
                    delete parent.getSignature;
                    break;
                case abstract_1.TraverseProperty.IndexSignature:
                    (0, utils_1.removeIfPresent)(parent.indexSignatures, reflection);
                    if (!parent.indexSignatures?.length) {
                        delete parent.indexSignatures;
                    }
                    break;
                case abstract_1.TraverseProperty.Parameters:
                    (0, utils_1.removeIfPresent)(reflection.parent.parameters, reflection);
                    if (!reflection.parent.parameters
                        ?.length) {
                        delete reflection.parent
                            .parameters;
                    }
                    break;
                case abstract_1.TraverseProperty.SetSignature:
                    delete parent.setSignature;
                    break;
                case abstract_1.TraverseProperty.Signatures:
                    (0, utils_1.removeIfPresent)(parent.signatures, reflection);
                    if (!parent.signatures?.length) {
                        delete parent.signatures;
                    }
                    break;
                case abstract_1.TraverseProperty.TypeLiteral:
                    parent.type = new types_1.IntrinsicType("Object");
                    break;
                case abstract_1.TraverseProperty.TypeParameter:
                    (0, utils_1.removeIfPresent)(parent.typeParameters, reflection);
                    if (!parent.typeParameters?.length) {
                        delete parent.typeParameters;
                    }
                    break;
                default:
                    (0, utils_1.assertNever)(property);
            }
            return false; // Stop iteration
        });
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
            }
            else if (typeof saved === "object") {
                (0, utils_1.removeIfPresent)(saved, reflection.id);
            }
        }
        this.reflectionIdToSymbolMap.delete(reflection.id);
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
     * Gets the reflection associated with the given symbol, if it exists.
     * @internal
     */
    getReflectionFromSymbol(symbol) {
        return this.getReflectionFromSymbolId(new ReflectionSymbolId_1.ReflectionSymbolId(symbol));
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
        this.reflectionIdToSymbolIdMap.set(reflection.id, id);
        const previous = this.symbolToReflectionIdMap.get(id);
        if (previous) {
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
    /**
     * THIS MAY NOT BE USED AFTER CONVERSION HAS FINISHED.
     * @internal
     */
    getSymbolFromReflection(reflection) {
        return this.reflectionIdToSymbolMap.get(reflection.id);
    }
    getReferenceGraph() {
        if (!this.referenceGraph) {
            this.referenceGraph = new Map();
            for (const id in this.reflections) {
                const ref = this.reflections[id];
                if (ref instanceof reference_1.ReferenceReflection) {
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
            symbolIdMap[id] = sid.toObject(serializer);
        });
        return {
            ...super.toObject(serializer),
            variant: this.variant,
            packageName: this.packageName,
            packageVersion: this.packageVersion,
            readme: comments_1.Comment.serializeDisplayParts(serializer, this.readme),
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
            this.readme = comments_1.Comment.deserializeDisplayParts(de, obj.readme);
        }
        this.files.fromObject(de, obj.files || {});
        de.defer(() => {
            // Unnecessary conditional in release
            for (const [id, sid] of Object.entries(obj.symbolIdMap || {})) {
                const refl = this.getReflectionById(de.oldIdToNewId[+id] ?? -1);
                if (refl) {
                    this.registerSymbolId(refl, new ReflectionSymbolId_1.ReflectionSymbolId(sid));
                }
                else {
                    de.logger.warn(de.application.i18n.serialized_project_referenced_0_not_part_of_project(id.toString()));
                }
            }
        });
    }
}
exports.ProjectReflection = ProjectReflection;
