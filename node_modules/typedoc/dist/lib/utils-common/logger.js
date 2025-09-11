/**
 * List of known log levels. Used to specify the urgency of a log message.
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Info"] = 1] = "Info";
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    LogLevel[LogLevel["Error"] = 3] = "Error";
    LogLevel[LogLevel["None"] = 4] = "None";
})(LogLevel || (LogLevel = {}));
const messagePrefixes = {
    [LogLevel.Error]: "[error]",
    [LogLevel.Warn]: "[warning]",
    [LogLevel.Info]: "[info]",
    [LogLevel.Verbose]: "[debug]",
};
/**
 * A logger that will not produce any output.
 *
 * This logger also serves as the base class of other loggers as it implements
 * all the required utility functions.
 */
export class Logger {
    /**
     * How many error messages have been logged?
     */
    errorCount = 0;
    /**
     * How many warning messages have been logged?
     */
    warningCount = 0;
    /**
     * The minimum logging level to print.
     */
    level = LogLevel.Info;
    /**
     * Has an error been raised through the log method?
     */
    hasErrors() {
        return this.errorCount > 0;
    }
    /**
     * Has a warning been raised through the log method?
     */
    hasWarnings() {
        return this.warningCount > 0;
    }
    /**
     * Reset the error counter.
     */
    resetErrors() {
        this.errorCount = 0;
    }
    /**
     * Reset the warning counter.
     */
    resetWarnings() {
        this.warningCount = 0;
    }
    /**
     * Log the given verbose message.
     *
     * @param text  The message that should be logged.
     */
    verbose(text) {
        this.log(this.addContext(text, LogLevel.Verbose), LogLevel.Verbose);
    }
    /** Log the given info message. */
    info(text) {
        this.log(this.addContext(text, LogLevel.Info), LogLevel.Info);
    }
    warn(text, ...args) {
        const text2 = this.addContext(text, LogLevel.Warn, ...args);
        this.log(text2, LogLevel.Warn);
    }
    error(text, ...args) {
        const text2 = this.addContext(text, LogLevel.Error, ...args);
        this.log(text2, LogLevel.Error);
    }
    /**
     * Print a log message.
     *
     * @param _message The message itself.
     * @param level The urgency of the log message.
     */
    log(_message, level) {
        if (level === LogLevel.Error) {
            this.errorCount += 1;
        }
        if (level === LogLevel.Warn) {
            this.warningCount += 1;
        }
    }
    addContext(message, _level, ..._args) {
        return message;
    }
}
/**
 * Logger implementation which logs to the console
 */
export class ConsoleLogger extends Logger {
    log(message, level) {
        super.log(message, level);
        if (level < this.level) {
            return;
        }
        const method = {
            [LogLevel.Error]: "error",
            [LogLevel.Warn]: "warn",
            [LogLevel.Info]: "info",
            [LogLevel.Verbose]: "log",
        }[level];
        // eslint-disable-next-line no-console
        console[method](message);
    }
    addContext(message, level, ..._args) {
        return `${messagePrefixes[level]} ${message}`;
    }
}
