import { RendererComponent } from "../components.js";
import type { Renderer } from "../index.js";
export declare class NavigationPlugin extends RendererComponent {
    constructor(owner: Renderer);
    private onRendererBegin;
    private buildNavigationIndex;
}
