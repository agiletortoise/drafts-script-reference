"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterType = exports.ParameterHint = exports.CommentStyle = exports.EmitStrategy = void 0;
exports.convert = convert;
exports.getDefaultValue = getDefaultValue;
const path_1 = require("path");
/** @enum */
exports.EmitStrategy = {
    both: "both", // Emit both documentation and JS
    docs: "docs", // Emit documentation, but not JS (default)
    none: "none", // Emit nothing, just convert and run validation
};
/**
 * Determines how TypeDoc searches for comments.
 * @enum
 */
exports.CommentStyle = {
    JSDoc: "jsdoc",
    Block: "block",
    Line: "line",
    All: "all",
};
var ParameterHint;
(function (ParameterHint) {
    ParameterHint[ParameterHint["File"] = 0] = "File";
    ParameterHint[ParameterHint["Directory"] = 1] = "Directory";
})(ParameterHint || (exports.ParameterHint = ParameterHint = {}));
var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["String"] = 0] = "String";
    /**
     * Resolved according to the config directory.
     */
    ParameterType[ParameterType["Path"] = 1] = "Path";
    ParameterType[ParameterType["Number"] = 2] = "Number";
    ParameterType[ParameterType["Boolean"] = 3] = "Boolean";
    ParameterType[ParameterType["Map"] = 4] = "Map";
    ParameterType[ParameterType["Mixed"] = 5] = "Mixed";
    ParameterType[ParameterType["Array"] = 6] = "Array";
    /**
     * Resolved according to the config directory.
     */
    ParameterType[ParameterType["PathArray"] = 7] = "PathArray";
    /**
     * Resolved according to the config directory if it starts with `.`
     */
    ParameterType[ParameterType["ModuleArray"] = 8] = "ModuleArray";
    /**
     * Resolved according to the config directory unless it starts with `**`, after skipping any leading `!` and `#` characters.
     */
    ParameterType[ParameterType["GlobArray"] = 9] = "GlobArray";
    /**
     * An object which partially merges user-set values into the defaults.
     */
    ParameterType[ParameterType["Object"] = 10] = "Object";
    /**
     * An object with true/false flags
     */
    ParameterType[ParameterType["Flags"] = 11] = "Flags";
})(ParameterType || (exports.ParameterType = ParameterType = {}));
const converters = {
    [ParameterType.String](value, option, i18n) {
        const stringValue = value == null ? "" : String(value);
        option.validate?.(stringValue, i18n);
        return stringValue;
    },
    [ParameterType.Path](value, option, i18n, configPath) {
        const stringValue = value == null ? "" : (0, path_1.resolve)(configPath, String(value));
        option.validate?.(stringValue, i18n);
        return stringValue;
    },
    [ParameterType.Number](value, option, i18n) {
        const numValue = parseInt(String(value), 10) || 0;
        if (!valueIsWithinBounds(numValue, option.minValue, option.maxValue)) {
            throw new Error(getBoundsError(option.name, i18n, option.minValue, option.maxValue));
        }
        option.validate?.(numValue, i18n);
        return numValue;
    },
    [ParameterType.Boolean](value) {
        return !!value;
    },
    [ParameterType.Array](value, option, i18n) {
        let strArrValue = new Array();
        if (Array.isArray(value)) {
            strArrValue = value.map(String);
        }
        else if (typeof value === "string") {
            strArrValue = [value];
        }
        option.validate?.(strArrValue, i18n);
        return strArrValue;
    },
    [ParameterType.PathArray](value, option, i18n, configPath) {
        let strArrValue = new Array();
        if (Array.isArray(value)) {
            strArrValue = value.map(String);
        }
        else if (typeof value === "string") {
            strArrValue = [value];
        }
        strArrValue = strArrValue.map((path) => (0, path_1.resolve)(configPath, path));
        option.validate?.(strArrValue, i18n);
        return strArrValue;
    },
    [ParameterType.ModuleArray](value, option, i18n, configPath) {
        let strArrValue = new Array();
        if (Array.isArray(value)) {
            strArrValue = value.map(String);
        }
        else if (typeof value === "string") {
            strArrValue = [value];
        }
        strArrValue = resolveModulePaths(strArrValue, configPath);
        option.validate?.(strArrValue, i18n);
        return strArrValue;
    },
    [ParameterType.GlobArray](value, option, i18n, configPath) {
        let strArrValue = new Array();
        if (Array.isArray(value)) {
            strArrValue = value.map(String);
        }
        else if (typeof value === "string") {
            strArrValue = [value];
        }
        strArrValue = resolveGlobPaths(strArrValue, configPath);
        option.validate?.(strArrValue, i18n);
        return strArrValue;
    },
    [ParameterType.Map](value, option, i18n) {
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
        throw new Error(getMapError(option.map, i18n, option.name));
    },
    [ParameterType.Mixed](value, option, i18n) {
        option.validate?.(value, i18n);
        return value;
    },
    [ParameterType.Object](value, option, i18n, _configPath, oldValue) {
        option.validate?.(value, i18n);
        if (typeof oldValue !== "undefined")
            value = { ...oldValue, ...value };
        return value;
    },
    [ParameterType.Flags](value, option, i18n) {
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
function convert(value, option, i18n, configPath, oldValue) {
    const _converters = converters;
    return _converters[option.type ?? ParameterType.String](value, option, i18n, configPath, oldValue);
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
        return (0, path_1.isAbsolute)(defaultStr)
            ? defaultStr
            : (0, path_1.join)(process.cwd(), defaultStr);
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
        return (option.defaultValue?.map((value) => (0, path_1.resolve)(process.cwd(), value)) ?? []);
    },
    [ParameterType.ModuleArray](option) {
        return (option.defaultValue?.map((value) => value.startsWith(".") ? (0, path_1.resolve)(process.cwd(), value) : value) ?? []);
    },
    [ParameterType.GlobArray](option) {
        return resolveGlobPaths(option.defaultValue ?? [], process.cwd());
    },
    [ParameterType.Flags](option) {
        return { ...option.defaults };
    },
};
function getDefaultValue(option) {
    const getters = defaultGetters;
    return getters[option.type ?? ParameterType.String](option);
}
function resolveGlobPaths(globs, configPath) {
    return globs.map((path) => {
        const start = path.match(/^[!#]+/)?.[0] ?? "";
        const remaining = path.substring(start.length);
        if (!remaining.startsWith("**")) {
            return start + (0, path_1.resolve)(configPath, remaining);
        }
        return start + remaining;
    });
}
function resolveModulePaths(modules, configPath) {
    return modules.map((path) => {
        if (path.startsWith(".")) {
            return (0, path_1.resolve)(configPath, path);
        }
        return path;
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
function getMapError(map, i18n, name) {
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
function getBoundsError(name, i18n, minValue, maxValue) {
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
