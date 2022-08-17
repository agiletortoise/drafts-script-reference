"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTypeDocOptions = void 0;
const loggers_1 = require("../../loggers");
const declaration_1 = require("../declaration");
const shiki_1 = require("shiki");
const sort_1 = require("../../sort");
const entry_point_1 = require("../../entry-point");
const kind_1 = require("../../../models/reflections/kind");
const Validation = require("../../validation");
const tsdoc_defaults_1 = require("../tsdoc-defaults");
// For convenience, added in the same order as they are documented on the website.
function addTypeDocOptions(options) {
    ///////////////////////////
    // Configuration Options //
    ///////////////////////////
    options.addDeclaration({
        type: declaration_1.ParameterType.Path,
        name: "options",
        help: "Specify a json option file that should be loaded. If not specified TypeDoc will look for 'typedoc.json' in the current directory.",
        hint: declaration_1.ParameterHint.File,
        defaultValue: process.cwd(),
    });
    options.addDeclaration({
        type: declaration_1.ParameterType.Path,
        name: "tsconfig",
        help: "Specify a TypeScript config file that should be loaded. If not specified TypeDoc will look for 'tsconfig.json' in the current directory.",
        hint: declaration_1.ParameterHint.File,
        defaultValue: process.cwd(),
    });
    options.addDeclaration({
        name: "compilerOptions",
        help: "Selectively override the TypeScript compiler options used by TypeDoc.",
        type: declaration_1.ParameterType.Mixed,
        validate(value) {
            if (!Validation.validate({}, value)) {
                throw new Error("The 'compilerOptions' option must be a non-array object.");
            }
        },
    });
    ///////////////////////////
    ////// Input Options //////
    ///////////////////////////
    options.addDeclaration({
        name: "entryPoints",
        help: "The entry points of your documentation.",
        type: declaration_1.ParameterType.GlobArray,
    });
    options.addDeclaration({
        name: "entryPointStrategy",
        help: "The strategy to be used to convert entry points into documentation modules.",
        type: declaration_1.ParameterType.Map,
        map: entry_point_1.EntryPointStrategy,
        defaultValue: entry_point_1.EntryPointStrategy.Resolve,
    });
    options.addDeclaration({
        name: "exclude",
        help: "Define patterns to be excluded when expanding a directory that was specified as an entry point.",
        type: declaration_1.ParameterType.GlobArray,
    });
    options.addDeclaration({
        name: "externalPattern",
        help: "Define patterns for files that should be considered being external.",
        type: declaration_1.ParameterType.GlobArray,
        defaultValue: ["**/node_modules/**"],
    });
    options.addDeclaration({
        name: "excludeExternals",
        help: "Prevent externally resolved symbols from being documented.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeNotDocumented",
        help: "Prevent symbols that are not explicitly documented from appearing in the results.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeInternal",
        help: "Prevent symbols that are marked with @internal from being documented.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludePrivate",
        help: "Ignore private variables and methods.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "excludeProtected",
        help: "Ignore protected variables and methods.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "media",
        help: "Specify the location with media files that should be copied to the output directory.",
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.Directory,
    });
    options.addDeclaration({
        name: "includes",
        help: "Specify the location to look for included documents (use [[include:FILENAME]] in comments).",
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.Directory,
    });
    ///////////////////////////
    ///// Output Options //////
    ///////////////////////////
    options.addDeclaration({
        name: "out",
        help: "Specify the location the documentation should be written to.",
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.Directory,
    });
    options.addDeclaration({
        name: "json",
        help: "Specify the location and filename a JSON file describing the project is written to.",
        type: declaration_1.ParameterType.Path,
        hint: declaration_1.ParameterHint.File,
    });
    options.addDeclaration({
        name: "pretty",
        help: "Specify whether the output JSON should be formatted with tabs.",
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "emit",
        help: "Specify what TypeDoc should emit, 'docs', 'both', or 'none'.",
        type: declaration_1.ParameterType.Map,
        map: declaration_1.EmitStrategy,
        defaultValue: "docs",
    });
    options.addDeclaration({
        name: "theme",
        help: "Specify the theme name to render the documentation with",
        type: declaration_1.ParameterType.String,
        defaultValue: "default",
    });
    const defaultLightTheme = "light-plus";
    const defaultDarkTheme = "dark-plus";
    options.addDeclaration({
        name: "lightHighlightTheme",
        help: "Specify the code highlighting theme in light mode.",
        type: declaration_1.ParameterType.String,
        defaultValue: defaultLightTheme,
        validate(value) {
            if (!shiki_1.BUNDLED_THEMES.includes(value)) {
                throw new Error(`lightHighlightTheme must be one of the following: ${shiki_1.BUNDLED_THEMES.join(", ")}`);
            }
        },
    });
    options.addDeclaration({
        name: "darkHighlightTheme",
        help: "Specify the code highlighting theme in dark mode.",
        type: declaration_1.ParameterType.String,
        defaultValue: defaultDarkTheme,
        validate(value) {
            if (!shiki_1.BUNDLED_THEMES.includes(value)) {
                throw new Error(`darkHighlightTheme must be one of the following: ${shiki_1.BUNDLED_THEMES.join(", ")}`);
            }
        },
    });
    options.addDeclaration({
        name: "customCss",
        help: "Path to a custom CSS file to for the theme to import.",
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "markedOptions",
        help: "Specify the options passed to Marked, the Markdown parser used by TypeDoc.",
        type: declaration_1.ParameterType.Mixed,
        validate(value) {
            if (!Validation.validate({}, value)) {
                throw new Error("The 'markedOptions' option must be a non-array object.");
            }
        },
    });
    options.addDeclaration({
        name: "name",
        help: "Set the name of the project that will be used in the header of the template.",
    });
    options.addDeclaration({
        name: "includeVersion",
        help: "Add the package version to the project name.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "disableSources",
        help: "Disable setting the source of a reflection when documenting it.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "basePath",
        help: "Specifies the base path to be used when displaying file paths.",
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "excludeTags",
        help: "Remove the listed block/modifier tags from doc comments.",
        type: declaration_1.ParameterType.Array,
        defaultValue: ["@override", "@virtual", "@privateRemarks"],
        validate(value) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(`excludeTags must be an array of valid tag names.`);
            }
        },
    });
    options.addDeclaration({
        name: "readme",
        help: "Path to the readme file that should be displayed on the index page. Pass `none` to disable the index page and start the documentation on the globals page.",
        type: declaration_1.ParameterType.Path,
    });
    options.addDeclaration({
        name: "cname",
        help: "Set the CNAME file text, it's useful for custom domains on GitHub Pages.",
    });
    options.addDeclaration({
        name: "gitRevision",
        help: "Use specified revision instead of the last revision for linking to GitHub/Bitbucket source files.",
    });
    options.addDeclaration({
        name: "gitRemote",
        help: "Use the specified remote for linking to GitHub/Bitbucket source files.",
        defaultValue: "origin",
    });
    options.addDeclaration({
        name: "githubPages",
        help: "Generate a .nojekyll file to prevent 404 errors in GitHub Pages. Defaults to `true`.",
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "htmlLang",
        help: "Sets the lang attribute in the generated html tag.",
        type: declaration_1.ParameterType.String,
        defaultValue: "en",
    });
    options.addDeclaration({
        name: "gaID",
        help: "Set the Google Analytics tracking ID and activate tracking code.",
    });
    options.addDeclaration({
        name: "hideGenerator",
        help: "Do not print the TypeDoc link at the end of the page.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "searchInComments",
        help: "If set, the search index will also include comments. This will greatly increase the size of the search index.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "cleanOutputDir",
        help: "If set, TypeDoc will remove the output directory before writing output.",
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    ///////////////////////////
    ///// Comment Options /////
    ///////////////////////////
    options.addDeclaration({
        name: "commentStyle",
        help: "Determines how TypeDoc searches for comments.",
        type: declaration_1.ParameterType.Map,
        map: declaration_1.CommentStyle,
        defaultValue: declaration_1.CommentStyle.JSDoc,
    });
    options.addDeclaration({
        name: "blockTags",
        help: "Block tags which TypeDoc should recognize when parsing comments.",
        type: declaration_1.ParameterType.Array,
        defaultValue: tsdoc_defaults_1.blockTags,
        validate(value) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(`blockTags must be an array of valid tag names.`);
            }
        },
    });
    options.addDeclaration({
        name: "inlineTags",
        help: "Inline tags which TypeDoc should recognize when parsing comments.",
        type: declaration_1.ParameterType.Array,
        defaultValue: tsdoc_defaults_1.inlineTags,
        validate(value) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(`inlineTags must be an array of valid tag names.`);
            }
        },
    });
    options.addDeclaration({
        name: "modifierTags",
        help: "Modifier tags which TypeDoc should recognize when parsing comments.",
        type: declaration_1.ParameterType.Array,
        defaultValue: tsdoc_defaults_1.modifierTags,
        validate(value) {
            if (!Validation.validate([Array, Validation.isTagString], value)) {
                throw new Error(`modifierTags must be an array of valid tag names.`);
            }
        },
    });
    ///////////////////////////
    // Organization Options ///
    ///////////////////////////
    options.addDeclaration({
        name: "categorizeByGroup",
        help: "Specify whether categorization will be done at the group level.",
        type: declaration_1.ParameterType.Boolean,
        defaultValue: true,
    });
    options.addDeclaration({
        name: "defaultCategory",
        help: "Specify the default category for reflections without a category.",
        defaultValue: "Other",
    });
    options.addDeclaration({
        name: "categoryOrder",
        help: "Specify the order in which categories appear. * indicates the relative order for categories not in the list.",
        type: declaration_1.ParameterType.Array,
    });
    options.addDeclaration({
        name: "sort",
        help: "Specify the sort strategy for documented values.",
        type: declaration_1.ParameterType.Array,
        defaultValue: ["kind", "instance-first", "alphabetical"],
        validate(value) {
            const invalid = new Set(value);
            for (const v of sort_1.SORT_STRATEGIES) {
                invalid.delete(v);
            }
            if (invalid.size !== 0) {
                throw new Error(`sort may only specify known values, and invalid values were provided (${Array.from(invalid).join(", ")}). The valid sort strategies are:\n${sort_1.SORT_STRATEGIES.join(", ")}`);
            }
        },
    });
    options.addDeclaration({
        name: "visibilityFilters",
        help: "Specify the default visibility for builtin filters and additional filters according to modifier tags.",
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {
            protected: false,
            private: false,
            inherited: true,
            external: false,
        },
        validate(value) {
            const knownKeys = ["protected", "private", "inherited", "external"];
            if (!value || typeof value !== "object") {
                throw new Error("visibilityFilters must be an object.");
            }
            for (const [key, val] of Object.entries(value)) {
                if (!key.startsWith("@") && !knownKeys.includes(key)) {
                    throw new Error(`visibilityFilters can only include the following non-@ keys: ${knownKeys.join(", ")}`);
                }
                if (typeof val !== "boolean") {
                    throw new Error(`All values of visibilityFilters must be booleans.`);
                }
            }
        },
    });
    options.addDeclaration({
        name: "searchCategoryBoosts",
        help: "Configure search to give a relevance boost to selected categories",
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {},
        validate(value) {
            if (!isObject(value)) {
                throw new Error("The 'searchCategoryBoosts' option must be a non-array object.");
            }
            if (Object.values(value).some((x) => typeof x !== "number")) {
                throw new Error("All values of 'searchCategoryBoosts' must be numbers.");
            }
        },
    });
    options.addDeclaration({
        name: "searchGroupBoosts",
        help: 'Configure search to give a relevance boost to selected kinds (eg "class")',
        type: declaration_1.ParameterType.Mixed,
        defaultValue: {},
        validate(value) {
            if (!isObject(value)) {
                throw new Error("The 'searchGroupBoosts' option must be a non-array object.");
            }
            if (Object.values(value).some((x) => typeof x !== "number")) {
                throw new Error("All values of 'searchGroupBoosts' must be numbers.");
            }
        },
    });
    ///////////////////////////
    ///// General Options /////
    ///////////////////////////
    options.addDeclaration({
        name: "watch",
        help: "Watch files for changes and rebuild docs on change.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "preserveWatchOutput",
        help: "If set, TypeDoc will not clear the screen between compilation runs.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "help",
        help: "Print this message.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "version",
        help: "Print TypeDoc's version.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "showConfig",
        help: "Print the resolved configuration and exit.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "plugin",
        help: "Specify the npm plugins that should be loaded. Omit to load all installed plugins, set to 'none' to load no plugins.",
        type: declaration_1.ParameterType.ModuleArray,
    });
    options.addDeclaration({
        name: "logger",
        help: "Specify the logger that should be used, 'none' or 'console'.",
        defaultValue: "console",
        type: declaration_1.ParameterType.Mixed,
    });
    options.addDeclaration({
        name: "logLevel",
        help: "Specify what level of logging should be used.",
        type: declaration_1.ParameterType.Map,
        map: loggers_1.LogLevel,
        defaultValue: loggers_1.LogLevel.Info,
    });
    options.addDeclaration({
        name: "treatWarningsAsErrors",
        help: "If set, warnings will be treated as errors.",
        type: declaration_1.ParameterType.Boolean,
    });
    options.addDeclaration({
        name: "intentionallyNotExported",
        help: "A list of types which should not produce 'referenced but not documented' warnings.",
        type: declaration_1.ParameterType.Array,
    });
    options.addDeclaration({
        name: "requiredToBeDocumented",
        help: "A list of reflection kinds that must be documented",
        type: declaration_1.ParameterType.Array,
        validate(values) {
            // this is good enough because the values of the ReflectionKind enum are all numbers
            const validValues = Object.values(kind_1.ReflectionKind).filter((v) => typeof v === "string");
            for (const kind of values) {
                if (!validValues.includes(kind)) {
                    throw new Error(`'${kind}' is an invalid value for 'requiredToBeDocumented'. Must be one of: ${validValues.join(", ")}`);
                }
            }
        },
        defaultValue: [
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
    });
    options.addDeclaration({
        name: "validation",
        help: "Specify which validation steps TypeDoc should perform on your generated documentation.",
        type: declaration_1.ParameterType.Flags,
        defaults: {
            notExported: true,
            invalidLink: true,
            notDocumented: false,
        },
    });
}
exports.addTypeDocOptions = addTypeDocOptions;
function isObject(x) {
    return !!x && typeof x === "object" && !Array.isArray(x);
}
