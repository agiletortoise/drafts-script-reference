import { type GlobString, type NormalizedPath } from "#utils";
import { Minimatch } from "minimatch";
export declare class MinimatchSet {
    readonly patterns: Minimatch[];
    constructor(patterns: GlobString[]);
    matchesAny(path: string): boolean;
}
export declare function splitGlobToPathAndSpecial(glob: string): {
    modifiers: string;
    path: string;
    glob: string;
};
export declare function createGlobString(relativeTo: NormalizedPath, glob: string): GlobString;
/**
 * Get the longest directory path common to all files.
 */
export declare function getCommonPath(files: readonly string[]): NormalizedPath;
export declare function getCommonDirectory(files: readonly string[]): NormalizedPath;
export declare function deriveRootDir(globPaths: GlobString[]): NormalizedPath;
export declare function nicePath(absPath: string): string;
/**
 * Normalize the given path.
 *
 * @param path  The path that should be normalized.
 * @returns The normalized path.
 */
export declare function normalizePath(path: string): NormalizedPath;
