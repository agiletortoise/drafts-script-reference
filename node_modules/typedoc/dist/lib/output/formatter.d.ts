import { type SomeType, TypeContext } from "../models/types.js";
import { JSX } from "#utils";
import { type DeclarationReflection, type Reflection, type SignatureReflection } from "../models/index.js";
import type { Router } from "./index.js";
export type FormatterNode = {
    type: "text";
    content: string;
} | {
    type: "element";
    content: JSX.Element;
    length: number;
} | {
    type: "line";
} | {
    type: "space_or_line";
} | {
    type: "indent";
    content: FormatterNode[];
} | {
    type: "group";
    id: number;
    content: FormatterNode[];
} | {
    type: "nodes";
    content: FormatterNode[];
} | {
    type: "if_wrap";
    id: number;
    true: FormatterNode;
    false: FormatterNode;
};
export declare enum Wrap {
    Detect = 0,
    Enable = 1
}
/**
 * Responsible for rendering nodes
 */
export declare class FormattedCodeGenerator {
    private buffer;
    /** Indentation level, not number of chars */
    private indent;
    /** The number of characters on the current line */
    private size;
    /** Maximum number of characters allowed per line */
    private max;
    /** Groups which need to be wrapped */
    private wrapped;
    constructor(maxWidth?: number, startWidth?: number);
    forceWrap(wrapped: Set<number>): void;
    toElement(): JSX.Element;
    node(node: FormatterNode, wrap: Wrap): void;
    private text;
    private newLine;
}
/**
 * Responsible for generating Nodes from a type tree.
 */
export declare class FormattedCodeBuilder {
    readonly router: Router;
    readonly relativeReflection: Reflection;
    forceWrap: Set<number>;
    id: number;
    constructor(router: Router, relativeReflection: Reflection);
    urlTo(refl: Reflection): string;
    newId(): number;
    type(type: SomeType | undefined, where: TypeContext, options?: {
        topLevelLinks: boolean;
    }): FormatterNode;
    reflection(reflection: DeclarationReflection, options: {
        topLevelLinks: boolean;
    }): FormatterNode;
    typeAlias(item: DeclarationReflection): FormatterNode;
    interface(item: DeclarationReflection): FormatterNode;
    member(members: FormatterNode[], item: DeclarationReflection, options: {
        topLevelLinks: boolean;
    }): void;
    signature(sig: SignatureReflection, options: {
        topLevelLinks?: boolean;
        hideName?: boolean;
        arrowStyle?: boolean;
    }): FormatterNode;
    private typeParameters;
    private typeParameter;
    private parameters;
    private parameter;
    private propertyName;
}
