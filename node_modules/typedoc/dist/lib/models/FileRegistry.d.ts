import type { Deserializer, Serializer } from "../serialization";
import type { FileRegistry as JSONFileRegistry } from "../serialization/schema";
import type { Reflection } from "./reflections";
export declare class FileRegistry {
    protected nextId: number;
    protected mediaToReflection: Map<number, Reflection>;
    protected mediaToPath: Map<number, string>;
    protected reflectionToPath: Map<Reflection, string>;
    protected pathToMedia: Map<string, number>;
    protected names: Map<number, string>;
    protected nameUsage: Map<string, number>;
    registerAbsolute(absolute: string): number;
    /** Called by {@link ProjectReflection.registerReflection} @internal*/
    registerReflection(absolute: string, reflection: Reflection): void;
    register(sourcePath: string, relativePath: string): number | undefined;
    removeReflection(reflection: Reflection): void;
    resolve(id: number): string | Reflection | undefined;
    getName(id: number): string | undefined;
    getNameToAbsoluteMap(): ReadonlyMap<string, string>;
    toObject(ser: Serializer): JSONFileRegistry;
    /**
     * Revive a file registry from disc.
     * Note that in the packages context this may be called multiple times on
     * a single object, and should merge in files from the other registries.
     */
    fromObject(de: Deserializer, obj: JSONFileRegistry): void;
}
export declare class ValidatingFileRegistry extends FileRegistry {
    register(sourcePath: string, relativePath: string): number | undefined;
    fromObject(de: Deserializer, obj: JSONFileRegistry): void;
}
