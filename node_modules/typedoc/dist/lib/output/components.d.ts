import { AbstractComponent } from "../utils/component.js";
import type { ProjectReflection } from "../models/index.js";
import type { Renderer } from "./renderer.js";
import { PageEvent, RendererEvent } from "./events.js";
export declare abstract class RendererComponent extends AbstractComponent<Renderer, {}> {
}
/**
 * A plugin for the renderer that reads the current render context.
 */
export declare abstract class ContextAwareRendererComponent extends RendererComponent {
    /**
     * The project that is currently processed.
     */
    protected project?: ProjectReflection;
    /**
     * The reflection that is currently processed.
     */
    protected page?: PageEvent;
    /**
     * The url of the document that is being currently generated.
     * Set when a page begins rendering.
     *
     * Defaulted to '.' so that tests don't have to set up events.
     */
    private location;
    /**
     * Regular expression to test if a string looks like an external url.
     */
    protected urlPrefix: RegExp;
    protected get hostedBaseUrl(): string;
    private accessor useHostedBaseUrlForAbsoluteLinks;
    constructor(owner: Renderer);
    private absoluteToRelativePathMap;
    /**
     * Transform the given absolute path into a relative path.
     *
     * @param absolute  The absolute path to transform.
     * @returns A path relative to the document currently processed.
     */
    getRelativeUrl(absolute: string): string;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    protected onBeginRenderer(event: RendererEvent): void;
    /**
     * Triggered before a document will be rendered.
     *
     * @param page  An event object describing the current render operation.
     */
    protected onBeginPage(page: PageEvent): void;
}
