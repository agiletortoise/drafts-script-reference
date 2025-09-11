import { RendererComponent } from "./components.js";
/**
 * Base class of all themes.
 *
 * The theme class determines how a page is rendered. It is loosely coupled with a router
 * class instance which is also created by the {@link Renderer} class.
 */
export class Theme extends RendererComponent {
    /**
     * Optional hook to call pre-render jobs
     */
    async preRender(_event) { }
    /**
     * Optional hook to call post-render jobs
     */
    async postRender(_event) { }
}
