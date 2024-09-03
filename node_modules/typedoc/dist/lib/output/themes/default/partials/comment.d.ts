import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import { type Reflection } from "../../../../models";
export declare function commentSummary({ markdown }: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined;
export declare function commentTags(context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined;
export declare function reflectionFlags(context: DefaultThemeRenderContext, props: Reflection): JSX.Element;
