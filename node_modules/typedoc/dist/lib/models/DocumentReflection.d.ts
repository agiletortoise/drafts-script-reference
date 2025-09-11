import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import { type CommentDisplayPart } from "./Comment.js";
import { Reflection, type TraverseCallback } from "./Reflection.js";
/**
 * Non-TS reflection type which is used to represent markdown documents included in the docs.
 */
export declare class DocumentReflection extends Reflection {
    readonly variant = "document";
    /**
     * The content to be displayed on the page for this reflection.
     */
    content: CommentDisplayPart[];
    /**
     * Frontmatter included in document
     */
    frontmatter: Record<string, unknown>;
    /**
     * A precomputed boost derived from the searchCategoryBoosts and searchGroupBoosts options, used when
     * boosting search relevance scores at runtime. May be modified by plugins.
     */
    relevanceBoost?: number;
    /**
     * Child documents, if any are present.
     */
    children?: DocumentReflection[];
    constructor(name: string, parent: Reflection, content: CommentDisplayPart[], frontmatter: Record<string, unknown>);
    addChild(child: DocumentReflection): void;
    isDocument(): this is DocumentReflection;
    traverse(callback: TraverseCallback): void;
    toObject(serializer: Serializer): JSONOutput.DocumentReflection;
    fromObject(de: Deserializer, obj: JSONOutput.DocumentReflection): void;
}
