/**
 * Shows a simple alert dialog containing the message.
 */
declare function alert(message: string): void

/**
 * Include the contents of a script loaded from iCloud Drive. The contents of the script will be evaluated as if they were inline with the current script. Useful for loading reusable libraries and utility scripts.
 * @param path  relative path to javascript file in the iCloud Drive `/Drafts/Library/Scripts` folder. For example, to load the script in the file `test.js` in the `iCloud Drive/Drafts/Library/Scripts/Utilities/` folder, use the path parameter `Utilities/test.js`.
 */
declare function require(path: string): void

/**
 * Format date using strftime format string. See [strftime format reference](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man3/strftime.3.html) for supported format strings.
 * @category Date
 */
declare function strftime(date: Date, format: string): string

/**
 * Move a date forward or backward in time based on the simple adjustment expression.
 * @param date Valid date object
 * @param adjustmentExpression An series of date adjustment values in the format `(+|-)(integer) (unit)`, such as `"+1 year"`, `"-1 month -12 hours"`. Supported units: year, month, day, hour, minute, second. Units may be in singular or plural form.
 * @category Date
 */
declare function adjustDate(date: Date, adjustmentExpression: string): Date

