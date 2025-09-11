import { isAbsolute, join, resolve } from "path";
import { i18n, } from "#utils";
import { createGlobString, normalizePath } from "../paths.js";
/** @enum */
export const EmitStrategy = {
    both: "both", // Emit both documentation and JS
    docs: "docs", // Emit documentation, but not JS (default)
    none: "none", // Emit nothing, just convert and run validation
};
/**
 * Determines how TypeDoc searches for comments.
 * @enum
 */
export const CommentStyle = {
    JSDoc: "jsdoc",
    Block: "block",
    Line: "line",
    All: "all",
};
/**
 * List of option names which, with `entryPointStrategy` set to `packages`
 * should only be set at the root level.
 */
export const rootPackageOptions = [
    // Configuration Options
    "plugin",
    // Input Options
    "packageOptions",
    // Output Options
    "outputs",
    "out",
    "html",
    "json",
    "pretty",
    "theme",
    "router",
    "lightHighlightTheme",
    "darkHighlightTheme",
    "highlightLanguages",
    "ignoredHighlightLanguages",
    "typePrintWidth",
    "customCss",
    "customJs",
    "customFooterHtml",
    "customFooterHtmlDisableWrapper",
    "markdownItOptions",
    "markdownItLoader",
    "cname",
    "favicon",
    "sourceLinkExternal",
    "markdownLinkExternal",
    "lang",
    "locales",
    "githubPages",
    "cacheBust",
    "hideGenerator",
    "searchInComments",
    "searchInDocuments",
    "cleanOutputDir",
    "titleLink",
    "navigationLinks",
    "sidebarLinks",
    "navigation",
    "headings",
    "sluggerConfiguration",
    "navigationLeaves",
    "visibilityFilters",
    "searchCategoryBoosts",
    "searchGroupBoosts",
    "hostedBaseUrl",
    "useHostedBaseUrlForAbsoluteLinks",
    "useFirstParagraphOfCommentAsSummary",
    "includeHierarchySummary",
    // Comment Options
    "notRenderedTags",
    // Organization Options
    // Validation Options
    "treatWarningsAsErrors",
    "treatValidationWarningsAsErrors",
    // Other Options
    "watch",
    "preserveWatchOutput",
    "help",
    "version",
    "showConfig",
    "logLevel",
];
export var ParameterHint;
(function (ParameterHint) {
    ParameterHint[ParameterHint["File"] = 0] = "File";
    ParameterHint[ParameterHint["Directory"] = 1] = "Directory";
})(ParameterHint || (ParameterHint = {}));
export var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["String"] = 0] = "String";
    /**
     * Resolved according to the config directory.
     */
    ParameterType[ParameterType["Path"] = 1] = "Path";
    /**
     * Resolved according to the config directory unless it starts with https?://
     */
    ParameterType[ParameterType["UrlOrPath"] = 2] = "UrlOrPath";
    ParameterType[ParameterType["Number"] = 3] = "Number";
    ParameterType[ParameterType["Boolean"] = 4] = "Boolean";
    ParameterType[ParameterType["Map"] = 5] = "Map";
    ParameterType[ParameterType["Mixed"] = 6] = "Mixed";
    ParameterType[ParameterType["Array"] = 7] = "Array";
    /**
     * Resolved according to the config directory.
     */
    ParameterType[ParameterType["PathArray"] = 8] = "PathArray";
    /**
     * Resolved according to the config directory if it starts with `.`
     */
    ParameterType[ParameterType["ModuleArray"] = 9] = "ModuleArray";
    /**
     * Relative to the config directory.
     */
    ParameterType[ParameterType["GlobArray"] = 10] = "GlobArray";
    /**
     * An object which partially merges user-set values into the defaults.
     */
    ParameterType[ParameterType["Object"] = 11] = "Object";
    /**
     * An object with true/false flags
     */
    ParameterType[ParameterType["Flags"] = 12] = "Flags";
})(ParameterType || (ParameterType = {}));
function toStringArray(value, option) {
    if (Array.isArray(value) && value.every(v => typeof v === "string")) {
        return value;
    }
    else if (typeof value === "string") {
        return [value];
    }
    throw new Error(i18n.option_0_must_be_an_array_of_string(option.name));
}
const converters = {
    [ParameterType.String](value, option) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const stringValue = value == null ? "" : String(value);
        option.validate?.(stringValue);
        return stringValue;
    },
    [ParameterType.Path](value, option, configPath) {
        const stringValue = 
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        value == null ? "" : resolve(configPath, String(value));
        option.validate?.(stringValue);
        return normalizePath(stringValue);
    },
    [ParameterType.UrlOrPath](value, option, configPath) {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const stringValue = value == null ? "" : String(value);
        if (/^https?:\/\//i.test(stringValue)) {
            option.validate?.(stringValue);
            return stringValue;
        }
        const resolved = normalizePath(resolve(configPath, stringValue));
        option.validate?.(resolved);
        return resolved;
    },
    [ParameterType.Number](value, option) {
        const numValue = parseInt(String(value), 10) || 0;
        if (!valueIsWithinBounds(numValue, option.minValue, option.maxValue)) {
            throw new Error(getBoundsError(option.name, option.minValue, option.maxValue));
        }
        option.validate?.(numValue);
        return numValue;
    },
    [ParameterType.Boolean](value) {
        return !!value;
    },
    [ParameterType.Array](value, option) {
        const strArrValue = toStringArray(value, option);
        option.validate?.(strArrValue);
        return strArrValue;
    },
    [ParameterType.PathArray](value, option, configPath) {
        const strArrValue = toStringArray(value, option);
        const normalized = strArrValue.map((path) => normalizePath(resolve(configPath, path)));
        option.validate?.(normalized);
        return normalized;
    },
    [ParameterType.ModuleArray](value, option, configPath) {
        const strArrValue = toStringArray(value, option);
        const resolved = resolveModulePaths(strArrValue, configPath);
        option.validate?.(resolved);
        return resolved;
    },
    [ParameterType.GlobArray](value, option, configPath) {
        const toGlobString = (v) => {
            const s = String(v);
            // If the string tries to escape a character which isn't a special
            // glob character, the user probably provided a Windows style path
            // by accident due to shell completion, tell them to either remove
            // the useless escape or switch to Unix path separators.
            if (/\\[^?*()[\]\\{}]/.test(s)) {
                throw new Error(i18n.glob_0_should_use_posix_slash(s));
            }
            return createGlobString(configPath, s);
        };
        const strArrValue = toStringArray(value, option);
        const globs = strArrValue.map(toGlobString);
        option.validate?.(globs);
        return globs;
    },
    [ParameterType.Map](value, option) {
        const key = String(value);
        if (option.map instanceof Map) {
            if (option.map.has(key)) {
                return option.map.get(key);
            }
            else if ([...option.map.values()].includes(value)) {
                return value;
            }
        }
        else if (key in option.map) {
            if (isTsNumericEnum(option.map) && typeof value === "number") {
                return value;
            }
            return option.map[key];
        }
        else if (Object.values(option.map).includes(value)) {
            return value;
        }
        throw new Error(getMapError(option.map, option.name));
    },
    [ParameterType.Mixed](value, option) {
        option.validate?.(value);
        return value;
    },
    [ParameterType.Object](value, option, _configPath, oldValue) {
        option.validate?.(value);
        if (typeof oldValue !== "undefined") {
            value = { ...oldValue, ...value };
        }
        return value;
    },
    [ParameterType.Flags](value, option) {
        if (typeof value === "boolean") {
            value = Object.fromEntries(Object.keys(option.defaults).map((key) => [key, value]));
        }
        if (typeof value !== "object" || value == null) {
            throw new Error(i18n.expected_object_with_flag_values_for_0(option.name));
        }
        const obj = { ...value };
        for (const key of Object.keys(obj)) {
            if (!Object.prototype.hasOwnProperty.call(option.defaults, key)) {
                throw new Error(i18n.flag_0_is_not_valid_for_1_expected_2(key, option.name, Object.keys(option.defaults).join(", ")));
            }
            if (typeof obj[key] !== "boolean") {
                // Explicit null/undefined, switch to default.
                if (obj[key] == null) {
                    obj[key] = option.defaults[key];
                }
                else {
                    throw new Error(i18n.flag_values_for_0_must_be_booleans(option.name));
                }
            }
        }
        return obj;
    },
};
/**
 * The default conversion function used by the Options container. Readers may
 * re-use this conversion function or implement their own. The arguments reader
 * implements its own since 'false' should not be converted to true for a boolean option.
 * @param value The value to convert.
 * @param option The option for which the value should be converted.
 * @returns The result of the conversion. Might be the value or an error.
 */
