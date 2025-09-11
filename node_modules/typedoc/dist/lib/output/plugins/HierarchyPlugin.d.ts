import { RendererComponent } from "../components.js";
import type { Renderer } from "../index.js";
export declare class HierarchyPlugin extends RendererComponent {
    constructor(renderer: Renderer);
    private onRendererBegin;
    private buildHierarchy;
}
