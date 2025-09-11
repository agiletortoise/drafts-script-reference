import { type MinimatchSet } from "./paths.js";
import { type GlobString, type Logger, type NormalizedPath } from "#utils";
/**
 * Loads a package.json and validates that it is a JSON Object
 */
export declare function loadPackageManifest(logger: Logger, packageJsonPath: string): Record<string, unknown> | undefined;
/**
 * Given a list of (potentially wildcard containing) package paths,
 * return all the actual package folders found.
 */
export declare function expandPackages(logger: Logger, packageJsonDir: NormalizedPath, workspaces: GlobString[], exclude: MinimatchSet): string[];
