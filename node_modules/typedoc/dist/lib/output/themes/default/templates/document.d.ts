import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
import type { DocumentReflection } from "../../../../models/index.js";
import type { PageEvent } from "../../../events.js";
import { JSX } from "#utils";
export declare const documentTemplate: ({ markdown }: DefaultThemeRenderContext, props: PageEvent<DocumentReflection>) => JSX.Element;
