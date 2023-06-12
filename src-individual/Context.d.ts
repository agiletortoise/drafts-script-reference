/**
 * A single global "context" object is available to scripts to control flow of the currently running action.
 *
 * It is important to understand that `cancel()` and `fail()` will not immediately stop script, just stop any further action steps from being performed.
 *
 * @example
 * 
 * **Control Flow**
 * 
 * ```javascript
 * // test for logical condition before continuing
 * if (!validationCondition) {
 *   context.fail();
 * }
 * // code below will still run.
 * ```
 * 
 * **Retreive values**
 * 
 * ```javascript
 * // if a "Run Workflow" step preceded this script, lets look for a result
 * let response = context.callbackResponses[0];
 * if (response) {
 *   // Workflow returns one "result" parameter, other apps may use other values.
 *   var result = response["result"];
 *   if (result) {
 *     // so something with the result
 *   }
 * }
 * ```
 * 
 */
declare class Context {
    private constructor()
    /**
     * If [Callback URL](https://docs.getdrafts.com/docs/actions/steps/advanced#callback-url) or [Run Shortcut](https://docs.getdrafts.com/docs/actions/steps/advanced#run-shortcut) action steps using the "Wait for response" option have been run in steps before the script step in an action, and the target app returned to Drafts using an x-success callback, this object will contain an array of objects with the parsed query parameters included in those responses, in the order they were received. 
     */
    callbackResponses: { [x: string]: any }

    /**
    * If AppleScripts run using the AppleScript object return values, they will be converted to JavaScript object and stored in this array. See [AppleScript docs](https://docs.getdrafts.com/docs/automation/applescript) for details.
    */
    appleScriptResponses: { [x: string]: any }

    /**
    * If [HTML Preview](https://docs.getdrafts.com/docs/actions/html-forms) makes calls to `Drafts.send(key, value)` those values are stored in this object by `key`.
    */
    previewValues: { string: any }

    /**
     * Tell the context to cancel the action at the end of the script execution. If called, at the end of the script the action will be stopped. No subsequent action steps in the action will run, and the action still stop silently - no notification banners, sounds, etc. If a message is included it will be added to the action log to explain the cancellation.
     */
    cancel(message: string): void

    /**
     * Tell the context to fail the current action. In effect this is the same as `cancel()` but an error notification will be shown. If a message is included it will be added to the action log to explain the cancellation.
     */
    fail(message: string): void

    /**
     * Used only when calling a Drafts action from another app via x-callback-url with a `/runAction` URL. Any parameters set via this method will be included as query args when calling the provided `x-success` parameter. As an example, the below:
     * 
     * ```
     * context.addSuccessParameter("a", "1");
     * context.addSuccessParameter("b", "2");
     * ```
     * 
     * Would result in the parameters `?a=1&b=2` being added to the `x-success` callback.
     * @param name   The name for the parameter
     * @param value A string value for the parameter. Do *not* URL encode this value, it will be encoded when added to the callback URL.
     */
    addSuccessParameter(name: string, value: string): void
}

declare const  context: Context

