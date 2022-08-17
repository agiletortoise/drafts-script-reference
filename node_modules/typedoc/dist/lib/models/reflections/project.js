"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectReflection = void 0;
const abstract_1 = require("./abstract");
const container_1 = require("./container");
const reference_1 = require("./reference");
const types_1 = require("../types");
const utils_1 = require("../../utils");
const kind_1 = require("./kind");
/**
 * A reflection that represents the root of the project.
 *
 * The project reflection acts as a global index, one may receive all reflections
 * and source files of the processed project through this reflection.
 */
class ProjectReflection extends container_1.ContainerReflection {
    constructor(name) {
        super(name, kind_1.ReflectionKind.Project);
        // Used to resolve references.
        this.symbolToReflectionIdMap = new Map();
        this.reflectionIdToSymbolMap = new Map();
        /**
         * A list of all reflections within the project. DO NOT MUTATE THIS OBJECT.
         * All mutation should be done via {@link registerReflection} and {@link removeReflection}
         * to ensure that links to reflections remain valid.
         *
         * This may be replaced with a `Map<number, Reflection>` someday.
         */
        this.reflections = {};
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
     * When excludeNotExported is set, if a symbol is exported only under a different name
     * there will be a reference which points to the symbol, but the symbol will not be converted
     * and the rename will point to nothing. Warn the user if this happens.
     */
    removeDanglingReferences() {
        const dangling = new Set();
        for (const ref of Object.values(this.reflections)) {
            if (ref instanceof reference_1.ReferenceReflection) {
                if (!ref.tryGetTargetReflection()) {
                    dangling.add(ref);
                }
            }
        }
        for (const refl of dangling) {
            this.removeReflection(refl);
        }
    }
    /**
     * Registers the given reflection so that it can be quickly looked up by helper methods.
     * Should be called for *every* reflection added to the project.
     */
    registerReflection(reflection, symbol) {
        this.referenceGraph = undefined;
        this.reflections[reflection.id] = reflection;
        if (symbol) {
            this.symbolToReflectionIdMap.set(symbol, this.symbolToReflectionIdMap.get(symbol) ?? reflection.id);
            this.reflectionIdToSymbolMap.set(reflection.id, symbol);
        }
    }
    /**
     * Removes a reflection from the documentation. Can be used by plugins to filter reflections
     * out of the generated documentation. Has no effect if the reflection is not present in the
     * project.
     */
    removeReflection(reflection) {
        // Remove references
        for (const id of this.getReferenceGraph().get(reflection.id) ?? []) {
            const ref = this.getReflectionById(id);
            if (ref) {
                this.removeReflection(ref);
            }
        }
        this.getReferenceGraph().delete(reflection.id);
        reflection.traverse((child) => (this.removeReflection(child), true));
        const parent = reflection.parent;
        parent?.traverse((child, property) => {
            if (child !== reflection) {
                return true; // Continue iteration
            }
            if (property === abstract_1.TraverseProperty.Children) {
                (0, utils_1.removeIfPresent)(parent.children, reflection);
            }
            else if (property === abstract_1.TraverseProperty.GetSignature) {
                delete parent.getSignature;
            }
            else if (property === abstract_1.TraverseProperty.IndexSignature) {
                delete parent.indexSignature;
            }
            else if (property === abstract_1.TraverseProperty.Parameters) {
                (0, utils_1.removeIfPresent)(reflection.parent.parameters, reflection);
            }
            else if (property === abstract_1.TraverseProperty.SetSignature) {
                delete parent.setSignature;
            }
            else if (property === abstract_1.TraverseProperty.Signatures) {
                (0, utils_1.removeIfPresent)(parent.signatures, reflection);
            }
            else if (property === abstract_1.TraverseProperty.TypeLiteral) {
                parent.type = new types_1.IntrinsicType("Object");
            }
            else if (property === abstract_1.TraverseProperty.TypeParameter) {
                (0, utils_1.removeIfPresent)(parent.typeParameters, reflection);
            }
            return false; // Stop iteration
        });
        const symbol = this.reflectionIdToSymbolMap.get(reflection.id);
        if (symbol &&
            this.symbolToReflectionIdMap.get(symbol) === reflection.id) {
            this.symbolToReflectionIdMap.delete(symbol);
        }
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
        const id = this.symbolToReflectionIdMap.get(symbol);
        if (typeof id === "number") {
            return this.getReflectionById(id);
        }
    }
    /** @internal */
    getSymbolFromReflection(reflection) {
        return this.reflectionIdToSymbolMap.get(reflection.id);
    }
    getReferenceGraph() {
        if (!this.referenceGraph) {
            this.referenceGraph = new Map();
            for (const ref of Object.values(this.reflections)) {
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
}
exports.ProjectReflection = ProjectReflection;
