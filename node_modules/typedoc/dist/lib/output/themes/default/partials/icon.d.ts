import { ReflectionKind } from "../../../../models";
import { JSX } from "../../../../utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
export declare function buildRefIcons<T extends Record<string, () => JSX.Element>>(icons: T, context: DefaultThemeRenderContext): T;
export declare const icons: Record<ReflectionKind | "chevronDown" | "checkbox" | "menu" | "search" | "chevronSmall" | "anchor", () => JSX.Element>;
