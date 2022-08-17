"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionGroup = void 0;
/**
 * A group of reflections. All reflections in a group are of the same kind.
 *
 * Reflection groups are created by the ´GroupHandler´ in the resolving phase
 * of the dispatcher. The main purpose of groups is to be able to more easily
 * render human readable children lists in templates.
 */
class ReflectionGroup {
    /**
     * Create a new ReflectionGroup instance.
     *
     * @param title The title of this group.
     */
    constructor(title) {
        /**
         * All reflections of this group.
         */
        this.children = [];
        this.title = title;
    }
    /**
     * Do all children of this group have a separate document?
     */
    allChildrenHaveOwnDocument() {
        return this.children.every((child) => child.hasOwnDocument);
    }
    toObject(serializer) {
        return {
            title: this.title,
            children: this.children.length > 0
                ? this.children.map((child) => child.id)
                : undefined,
            categories: serializer.toObjectsOptional(this.categories),
        };
    }
}
exports.ReflectionGroup = ReflectionGroup;
