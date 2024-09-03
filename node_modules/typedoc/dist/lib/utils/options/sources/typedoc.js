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
exports.addTypeDocOptions = addTypeDocOptions;
const loggers_1 = require("../../loggers");
const declaration_1 = require("../declaration");
const sort_1 = require("../../sort");
const entry_point_1 = require("../../entry-point");
const kind_1 = require("../../../models/reflections/kind");
const Validation = __importStar(require("../../validation"));
const enum_1 = require("../../enum");
const highlighter_1 = require("../../highlighter");
const set_1 = require("../../set");
const defaults_1 = require("../defaults");
// For convenience, added in the same order as they are documented on the website.
function addTypeDocOptions(options) {
    ///////////////////////////
    // Configuration Options //
    ///////////////////////////
    options.addDeclaration({
        type: declaration_1.ParameterType.Path,
        name: "options",
        help: (i18n) => i18n.help_options(),
        hint: declaration_1.ParameterHint.File,
        defaultValue: "",
    });
    options.addDeclaration({
        type: declaration_1.ParameterType.Path,
        name: "tsconfig",
        help: (i18n) => i18n.help_tsconfig(),
        hint: declaration_1.ParameterHint.File,
        defaultValue: "",
    });
    options.addDeclaration({
        name: "compilerOptions",
        help: (i18n) => i18n.help_compilerOptions(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        validate(value, i18n) {
            if (!Validation.validate({}, value)) {
                throw new Error(i18n.option_0_must_be_an_object("compilerOptions"));
            }
        },
    });
    options.addDeclaration({
        name: "lang",
        help: (i18n) => i18n.help_lang(),
        type: declaration_1.ParameterType.String,
        defaultValue: "en",
    });
    options.addDeclaration({
        name: "locales",
        help: (i18n) => i18n.help_locales(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {},
        validate(value, i18n) {
            if (typeof value !== "object" || !value) {
                throw new Error(i18n.locales_must_be_an_object());
            }
            for (const val of Object.values(value)) {
                if (typeof val !== "object" || !val) {
                    throw new Error(i18n.locales_must_be_an_object());
                }
                for (const val2 of Object.values(val)) {
                    if (typeof val2 !== "string") {
                        throw new Error(i18n.locales_must_be_an_object());
                    }
                }
            }
        },
    });
    options.addDeclaration({
        name: "packageOptions",
        help: (i18n) => i18n.help_packageOptions(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {},
        validate(value, i18n) {
            if (!Validation.validate({}, value)) {
                throw new Error(i18n.option_0_must_be_an_object("packageOptions"));
            }
        },
    });
    ///////////////////////////
    ////// Input Options //////
    ///////////////////////////
    options.addDeclaration({
        name: "entryPoints",
        help: (i18n) => i18n.help_entryPoints(),
        type: declaration_1.ParameterType.GlobArray,
    });
    options.addDeclaration({
        name: "entryPointStrategy",
        help: (i18n) => i18n.help_entryPointStrategy(),
        type: declaration_1.ParameterType.Map,
        map: entry_point_1.EntryPointStrategy,
        defaultValue: entry_point_1.EntryPointStrategy.Resolve,
    });
    options.addDeclaration({
        name: "alwaysCreateEntryPointModule",
        help: (i18n) => i18n.help_alwaysCreateEntryPointModule(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "projectDocuments",
        help: (i18n) => i18n.help_projectDocuments(),
        type: declaration_1.ParameterType.GlobArray,
    });
    options.addDeclaration({
        name: "exclude",
        help: (i18n) => i18n.help_exclude(),
        type: declaration_1.ParameterType.GlobArray,
    });
    options.addDeclaration({
        name: "externalPattern",
        help: (i18n) => i18n.help_externalPattern(),
        type: declaration_1.ParameterType.GlobArray,
        defaultValue: ["**/node_modules/**"],
    });
    options.addDeclaration({
        name: "excludeExternals",
        help: (i18n) => i18n.help_excludeExternals(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeNotDocumented",
        help: (i18n) => i18n.help_excludeNotDocumented(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeNotDocumentedKinds",
        help: (i18n) => i18n.help_excludeNotDocumentedKinds(),
        type: declaration_1.ParameterType.Array,
        validate(value, i18n) {
            const invalid = new Set(value);
            const valid = new Set((0, enum_1.getEnumKeys)(kind_1.ReflectionKind));
            for (const notPermitted of [
                kind_1.ReflectionKind.Project,
                kind_1.ReflectionKind.TypeLiteral,
                kind_1.ReflectionKind.TypeParameter,
                kind_1.ReflectionKind.Parameter,
            ]) {
                valid.delete(kind_1.ReflectionKind[notPermitted]);
            }
            for (const v of valid) {
                invalid.delete(v);
            }
            if (invalid.size !== 0) {
                throw new Error(i18n.exclude_not_documented_specified_0_valid_values_are_1(Array.from(invalid).join(", "), Array.from(valid).join(", ")));
            }
        },
        defaultValue: defaults_1.OptionDefaults.excludeNotDocumentedKinds,
    });
    options.addDeclaration({
        name: "excludeInternal",
        help: (i18n) => i18n.help_excludeInternal(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeCategories",
        help: (i18n) => i18n.help_excludeCategories(),
        type: declaration_1.ParameterType.Array,
        defaultValue: [],
    });
    options.addDeclaration({
        name: "excludePrivate",
        help: (i18n) => i18n.help_excludePrivate(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "excludeProtected",
        help: (i18n) => i18n.help_excludeProtected(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeReferences",
        help: (i18n) => i18n.help_excludeReferences(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "externalSymbolLinkMappings",
        help: (i18n) => i18n.help_externalSymbolLinkMappings(),
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {},
        validate(value, i18n) {
            if (!Validation.validate({}, value)) {
                throw new Error(i18n.external_symbol_link_mappings_must_be_object());
            }
            for (const mappings of Object.values(value)) {
                if (!Validation.validate({}, mappings)) {
                    throw new Error(i18n.external_symbol_link_mappings_must_be_object());
                }
                for (const link of Object.values(mappings)) {
                    if (typeof link !== "string") {
                        throw new Error(i18n.external_symbol_link_mappings_must_be_object());
                    }
                }
            }
        },
    });
    ///////////////////////////
    ///// Output Options //////
    ///////////////////////////
    options.addDeclaration({
        name: "out",
        help: (i18n) => i18n.help_out(),
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.Directory,
        defaultValue: "./docs",
    });
    options.addDeclaration({
        name: "json",
        help: (i18n) => i18n.help_json(),
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.File,
    });
    options.addDeclaration({
        name: "pretty",
        help: (i18n) => i18n.help_pretty(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "emit",
        help: (i18n) => i18n.help_emit(),
        type: declaration_1.ParameterType.Map,
        map: declaration_1.EmitStrategy,
        defaultValue: "docs",
    });
    options.addDeclaration({
        name: "theme",
        help: (i18n) => i18n.help_theme(),
        type: declaration_1.ParameterType.String,
        defaultValue: "default",
    });
    const defaultLightTheme = "light-plus";
    const defaultDarkTheme = "dark-plus";
    options.addDeclaration({
        name: "lightHighlightTheme",
        help: (i18n) => i18n.help_lightHighlightTheme(),
        type: declaration_1.ParameterType.String,
        defaultValue: defaultLightTheme,
        validate(value, i18n) {
            if (!(0, highlighter_1.getSupportedThemes)().includes(value)) {
                throw new Error(i18n.highlight_theme_0_must_be_one_of_1("lightHighlightTheme", (0, highlighter_1.getSupportedThemes)().join(", ")));
            }
        },
    });
    options.addDeclaration({
        name: "darkHighlightTheme",
        help: (i18n) => i18n.help_darkHighlightTheme(),
        type: declaration_1.ParameterType.String,
        defaultValue: defaultDarkTheme,
        validate(value, i18n) {
            if (!(0, highlighter_1.getSupportedThemes)().includes(value)) {
                throw new Error(i18n.highlight_theme_0_must_be_one_of_1("darkHighlightTheme", (0, highlighter_1.getSupportedThemes)().join(", ")));
            }
        },
    });
    options.addDeclaration({
        name: "highlightLanguages",
        help: (i18n) => i18n.help_highlightLanguages(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.highlightLanguages,
        validate(value, i18n) {
            const invalid = (0, set_1.setDifference)(value, (0, highlighter_1.getSupportedLanguagesWithoutAliases)());
            if (invalid.size) {
                throw new Error(i18n.highlightLanguages_contains_invalid_languages_0(Array.from(invalid).join(", ")));
            }
        },
    });
    options.addDeclaration({
        name: "customCss",
        help: (i18n) => i18n.help_customCss(),
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "markdownItOptions",
        help: (i18n) => i18n.help_markdownItOptions(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {
            html: true,
            linkify: true,
        },
        validate(value, i18n) {
            if (!Validation.validate({}, value)) {
                throw new Error(i18n.option_0_must_be_an_object("markdownItOptions"));
            }
        },
    });
    options.addDeclaration({
        name: "markdownItLoader",
        help: (i18n) => i18n.help_markdownItLoader(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: () => { },
        validate(value, i18n) {
            if (typeof value !== "function") {
                throw new Error(i18n.option_0_must_be_a_function("markdownItLoader"));
            }
        },
    });
    options.addDeclaration({
        name: "maxTypeConversionDepth",
        help: (i18n) => i18n.help_maxTypeConversionDepth(),
        defaultValue: 10,
        type: declaration_1.ParameterType.Number,
    });
    options.addDeclaration({
        name: "name",
        help: (i18n) => i18n.help_name(),
    });
    options.addDeclaration({
        name: "includeVersion",
        help: (i18n) => i18n.help_includeVersion(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "disableSources",
        help: (i18n) => i18n.help_disableSources(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "sourceLinkTemplate",
        help: (i18n) => i18n.help_sourceLinkTemplate(),
    });
    options.addDeclaration({
        name: "gitRevision",
        help: (i18n) => i18n.help_gitRevision(),
    });
    options.addDeclaration({
        name: "gitRemote",
        help: (i18n) => i18n.help_gitRemote(),
        defaultValue: "origin",
    });
    options.addDeclaration({
        name: "disableGit",
        help: (i18n) => i18n.help_disableGit(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "basePath",
        help: (i18n) => i18n.help_basePath(),
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "excludeTags",
        help: (i18n) => i18n.help_excludeTags(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.excludeTags,
        validate(value, i18n) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(i18n.option_0_values_must_be_array_of_tags("excludeTags"));
            }
        },
    });
    options.addDeclaration({
        name: "readme",
        help: (i18n) => i18n.help_readme(),
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "cname",
        help: (i18n) => i18n.help_cname(),
    });
    options.addDeclaration({
        name: "sourceLinkExternal",
        help: (i18n) => i18n.help_sourceLinkExternal(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "githubPages",
        help: (i18n) => i18n.help_githubPages(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "hostedBaseUrl",
        help: (i18n) => i18n.help_hostedBaseUrl(),
        validate(value, i18n) {
            if (!/https?:\/\//.test(value)) {
                throw new Error(i18n.hostedBaseUrl_must_start_with_http());
            }
        },
    });
    options.addDeclaration({
        name: "useHostedBaseUrlForAbsoluteLinks",
        help: (i18n) => i18n.help_useHostedBaseUrlForAbsoluteLinks(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "hideGenerator",
        help: (i18n) => i18n.help_hideGenerator(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "customFooterHtml",
        help: (i18n) => i18n.help_customFooterHtml(),
        type: declaration_1.ParameterType.String,
    });
    options.addDeclaration({
        name: "customFooterHtmlDisableWrapper",
        help: (i18n) => i18n.help_customFooterHtmlDisableWrapper(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "hideParameterTypesInTitle",
        help: (i18n) => i18n.help_hideParameterTypesInTitle(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "cacheBust",
        help: (i18n) => i18n.help_cacheBust(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "searchInComments",
        help: (i18n) => i18n.help_searchInComments(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "searchInDocuments",
        help: (i18n) => i18n.help_searchInDocuments(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "cleanOutputDir",
        help: (i18n) => i18n.help_cleanOutputDir(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "titleLink",
        help: (i18n) => i18n.help_titleLink(),
        type: declaration_1.ParameterType.String,
    });
    options.addDeclaration({
        name: "navigationLinks",
        help: (i18n) => i18n.help_navigationLinks(),
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {},
        validate(value, i18n) {
            if (!isObject(value)) {
                throw new Error(i18n.option_0_must_be_object_with_urls("navigationLinks"));
            }
            if (Object.values(value).some((x) => typeof x !== "string")) {
                throw new Error(i18n.option_0_must_be_object_with_urls("navigationLinks"));
            }
        },
    });
    options.addDeclaration({
        name: "sidebarLinks",
        help: (i18n) => i18n.help_sidebarLinks(),
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {},
        validate(value, i18n) {
            if (!isObject(value)) {
                throw new Error(i18n.option_0_must_be_object_with_urls("sidebarLinks"));
            }
            if (Object.values(value).some((x) => typeof x !== "string")) {
                throw new Error(i18n.option_0_must_be_object_with_urls("sidebarLinks"));
            }
        },
    });
    options.addDeclaration({
        name: "navigationLeaves",
        help: (i18n) => i18n.help_navigationLeaves(),
        type: declaration_1.ParameterType.Array,
    });
    options.addDeclaration({
        name: "navigation",
        help: (i18n) => i18n.help_navigation(),
        type: declaration_1.ParameterType.Flags,
        defaults: {
            includeCategories: false,
            includeGroups: false,
            includeFolders: true,
            compactFolders: true,
        },
    });
    options.addDeclaration({
        name: "visibilityFilters",
        help: (i18n) => i18n.help_visibilityFilters(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {
            protected: false,
            private: false,
            inherited: true,
            external: false,
        },
        validate(value, i18n) {
            const knownKeys = ["protected", "private", "inherited", "external"];
            if (!value || typeof value !== "object") {
                throw new Error(i18n.option_0_must_be_an_object("visibilityFilters"));
            }
            for (const [key, val] of Object.entries(value)) {
                if (!key.startsWith("@") && !knownKeys.includes(key)) {
                    throw new Error(i18n.visibility_filters_only_include_0(knownKeys.join(", ")));
                }
                if (typeof val !== "boolean") {
                    throw new Error(i18n.visibility_filters_must_be_booleans());
                }
            }
        },
    });
    options.addDeclaration({
        name: "searchCategoryBoosts",
        help: (i18n) => i18n.help_searchCategoryBoosts(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {},
        validate(value, i18n) {
            if (!isObject(value)) {
                throw new Error(i18n.option_0_must_be_an_object("searchCategoryBoosts"));
            }
            if (Object.values(value).some((x) => typeof x !== "number")) {
                throw new Error(i18n.option_0_values_must_be_numbers("searchCategoryBoosts"));
            }
        },
    });
    options.addDeclaration({
        name: "searchGroupBoosts",
        help: (i18n) => i18n.help_searchGroupBoosts(),
        type: declaration_1.ParameterType.Mixed,
        configFileOnly: true,
        defaultValue: {},
        validate(value, i18n) {
            if (!isObject(value)) {
                throw new Error(i18n.option_0_must_be_an_object("searchGroupBoosts"));
            }
            if (Object.values(value).some((x) => typeof x !== "number")) {
                throw new Error(i18n.option_0_values_must_be_numbers("searchGroupBoosts"));
            }
        },
    });
    ///////////////////////////
    ///// Comment Options /////
    ///////////////////////////
    options.addDeclaration({
        name: "jsDocCompatibility",
        help: (i18n) => i18n.help_jsDocCompatibility(),
        type: declaration_1.ParameterType.Flags,
        defaults: {
            defaultTag: true,
            exampleTag: true,
            inheritDocTag: true,
            ignoreUnescapedBraces: true,
        },
    });
    options.addDeclaration({
        name: "suppressCommentWarningsInDeclarationFiles",
        help: (i18n) => i18n.help_lang(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "commentStyle",
        help: (i18n) => i18n.help_commentStyle(),
        type: declaration_1.ParameterType.Map,
        map: declaration_1.CommentStyle,
        defaultValue: declaration_1.CommentStyle.JSDoc,
    });
    options.addDeclaration({
        name: "useTsLinkResolution",
        help: (i18n) => i18n.help_useTsLinkResolution(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "preserveLinkText",
        help: (i18n) => i18n.help_preserveLinkText(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "blockTags",
        help: (i18n) => i18n.help_blockTags(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.blockTags,
        validate(value, i18n) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(i18n.option_0_values_must_be_array_of_tags("blockTags"));
            }
        },
    });
    options.addDeclaration({
        name: "inlineTags",
        help: (i18n) => i18n.help_inlineTags(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.inlineTags,
        validate(value, i18n) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(i18n.option_0_values_must_be_array_of_tags("inlineTags"));
            }
        },
    });
    options.addDeclaration({
        name: "modifierTags",
        help: (i18n) => i18n.help_modifierTags(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.modifierTags,
        validate(value, i18n) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(i18n.option_0_values_must_be_array_of_tags("modifierTags"));
            }
        },
    });
    options.addDeclaration({
        name: "cascadedModifierTags",
        help: (i18n) => i18n.help_modifierTags(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.cascadedModifierTags,
        validate(value, i18n) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(i18n.option_0_values_must_be_array_of_tags("cascadedModifierTags"));
            }
        },
    });
    ///////////////////////////
    // Organization Options ///
    ///////////////////////////
    options.addDeclaration({
        name: "categorizeByGroup",
        help: (i18n) => i18n.help_categorizeByGroup(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    options.addDeclaration({
        name: "defaultCategory",
        help: (i18n) => i18n.help_defaultCategory(),
        defaultValue: "Other",
    });
    options.addDeclaration({
        name: "categoryOrder",
        help: (i18n) => i18n.help_categoryOrder(),
        type: declaration_1.ParameterType.Array,
    });
    options.addDeclaration({
        name: "groupOrder",
        help: (i18n) => i18n.help_groupOrder(),
        type: declaration_1.ParameterType.Array,
        // default order specified in GroupPlugin to correctly handle localization.
    });
    options.addDeclaration({
        name: "sort",
        help: (i18n) => i18n.help_sort(),
        type: declaration_1.ParameterType.Array,
        defaultValue: defaults_1.OptionDefaults.sort,
        validate(value, i18n) {
            const invalid = new Set(value);
            for (const v of sort_1.SORT_STRATEGIES) {
                invalid.delete(v);
            }
            if (invalid.size !== 0) {
                throw new Error(i18n.option_0_specified_1_but_only_2_is_valid("sort", Array.from(invalid).join(", "), sort_1.SORT_STRATEGIES.join(", ")));
            }
        },
    });
    options.addDeclaration({
        name: "sortEntryPoints",
        help: (i18n) => i18n.help_sortEntryPoints(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "kindSortOrder",
        help: (i18n) => i18n.help_kindSortOrder(),
        type: declaration_1.ParameterType.Array,
        defaultValue: [],
        validate(value, i18n) {
            const invalid = (0, set_1.setDifference)(value, (0, enum_1.getEnumKeys)(kind_1.ReflectionKind));
            if (invalid.size !== 0) {
                throw new Error(i18n.option_0_specified_1_but_only_2_is_valid(`kindSortOrder`, Array.from(invalid).join(", "), (0, enum_1.getEnumKeys)(kind_1.ReflectionKind).join(", ")));
            }
        },
    });
    ///////////////////////////
    ///// General Options /////
    ///////////////////////////
    options.addDeclaration({
        name: "watch",
        help: (i18n) => i18n.help_watch(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "preserveWatchOutput",
        help: (i18n) => i18n.help_preserveWatchOutput(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "skipErrorChecking",
        help: (i18n) => i18n.help_skipErrorChecking(),
        type: declaration_1.ParameterType.Boolean,
        defaultValue: false,
    });
    options.addDeclaration({
        name: "help",
        help: (i18n) => i18n.help_help(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "version",
        help: (i18n) => i18n.help_version(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "showConfig",
        help: (i18n) => i18n.help_showConfig(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "plugin",
        help: (i18n) => i18n.help_plugin(),
        type: declaration_1.ParameterType.ModuleArray,
    });
    options.addDeclaration({
        name: "logLevel",
        help: (i18n) => i18n.help_logLevel(),
        type: declaration_1.ParameterType.Map,
        map: loggers_1.LogLevel,
        defaultValue: loggers_1.LogLevel.Info,
    });
    options.addDeclaration({
        name: "treatWarningsAsErrors",
        help: (i18n) => i18n.help_treatWarningsAsErrors(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "treatValidationWarningsAsErrors",
        help: (i18n) => i18n.help_treatValidationWarningsAsErrors(),
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "intentionallyNotExported",
        help: (i18n) => i18n.help_intentionallyNotExported(),
        type: declaration_1.ParameterType.Array,
    });
    options.addDeclaration({
        name: "requiredToBeDocumented",
        help: (i18n) => i18n.help_requiredToBeDocumented(),
        type: declaration_1.ParameterType.Array,
        validate(values, i18n) {
            // this is good enough because the values of the ReflectionKind enum are all numbers
            const validValues = (0, enum_1.getEnumKeys)(kind_1.ReflectionKind);
            for (const kind of values) {
                if (!validValues.includes(kind)) {
                    throw new Error(i18n.option_0_specified_1_but_only_2_is_valid("requiredToBeDocumented", kind, validValues.join(", ")));
                }
            }
        },
        defaultValue: defaults_1.OptionDefaults.requiredToBeDocumented,
    });
    options.addDeclaration({
        name: "validation",
        help: (i18n) => i18n.help_validation(),
        type: declaration_1.ParameterType.Flags,
        defaults: {
            notExported: true,
            invalidLink: true,
            notDocumented: false,
        },
    });
}
function isObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
}
