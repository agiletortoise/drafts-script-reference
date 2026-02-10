import type { TypeDocOptionMap } from "#node-utils";
/**
 * Responsible for getting a unique anchor for elements within a page.
 */
export declare class Slugger {
    private options;
    private seen;
    private serialize;
    constructor(options: TypeDocOptionMap["sluggerConfiguration"]);
    slug(value: string): string;
    hasAnchor(anchor: string): boolean;
    getSimilarAnchors(anchor: string): string[];
}
