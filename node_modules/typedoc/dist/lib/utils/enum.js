"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumFlags = getEnumFlags;
exports.removeFlag = removeFlag;
exports.hasAllFlags = hasAllFlags;
exports.hasAnyFlag = hasAnyFlag;
exports.debugFlags = debugFlags;
exports.getEnumKeys = getEnumKeys;
function getEnumFlags(flags) {
    const result = [];
    for (let i = 1; i <= flags; i <<= 1) {
        if (flags & i) {
            result.push(i);
        }
    }
    return result;
}
// T & {} reduces inference priority
function removeFlag(flag, remove) {
    return (flag & ~remove);
}
function hasAllFlags(flags, check) {
    return (flags & check) === check;
}
function hasAnyFlag(flags, check) {
    return (flags & check) !== 0;
}
function debugFlags(Enum, flags) {
    return getEnumKeys(Enum).filter((key) => (Enum[key] & flags) === Enum[key]);
}
// Note: String enums are not handled.
function getEnumKeys(Enum) {
    const E = Enum;
    return Object.keys(E).filter((k) => E[E[k]] === k);
}
