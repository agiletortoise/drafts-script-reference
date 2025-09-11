import ts from "typescript";
import { ConsoleLogger, type Logger, LogLevel, type MinimalNode, type MinimalSourceFile } from "#utils";
export declare function diagnostics(logger: Logger, diagnostics: readonly ts.Diagnostic[]): void;
export declare function diagnostic(logger: Logger, diagnostic: ts.Diagnostic): void;
/**
 * A logger that outputs all messages to the console.
 */
export declare class FancyConsoleLogger extends ConsoleLogger {
    protected addContext(message: string, level: Exclude<LogLevel, LogLevel.None>, ...args: [MinimalNode?] | [number, MinimalSourceFile]): string;
}
