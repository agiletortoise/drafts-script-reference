"use strict";
// If updating these lists, also update tsdoc.json
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifierTags = exports.tsdocModifierTags = exports.inlineTags = exports.tsdocInlineTags = exports.blockTags = exports.tsdocBlockTags = void 0;
exports.tsdocBlockTags = [
    "@defaultValue",
    "@deprecated",
    "@example",
    "@param",
    "@privateRemarks",
    "@remarks",
    "@returns",
    "@see",
    "@throws",
    "@typeParam",
];
exports.blockTags = [
    ...exports.tsdocBlockTags,
    "@author",
    "@callback",
    "@category",
    "@categoryDescription",
    "@default",
    "@document",
    "@extends",
    "@augments", //Alias for @extends
    "@yields",
    "@group",
    "@groupDescription",
    "@import",
    "@inheritDoc",
    "@jsx",
    "@license",
    "@module",
    "@prop",
    "@property",
    "@return",
    "@satisfies",
    "@since",
    "@template", // Alias for @typeParam
    "@type",
    "@typedef",
];
exports.tsdocInlineTags = ["@link", "@inheritDoc", "@label"];
exports.inlineTags = [
    ...exports.tsdocInlineTags,
    "@linkcode",
    "@linkplain",
];
exports.tsdocModifierTags = [
    "@alpha",
    "@beta",
    "@eventProperty",
    "@experimental",
    "@internal",
    "@override",
    "@packageDocumentation",
    "@public",
    "@readonly",
    "@sealed",
    "@virtual",
];
exports.modifierTags = [
    ...exports.tsdocModifierTags,
    "@class",
    "@enum",
    "@event",
    "@hidden",
    "@hideCategories",
    "@hideconstructor",
    "@hideGroups",
    "@ignore",
    "@interface",
    "@namespace",
    "@overload",
    "@private",
    "@protected",
    "@showCategories",
    "@showGroups",
];
