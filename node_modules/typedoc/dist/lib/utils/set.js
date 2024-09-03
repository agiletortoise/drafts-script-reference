"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntersection = setIntersection;
exports.setDifference = setDifference;
function setIntersection(a, b) {
    const result = new Set();
    for (const elem of a) {
        if (b.has(elem)) {
            result.add(elem);
        }
    }
    return result;
}
function setDifference(a, b) {
    const result = new Set(a);
    for (const elem of b) {
        result.delete(elem);
    }
    return result;
}