export function convert(value, option, configPath, oldValue) {
    const _converters = converters;
    return _converters[option.type ?? ParameterType.String](value, option, configPath, oldValue);
}
const defaultGetters = {
    [ParameterType.String](option) {
        return option.defaultValue ?? "";
    },
    [ParameterType.Path](option) {
        const defaultStr = option.defaultValue ?? "";
        if (defaultStr == "") {
            return "";
        }
        return normalizePath(isAbsolute(defaultStr)
            ? defaultStr
            : join(process.cwd(), defaultStr));
    },
    [ParameterType.UrlOrPath](option) {
        const defaultStr = option.defaultValue ?? "";
        if (defaultStr == "") {
            return "";
        }
        if (/^https?:\/\//i.test(defaultStr)) {
            return defaultStr;
        }
        return isAbsolute(defaultStr)
            ? defaultStr
            : join(process.cwd(), defaultStr);
    },
    [ParameterType.Number](option) {
        return option.defaultValue ?? 0;
    },
    [ParameterType.Boolean](option) {
        return option.defaultValue ?? false;
    },
    [ParameterType.Map](option) {
        return option.defaultValue;
    },
    [ParameterType.Mixed](option) {
        return option.defaultValue;
    },
    [ParameterType.Object](option) {
        return option.defaultValue;
    },
    [ParameterType.Array](option) {
        return option.defaultValue?.slice() ?? [];
    },
    [ParameterType.PathArray](option) {
        return (option.defaultValue?.map((value) => normalizePath(resolve(process.cwd(), value))) ?? []);
    },
    [ParameterType.ModuleArray](option) {
        if (option.defaultValue) {
            return resolveModulePaths(option.defaultValue, process.cwd());
        }
        return [];
    },
    [ParameterType.GlobArray](option) {
        return (option.defaultValue ?? []).map(g => createGlobString(normalizePath(process.cwd()), g));
    },
    [ParameterType.Flags](option) {
        return { ...option.defaults };
    },
};
export function getDefaultValue(option) {
    const getters = defaultGetters;
    return getters[option.type ?? ParameterType.String](option);
}
function resolveModulePaths(modules, configPath) {
    return modules.map((path) => {
        if (path.startsWith(".")) {
            return normalizePath(resolve(configPath, path));
        }
        return normalizePath(path);
    });
}
function isTsNumericEnum(map) {
    return Object.values(map).every((key) => map[map[key]] === key);
}
/**
 * Returns an error message for a map option, indicating that a given value was not one of the values within the map.
 * @param map The values for the option.
 * @param name The name of the option.
 * @returns The error message.
 */
