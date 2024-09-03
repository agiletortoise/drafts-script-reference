import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";
import type { DocumentReflection } from "../../../../models";
import type { PageEvent } from "../../../events";
import { JSX } from "../../../../utils";
export declare const documentTemplate: ({ markdown }: DefaultThemeRenderContext, props: PageEvent<DocumentReflection>) => JSX.Element;
