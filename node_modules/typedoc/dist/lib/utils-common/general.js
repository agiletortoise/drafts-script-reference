/**
 * Utility to help type checking ensure that there is no uncovered case.
 */
export function assertNever(x) {
    throw new Error(`Expected handling to cover all possible cases, but it didn't cover: ${JSON.stringify(x)}`);
}
export function assert(x, message = "Assertion failed") {
    if (!x) {
        throw new Error(message);
    }
}
export function NonEnumerable(_cls, context) {
    context.addInitializer(function () {
        Object.defineProperty(this, context.name, {
            enumerable: false,
            configurable: true,
            writable: true,
        });
    });
}
