import type { PageEvent, Renderer } from "../../index.js";
import type { CommentDisplayPart, Reflection } from "../../../models/index.js";
import { type Options } from "../../../utils/index.js";
import type { DefaultTheme } from "./DefaultTheme.js";
import { type Icons } from "./partials/icon.js";
import type { Router } from "../../router.js";
import type { JSX, NeverIfInternal } from "#utils";
export declare class DefaultThemeRenderContext {
    readonly router: Router;
    readonly theme: DefaultTheme;
    page: PageEvent<Reflection>;
    private _refIcons;
    options: Options;
    model: Reflection;
    constructor(router: Router, theme: DefaultTheme, page: PageEvent<Reflection>, options: Options);
    /**
     * Icons available for use within the page.
     * When getting an icon for a reflection, {@link reflectionIcon} should be used so
     * that themes which define multiple icon variants can correctly specify which icon
     * they want to be used.
     *
     * Note: This creates a reference to icons declared by {@link DefaultTheme.icons},
     * to customize icons, that object must be modified instead.
     */
    get icons(): Readonly<Icons>;
    /**
     * Do not override this method, override {@link DefaultTheme.getReflectionIcon} instead.
     */
    reflectionIcon: (reflection: Reflection) => JSX.Element;
    get slugger(): import("./Slugger.js").Slugger;
    hook: Renderer["hooks"]["emit"];
    /** Avoid this in favor of urlTo if possible */
    relativeURL: (url: string, cacheBust?: boolean) => string;
    getAnchor: (reflection: Reflection) => string | undefined;
    urlTo: (reflection: Reflection) => string | undefined;
    markdown: (md: readonly CommentDisplayPart[] | NeverIfInternal<string | undefined>) => string;
    /** Renders user comment markdown wrapped in a tsd-comment div */
    displayParts: (parts: readonly CommentDisplayPart[] | undefined) => JSX.Element | undefined;
    getNavigation: () => import("./DefaultTheme.js").NavigationElement[];
    getReflectionClasses: (refl: Reflection) => string;
    documentTemplate: (props: PageEvent<import("../../../models/DocumentReflection.js").DocumentReflection>) => JSX.Element;
    reflectionTemplate: (props: PageEvent<import("../../../models/ContainerReflection.js").ContainerReflection>) => JSX.Element;
    indexTemplate: (props: PageEvent<import("../../../models/ProjectReflection.js").ProjectReflection>) => JSX.Element;
    hierarchyTemplate: (props: PageEvent<import("../../../models/ProjectReflection.js").ProjectReflection>) => JSX.Element;
    defaultLayout: (template: import("./DefaultTheme.js").RenderTemplate<PageEvent<Reflection>>, props: PageEvent<Reflection>) => JSX.Element;
    /**
     * Rendered just after the description for a reflection.
     * This can be used to render a shortened type display of a reflection that the
     * rest of the page expands on.
     *
     * Note: Will not be called for variables/type aliases, as they are summarized
     * by their type declaration, which is already rendered by {@link DefaultThemeRenderContext.memberDeclaration}
     */
    reflectionPreview: (props: Reflection) => JSX.Element | undefined;
    /**
     * Used to render additional details about a type. This is used to implement
     * the `@expand` tag, comments on union members, comments on object type members...
     */
    typeDetails: (reflectionOwningType: Reflection, type: import("../../../models/types.js").SomeType, renderAnchors: boolean) => JSX.Children;
    /**
     * Should call the {@link typeDetails} helper if rendering additional details
     * about the type will provide the user with more information about the type.
     */
    typeDetailsIfUseful: (reflectionOwningType: Reflection, type: import("../../../models/types.js").SomeType | undefined) => JSX.Children;
    /**
     * Wrapper around {@link typeDetails} which checks if it is useful
     * and includes a "Type Declaration" header.
     */
    typeDeclaration: (reflectionOwningType: Reflection, type: import("../../../models/types.js").SomeType) => JSX.Children;
    breadcrumbs: (props: Reflection) => JSX.Element;
    commentShortSummary: (props: Reflection) => JSX.Element | undefined;
    commentSummary: (props: Reflection) => JSX.Element | undefined;
    commentTags: (props: Reflection) => JSX.Element | undefined;
    reflectionFlags: (props: Reflection) => JSX.Element;
    footer: () => JSX.Element;
    header: (props: PageEvent<Reflection>) => JSX.Element;
    hierarchy: (typeHierarchy: import("../../../models/DeclarationReflection.js").DeclarationHierarchy | undefined) => JSX.Element | undefined;
    index: (props: import("../../../models/ContainerReflection.js").ContainerReflection) => JSX.Element;
    member: (props: import("../../../models/DocumentReflection.js").DocumentReflection | import("../../../models/DeclarationReflection.js").DeclarationReflection) => JSX.Element;
    moduleReflection: (mod: import("../../../models/DeclarationReflection.js").DeclarationReflection | import("../../../models/ProjectReflection.js").ProjectReflection) => JSX.Element;
    moduleMemberSummary: (member: import("../../../models/DocumentReflection.js").DocumentReflection | import("../../../models/DeclarationReflection.js").DeclarationReflection) => JSX.Element;
    memberDeclaration: (props: import("../../../models/DeclarationReflection.js").DeclarationReflection) => JSX.Element;
    memberGetterSetter: (props: import("../../../models/DeclarationReflection.js").DeclarationReflection) => JSX.Element;
    memberSignatureBody: (props: import("../../../models/SignatureReflection.js").SignatureReflection, r_1?: {
        hideSources?: boolean;
    } | undefined) => JSX.Element;
    memberSignatureTitle: (props: import("../../../models/SignatureReflection.js").SignatureReflection, options?: {
        hideName?: boolean;
    } | undefined) => JSX.Element;
    memberSignatures: (props: import("../../../models/DeclarationReflection.js").DeclarationReflection) => JSX.Element;
    memberSources: (props: import("../../../models/DeclarationReflection.js").DeclarationReflection | import("../../../models/SignatureReflection.js").SignatureReflection) => JSX.Element;
    members: (props: import("../../../models/ContainerReflection.js").ContainerReflection) => JSX.Element;
    sidebar: (props: PageEvent<Reflection>) => JSX.Element;
    pageSidebar: (props: PageEvent<Reflection>) => JSX.Element;
    sidebarLinks: () => JSX.Element | null;
    settings: () => JSX.Element;
    navigation: (props: PageEvent<Reflection>) => JSX.Element;
    pageNavigation: (props: PageEvent<Reflection>) => JSX.Element;
    toolbar: (props: PageEvent<Reflection>) => JSX.Element;
    type: (type: import("../../../models/types.js").SomeType | undefined, options?: {
        topLevelLinks: boolean;
    } | undefined) => JSX.Element;
    typeAndParent: (props: import("../../../models/types.js").Type) => JSX.Element;
    typeParameters: (typeParameters: import("../../../models/TypeParameterReflection.js").TypeParameterReflection[]) => JSX.Element;
}
