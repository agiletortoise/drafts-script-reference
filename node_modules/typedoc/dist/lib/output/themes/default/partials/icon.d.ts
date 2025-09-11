import { ReflectionKind } from "../../../../models/index.js";
import { JSX } from "#utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
export declare function buildRefIcons(icons: Icons, context: DefaultThemeRenderContext): Icons;
export interface Icons extends Record<ReflectionKind, () => JSX.Element> {
    chevronDown(): JSX.Element;
    checkbox(): JSX.Element;
    menu(): JSX.Element;
    search(): JSX.Element;
    /** @deprecated */
    chevronSmall(): JSX.Element;
    anchor(): JSX.Element;
    folder(): JSX.Element;
    alertNote(): JSX.Element;
    alertTip(): JSX.Element;
    alertImportant(): JSX.Element;
    alertWarning(): JSX.Element;
    alertCaution(): JSX.Element;
}
export declare function getIcons(): Icons;
