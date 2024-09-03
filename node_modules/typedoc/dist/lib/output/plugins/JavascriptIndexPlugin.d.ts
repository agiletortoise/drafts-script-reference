import { RendererComponent } from "../components";
/**
 * A plugin that exports an index of the project to a javascript file.
 *
 * The resulting javascript file can be used to build a simple search function.
 */
export declare class JavascriptIndexPlugin extends RendererComponent {
    private accessor searchComments;
    private accessor searchDocuments;
    initialize(): void;
    private onRendererBegin;
    private buildSearchIndex;
    private getCommentSearchText;
    private getDocumentSearchText;
}
