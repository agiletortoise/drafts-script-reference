import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
import type { ProjectReflection } from "../../../../models/index.js";
import type { PageEvent } from "../../../events.js";
import { JSX } from "#utils";
export declare const indexTemplate: ({ markdown }: DefaultThemeRenderContext, props: PageEvent<ProjectReflection>) => JSX.Element;
