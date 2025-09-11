import type { Application } from "../application.js";
import { ProjectReflection, Reflection, ReflectionKind } from "../models/index.js";
import { type TypeDocOptionMap } from "../utils/index.js";
import { Slugger } from "./themes/default/Slugger.js";
/**
 * The type of page which should be rendered. This may be extended in the future.
 *
 * Note: TypeDoc any string may be used as the page kind. TypeDoc defines a few
 * described by this object.
 * @enum
 */
export declare const PageKind: {
    readonly Index: "index";
    readonly Reflection: "reflection";
    readonly Document: "document";
    readonly Hierarchy: "hierarchy";
};
export type PageKind = (typeof PageKind)[keyof typeof PageKind] | string & {};
/**
 * A router target is something that may be linked to within a page. Notably,
 * {@link Reflection} is compatible with this interface. TypeDoc supports non-reflection
 * router targets, but does not currently create any.
 */
export type RouterTarget = {
    name: string;
    parent: RouterTarget;
} | Reflection;
export interface PageDefinition<out Model extends RouterTarget = RouterTarget> {
    readonly url: string;
    readonly kind: PageKind;
    readonly model: Model;
}
/**
 * Interface which routers must conform to.
 */
export interface Router {
    /**
     * Should return a list of pages which should be rendered.
     * This will be called once per render.
     */
    buildPages(project: ProjectReflection): PageDefinition[];
    /**
     * Can be used to check if the target can be linked to.
     */
    hasUrl(target: RouterTarget): boolean;
    /**
     * Get a list of all targets which can be linked to.
     * This is used for creating the search index.
     */
    getLinkTargets(): RouterTarget[];
    /**
     * Gets an anchor for this target within its containing page.
     * May be undefined if this target owns its own page.
     */
    getAnchor(refl: RouterTarget): string | undefined;
    /**
     * Returns true if the target has its own page, false if embedded within
     * another page.
     */
    hasOwnDocument(refl: RouterTarget): boolean;
    /**
     * Should return a URL which when clicked on the page containing `from`
     * takes the user to the page/anchor containing `to`.
     */
    relativeUrl(from: RouterTarget, to: RouterTarget): string;
    /**
     * Should return a URL relative to the project base. This is used for
     * determining links to items in the assets folder.
     */
    baseRelativeUrl(from: RouterTarget, target: string): string;
    /**
     * Get the full URL to the target. In TypeDoc's default router this
     * is equivalent to `relativeUrl(project, refl)`, but this might not be
     * the case for custom routers which place the project somewhere else
     * besides `index.html`.
     *
     * The URL returned by this by the frontend JS when building dynamic URLs
     * for the search, full hierarchy, and navigation components.
     */
    getFullUrl(refl: RouterTarget): string;
    /**
     * Responsible for getting a slugger for the given target. If a
     * target is not associated with a page, the slugger for the parent
     * target should be returned instead.
     */
    getSlugger(reflection: RouterTarget): Slugger;
}
/**
 * Base router class intended to make it easier to implement a router.
 *
 * Child classes need only {@link getIdealBaseName}, this class will take care
 * of the recursing through child reflections.
 * @group Routers
 */
export declare abstract class BaseRouter implements Router {
    readonly application: Application;
    extension: string;
    protected usedFileNames: Set<string>;
    protected sluggers: Map<RouterTarget, Slugger>;
    protected fullUrls: Map<RouterTarget, string>;
    protected anchors: Map<RouterTarget, string>;
    protected accessor sluggerConfiguration: TypeDocOptionMap["sluggerConfiguration"];
    protected accessor includeHierarchySummary: boolean;
    constructor(application: Application);
    /**
     * Should return the base-relative desired file name for a router target.
     * This name may not be used exactly as TypeDoc will detect conflicts
     * and automatically introduce a unique identifier to the URL to resolve
     * them.
     */
    protected abstract getIdealBaseName(reflection: RouterTarget): string;
    buildPages(project: ProjectReflection): PageDefinition[];
    hasUrl(target: RouterTarget): boolean;
    getLinkTargets(): RouterTarget[];
    getAnchor(target: RouterTarget): string | undefined;
    hasOwnDocument(target: RouterTarget): boolean;
    relativeUrl(from: RouterTarget, to: RouterTarget): string;
    baseRelativeUrl(from: RouterTarget, target: string): string;
    getFullUrl(target: RouterTarget): string;
    getSlugger(target: RouterTarget): Slugger;
    /**
     * Should the page kind to use if a reflection should have its own rendered
     * page in the output. Note that once `undefined` is returned, children of
     * that reflection will not have their own document.
     */
    protected getPageKind(target: RouterTarget): PageKind | undefined;
    protected buildChildPages(target: RouterTarget, outPages: PageDefinition[]): void;
    protected buildAnchors(target: RouterTarget, pageTarget: RouterTarget): void;
    /** Strip non-url safe characters from the specified string. */
    protected getUrlSafeName(name: string): string;
    protected getFileName(baseName: string): string;
}
/**
 * Router which places reflections in folders according to their kind.
 * @group Routers
 */
export declare class KindRouter extends BaseRouter {
    directories: Map<ReflectionKind, string>;
    protected getIdealBaseName(reflection: Reflection): string;
}
/**
 * Router which places reflections in folders according to their kind,
 * but creates each page as `/index.html` to allow for clean URLs.
 * @group Routers
 */
export declare class KindDirRouter extends KindRouter {
    private fixLink;
    protected buildChildPages(reflection: Reflection, outPages: PageDefinition[]): void;
    getFullUrl(refl: Reflection): string;
    relativeUrl(from: Reflection, to: Reflection): string;
}
/**
 * Router which places reflections in folders according to the module structure.
 * @group Routers
 */
export declare class StructureRouter extends BaseRouter {
    protected getIdealBaseName(reflection: Reflection): string;
}
/**
 * Router which places reflections in folders according to the module structure,
 * but creates each page as `/index.html` to allow for clean URLs.
 * @group Routers
 */
export declare class StructureDirRouter extends StructureRouter {
    private fixLink;
    protected buildChildPages(reflection: Reflection, outPages: PageDefinition[]): void;
    getFullUrl(refl: Reflection): string;
    relativeUrl(from: Reflection, to: Reflection): string;
}
/**
 * Router which places reflections in folders according to `@group` tags.
 * @group Routers
 */
export declare class GroupRouter extends BaseRouter {
    private accessor groupReferencesByType;
    private getGroup;
    protected getIdealBaseName(reflection: Reflection): string;
}
/**
 * Router which places reflections in folders according to `@category` tags.
 * @group Routers
 */
export declare class CategoryRouter extends BaseRouter {
    private accessor defaultCategory;
    private getCategory;
    protected getIdealBaseName(reflection: Reflection): string;
}
