"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReflection = void 0;
const comments_1 = require("../comments");
const abstract_1 = require("./abstract");
const kind_1 = require("./kind");
/**
 * Non-TS reflection type which is used to represent markdown documents included in the docs.
 */
class DocumentReflection extends abstract_1.Reflection {
    constructor(name, parent, content, frontmatter) {
        super(name, kind_1.ReflectionKind.Document, parent);
        this.variant = "document";
        this.content = content;
        this.frontmatter = frontmatter;
        if (typeof frontmatter["title"] === "string") {
            this.name = frontmatter["title"];
            delete frontmatter["title"];
        }
    }
    addChild(child) {
        this.children ||= [];
        this.children.push(child);
    }
    isDocument() {
        return true;
    }
    traverse(callback) {
        for (const child of this.children || []) {
            if (callback(child, abstract_1.TraverseProperty.Documents) === false) {
                return;
            }
        }
    }
    toObject(serializer) {
        return {
            ...super.toObject(serializer),
            variant: this.variant,
            content: comments_1.Comment.serializeDisplayParts(serializer, this.content),
            frontmatter: this.frontmatter,
            relevanceBoost: this.relevanceBoost,
            children: serializer.toObjectsOptional(this.children),
        };
    }
    fromObject(de, obj) {
        super.fromObject(de, obj);
        this.content = comments_1.Comment.deserializeDisplayParts(de, obj.content);
        this.frontmatter = obj.frontmatter;
        this.relevanceBoost = obj.relevanceBoost;
        this.children = de.reviveMany(obj.children, (obj) => de.reflectionBuilders.document(this, obj));
    }
}
exports.DocumentReflection = DocumentReflection;
