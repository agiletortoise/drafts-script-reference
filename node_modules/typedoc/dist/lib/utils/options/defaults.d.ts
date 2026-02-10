/**
 * Defaults values for TypeDoc options
 * @module
 */
import type { BundledLanguage } from "@gerrit0/mini-shiki";
import type { EnumKeys, TagString } from "#utils";
import type { ReflectionKind } from "../../models/index.js";
export declare const excludeNotDocumentedKinds: readonly EnumKeys<typeof ReflectionKind>[];
export declare const excludeTags: readonly TagString[];
export declare const blockTags: readonly TagString[];
export declare const inlineTags: readonly TagString[];
export declare const modifierTags: readonly TagString[];
export declare const cascadedModifierTags: readonly TagString[];
export declare const preservedTypeAnnotationTags: readonly TagString[];
export declare const notRenderedTags: readonly TagString[];
export declare const highlightLanguages: readonly BundledLanguage[];
export declare const ignoredHighlightLanguages: readonly string[];
export declare const sort: readonly string[];
export declare const kindSortOrder: readonly EnumKeys<typeof ReflectionKind>[];
export declare const requiredToBeDocumented: readonly EnumKeys<typeof ReflectionKind>[];