function getMapError(map, name) {
    let keys = map instanceof Map ? [...map.keys()] : Object.keys(map);
    // If the map is a TS numeric enum we need to filter out the numeric keys.
    // TS numeric enums have the property that every key maps to a value, which maps back to that key.
    if (!(map instanceof Map) && isTsNumericEnum(map)) {
        // This works because TS enum keys may not be numeric.
        keys = keys.filter((key) => Number.isNaN(parseInt(key, 10)));
    }
    return i18n.option_0_must_be_one_of_1(name, keys.join(", "));
}
/**
 * Returns an error message for a value that is out of bounds of the given min and/or max values.
 * @param name The name of the thing the value represents.
 * @param minValue The lower bound of the range of allowed values.
 * @param maxValue The upper bound of the range of allowed values.
 * @returns The error message.
 */
function getBoundsError(name, minValue, maxValue) {
    if (isFiniteNumber(minValue) && isFiniteNumber(maxValue)) {
        return i18n.option_0_must_be_between_1_and_2(name, String(minValue), String(maxValue));
    }
    else if (isFiniteNumber(minValue)) {
        return i18n.option_0_must_be_equal_to_or_greater_than_1(name, String(minValue));
    }
    else {
        return i18n.option_0_must_be_less_than_or_equal_to_1(name, String(maxValue));
    }
}
/**
 * Checks if the given value is a finite number.
 * @param value The value being checked.
 * @returns True, if the value is a finite number, otherwise false.
 */
function isFiniteNumber(value) {
    return Number.isFinite(value);
}
/**
 * Checks if a value is between the bounds of the given min and/or max values.
 * @param value The value being checked.
 * @param minValue The lower bound of the range of allowed values.
 * @param maxValue The upper bound of the range of allowed values.
 * @returns True, if the value is within the given bounds, otherwise false.
 */
function valueIsWithinBounds(value, minValue, maxValue) {
    if (isFiniteNumber(minValue) && isFiniteNumber(maxValue)) {
        return minValue <= value && value <= maxValue;
    }
    else if (isFiniteNumber(minValue)) {
        return minValue <= value;
    }
    else if (isFiniteNumber(maxValue)) {
        return value <= maxValue;
    }
    else {
        return true;
    }
}
