/**
 * When running a [Script action step](https://docs.getdrafts.com/docs/actions/steps/advanced.html#script), a single `script` object will be in context to reference the currently running script.
 * 
 * @example
 * ```javascript
 * function sleep(milliseconds) {
 *   var start = new Date().getTime();
 *   for (var i = 0; i < 1e7; i++) {
 *     if ((new Date().getTime() - start) > milliseconds){
 *       break;
 *     }
 *   }
 * }
 * async function f() {
 *   let promise = new Promise((resolve, reject) => {
 *     sleep(1000);
 *     resolve("done!")
 *   });
 *   let result = await promise; // wait until the promise resolves (*)
 *   alert(result); // "done!"
 *   script.complete();
 * }
 * f();
 * ```
 */
declare class Script {
    /**
     * Inform Drafts the current script has completed execution. Used in combination with the "Allow asynchronous execution" option of the Script step type. If your script step has the asynchronous option enabled, you *must* call `script.complete()` to indicate completion or the script will timeout and fail.
     */
    complete()
}
