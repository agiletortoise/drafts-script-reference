import { ContextAwareRendererComponent } from "../components.js";
import { MarkdownEvent, type PageEvent, RendererEvent } from "../events.js";
import { type ValidationOptions } from "../../utils/index.js";
import type { BundledTheme } from "@gerrit0/mini-shiki";
import type { DefaultThemeRenderContext, Renderer } from "../index.js";
import { type CommentDisplayPart } from "../../models/index.js";
/**
 * Implements markdown and relativeURL helpers for templates.
 * @internal
 */
export declare class MarkedPlugin extends ContextAwareRendererComponent {
    accessor lightTheme: BundledTheme;
    accessor darkTheme: BundledTheme;
    accessor markdownItOptions: Record<string, unknown>;
    accessor markdownLinkExternal: boolean;
    accessor validation: ValidationOptions;
    private parser?;
    private renderedRelativeLinks;
    /**
     * This needing to be here really feels hacky... probably some nicer way to do this.
     * Revisit in 0.28.
     */
    private renderContext;
    private lastHeaderSlug;
    constructor(owner: Renderer);
    /**
     * Highlight the syntax of the given text using Shiki.
     *
     * @param text  The text that should be highlighted.
     * @param lang  The language that should be used to highlight the string.
     * @return A html string with syntax highlighting.
     */
    getHighlighted(text: string, lang?: string): string;
    /**
     * Parse the given markdown string and return the resulting html.
     *
     * @param input  The markdown string that should be parsed.
     * @returns The resulting html string.
     */
    parseMarkdown(input: string | readonly CommentDisplayPart[], page: PageEvent<any>, context: DefaultThemeRenderContext): string;
    private displayPartsToMarkdown;
    private onEnd;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    protected onBeginRenderer(event: RendererEvent): void;
    private getSlugger;
    /**
     * Creates an object with options that are passed to the markdown parser.
     *
     * @returns The options object for the markdown parser.
     */
    private setupParser;
    /**
     * Triggered when {@link MarkedPlugin} parses a markdown string.
     *
     * @param event
     */
    onParseMarkdown(event: MarkdownEvent): void;
}
