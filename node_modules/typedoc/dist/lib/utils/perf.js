/* eslint-disable no-console */
const benchmarks = [];
export function bench(fn, name = fn.name) {
    const matching = benchmarks.find((b) => b.name === name);
    const timer = matching || {
        name,
        calls: 0,
        time: 0,
    };
    if (!matching)
        benchmarks.push(timer);
    return function bench(...args) {
        timer.calls++;
        const start = performance.now();
        const end = () => (timer.time += performance.now() - start);
        let result;
        try {
            result = fn.apply(this, args);
        }
        catch (error) {
            end();
            throw error;
        }
        if (result instanceof Promise) {
            result.then((res) => {
                end();
                return res;
            }, (reason) => {
                end();
                throw reason;
            });
        }
        else {
            end();
        }
        return result;
    };
}
function BenchField(_value, context) {
    let runner;
    return function (value) {
        if (!runner) {
            const className = context.static
                ? this.name
                : Object.getPrototypeOf(this).constructor.name;
            runner = bench(value, `${className}.${String(context.name)}`);
        }
        return function (...args) {
            return runner.apply(this, args);
        };
    };
}
function BenchMethod(value, context) {
    let runner;
    return function (...args) {
        if (!runner) {
            const className = context.static
                ? this.name
                : Object.getPrototypeOf(this).constructor.name;
            runner = bench(value, `${className}.${String(context.name)}`);
        }
        return runner.apply(this, args);
    };
}
export const Bench = (value, context) => {
    if (context.kind === "field") {
        return BenchField(value, context);
    }
    return BenchMethod(value, context);
};
export function measure(cb) {
    return bench(cb, "measure()")();
}
process.on("exit", () => {
    if (!benchmarks.length)
        return;
    const table = benchmarks.map((b) => {
        return {
            Benchmarked: b.name,
            Calls: b.calls,
            "Time (ms)": Math.round(b.time * 100) / 100,
            "Average (ms)": Math.round((b.time / b.calls) * 100) / 100,
        };
    });
    console.table(table);
});
