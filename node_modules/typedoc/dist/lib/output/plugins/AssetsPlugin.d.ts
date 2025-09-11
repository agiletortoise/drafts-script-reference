import { RendererComponent } from "../components.js";
import type { Renderer } from "../index.js";
/**
 * A plugin that copies the subdirectory ´assets´ from the current themes
 * source folder to the output directory.
 */
export declare class AssetsPlugin extends RendererComponent {
    private accessor favicon;
    private accessor customCss;
    private accessor customJs;
    constructor(owner: Renderer);
    getTranslatedStrings(): Record<string, string>;
    private onRenderBegin;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    private onRenderEnd;
}
