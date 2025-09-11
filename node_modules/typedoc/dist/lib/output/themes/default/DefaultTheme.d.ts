import { Theme } from "../../theme.js";
import type { Renderer } from "../../renderer.js";
import { type ContainerReflection, type DocumentReflection, type ProjectReflection, type Reflection, ReflectionKind } from "../../../models/index.js";
import type { PageEvent, RendererEvent } from "../../events.js";
import type { MarkedPlugin } from "../../plugins/index.js";
import { DefaultThemeRenderContext } from "./DefaultThemeRenderContext.js";
import { type Icons } from "./partials/icon.js";
import { JSX } from "#utils";
import { type Router } from "../../router.js";
export interface NavigationElement {
    text: string;
    path?: string;
    kind?: ReflectionKind;
    class?: string;
    children?: NavigationElement[];
    icon?: string | number;
}
/**
 * @param data the reflection to render
 * @returns either a string to be written to the file, or an element to be serialized and then written.
 */
export type RenderTemplate<T> = (data: T) => JSX.Element | string;
export declare class DefaultTheme extends Theme {
    usedFileNames: Set<string>;
    /** @internal */
    markedPlugin: MarkedPlugin;
    router: Router;
    /**
     * The icons which will actually be rendered. The source of truth lives on the theme, and
     * the {@link DefaultThemeRenderContext.icons} member will produce references to these.
     *
     * These icons will be written twice. Once to an `icons.svg` file in the assets directory
     * which will be referenced by icons on the context, and once to an `icons.js` file so that
     * references to the icons can be dynamically embedded within the page for use by the search
     * dropdown and when loading the page on `file://` urls.
     *
     * Custom themes may overwrite this entire object or individual properties on it to customize
     * the icons used within the page, however TypeDoc currently assumes that all icons are svg
     * elements, so custom themes must also use svg elements.
     */
    icons: Icons;
    ContextClass: typeof DefaultThemeRenderContext;
    private accessor lightTheme;
    private accessor darkTheme;
    private accessor highlightLanguages;
    private accessor ignoredHighlightLanguages;
    getRenderContext(pageEvent: PageEvent<Reflection>): DefaultThemeRenderContext;
    documentTemplate: (pageEvent: PageEvent<DocumentReflection>) => JSX.Element;
    reflectionTemplate: (pageEvent: PageEvent<ContainerReflection>) => JSX.Element;
    indexTemplate: (pageEvent: PageEvent<ProjectReflection>) => JSX.Element;
    hierarchyTemplate: (pageEvent: PageEvent<ProjectReflection>) => JSX.Element;
    defaultLayoutTemplate: (pageEvent: PageEvent<Reflection>, template: RenderTemplate<PageEvent<Reflection>>) => JSX.Element;
    getReflectionClasses(reflection: Reflection): string;
    /**
     * This is used so that themes may define multiple icons for modified icons (e.g. method, and inherited method)
     */
    getReflectionIcon(reflection: Reflection): keyof this["icons"] & (string | number);
    /**
     * Create a new DefaultTheme instance.
     *
     * @param renderer  The renderer this theme is attached to.
     */
    constructor(renderer: Renderer);
    render(page: PageEvent): string;
    preRender(_event: RendererEvent): Promise<void>;
    private _navigationCache;
    /**
     * If implementing a custom theme, it is recommended to override {@link buildNavigation} instead.
     */
    getNavigation(project: ProjectReflection): NavigationElement[];
    buildNavigation(project: ProjectReflection): NavigationElement[];
}
