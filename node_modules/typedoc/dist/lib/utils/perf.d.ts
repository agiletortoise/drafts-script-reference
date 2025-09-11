export declare function bench<T extends (..._: any) => any>(fn: T, name?: string): T;
declare function BenchField<T extends (..._: any) => any>(_value: undefined, context: ClassFieldDecoratorContext<unknown, T>): (value: T) => T;
declare function BenchMethod<T extends (..._: any) => any>(value: T, context: ClassMethodDecoratorContext): T;
export declare const Bench: typeof BenchField & typeof BenchMethod;
export declare function measure<T>(cb: () => T): T;
export {};
