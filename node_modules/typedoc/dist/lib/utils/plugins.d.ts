import type { Application } from "../application.js";
import { type NormalizedPathOrModuleOrFunction } from "#utils";
export declare function loadPlugins(app: Application, plugins: readonly NormalizedPathOrModuleOrFunction[]): Promise<void>;
