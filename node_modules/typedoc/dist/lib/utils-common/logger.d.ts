import type { IfInternal } from "./general.js";
import type { TranslatedString } from "./i18n.js";
import type { MinimalNode, MinimalSourceFile } from "./minimalSourceFile.js";
/**
 * List of known log levels. Used to specify the urgency of a log message.
 */
export declare enum LogLevel {
    Verbose = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    None = 4
}
/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements
 * all the required utility functions.
 */
export declare class Logger {
    /**
     * How many error messages have been logged?
     */
    errorCount: number;
    /**
     * How many warning messages have been logged?
     */
    warningCount: number;
    /**
     * The minimum logging level to print.
     */
    level: LogLevel;
    /**
     * Has an error been raised through the log method?
     */
    hasErrors(): boolean;
    /**
     * Has a warning been raised through the log method?
     */
    hasWarnings(): boolean;
    /**
     * Reset the error counter.
     */
    resetErrors(): void;
    /**
     * Reset the warning counter.
     */
    resetWarnings(): void;
    /**
     * Log the given verbose message.
     *
     * @param text  The message that should be logged.
     */
    verbose(text: string): void;
    /** Log the given info message. */
    info(text: IfInternal<TranslatedString, string>): void;
    /**
     * Log the given warning.
     *
     * @param text  The warning that should be logged.
     */
    warn(text: IfInternal<TranslatedString, string>, node?: MinimalNode): void;
    warn(text: IfInternal<TranslatedString, string>, pos: number, file: MinimalSourceFile): void;
    /**
     * Log the given error.
     *
     * @param text  The error that should be logged.
     */
    error(text: IfInternal<TranslatedString, string>, node?: MinimalNode): void;
    error(text: IfInternal<TranslatedString, string>, pos: number, file: MinimalSourceFile): void;
    /**
     * Print a log message.
     *
     * @param _message The message itself.
     * @param level The urgency of the log message.
     */
    log(_message: string, level: LogLevel): void;
    protected addContext(message: string, _level: Exclude<LogLevel, LogLevel.None>, ..._args: [MinimalNode?] | [number, MinimalSourceFile]): string;
}
/**
 * Logger implementation which logs to the console
 */
export declare class ConsoleLogger extends Logger {
    log(message: string, level: Exclude<LogLevel, LogLevel.None>): void;
    protected addContext(message: string, level: Exclude<LogLevel, LogLevel.None>, ..._args: [MinimalNode?] | [number, MinimalSourceFile]): string;
}
