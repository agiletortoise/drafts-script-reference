import { RendererComponent } from "../components.js";
import type { Renderer } from "../index.js";
/**
 * Plugin which is responsible for creating an icons.js file that embeds the icon SVGs
 * within the page on page load to reduce page sizes.
 */
export declare class IconsPlugin extends RendererComponent {
    iconHtml?: string;
    constructor(owner: Renderer);
    private onBeginRender;
    private onRenderEnd;
}
