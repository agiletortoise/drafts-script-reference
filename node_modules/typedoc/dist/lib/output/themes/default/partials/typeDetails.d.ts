import { type CommentDisplayPart, Reflection } from "../../../../models/index.js";
import type { SomeType } from "../../../../models/types.js";
import { JSX } from "#utils";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
export declare function typeDeclaration(context: DefaultThemeRenderContext, reflectionOwningType: Reflection, type: SomeType): JSX.Children;
export declare function typeDetails(context: DefaultThemeRenderContext, reflectionOwningType: Reflection, type: SomeType, renderAnchors: boolean): JSX.Children;
export declare function typeDetailsImpl(context: DefaultThemeRenderContext, reflectionOwningType: Reflection, type: SomeType, renderAnchors: boolean, highlighted?: Map<string, CommentDisplayPart[]>): JSX.Children;
export declare function typeDetailsIfUseful(context: DefaultThemeRenderContext, reflectionOwningType: Reflection, type: SomeType | undefined): JSX.Children;
