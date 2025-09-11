import { RendererComponent } from "../components.js";
import type { Renderer } from "../index.js";
/**
 * A plugin that exports an index of the project to a javascript file.
 *
 * The resulting javascript file can be used to build a simple search function.
 */
export declare class JavascriptIndexPlugin extends RendererComponent {
    private accessor searchComments;
    private accessor searchDocuments;
    private accessor searchGroupBoosts;
    private accessor searchCategoryBoosts;
    accessor groupReferencesByType: boolean;
    private unusedGroupBoosts;
    private unusedCatBoosts;
    constructor(owner: Renderer);
    private onRendererBegin;
    private buildSearchIndex;
    private getBoost;
    private getCommentSearchText;
    private getDocumentSearchText;
}
