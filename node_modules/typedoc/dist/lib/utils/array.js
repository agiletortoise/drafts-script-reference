"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyArray = void 0;
exports.insertPrioritySorted = insertPrioritySorted;
exports.insertOrderSorted = insertOrderSorted;
exports.binaryFindPartition = binaryFindPartition;
exports.removeIfPresent = removeIfPresent;
exports.removeIf = removeIf;
exports.unique = unique;
exports.partition = partition;
exports.zip = zip;
exports.filterMap = filterMap;
exports.firstDefined = firstDefined;
exports.filter = filter;
exports.emptyArray = [];
/**
 * Inserts an item into an array sorted by priority. If two items have the same priority,
 * the item will be inserted later will be placed later in the array.
 * @param arr modified by inserting item.
 * @param item
 */
function insertPrioritySorted(arr, item) {
    const index = binaryFindPartition(arr, (v) => v.priority < item.priority);
    arr.splice(index === -1 ? arr.length : index, 0, item);
    return arr;
}
/**
 * Inserts an item into an array sorted by order. If two items have the same order,
 * the item inserted later will be placed later in the array.
 * The array will be sorted with lower order being placed sooner.
 * @param arr modified by inserting item.
 * @param item
 */
function insertOrderSorted(arr, item) {
    const index = binaryFindPartition(arr, (v) => v.order > item.order);
    arr.splice(index === -1 ? arr.length : index, 0, item);
    return arr;
}
/**
 * Performs a binary search of a given array, returning the index of the first item
 * for which `partition` returns true. Returns the -1 if there are no items in `arr`
 * such that `partition(item)` is true.
 * @param arr
 * @param partition should return true while less than the partition point.
 */
function binaryFindPartition(arr, partition) {
    if (arr.length === 0) {
        return -1;
    }
    let low = 0, high = arr.length - 1;
    while (high > low) {
        const mid = low + Math.floor((high - low) / 2);
        if (partition(arr[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return partition(arr[low]) ? low : -1;
}
/**
 * Removes an item from the array if the array exists and the item is included
 * within it.
 * @param arr
 * @param item
 */
function removeIfPresent(arr, item) {
    if (!arr) {
        return;
    }
    const index = arr.indexOf(item);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}
/**
 * Remove items in an array which match a predicate.
 * @param arr
 * @param predicate
 */
function removeIf(arr, predicate) {
    for (let i = 0; i < arr.length; i++) {
        if (predicate(arr[i])) {
            arr.splice(i, 1);
            i--;
        }
    }
}
/**
 * Filters out duplicate values from the given iterable.
 * @param arr
 */
function unique(arr) {
    return Array.from(new Set(arr));
}
function partition(iter, predicate) {
    const left = [];
    const right = [];
    for (const item of iter) {
        if (predicate(item)) {
            left.push(item);
        }
        else {
            right.push(item);
        }
    }
    return [left, right];
}
function* zip(...args) {
    const iterators = args.map((x) => x[Symbol.iterator]());
    for (;;) {
        const next = iterators.map((i) => i.next());
        if (next.some((v) => v.done)) {
            break;
        }
        yield next.map((v) => v.value);
    }
}
function filterMap(iter, fn) {
    const result = [];
    for (const item of iter || []) {
        const newItem = fn(item);
        if (newItem !== void 0) {
            result.push(newItem);
        }
    }
    return result;
}
function firstDefined(array, callback) {
    if (array === undefined) {
        return undefined;
    }
    for (let i = 0; i < array.length; i++) {
        const result = callback(array[i], i);
        if (result !== undefined) {
            return result;
        }
    }
    return undefined;
}
function filter(array, predicate) {
    return array ? array.filter(predicate) : exports.emptyArray;
}
