import type { BundledLanguage } from "shiki" with { "resolution-mode": "import" };
import type { EnumKeys } from "../enum";
import type { ReflectionKind } from "../../models/index";
/**
 * Default values for TypeDoc options. This object should not be modified.
 *
 * @privateRemarks
 * These are declared here, rather than within the option declaration, so that
 * they can be exposed as a part of the public API. The unfortunate type declaration
 * is to control the type which appears in the generated documentation.
 */
export declare const OptionDefaults: {
    excludeNotDocumentedKinds: readonly EnumKeys<typeof ReflectionKind>[];
    excludeTags: readonly `@${string}`[];
    blockTags: readonly `@${string}`[];
    inlineTags: readonly `@${string}`[];
    modifierTags: readonly `@${string}`[];
    cascadedModifierTags: readonly `@${string}`[];
    highlightLanguages: readonly BundledLanguage[];
    sort: readonly string[];
    kindSortOrder: readonly EnumKeys<typeof ReflectionKind>[];
    requiredToBeDocumented: readonly EnumKeys<typeof ReflectionKind>[];
};
