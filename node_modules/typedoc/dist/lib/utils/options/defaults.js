"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionDefaults = void 0;
const TagDefaults = __importStar(require("./tsdoc-defaults"));
/**
 * Default values for TypeDoc options. This object should not be modified.
 *
 * @privateRemarks
 * These are declared here, rather than within the option declaration, so that
 * they can be exposed as a part of the public API. The unfortunate type declaration
 * is to control the type which appears in the generated documentation.
 */
exports.OptionDefaults = {
    excludeNotDocumentedKinds: [
        "Module",
        "Namespace",
        "Enum",
        // Not including enum member here by default
        "Variable",
        "Function",
        "Class",
        "Interface",
        "Constructor",
        "Property",
        "Method",
        "CallSignature",
        "IndexSignature",
        "ConstructorSignature",
        "Accessor",
        "GetSignature",
        "SetSignature",
        "TypeAlias",
        "Reference",
    ],
    excludeTags: [
        "@override",
        "@virtual",
        "@privateRemarks",
        "@satisfies",
        "@overload",
    ],
    blockTags: TagDefaults.blockTags,
    inlineTags: TagDefaults.inlineTags,
    modifierTags: TagDefaults.modifierTags,
    cascadedModifierTags: ["@alpha", "@beta", "@experimental"],
    highlightLanguages: [
        "bash",
        "console",
        "css",
        "html",
        "javascript",
        "json",
        "jsonc",
        "json5",
        "tsx",
        "typescript",
    ],
    sort: ["kind", "instance-first", "alphabetical"],
    kindSortOrder: [
        "Document",
        "Reference",
        "Project",
        "Module",
        "Namespace",
        "Enum",
        "EnumMember",
        "Class",
        "Interface",
        "TypeAlias",
        "Constructor",
        "Property",
        "Variable",
        "Function",
        "Accessor",
        "Method",
        "Parameter",
        "TypeParameter",
        "TypeLiteral",
        "CallSignature",
        "ConstructorSignature",
        "IndexSignature",
        "GetSignature",
        "SetSignature",
    ],
    requiredToBeDocumented: [
        "Enum",
        "EnumMember",
        "Variable",
        "Function",
        "Class",
        "Interface",
        "Property",
        "Method",
        "Accessor",
        "TypeAlias",
    ],
};
