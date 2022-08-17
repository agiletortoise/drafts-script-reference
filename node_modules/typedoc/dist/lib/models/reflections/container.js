"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerReflection = void 0;
const abstract_1 = require("./abstract");
class ContainerReflection extends abstract_1.Reflection {
    /**
     * Return a list of all children of a certain kind.
     *
     * @param kind  The desired kind of children.
     * @returns     An array containing all children with the desired kind.
     */
    getChildrenByKind(kind) {
        return (this.children || []).filter((child) => child.kindOf(kind));
    }
    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    traverse(callback) {
        for (const child of this.children?.slice() || []) {
            if (callback(child, abstract_1.TraverseProperty.Children) === false) {
                return;
            }
        }
    }
    toObject(serializer) {
        return {
            ...super.toObject(serializer),
            children: serializer.toObjectsOptional(this.children),
            groups: serializer.toObjectsOptional(this.groups),
            categories: serializer.toObjectsOptional(this.categories),
            sources: serializer.toObjectsOptional(this.sources),
        };
    }
}
exports.ContainerReflection = ContainerReflection;
