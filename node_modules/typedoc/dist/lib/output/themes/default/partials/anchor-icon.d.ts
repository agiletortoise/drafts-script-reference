import type { Reflection } from "../../../../models/index.js";
import { JSX } from "#utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
export declare function anchorIcon(context: DefaultThemeRenderContext, anchor: string | undefined): JSX.Element;
export declare function anchorTargetIfPresent(context: DefaultThemeRenderContext, refl: Reflection): string | undefined;
