"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBeenLoadedMultipleTimes = exports.assertNever = void 0;
const Util = require("util");
/**
 * Utility to help type checking ensure that there is no uncovered case.
 */
function assertNever(x) {
    throw new Error(`Expected handling to cover all possible cases, but it didn't cover: ${Util.inspect(x)}`);
}
exports.assertNever = assertNever;
/**
 * This is a hack to make it possible to detect and warn about installation setups
 * which result in TypeDoc being installed multiple times. If TypeDoc has been loaded
 * multiple times, then parts of it will not work as expected.
 */
const loadSymbol = Symbol.for("typedoc_loads");
const getLoads = () => globalThis[loadSymbol] || 0;
// @ts-expect-error there's no way to add symbols to globalThis, sadly.
globalThis[loadSymbol] = getLoads() + 1;
function hasBeenLoadedMultipleTimes() {
    return getLoads() !== 1;
}
exports.hasBeenLoadedMultipleTimes = hasBeenLoadedMultipleTimes;
