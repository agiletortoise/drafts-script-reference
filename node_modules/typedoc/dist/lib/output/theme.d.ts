import { RendererComponent } from "./components.js";
import type { PageEvent, RendererEvent } from "./events.js";
/**
 * Base class of all themes.
 *
 * The theme class determines how a page is rendered. It is loosely coupled with a router
 * class instance which is also created by the {@link Renderer} class.
 */
export declare abstract class Theme extends RendererComponent {
    /**
     * Renders the provided page to a string, which will be written to disk by the {@link Renderer}
     */
    abstract render(event: PageEvent): string;
    /**
     * Optional hook to call pre-render jobs
     */
    preRender(_event: RendererEvent): Promise<void>;
    /**
     * Optional hook to call post-render jobs
     */
    postRender(_event: RendererEvent): Promise<void>;
}
