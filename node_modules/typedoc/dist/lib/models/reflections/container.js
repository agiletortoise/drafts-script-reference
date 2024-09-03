"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerReflection = void 0;
const abstract_1 = require("./abstract");
const ReflectionCategory_1 = require("../ReflectionCategory");
const ReflectionGroup_1 = require("../ReflectionGroup");
const utils_1 = require("../../utils");
/**
 * @category Reflections
 */
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
    addChild(child) {
        if (child.isDeclaration()) {
            this.children ||= [];
            this.children.push(child);
        }
        else {
            this.documents ||= [];
            this.documents.push(child);
        }
        this.childrenIncludingDocuments ||= [];
        this.childrenIncludingDocuments.push(child);
    }
    removeChild(child) {
        if (child.isDeclaration()) {
            (0, utils_1.removeIfPresent)(this.children, child);
            if (this.children?.length === 0) {
                delete this.children;
            }
        }
        else {
            (0, utils_1.removeIfPresent)(this.documents, child);
            if (this.documents?.length === 0) {
                delete this.documents;
            }
        }
        (0, utils_1.removeIfPresent)(this.childrenIncludingDocuments, child);
        if (this.childrenIncludingDocuments?.length === 0) {
            delete this.childrenIncludingDocuments;
        }
    }
    traverse(callback) {
        for (const child of this.children?.slice() || []) {
            if (callback(child, abstract_1.TraverseProperty.Children) === false) {
                return;
            }
        }
        for (const child of this.documents?.slice() || []) {
            if (callback(child, abstract_1.TraverseProperty.Documents) === false) {
                return;
            }
        }
    }
    toObject(serializer) {
        return {
            ...super.toObject(serializer),
            children: serializer.toObjectsOptional(this.children),
            documents: serializer.toObjectsOptional(this.documents),
            // If we only have one type of child, don't bother writing the duplicate info about
            // ordering with documents to the serialized file.
            childrenIncludingDocuments: this.children?.length && this.documents?.length
                ? this.childrenIncludingDocuments?.map((refl) => refl.id)
                : undefined,
            groups: serializer.toObjectsOptional(this.groups),
            categories: serializer.toObjectsOptional(this.categories),
        };
    }
    fromObject(de, obj) {
        super.fromObject(de, obj);
        this.children = de.reviveMany(obj.children, (child) => de.constructReflection(child));
        this.documents = de.reviveMany(obj.documents, (child) => de.constructReflection(child));
        const byId = new Map();
        for (const child of this.children || []) {
            byId.set(child.id, child);
        }
        for (const child of this.documents || []) {
            byId.set(child.id, child);
        }
        for (const id of obj.childrenIncludingDocuments || []) {
            const child = byId.get(de.oldIdToNewId[id] ?? -1);
            if (child) {
                this.childrenIncludingDocuments ||= [];
                this.childrenIncludingDocuments.push(child);
                byId.delete(de.oldIdToNewId[id] ?? -1);
            }
        }
        if (byId.size) {
            // Anything left in byId wasn't included in the childrenIncludingDocuments array.
            // This is expected if we're dealing with a JSON file produced by TypeDoc 0.25.
            this.childrenIncludingDocuments ||= [];
            this.childrenIncludingDocuments.push(...byId.values());
        }
        this.groups = de.reviveMany(obj.groups, (group) => new ReflectionGroup_1.ReflectionGroup(group.title, this));
        this.categories = de.reviveMany(obj.categories, (cat) => new ReflectionCategory_1.ReflectionCategory(cat.title));
    }
}
exports.ContainerReflection = ContainerReflection;
