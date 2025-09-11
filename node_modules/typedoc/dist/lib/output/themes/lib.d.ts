import type { DefaultThemeRenderContext } from "../index.js";
import { type CommentDisplayPart, type ContainerReflection, DeclarationReflection, type DocumentReflection, ProjectReflection, type Reflection, type TypeParameterReflection } from "../../models/index.js";
import { JSX } from "#utils";
export declare function stringify(data: unknown): string;
export declare function getDisplayName(refl: Reflection): string;
export declare function toStyleClass(str: string): string;
export declare function getKindClass(refl: Reflection): string;
/**
 * Insert word break tags ``<wbr>`` into the given string.
 *
 * Breaks the given string at ``_``, ``-`` and capital letters.
 *
 * @param str The string that should be split.
 * @return The original string containing ``<wbr>`` tags where possible.
 */
export declare function wbr(str: string): (string | JSX.Element)[];
export declare function join<T>(joiner: JSX.Children, list: readonly T[], cb: (x: T) => JSX.Children): JSX.Element;
export declare function classNames(names: Record<string, boolean | null | undefined>, extraCss?: string): string | undefined;
export declare function hasTypeParameters(reflection: Reflection): reflection is Reflection & {
    typeParameters: TypeParameterReflection[];
};
export declare function renderTypeParametersSignature(context: DefaultThemeRenderContext, typeParameters: readonly TypeParameterReflection[] | undefined): JSX.Element;
/**
 * Renders the reflection name with an additional `?` if optional.
 */
export declare function renderName(refl: Reflection): JSX.Element | (string | JSX.Element)[];
export declare function getHierarchyRoots(project: ProjectReflection): DeclarationReflection[];
export declare function isNoneSection(section: MemberSection): boolean;
export interface MemberSection {
    title: string;
    description?: CommentDisplayPart[];
    children: Array<DocumentReflection | DeclarationReflection>;
}
export declare function getMemberSections(parent: ContainerReflection, childFilter?: (refl: Reflection) => boolean): MemberSection[];
/**
 * Returns a (hopefully) globally unique path for the given reflection.
 *
 * This only works for exportable symbols, so e.g. methods are not affected by this.
 *
 * If the given reflection has a globally unique name already, then it will be returned as is. If the name is
 * ambiguous (i.e. there are two classes with the same name in different namespaces), then the namespaces path of the
 * reflection will be returned.
 */
export declare function getUniquePath(reflection: Reflection): Reflection[];
