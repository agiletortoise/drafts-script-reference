/**
 * > _**macOS only**. Requires Drafts 19 or greater._
 * 
 * AppleScript objects can be used to execute AppleScripts. It is highly recommended AppleScripts be developed and tested in Apple's Script Editor or similar AppleScript editor, and loaded in Drafts when completed.
 *
 * @example
 * 
 * ```javascript
 * // create a local file in App documents
 * let method = "execute";
 * let script = `on execute(bodyHTML)
 * 	tell application "Safari"
 * 		activate
 * 	end tell
 * 	return "Yeah!"
 * end execute`;
 *
 * let html = draft.processTemplate("%%[[draft]]%%");

* let runner = AppleScript.create(script);
* if (runner.execute(method, [html])) {
* 	// the AppleScript ran without error
* 	// if the script returned a result, it's available...
* 	alert(runner.lastResult);
* }
* else {
* 	alert(runner.lastError);
* }
* ```
* 
* **Note:** When executed, AppleScripts are saved to temporary files in the Drafts' script directory at `~/Library/Application Scripts/com.agiletortoise.Drafts-OSX` and run. The first time a script is executed, the user will be asked to grant permissions to the script directory.
*/
declare class AppleScript {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string | undefined

    /**
    * If a the AppleScript subroutine called returns a value and it can be converted to a JavaScript object, it will be stored here. Most basic data types (string, date, numbers), as well as list and records containing those data types, can be returned.
    */
    lastResult?: object | undefined

    /**
     * Convenience method to create an AppleScript object.
     * @param script A string containing the AppleScript code. This code will be compiled and executed when the `execute` function is called.
     */
    static create(script: string): AppleScript

    /**
     * Create new instance.
     */
    constructor(script: string)

    /**
     * Compiles and executes the AppleScript code, calling the subroutine passed with the arguments.
     * @param subroutine The name of a subroutine in the AppleScript to call. [Subroutines](http://www.macosxautomation.com/applescript/sbrt/) are defined using `on subroutineName()` syntax in the AppleScript.
     * @param arguments An array of arguments to pass to the subroutine. Most basic Javascript data types, and objects and arrays of those data types, can be passed and will be translated to the proper AppleScript types.
     * @returns `true` if the AppleScript was compiled and executed without error, `false` if not. If `false`, the `lastError` property will contain details regarding the error.
     */
    execute(subroutine: string, arguments: object[]): boolean

}

