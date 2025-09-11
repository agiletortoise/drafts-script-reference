import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
import { JSX } from "#utils";
import { type CommentDisplayPart, type Reflection } from "../../../../models/index.js";
export declare function renderDisplayParts({ markdown }: DefaultThemeRenderContext, parts: readonly CommentDisplayPart[] | undefined): JSX.Element | undefined;
export declare function commentShortSummary(context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined;
export declare function commentSummary(context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined;
export declare function commentTags(context: DefaultThemeRenderContext, props: Reflection): JSX.Element | undefined;
export declare function reflectionFlags(context: DefaultThemeRenderContext, props: Reflection): JSX.Element;
