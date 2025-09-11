import { type ReferenceType, type SomeType } from "./types.js";
import { Reflection, type TraverseCallback } from "./Reflection.js";
import type { ParameterReflection } from "./ParameterReflection.js";
import type { TypeParameterReflection } from "./TypeParameterReflection.js";
import type { DeclarationReflection } from "./DeclarationReflection.js";
import type { ReflectionKind } from "./kind.js";
import type { Deserializer, JSONOutput, Serializer } from "#serialization";
import { SourceReference } from "./SourceReference.js";
/**
 * @category Reflections
 */
export declare class SignatureReflection extends Reflection {
    readonly variant = "signature";
    constructor(name: string, kind: SignatureReflection["kind"], parent: DeclarationReflection);
    kind: ReflectionKind.SetSignature | ReflectionKind.GetSignature | ReflectionKind.IndexSignature | ReflectionKind.CallSignature | ReflectionKind.ConstructorSignature;
    parent: DeclarationReflection;
    /**
     * A list of all source files that contributed to this reflection.
     */
    sources?: SourceReference[];
    parameters?: ParameterReflection[];
    typeParameters?: TypeParameterReflection[];
    type?: SomeType;
    /**
     * A type that points to the reflection that has been overwritten by this reflection.
     *
     * Applies to interface and class members.
     */
    overwrites?: ReferenceType;
    /**
     * A type that points to the reflection this reflection has been inherited from.
     *
     * Applies to interface and class members.
     */
    inheritedFrom?: ReferenceType;
    /**
     * A type that points to the reflection this reflection is the implementation of.
     *
     * Applies to class members.
     */
    implementationOf?: ReferenceType;
    traverse(callback: TraverseCallback): void;
    isSignature(): this is SignatureReflection;
    /**
     * Return a string representation of this reflection.
     */
    toString(): string;
    toObject(serializer: Serializer): JSONOutput.SignatureReflection;
    fromObject(de: Deserializer, obj: JSONOutput.SignatureReflection): void;
}
