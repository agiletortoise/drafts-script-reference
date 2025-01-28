/**
 * Shortcut objects are used as a convenience to run a shortcut in Apple's Shortcut app, and optionally obtain a result. This is a wrapper for making x-callback-url requests and waiting for a response from the Shortcuts app.
 *
 * An example, with associated shortcut, can be [installed from the Directory](https://directory.getdrafts.com/a/2XD).
 * 
 * @example
 * 
 * ```javascript
 * let shortcut = Shortcut.create("MY-SHORTCUT-NAME", draft.content)
 * if (shortcut.run()) {
 *     // if here, the shortcut ran successfully
 *     // show an alert with the result text
 *     alert(shortcut.result)
 *     // if the shortcut returned a dictionary, it will be in the `response` property
 *     alert(JSON.stringify(shortcut.response))
 * }
 * ```
 */
declare class Shortcut {
    /**
     * The name of the Shortcut to call from your Shortcuts library.
     */
    name: string

    /**
     * The string value to pass as the Shortcut Input value.
     */
    text: string

    /**
     * If true, the script will pause and wait for the shortcut to complete and return a result. If false, execution of the script/action will continue immediately and no response/results will be available.
     */
    waitForResponse: boolean

    /**
     * The current status. Used to check outcome after `run` is called. Possible values:
     * * created: `run` has not yet been called.
     * * success: Shortcut has been run successfully.
     * * cancelled: Cancel callback was received.
     * * error: Error was returned from Shortcuts.
     * * timeout: Waiting for the response timed out without receiving response from Shortcuts.
     * * invalid: The URL was invalid and could not be opened.
     */
    status: 'created' | 'success' | 'cancelled' | 'error' | 'timeout' | 'invalid'

    /**
     * An object contain and URL query parameters returned by the Shortcuts app. For example, if the the shortcut ends returning a value, it will be in the `result` key of this dictionary. If it returned a Dictionary, this would have each of the keys of the dictionary as a string value.
     */
    response: { [x: string]: any }

    /**
     * Convenience method to retrieve the `result` key from the `reponse` object. This is equivalent to `shortcut.response["result"]`. The type of value in this key depends on the value returned from the shortcut. 
     */
    result?: any

    /**
     * Run the shortcut, and waits for a response (if `waitForResponse` = true). Returns true if an success response was received from the Shortcuts, otherwise false. If false, use the "status" property to determine the type of failure.
     */
    run(): boolean

    /**
     * Creates a new Shortcut object with the name and text properties already assigned.
     */
    static create(name: string, text: string): Shortcut

    /**
     * Create new instance.
     */
    constructor()

}

