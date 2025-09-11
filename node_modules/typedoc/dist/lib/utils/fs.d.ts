import { type GlobString, type NormalizedPath } from "#utils";
export declare function isFile(file: string): boolean;
export declare function isDir(path: string): boolean;
/**
 * Load the given file and return its contents.
 *
 * @param file  The path of the file to read.
 * @returns The files contents.
 */
export declare function readFile(file: string): string;
/**
 * Write a file to disc.
 *
 * If the containing directory does not exist it will be created.
 *
 * @param fileName  The name of the file that should be written.
 * @param data  The contents of the file.
 */
export declare function writeFileSync(fileName: string, data: string): void;
/**
 * Write a file to disc.
 *
 * If the containing directory does not exist it will be created.
 *
 * @param fileName  The name of the file that should be written.
 * @param data  The contents of the file.
 */
export declare function writeFile(fileName: string, data: string): Promise<void>;
/**
 * Copy a file or directory recursively.
 */
export declare function copy(src: string, dest: string): Promise<void>;
export declare function copySync(src: string, dest: string): void;
export interface DiscoverFilesController {
    shouldRecurse(childPath: string[]): boolean;
    matches(path: string): boolean;
    /** Defaults to false */
    matchDirectories?: boolean;
    /** Defaults to false */
    followSymlinks?: boolean;
}
export declare function discoverFiles(rootDir: NormalizedPath, controller: DiscoverFilesController): NormalizedPath[];
/**
 * Simpler version of `glob.sync` that only covers our use cases, always ignoring node_modules.
 */
export declare function glob(pattern: GlobString, root: NormalizedPath, options?: {
    includeDirectories?: boolean;
    followSymlinks?: boolean;
}): NormalizedPath[];
export declare function hasTsExtension(path: string): boolean;
export declare function hasDeclarationFileExtension(path: string): boolean;
export declare function discoverInParentDirExactMatch<T extends {}>(name: string, dir: string, read: (content: string) => T | undefined, usedFile?: (path: string) => void): {
    file: string;
    content: T;
} | undefined;
export declare function discoverPackageJson(dir: string, usedFile?: (path: string) => void): {
    file: string;
    content: {
        version?: string | undefined;
    } & {
        name: string;
    };
} | undefined;
export declare function findPackageForPath(sourcePath: string): readonly [packageName: string, packageDir: string] | undefined;
export declare function inferPackageEntryPointPaths(packagePath: string): [importPath: string, resolvedPath: string][];
