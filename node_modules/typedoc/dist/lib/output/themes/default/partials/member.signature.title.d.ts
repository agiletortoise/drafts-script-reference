import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import { JSX } from "../../../../utils";
import { type SignatureReflection } from "../../../../models";
export declare function memberSignatureTitle(context: DefaultThemeRenderContext, props: SignatureReflection, { hideName, arrowStyle, hideParamTypes, }?: {
    hideName?: boolean;
    arrowStyle?: boolean;
    hideParamTypes?: boolean;
}): JSX.Element;
