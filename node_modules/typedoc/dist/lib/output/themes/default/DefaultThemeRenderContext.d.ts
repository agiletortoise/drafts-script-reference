import type { PageEvent, Renderer } from "../..";
import type { Internationalization, TranslationProxy } from "../../../internationalization/internationalization";
import type { DocumentReflection, CommentDisplayPart, DeclarationReflection, Reflection } from "../../../models";
import { type NeverIfInternal, type Options } from "../../../utils";
import type { DefaultTheme } from "./DefaultTheme";
import { type icons } from "./partials/icon";
export declare class DefaultThemeRenderContext {
    readonly theme: DefaultTheme;
    page: PageEvent<Reflection>;
    private _refIcons;
    options: Options;
    internationalization: Internationalization;
    i18n: TranslationProxy;
    constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options);
    /**
     * Icons available for use within the page.
     *
     * Note: This creates a reference to icons declared by {@link DefaultTheme.icons},
     * to customize icons, that object must be modified instead.
     */
    get icons(): Readonly<typeof icons>;
    hook: Renderer["hooks"]["emit"];
    /** Avoid this in favor of urlTo if possible */
    relativeURL: (url: string, cacheBust?: boolean) => string;
    urlTo: (reflection: Reflection) => string;
    markdown: (md: readonly CommentDisplayPart[] | NeverIfInternal<string | undefined>) => string;
    getNavigation: () => import("./DefaultTheme").NavigationElement[];
    getReflectionClasses: (refl: DeclarationReflection | DocumentReflection) => string;
    documentTemplate: (props: PageEvent<DocumentReflection>) => import("../../../utils/jsx.elements").JsxElement;
    reflectionTemplate: (props: PageEvent<import("../../../models").ContainerReflection>) => import("../../../utils/jsx.elements").JsxElement;
    indexTemplate: (props: PageEvent<import("../../../models").ProjectReflection>) => import("../../../utils/jsx.elements").JsxElement;
    hierarchyTemplate: (props: PageEvent<import("../../../models").ProjectReflection>) => import("../../../utils/jsx.elements").JsxElement;
    defaultLayout: (template: import("../..").RenderTemplate<PageEvent<Reflection>>, props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    /**
     * Rendered just after the description for a reflection.
     * This can be used to render a shortened type display of a reflection that the
     * rest of the page expands on.
     *
     * Note: Will not be called for variables/type aliases, as they are summarized
     * by their type declaration, which is already rendered by {@link DefaultThemeRenderContext.memberDeclaration}
     */
    reflectionPreview: (props: Reflection) => import("../../../utils/jsx.elements").JsxElement | undefined;
    breadcrumb: (props: Reflection) => import("../../../utils/jsx.elements").JsxElement | undefined;
    commentSummary: (props: Reflection) => import("../../../utils/jsx.elements").JsxElement | undefined;
    commentTags: (props: Reflection) => import("../../../utils/jsx.elements").JsxElement | undefined;
    reflectionFlags: (props: Reflection) => import("../../../utils/jsx.elements").JsxElement;
    footer: () => import("../../../utils/jsx.elements").JsxElement;
    header: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    hierarchy: (props: import("../../../models").DeclarationHierarchy | undefined) => import("../../../utils/jsx.elements").JsxElement | undefined;
    index: (props: import("../../../models").ContainerReflection) => import("../../../utils/jsx.elements").JsxElement;
    member: (props: DeclarationReflection | DocumentReflection) => import("../../../utils/jsx.elements").JsxElement;
    memberDeclaration: (props: DeclarationReflection) => import("../../../utils/jsx.elements").JsxElement;
    memberGetterSetter: (props: DeclarationReflection) => import("../../../utils/jsx.elements").JsxElement;
    memberReference: (props: import("../../../models").ReferenceReflection) => import("../../../utils/jsx.elements").JsxElement;
    memberSignatureBody: (props: import("../../../models").SignatureReflection, r_1?: {
        hideSources?: boolean;
    } | undefined) => import("../../../utils/jsx.elements").JsxElement;
    memberSignatureTitle: (props: import("../../../models").SignatureReflection, r_1?: {
        hideName?: boolean;
        arrowStyle?: boolean;
        hideParamTypes?: boolean;
    } | undefined) => import("../../../utils/jsx.elements").JsxElement;
    memberSignatures: (props: DeclarationReflection) => import("../../../utils/jsx.elements").JsxElement;
    memberSources: (props: DeclarationReflection | import("../../../models").SignatureReflection) => import("../../../utils/jsx.elements").JsxElement;
    members: (props: import("../../../models").ContainerReflection) => import("../../../utils/jsx.elements").JsxElement;
    /** @deprecated Since 0.26.3 members does group/category flattening internally */
    membersGroup?: Function;
    sidebar: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    pageSidebar: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    sidebarLinks: () => import("../../../utils/jsx.elements").JsxElement | null;
    settings: () => import("../../../utils/jsx.elements").JsxElement;
    navigation: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    pageNavigation: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    parameter: (props: DeclarationReflection) => import("../../../utils/jsx.elements").JsxElement;
    toolbar: (props: PageEvent<Reflection>) => import("../../../utils/jsx.elements").JsxElement;
    type: (type: import("../../../models").Type | undefined, options?: {
        topLevelLinks: boolean;
    } | undefined) => import("../../../utils/jsx.elements").JsxElement;
    typeAndParent: (props: import("../../../models").Type) => import("../../../utils/jsx.elements").JsxElement;
    typeParameters: (typeParameters: import("../../../models").TypeParameterReflection[]) => import("../../../utils/jsx.elements").JsxElement;
}
