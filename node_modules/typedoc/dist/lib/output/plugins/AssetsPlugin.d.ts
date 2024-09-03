import { RendererComponent } from "../components";
/**
 * A plugin that copies the subdirectory ´assets´ from the current themes
 * source folder to the output directory.
 */
export declare class AssetsPlugin extends RendererComponent {
    /** @internal */
    accessor customCss: string;
    getTranslatedStrings(): {
        copy: import("../../internationalization").TranslatedString;
        copied: import("../../internationalization").TranslatedString;
        normally_hidden: import("../../internationalization").TranslatedString;
    };
    /**
     * Create a new AssetsPlugin instance.
     */
    initialize(): void;
    private onRenderBegin;
    /**
     * Triggered before the renderer starts rendering a project.
     *
     * @param event  An event object describing the current render operation.
     */
    private onRenderEnd;
}
