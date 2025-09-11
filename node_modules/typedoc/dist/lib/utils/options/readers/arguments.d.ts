import type { Options, OptionsReader } from "../index.js";
import { type Logger } from "#utils";
/**
 * Obtains option values from command-line arguments
 */
export declare class ArgumentsReader implements OptionsReader {
    readonly name = "arguments";
    readonly order: number;
    readonly supportsPackages = false;
    private args;
    private skipErrorReporting;
    constructor(priority: number, args?: string[]);
    ignoreErrors(): this;
    read(container: Options, logger: Logger): void;
}
