import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import type { ProjectReflection, Reflection } from "./index.js";
import type { ReflectionId } from "./Reflection.js";
import { type NormalizedPath } from "#utils";
export type FileId = number & {
    __mediaIdBrand: never;
};
export declare class FileRegistry {
    protected nextId: number;
    protected mediaToReflection: Map<FileId, ReflectionId>;
    protected mediaToPath: Map<FileId, NormalizedPath>;
    protected reflectionToPath: Map<ReflectionId, NormalizedPath>;
    protected pathToMedia: Map<NormalizedPath, FileId>;
    protected names: Map<FileId, string>;
    protected nameUsage: Map<string, number>;
    registerAbsolute(absolute: NormalizedPath): {
        target: FileId;
        anchor: string | undefined;
    };
    /**
     * Registers the specified path as the canonical file for this reflection
     */
    registerReflection(absolute: NormalizedPath, reflection: Reflection): void;
    /**
     * Registers the specified path as a path which should be resolved to the specified
     * reflection. A reflection *may* be associated with multiple paths.
     */
    registerReflectionPath(absolute: NormalizedPath, reflection: Reflection): void;
    getReflectionPath(reflection: Reflection): string | undefined;
    register(sourcePath: NormalizedPath, relativePath: NormalizedPath): {
        target: FileId;
        anchor: string | undefined;
    } | undefined;
    removeReflection(reflection: Reflection): void;
    resolve(id: FileId, project: ProjectReflection): string | Reflection | undefined;
    resolvePath(id: FileId): string | undefined;
    getName(id: FileId): string | undefined;
    getNameToAbsoluteMap(): ReadonlyMap<string, string>;
    toObject(ser: Serializer): JSONOutput.FileRegistry;
    /**
     * Revive a file registry from disc.
     * Note that in the packages context this may be called multiple times on
     * a single object, and should merge in files from the other registries.
     */
    fromObject(de: Deserializer, obj: JSONOutput.FileRegistry): void;
}
