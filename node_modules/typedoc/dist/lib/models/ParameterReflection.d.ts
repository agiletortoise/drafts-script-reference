import type { SomeType } from "./index.js";
import { Reflection, type TraverseCallback } from "./Reflection.js";
import type { SignatureReflection } from "./SignatureReflection.js";
import type { Deserializer, JSONOutput, Serializer } from "#serialization";
/**
 * @category Reflections
 */
export declare class ParameterReflection extends Reflection {
    readonly variant = "param";
    parent?: SignatureReflection;
    defaultValue?: string;
    type?: SomeType;
    traverse(callback: TraverseCallback): void;
    isParameter(): this is ParameterReflection;
    /**
     * Return a string representation of this reflection.
     */
    toString(): string;
    toObject(serializer: Serializer): JSONOutput.ParameterReflection;
    fromObject(de: Deserializer, obj: JSONOutput.ParameterReflection): void;
}
