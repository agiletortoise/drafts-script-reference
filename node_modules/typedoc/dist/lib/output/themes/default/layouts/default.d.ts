import type { RenderTemplate } from "../../../index.js";
import type { Reflection } from "../../../../models/index.js";
import { JSX } from "#utils";
import type { PageEvent } from "../../../events.js";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext.js";
export declare const defaultLayout: (context: DefaultThemeRenderContext, template: RenderTemplate<PageEvent<Reflection>>, props: PageEvent<Reflection>) => JSX.Element;
