/**
 * @module Global
 * # Action
 * 
 * In addition to being able to lookup an action using the find method, a single global `action` object is created and available in scripts to inquire about the current action and control flow.
 * 
 * ### Example
 * 
 * ```javascript
 * // find action
 * let action = Action.find("Copy");
 * 
 * // queue to action to run after the current action
 * app.queueAction(action, draft);
```
 */
declare class Action {
    /**
     * Search for action matching the name passed and return it if found. Useful to lookup and action and queue it to be run using `app.queueAction(action, draft)`. This method will return only the first found action with the given name, be sure to avoid duplicate names in your action list.
     * @category Query
     * @param name Name of a valid, installed action.
     */
    static find(name: string): Action | undefined

    /**
     * The display name of the action as displayed in the action list.
     * @category Identification
     */
    readonly name: string

    /**
     * URL which can be used to install this Action in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
    * The unique identifier of the action group.
    * @category Identification
    */
    readonly uuid: string

    /**
    * If true, the action is a separator.
    * @category Identification
    */
    readonly isSeparator: boolean
}
/**
 * The current running action. This can be used in script to branch based on action name. 
 */
declare const action: Action/**
 * # ActionGroup
 * 
 * Represents an action group. Can be used to inquire and load action groups in the action list and action bar using methods on the [[App]] object.
 * 
 * ### Examples
 *
 * ```javascript
 * let group = ActionGroup.find("Basic");
 * app.loadActionGroup(group);
 * ```
 * 
 */
declare class ActionGroup {
    /**
     * Get list of all available action groups.
     * @category Query
     */
    static getAll(): ActionGroup[]

    /**
     * Search for action group matching the name passed and return it if found. Returns `undefined` if not found.
     * @param name The display name of the action group.
     * @category Query
     */
    static find(name: string): ActionGroup | undefined

    /**
     * The display name of the action group.
     * @category Identification
     */
    readonly name: string

    /**
    * The unique identifier of the action group.
    * @category Identification
    */
    readonly uuid: string

    /**
    * URL which can be used to install this Action Group in another installation of Drafts. Useful for sharing and backups.
    * @category Identification
    */
    readonly installURL: string

    /**
    * The actions contained in the action group.
    * @category Content
    */
    readonly actions: Action[]
}
/**
 * # ActionLog
 * 
 * ActionLog objects represent entries in the [action log](). ActionLog objects are accessed using the `actionLogs` property of the [[Draft]] object.
 * 
 * ```javascript
 * // loop over log entries, deleting any more than 100 days old
 * for(let log of draft.actionLogs) {
 *   if (log.executedAt < Date.today.addDays(-100)) {
 *     log.delete();
 *   }
 * }
 * ```
 */
declare class ActionLog {
    /**
     * Unique identifier
     * @category Identification
     */
    readonly uuid: string
    /**
    * The content of the log
    * @category Content
    */
    readonly log: string
    /**
    * Status of the log. "failed" indicates the action ended in an error, "completed" indicates successful completion of the action.
    * @category Content
    */
    readonly status: "pending" | "in-progress" | "completed" | "failed" | "cancelled"
    /**
    * Timestamp for the creation of the log entry
    * @category Content
    */
    readonly executedAt: Date
    /**
    * The [[Draft]] object related to the log. This value may be nil if the action was performed without a draft in context, or if the related draft no longer exists.
    * @category Identification
    */
    readonly draft?: Draft
    /**
    * The [[Action]] object related to the log. This value may be nil if the action no longer exists.
    * @category Identification
    */
    readonly action?: Action
    /**
    * The longitude portion of the location recorded when action was executed, if location services are enabled.
    * @category Content
    */
    readonly executedLongitude: number
    /**
    * The latitude portion of the location recorded when action was executed, if location services are enabled.
    * @category Content
    */
    readonly executedLatitude: number
    /**
    * Which device the action was performed on, typically 'iPhone', 'iPad', or 'Mac'
    * @category Content
    */
    readonly executedDevice: string
    /**
    * Delete the action log. This is permanent and should be used with caution
    */
    delete()
}/**
 * # Alarm
 * 
 * Alarms are alerts which can be attached to [[Reminder]] and [[Event]] objects.
 * 
 * ### Examples
 * 
 * ```javascript
 * let list = ReminderList.findOrCreate("Errands");
 * let reminder = list.createReminder();
 * reminder.title = "Get more paper towels";
 *
 * let alarm = Alarm.alarmWithDate((3).days().fromNow());
 * reminder.addAlarm(alarm);
 * reminder.update();
 * ```
 */

declare class Alarm {
    /**
     * Alarm set to remind at a specific date/time.
     * @param date: Date
     */
    static alarmWithDate(date: Date): Alarm

    /**
     * Alarm set to remind at a specific number of seconds relative to the start date of the event. Note that alarms created with this methods are only supported on [[Event]] objects, not [[Reminder]] objects.
     * @param seconds: Number seconds from now
     */
    static alarmWithOffset(seconds: Number): Alarm
}/**
 * # App
 * 
 * Drafts defines a single global `app` object which provides access to application level functions.
 * 
 * ### Examples
 * ```javascript
 * // toggle dark-light mode
 * if (app.currentThemeMode == 'dark') {
 *   app.themeMode = 'light';
 * }
 * else {
 *   app.themeMode = 'dark';
 * }
 * ```
 */
declare class App {
    /**
     * Returns true if app has an active Drafts Pro subscription.
     * @category System
    */
    readonly isPro: boolean

    /**
     * Version number of current installation of Drafts.
     * @category System
     */
    readonly version: string

    /**
     * Get or set themeMode.
     * @category Theme
     */
    themeMode: 'light' | 'dark' | 'automatic'

    /**
    * The current light mode theme.
    * @category Theme
    */
    lightTheme: Theme

    /**
    * The current dark mode theme.
    * @category Theme
    */
    darkTheme: Theme

    /**
     * Returns the active theme mode, light or dark, taking into account automatic switching of themes if active. If writing scripts to branch logic based on the current mode, this is the best property to use.
     * @category Theme
     */
    readonly currentThemeMode: 'light' | 'dark'

    /**
     * Is the draft list side panel is visible.
     * @category Interface
     */
    readonly isDraftListVisible: boolean

    /**
     * Is the action list side panel is visible.
     * @category Interface
     */
    readonly isActionListVisible: boolean

    /**
     * Is system sleep timer disabled preventing screen dimming/sleep.
     * @category System
     */
    isIdleDisabled: boolean

    /**
     * Request system opens the URL passed. Returns true if URL was opened, false if the URL was invalid or no available app can open the URL on the device.
     * @param url url to open
     * @param useSafari whether to use the Safari View Controller (true) or default browser (false).
     * @category Utility
     */
    openURL(url: string, useSafari?: boolean): boolean

    /**
     * Queues an action to run on a draft after the current action is complete.
     * ```javascript
     * // lookup action and draft, and queue the action to run
     * let a = Action.find("Copy");
     * let d = Draft.find("UUID");
     * app.queueAction(a, d);
     * ```
     * @category Utility
     * @param action Actions can be obtained using the `Action.find(name)` method.
     * @param draft A draft object.
     */
    queueAction(action: Action, draft: Draft): boolean

    /**
     * Open draft selection interface and wait for user to select a draft. Returns the select draft object, or `undefined` if user cancelled.
     * @category Interface
     * @param workspace If provided, the workspace will define the default filtering, display, and sort options for the selection window.
     */
    selectDraft(workspace?: Workspace): Draft | undefined

    // UI FUNCTIONS

    /**
     * Open draft list side bar.
     * @category Interface
     */
    showDraftList(): void

    /**
     * Close draft list side bar.
     * @category Interface
     */
    hideDraftList(): void

    /**
     * Open quick search window, optionally providing a initial query value.
     * @category Interface
    */
    showQuickSearch(initialQuery?: string): void

    /**
    * Open the "Get Info" view for a draft. If no draft is passed, the current active draft in the editor will be used.
    * @category Interface
    */
    showDraftInfo(draft?: Draft): void

    /**
    * If able, open the requested draft in a new window. This method only functions on iPad and Mac. The ability to open new windows is not available on iPhone.
    * @returns `true` if successful. `false` if unable to open a new window (as on iPhone).
    * @category Interface
    */
    openInNewWindow(draft: Draft): boolean

    /**
     * Open action list side bar.
     * @category Interface
     */
    showActionList(): void

    /**
     * Close action list side bar.
     * @category Interface
     */
    hideActionList(): void

    /**
     * Apply the Workspace as if it was selected in draft list. Calling this function with no arguments will clear filters and apply the default workspace.
     * @category Interface
     **/
    applyWorkspace(workspace?: Workspace): boolean

    /**
     * Returns a workspace object configured like the workspace currently loaded in the draft list of the active window. Useful when creating logic which reacts contextually to the workspace loaded.
     * @category Interface
     */
    currentWorkspace: Workspace

    /**
     * Load the ActionGroup in the action list side bar.
     * @category Interface
     */
    loadActionGroup(actionGroup: ActionGroup): boolean

    /**
     * Load the ActionGroup in the action bar below editor.
     * @category Interface
     */
    loadActionBarGroup(actionGroup: ActionGroup): boolean

    /**
     * @deprecated replaced by `loadActionBarGroup`.
     * @category Deprecated
     */
    loadKeyboardActionGroup(actionGroup: ActionGroup): boolean

    /**
     * Enable and disable the iOS system sleep timer to prevent screen dimming/sleep.
     * @category Utility
     */
    setIdleDisabled(isDisabled: boolean): void

    // CLIPBOARD FUNCTIONS

    /**
     * Get current contents of the system clipboard.
     * @category Utility
     */
    getClipboard(): string

    /**
     * Set the contents of the system clipboard.
     * @param string the data to set
     * @category Utility
     */
    setClipboard(contents: string): void

    /**
     * Takes HTML string and converts it to rich-text and places it in the system clipboard. Returns true if successful, false if an error occurred in conversion.
     * @param html a possibly-valid html string
     * @category Utility
     */
    htmlToClipboard(html: string): boolean

    // MESSAGES FUNCTIONS
    /**
     * Show success banner notification with the message passed.
     * @category Interface
     */
    displaySuccessMessage(message: string): void
    /**
     * Show info banner notification with the message passed.
     * @category Messages
     */
    displayInfoMessage(message: string): void
    /**
     * Show warning banner notification with the message passed.
     * @category Messages
     */
    displayWarningMessage(message: string): void
    /**
     * Show error banner notification with the message passed.
     * @category Messages
     */
    displayErrorMessage(message: string): void
}
/**
 * Reference to current app object.
 */
declare const app: App/**
 * # AppleScript
 * 
 * _**macOS only**. Requires Drafts 19 or greater._
 * 
 * AppleScript objects can be used to execute AppleScripts. It is highly recommended AppleScripts be developed and tested in Apple's Script Editor or similar AppleScript editor, and loaded in Drafts when completed.
 *
 * ### Example
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

/**
 * # Base64
 * 
 * Helper methods to encode and decode [Base64](https://en.wikipedia.org/wiki/Base64) strings.
 * 
 *  ### Examples
 * 
 * ```javascript
 * let s = "My String";
 * let encoded = Base64.encode(s);
 * let decoded = Base64.decode(encoded);
 * ```
 */
declare class Base64 {
    /**
     * Base64 encode a string.
     * @param data the string to encode
     */
    static encode(data: string): string

    /**
     * Base64 decode a string.
     * @param data the string to decode
     */
    static decode(data: string): string
}/**
 * # Bookmark
 * 
 * Bookmark objects are used to work with folder bookmarks and the [[FileManager]] object to provide access to folders outside the Drafts App Sandbox. Bookmarks are unique by name. A user-friendly name should be used, as the first time a bookmark is required, the user is prompted to select the folder in their file system to associate with the bookmark, and a useful name can help guide them to selecting the correct folder.
 * 
 * _Learn more about [Bookmarks in the User Guide](https://docs.getdrafts.com/docs/settings/bookmarks)_
 *
 * ### Example
 * 
 * ```javascript
 * // find or create a named Bookmark
 * let bookmark = Bookmark.findOrCreate("My-Folder");
 * let fm = FileManager.createForBookmark(bookmark);
 * 
 * // write to a file at the root of the bookmark folder
 * let success = fm.writeString("/ScriptedFile.txt", "This is the file  * content");
 * 
 * // read from file in bookmarked folder
 * let content = fm.readString("/Test Folder/Test.txt") 
 * ```
 */
declare class Bookmark {
    /**
     * Get a bookmark object with the specified name. If no bookmark with the specified name exists, a new one will be created.
     */
    static findOrCreate(name: string): Bookmark

    /**
    * The name of the bookmark.
    */
    readonly name: string

    /**
     * Forget the bookmark, resetting any associated permissions. Generally, this would be a function the user performs in the user interface, but could be useful in the case of an action which wishes to request and use a one-time bookmark and revoke permissions on completion of an action.
     */
    forget()

}

/**
 * # Box
 * 
 * Box objects can be used to work with files in a Box.com account.
 *
 * ### Examples
 * 
 * ```javascript
 * // create Box object
 * var drive = Box.create();
 * 
 * // setup variables
 * var path = "/test/file.txt";
 * var content = "text to place in file";
 * 
 * // write to file on Box
 * var success = drive.write(path, content, false);
 * 
 * if (success) { // write worked!
 *   var driveContent = drive.read(path);
 *   if (driveContent) { // read worked!
 *     if (driveContent == content) {
 *       alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(drive.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(drive.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class Box {
    readonly lastError?: string

    /**
     * Reads the contents of the file at the path as a string. Returns `undefined` value if the file does not exist or could not be read. Paths should begin with a `/` and be relative to the root directory of your Box.com account.
     * @param path
     */
    read(path: string): string

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Paths should begin with a `/` and be relative to the root directory of your Box
     * @param content Text to place in the file.
     * @param overwrite If false, an existing file will not be overwritten.
     */
    write(path: string, content: string, overwrite?: boolean): boolean

    /**
     * Creates a new Box object. Identifier is a optional string value used to identify a Box.com account. Typically this can be omitted if you only work with one Box.com account in Drafts.
     */
    static create(identifier?: string): Box

    /**
    * Create new instance.
    */
    constructor(identifier?: string)
}
/**
 * # Calendar
 * 
 * Calendar objects are used to manipulate and create calendars in the built-in Calendars app and its associated accounts.
 * 
 * #### Example: Event Creation
 * 
 * ```javascript
 * var calendar = Calendar.findOrCreate("Activities");
 * var event = calendar.createEvent();
 * event.title = "Dinner Party";
 * event.notes = "Bring side dish.";
 * event.startDate = Date.parse("7pm next friday");
 * event.endDate = Date.parse("10pm next friday");
 * event.isAllDay = false;
 * if (!event.update()) {
 *   console.log(event.lastError);
 * }
 * ```
 * 
 * # Example: Reading Calendar Events
 * 
 * ```javascript
 * // load a calendar
 * let cal = Calendar.find("Test");
 * // loop over events in the last 30 days and alert the name of each.
 * if (cal) {
 * 	let events = cal.events((30).days().ago(), new Date());
 * 	for (let event of events) {
 * 		alert(event.title);
 * 	}
 * }
 * ```
 */
declare class Calendar {
    title: string
    /**
     * A Boolean value that indicates whether you can add, edit, and delete items in the calendar.
     */
    allowsContentModificationx: boolean
    /**
     * A Boolean value indicating whether the calendar’s properties can be edited or deleted.
     */
    isImmutable: boolean

    /**
     * Save changes to the calendar.
     */
    update(): boolean

    /**
     * Create a new Event object in this calendar.
     */
    createEvent(): Event

    /**
     * Returns array of events on the calendar between the start and end dates specified.
     */
    events(startDate: Date, endDate: Date): Event[]

    /**
     * Searches for a calendar matching the title. If none is found, creates a new list with that title in your default calendars account. If more than one calendar with the same name exist in Calendars, the first found will be returned.
     */
    static findOrCreate(title: string): Calendar

    /**
     * Searches for a calendar matching the title. If none is found, return `undefined`.
     */
    static find(title: string): Calendar | undefined

    /**
     * Get an array all known calendars on the device.
     */
    static getAllCalendars(): Calendar[]

    /**
     * Returns the system default calendar configured for new events.
     */
    static default(): Calendar
}

/**
 * # CallbackURL
 * 
 * CallbackURL objects can be used to open x-callback-url requests and wait for a response from the target app.
 * 
 * **NOTE**: If you want to open a URL in Safari or another app and do not need a response or x-callback-url support, use the `app.openURL(url)` method on the App object.
 *
 * ### Example
 * 
 * ```javascript
 * // Open callback URL for each line in a draft
 * // Setup base Fantastical URL, with no parameters
 * const baseURL = "fantastical2://x-callback-url/parse/";
 * 
 * // split draft and loop over lines
 * var lines = draft.content.split("\n");
 * for (var line of lines) {
 * 	// create and configure callback object
 * 	var cb = CallbackURL.create();
 * 	cb.baseURL = baseURL;
 * 	cb.addParameter("sentence", line);
 * 	// open and wait for result
 * 	var success = cb.open();
 * 	if (success) {
 * 		console.log("Event created");
 * 	}
 * 	else { // something went wrong or was cancelled
 * 	  	console.log(cb.status);
 * 	  	if (cb.status == "cancelled") {
 * 			context.cancel();
 * 		}
 * 		else {
 * 			context.fail();
 * 		}
 * 	}
 * }
 * ```
 */
declare class CallbackURL {
    /**
     * The baseURL of the request. This should include the x-callback-url base URL and action, typically something like `app-scheme://x-callback-url/actionName`
     */
    baseURL: string

    /**
     * The current URL. This is provided as a debugging property, and will output the URL including the baseURL property with any configured parameters added. This property will differ from the actual URL opened when calling `open()` in that it will not contain the `x-success`, `x-error` and `x-cancel` parameters which are added dynamically at the time `open()` is called. 
     */
    url: string

    /**
     * If true, the script will pause and wait for the `x-success`, `x-error` or `x-cancel` response from the app being targeted by the URL. If false, execution of the script/action will continue immediately and no response/results will be available.
     */
    waitForResponse: boolean

    /**
     * Object containing string keys and values to be appended to the base url as query parameters. Values should not be pre-encoded, but will be encoded and added to the base URL automatically. Do not include x-callback parameters (`x-success`, `x-error`, `x-cancel`) as these will be generated by Drafts.
     */
    parameters: { [x: string]: any }

    /**
     * The current status of the callback. Used to check outcome after open is called. Possible values:
     * * created: open has not yet been called.
     * * success: x-success callback was received from target app.
     * * cancelled: x-cancel callback was received from target app.
     * * error: x-error callback was received from target app.
     * * timeout: Waiting for the response timed out without receiving a callback URL from the target app.
     * * invalid: The URL was invalid and could not be opened.
     */
    status: 'created' | 'success' | 'cancelled' | 'error' | 'timeout' | 'invalid'

    /**
     * An object contain and URL query parameters returned by the target app along with it’s callback response. For example, if the target app called x-success with the query parameters `result=MyTestText`, callbackResponse would contain `{"result": "MyTestText"}`.
     */
    callbackResponse: { [x: string]: any }

    /**
     * Opens the URL with associated parameters, and waits for a callback response. Returns true if an x-success response was received from the target app, otherwise false. If false, use the "status" property to determine the type of failure.
     */
    open(): boolean

    /**
     * Add a query parameter for the outgoing URL.
     * FIXME: can the value be anything?
     */
    addParameter(key: string, value: any): void

    /**
     * Creates a new CallbackURL object.
     */
    static create(): CallbackURL

    /**
     * Create new instance.
     */
    constructor()

}

/**
 * # Context
 * 
 * A single global "context" object is available to scripts to control flow of the currently running action.
 *
 * It is important to understand that `cancel()` and `fail()` will not immediately stop script, just stop any further action steps from being performed.
 *
 * ### Example: Control Flow
 * 
 * ```javascript
 * // test for logical condition before continuing
 * if (!validationCondition) {
 *   context.fail();
 * }
 * // code below will still run.
 * ```
 * 
 * ### Example: Retreive values
 * 
 * ```javascript
 * // if a "Run Workflow" step preceded this script, lets look for a result
 * var response = context.callbackResponses[0];
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
declare const context: Context

/**
 * # Credential
 * 
 * Credential objects can be used in actions which require the user to provide a username, password and optionally a host name, to connect to a service. By using credentials objects, actions can be written to connect to arbitrary web services without hard coding credentials into the action.
 *
 * When an authorize() call is made on a credential object for the first time, the user is prompted to enter their credentials, then Drafts stores those for later use. When the action is used again, there will be no prompt required and the stored credentials will be used.
 *
 * Credentials objects have unique identifiers, and a single set of user credentials can be used across actions by using the same identifier.
 *
 * The user can delete those credentials at any time by visiting Settings > Credentials and tapping the "Forget" button on a service.
 *
 * ### Example
 * 
 * ```javascript
 * var credential = Credential.create("My Service", "Description of the service to  * appear in user prompt.");
 * 
 * credential.addTextField("username", "Username");
 * credential.addPasswordField("password", "Password");
 * 
 * credential.authorize();
 * 
 * var http = HTTP.create();
 * var response = http.request({
 *   "url": "http://myurl.com/api",
 *   "username": credential.getValue("username"),
 *   "password": credential.getValue("password"),
 *   "method": "POST",
 *   "data": {
 *     "key":"value"
 *   },
 *   "headers": {
 *     "HeaderName": "HeaderValue"
 *   }
 * });
 * 
 * ```
 */
declare class Credential {
    /**
     * Create a credential object with the specified identifier and description. Identifiers should be unique, such that any two calls from different actions with the same identifier will return the same credentials
     * @param identifier Unique identifier for the credentials
     * @param description Optional description
     */
    static create(identifier: string, description?: string): Credential

    /**
     * Create credential already configured with username and password fields.
     * @param identifier Unique identifier for the credentials
     * @param description Optional description
     */
    static createWithUsernamePassword(
        identifier: string,
        description: string
    ): Credential

    /**
     * Create credential already configured with host url, username and password fields.
     * @param identifier Unique identifier for the credentials
     * @param description Optional description
     */
    static createWithHostUsernamePassword(
        identifier: string,
        description: string
    ): Credential

    /**
     * Create new instance.
     * @param identifier Unique identifier for the credentials
     * @param description Optional description
    */
    constructor(identifier: string, description?: string)
    
    /**
     * Call this function after configuring, but before using host, username or password properties of a credential. If the credential object has not be previous authorized, the user will be prompted to enter their credentials before continuing. If the user has previously been prompt, this method will load previously provided information.
     */
    authorize(): boolean

    /**
     * Get the value the user stored for the key, as defined in a call to add the field.
     */
    getValue(key: string): string

    /**
     * Add a text field for data entry.
     * @param key used to retrieve the value
     * @param label label is displayed to the user
     */
    addTextField(key: string, label: string): void

    /**
     * Add a secure entry text field for data entry.
     * @param key used to retrieve the value
     * @param label label is displayed to the user
     */
    addPasswordField(key: string, label: string): void

    /**
     * Add a text field for configured for URL data entry.
     * @param key used to retrieve the value
     * @param label label is displayed to the user
     */
    addURLField(key: string, label: string): void

    /**
     * Deletes the credentials provided by the user. This is the same as the user visiting settings and tapping "Forget" for the credentials.
     */
    forget(): void
}
/**
 * # Device
 * 
 * Drafts defines a single global `device` object which provides access to information about the current device.
 * 
 * ### Examples
 * 
 * ```javascript
 * // get system info from device object
 * var model = device.model;
 * var system = device.systemName;
 * var osVersion = device.systemVersion;
 * var batteryLevel = device.batteryLevel;
 * 
 * // create and display it in an alert
 * var s = "Model: " + model + "\n";
 * s = s + "System: " + system + "\n";
 * s = s + "OS: " + osVersion + "\n";
 * s = s + "Battery: " + batteryLevel;
 * alert(s);
 * 
 * // branch logic based on platform
 * if (device.systemName == 'macOS') {
 *     // do something only on Mac
 * }
 * else {
 *     // do something only on iOS
 * }
 * ```
 */
declare class Device {
    /**
     * Model of current device.
     */
    model: 'iPhone' | 'iPad' | 'Mac' 

    /**
     * Name of current OS.
     */
    systemName: 'iOS' | 'macOS'

    /**
     * Version of current OS.
     */
    systemVersion: string

    /**
     * Current battery level as a number between 0.0 and 1.0
     */
    batteryLevel: number
}
/**
 * Current device.
 */
declare const device: Device
type draftFolderTab = 'inbox' | 'flagged' | 'archive' | 'trash' | 'all'
/**
 * # Draft 
 * 
 * The Draft object represents a single draft. When an action is run, the current draft is available as the global variable `draft`. Scripts can also create new drafts, access and set values, and update the draft to persist changes.
 * 
 * ### Example: Creating a draft
 * 
 * ```javascript
 * // create a new draft, assign content and save it
 * let d = new Draft();
 * d.content = "My new draft";
 * d.addTag("personal");
 * d.update();
 * ```
 * 
 * ### Example: Querying drafts
 * 
 * ```javascript
 * // query a list of drafts in the inbox with the tag "blue"
 * let drafts = Draft.query("", "inbox", ["blue"])
 * ```
 */
declare class Draft {
    /**
     * Create new instance.
     */
    constructor()

    /**
     * Unique identifier.
     */
    readonly uuid: string

    /**
    * The full text content.
    */
    content: string

    /**
     * The first line.
     */
    readonly title: string

    /**
    * Generally, the first line of the draft, but cleaned up as it would be displayed in the draft list in the user interface, removing Markdown header characters, etc.
    */
    readonly displayTitle: string

    /**
    * The lines of content separated into an array on `\n` line feeds. This is a convenience method an equivalent to `content.split('\n');`
    */
    readonly lines: [string]

    /**
     * Return the a trimmed display version of the "body" of the draft (content after first line), similar to what is displayed as a preview in the draft list._
     */
    bodyPreview(maxLength: number): string

    /**
     * @category Deprecated
     * @deprecated use `syntax` property.
     */
    languageGrammar:
        | 'Plain Text'
        | 'Markdown'
        | 'Taskpaper'
        | 'JavaScript'
        | 'Simple List'
        | 'MultiMarkdown'
        | 'GitHub Markdown'

    /**
     * The syntax definition used when displaying this draft in the editor.
     */
    syntax?: Syntax

    /**
     * The index location in the string of the beginning of the last text selection.
     */
    readonly selectionStart: number

    /**
     * The length of the last text selection.
     */
    readonly selectionLength: number

    /**
     * Array of string tag names assigned.
     * @category Tag
     */
    readonly tags: string[]

    /**
     * Is the draft current in the archive. If `false`, the draft is in the inbox.
     */
    isArchived: boolean

    /**
     * Is the draft currently in the trash.
     */
    isTrashed: boolean

    /**
     * Current flagged status.
     */
    isFlagged: boolean

    /**
     * Date the draft was created. This property is generally maintained by Drafts automatically and is it not recommended it be set directly unless needed to maintain information from an external source when importing.
     * @category Date
     */
    createdAt: Date
    /**
     * Numeric longitude where the draft was created. This value will be `0` if no location information was available.
     * @category Location
     */
    createdLongitude: number
    /**
     * Numeric latitude where the draft was created. This value will be `0` if no location information was available.
     * @category Location
     */
    createdLatitude: number
    /**
     * Date the draft was last modified. This property is generally maintained by Drafts automatically and is it not recommended it be set directly unless needed to maintain information from an external source when importing.
     * @category Date
     */
    modifiedAt: Date
    /**
    * Numeric longitude where the draft was last modified. This value will be `0` if no location information was available.
    * @category Location
    */
    modifiedLongitude: number
    /**
    * Numeric longitude where the draft was last modified. This value will be `0` if no location information was available.
    * @category Location
    */
    modifiedLatitude: number

    /**
     * URL which can be used to open the draft. URLs are cross-platform, but specific to an individual user's drafts datastore.
     */
    readonly permalink: string

    /**
     * Save changes made to the draft to the database. _`update()` must be called to save changes made to a draft._
     */
    update(): void

    /**
    * Assign a tag
    * @category Tag
    */
    addTag(tag: string): void

    /**
     * Remove a tag if it is assigned to the draft.
     * @category Tag
     */
    removeTag(tag: string): void

    /**
     * Check whether a tag is currently assigned to the draft.
     * @category Tag
     */
    hasTag(tag: string): boolean

    /**
     * Runs the template string through the [Drafts Template](https://docs.getdrafts.com/docs/actions/templates/drafts-templates) engine to evaluate tags.
     * @category Template
     */
    processTemplate(template: string): string

    /**
     * Runs the template string through the [Mustache template](https://docs.getdrafts.com/docs/actions/templates/mustache-templates) engine to evaluate tags. Allows additional values and partials to be provided to the context.
     * @param template Template string
     * @param additionalValues An object containing additional values you wish to make available in the Mustache context.
     * @param partials An object containing string keys and values which will contain additional templates you which to make available for use as partials and layouts.
     * @category Template
     */
    processMustacheTemplate(template: string, additionalValues: Object, partials: Object): string

    /**
     * Set a custom template tag value for use in templates. For example, calling `setTemplateTag("mytag", "mytext")` will create a tag `[[mytag]]`, which subsequent action steps in the same action can use in their templates. These values are also available in Mustache templates, but as `{{mytag}}`.
     * @category Template
     */
    setTemplateTag(tagName: string, value: string): void

    /**
     * Get the current value of a custom template tag.
     * @category Template
     */
    getTemplateTag(tagName: string): string

    /**
     * Append text to the end of the draft's `content`. This is a convenience function.
     * @param text The text to append
     * @param separator An optional separator string to use between content and added text. Defaults to a single line feed.
     */
    append(text: string, separator?: string): void

    /**
     * Prepend text to the beginning of the draft's `content`. This is a convenience function.
     * @param text The text to prepend
     * @param separator An optional separator string to use between content and added text. Defaults to a single line feed.
     */
    prepend(text: string, separator?: string): void

    /**
     * Array of versions representing the entire saved version history for this draft.
     * @category ActionLog
     */
    readonly actionLogs: ActionLog[]

    /**
     * Array of versions representing the entire saved version history for this draft.
     * @category Version
     */
    readonly versions: Version[]

    /**
     * Create a version in the version history representing the current state of the draft.
     * @category Version
     */
    saveVersion()

    /**
     * Create a new draft object. This is an in-memory object only, unless "update()" is called to save the draft.
     */
    static create(): Draft

    /**
     * Find an existing draft based on UUID.
     * @category Querying
     */
    static find(uuid: string): Draft

    /**
     * Perform a search for drafts and return an array of matching draft objects.
     * @param queryString Search string, as you would type in the search box in the draft list. Will find only drafts with a matching string in their contents. Use empty string (`""`) not to filter.
     * @param filter Filter by one of the allowed values
     * @param tags Results will only include drafts with one or more of these tags assigned.
     * @param omitTags Results will omit drafts with any of these tags assigned.
     * @param sort
     * @param sortDescending If `true`, sort descending. Defaults to `false`.
     * @param sortFlaggedToTop If `true`, sort flagged drafts to beginning. Defaults to `false`.
     * @category Querying
     */
    static query(
        queryString: string,
        filter: 'inbox' | 'archive' | 'flagged' | 'trash' | 'all',
        tags: string[],
        omitTags: string[],
        sort: 'created' | 'modified' | 'accessed',
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): Draft[]

    /**  
    * Search for drafts containing the title string in the first line of their content. This mimics the logic used by the `/open?title=Title` URL scheme to locate drafts by title when triggering embedded [cross-links](https://docs.getdrafts.com/docs/drafts/cross-linking).
    * @category Querying
    */
    static queryByTitle(title: string): Draft[]

    /**
     * Return array of recently used tags. Helpful for building prompts to select tags.
     * @category Tag
     */
    static recentTags(): string[]
}
/**
 * When an action is run, a single draft is always in context and accessible via the `draft` const. This usually points to the draft loaded in the editor at the time the action was run if running actions from the action list or action bar. 
 */
declare const draft: Draft

type dropboxMode = 'add' | 'overwrite'

interface DropboxRequestSettings {
    /**
     * The full URL to the RPC endpoint in the [Dropbox API](https://www.dropbox.com/developers/documentation/http/documentation). RPC endpoint are typically on the `api.dropboxapi.com` domain.
     */
    url: string,
    /**
    * The HTTP method, like "GET", "POST", etc.
    */
    method: string,
    /** 
     * An object contain key-values to be added as custom headers in the request. 
     */
    headers?: { [x: string]: string },
    /** Query parameters to merge with the url. Query parameters can also be part of the original url value. */
    parameters?: { [x: string]: string },
    /** An object containing data to be encoded into the HTTP body of the request. */
    data?: { [x: string]: string },
    /** An object containing the parameters to encode in the `dropbox-api-args` header, per API documentation. Drafts will take care of properly ASCII escaping values. Required only for `contentUploadRequest` and `contentDownloadRequest` functions. */
    'dropbox-api-args'?: { [x: string]: string },
}

/**
 * # Dropbox
 * 
 * Dropbox objects can be used to work with files in a [Dropbox](http://dropbopx.com) account. The `read` and `write` methods are simple wrappers for uploading and reading content of files on Dropbox.
 * 
 * For advanced uses, the `rpcRequest`, `contentUploadRequest` and `contentDownloadRequest` methods enable direct use of any Dropbox API 2.0 endpoints. These methods are an advanced feature which return raw results from the Dropbox API and may require advanced understanding of the API to process the results. They do enable full access to the API, however, which enabled things like querying files, listing folder contents, uploading to Paper, etc. For details on availalbe methods, see [Dropbox API documentation](https://www.dropbox.com/developers/documentation/http/overview).  In the case of all of these methods Drafts takes care of the OAuth request signing and authentication process when necessary.
 * 
 * ### Example
 * 
 * ```javascript
 * // create Dropbox object
 * var db = Dropbox.create();
 *
 * // setup variables
 * var path = "/test/file.txt";
 * var content = "text to place in file";
 *
 * // write to file on Dropbox
 * var success = db.write(path, content, "add", true);
 *
 * if (success) { // write worked!
 *   var dbContent = db.read(path);
 *   if (dbContent) { // read worked!
 *     if (dbContent == content) {
 *      alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(db.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(db.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class Dropbox {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the with the file name, in the parent folder, as a string. Returns `undefined` value if the file does not exist or could not be read.
     * @param path Path related to root of Dropbox folder.
     */
    read(path: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Path related to root of Dropbox folder.
     * @param content Text to write to file.
     * @param mode Either "add" or "overwrite" to determine if the write method should overwrite an existing file at the path if it exists.
     * @param autorename
     */
    write(path: string, content: string, mode: dropboxMode, autorename: boolean): boolean

    /**
     * Execute a request against the Dropbox API for an [endpoint of RPC type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Dropbox as appropriate to the request made. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request.
     */
    rpcRequest(settings: DropboxRequestSettings): HTTPResponse 

    /**
     * Execute a request against the Dropbox API for an [endpoint of Content Upload type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Dropbox as appropriate to the request made. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request.
     */
    contentUploadRequest(settings: DropboxRequestSettings): HTTPResponse

    /**
     * Execute a request against the Dropbox API for an [endpoint of Content Download type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an raw data in the `responseData` property and, if the data can be converted to a string value, the text version in the `responseText` property. The HTTPResponse `otherData` property will contain a Javascript object decoded from the JSON returned in the `Dropbox-API-Result` header. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request. 
     */
    contentDownloadRequest(settings: DropboxRequestSettings): HTTPResponse

    /**
     * Creates a new Dropbox object.
     * @param identifier used to identify a Dropbox account. Typically this can be omitted if you only work with one Dropbox account in Drafts.
     */
    static create(identifier?: string): Dropbox
    
    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * An array of numbers containing the location (index in string), and length (number of characters) of a text selection.
 */
type selectionRange = Array<number>
/**
 * An object describing a navigation location, as defined by the syntax definition in use in the editor
 */
type navigationMarker = {
    /**
     * The start location of the range of text representing the marker.
     */
    location: number,
    /**
    * The number of characters in the range.
    */
    length: number,
    /** 
     * Prefix text for the marker. Example: `H1`, `H2` in Markdown
     */
    prefix: string,
    /** 
     * Label text for the marker.
     */
    label: string,
    /** 
     * Indentation level of the marker.
     */
    level: number,
}
/**
 * # Editor 
 * 
 * A global `editor` object is available in all action scripts. This object allows manipulation of the main editing window in Drafts, altering the text, text selections, or loading a different draft into the editor, etc.
 * 
 * Typically scripting actions that work like custom keyboard commands and similar will utilize the editor functions to manipulate text.
 * 
 * **NOTE:** _Generally speaking, editor methods are best used for quick text manipulations of the type used in the extended keyboard. Most substantial updates to draft content are better applied using the `draft` object._
 * 
 * 
 */
declare class Editor {
    /**
     * @deprecated replaced by `pinningEnabled`.
     * @category Deprecated
     */
    focusModeEnabled: boolean

    /**
     * Access or set current pinning status for editor.
     */
    pinningEnabled: boolean

    /**
     * Returns the current tab string is use. This could be 2 spaces, 4 spaces, or `\t` depending on the editor preferences for the current syntax. Useful in actions, such as indent/outdent actions, which need to insert or remove indentation and want to match the options of the current syntax.
     */
    preferredTabString: string

    /**
     * Access or set current link mode status.
     */
    linkModeEnabled: boolean

    /**
     * Access or set current typewriter scrolling status.
     */
    typewriterScrollingEnabled: boolean

    /**
     * Is editor current focused for editing.
     */
    isActive: boolean

    /**
     * Array of recent drafts. This is the same list as used in the navigation features of the editor, and is in reverse order, so that the first index in the array is the previous draft loaded in the editor.
     */
    recentDrafts: [Draft]

    // FUNCTIONS
    /**
    * Creates a new blank draft and loads it into the editor.
    */
    new(): void

    /**
    * Loads an existing draft into the editor.
    */
    load(draft: Draft): void

    /**
    * Save any current changes to the draft.
    */
    save(): void

    /**
    * Apply undo action to editor, if one is available.
    */
    undo(): void

    /**
    * Apply redo action to editor, if one is available.
    */
    redo(): void

    /**
    * Request focus for the editor. This will dismiss other views and show the keyboard on the currently loaded draft. Useful if an action opens user interface elements or otherwise causes the editor to resign focus and you would like to return to editing at the end of the action's execution.
    */
    activate(): void

    /**
    * Resign focus for the editor. If the editor text view is currently focused for editing (e.g. showing keyboard), resign focus.
    */
    deactivate(): void

    /**
    * Open arrange mode in editor. This is a non-blocking method and returns immediately. It is intended only to mimic the tapping of the arrange button. Use `editor.arrange(text)` to wait for a result.
    */
    showArrange(): void

    /**
    * Opens the arrange mode view with the passed text for arranging. Returns the arranged text if the user makes changes and taps "Done", the original text if the user cancels.
    * @param text The text to arrange
    * @returns String containing result of arrange. If user cancels, it will be the same as the original text passed.
    */
    arrange(text: string): string

    /**
    * Open find mode in editor.
    */
    showFind(): void

    /**
    * Open dictation mode in editor. This is a non-blocking method and returns immediately. It is intended only to mimic the tapping of the dictate button. Use `editor.dictate()` to wait for a result and use it in further scripting.
    */
    showDictate(): void

    /**
    * Open dictation interface, and return the result as a string. The string will be empty if user cancels.
    * @param locale the preferred locale can be passed in the format "en-US" (U.S. English), "it-IT" (Italian-Italian), "es-MX" (Mexican Spanish), etc.
    * @returns The accepted dictation text.
    */
    dictate(locale?: string): string

    /**
    * Open document scanning camera to scan documents and OCR, returning the result as a string. The string will be empty if user cancels, or document scanning is not available.
    * @returns The text recognized in the OCR of the scanned document.
    */
    scanDocument(): string

    /**
    * Open Opens audio transcription window. If file is selected and transcribed, returns text.
    * @returns The text recognized in the audio transcription.
    */
    transcribe(): string

    /**
    * Get the full text currently loaded in the editor.
    */
    getText(): string

    /**
    * Replace the contents of the editor with a string.
    */
    setText(text: string): void

    /**
    * Get text range that was last selected.
    */
    getSelectedText(): string

    /**
    * Replace the contents of the last text selection with a string.
    */
    setSelectedText(text: string): void

    /**
    * Get the current selected text range extended to the beginning and end of the lines it encompasses.
    */
    getSelectedLineRange(): selectionRange

    /**
    * Get text range that was last selected.
    */
    getSelectedRange(): selectionRange

    /**
    * Expand the range provided to the nearest beginning and end of the lines it encompasses.
    */
    getLineRange(location: number, length: number): selectionRange

    /**
    * Update the text selection in the editor by passing the start location and the length of the new selection.
    */
    setSelectedRange(location: number, length: number): void

    /**
    * Get the substring in a range from the text in the editor.
    */
    getTextInRange(location: number, length: number): string

    /**
    * Replace the text in the passed range with new text.
    */
    setTextInRange(location: number, length: number, text: string): void

    /**
    * Array of navigation markers in the text. Navigation markers are defined by the syntax definition in use in the editor, and are used in the [Navigation](https://docs.getdrafts.com/docs/editor/navigation) feature. 
    */
    navigationMarkers: [navigationMarker]

    /**
    * The next navigation marker in the editor, relative to the character location. This is a convenience method to assist in navigating by marker.
    */
    navigationMarkerAfter(location: number): navigationMarker
    /**
    * The previous navigation marker in the editor, relative to the character location. This is a convenience method to assist in navigating by marker.
    */
    navigationMarkerBefore(location: number): navigationMarker
}
/**
 * The active editor
 */
declare const editor: Editor/**
 * # Event
 * 
 * Event object represent individual calendar events. For usage examples, see [[Calendar]] object documentation.
 */
declare class Event {
    /**
     * The calendar which this event resides in.
     */
    calendar: Calendar

    /**
     * Unique identifier for the event
     */
    identifier: string

    /**
     * The title of the event.
     */
    title: string

    /**
     * Notes associated with the event.
     */
    notes: string

    /**
    * URL associated with the event. Setting URL value will fail if the value is not a valid URL.
    */
    url?: string

    /**
     * Start date of the event.
     */
    startDate: Date

    /**
     * End date of the event.
     */
    endDate: Date

    /**
     * Flag for all day events.
     */
    isAllDay: boolean

    /**
     * Location of the event.
     */
    location: string

    /**
     * Original creation date of the event.
     */
    readonly creationDate: Date

    /**
     * Last change to the event.
     */
    readonly lastModifiedDate: Date

    /**
     * Attendees of the event as an array of objects in the format:
     * 
     * ```
     * {
     *    "isCurrentUser": false,
     *    "name": "John Appleseed",
     *    "status": "accepted",
     *    "type": "person",
     *    "role": "required"
     * }
     * ```
     */
    readonly attendees: Object[]

    /**
     * Availability for scheduling. Not supported by all Calendar servers.
     */
    availability: 'busy'
        | 'free'
        | 'tentative'
        | 'unavailable'
        | 'notSupported'

    /**
     * Returns true if the event has any alarms.
     */
    readonly hasAlarms: boolean

    /**
     * The alarms assigned to the event, if any.
     */
    alarms: Alarm[]

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Save the event. Returns true if the event is successfully saved in Calendars.
     */
    update(): boolean

    /**
     * Open the event in the system event editing card. The user will be able to modify/edit the event values and add to a calendar from this view. Returns true if the event was saved, false if the user canceled or deleted the event.
     */
    edit(): boolean

    /**
     * Add an alarm object to the event. Be sure to `update()` to save after adding alarms.
     */
    addAlarm(alarm: Alarm): void

    /**
     * Remove any assigned alarms from the event.
     */
    removeAllAlarms(): void
}/**
 * # FileManager
 * 
 * FileManager objects can be used to read from or write to files in either the local Drafts app Documents directory, or iCloud Drive (inside the `Drafts` folder).Note that local files are not visible on iOS, and are only available for reading and writing via scripting.
 *
 * ### Example
 * 
 * ```javascript
 * // create a local file in App documents
 * let fmLocal = FileManager.createLocal(); // Local file in app container
 * let success = fmLocal.writeString("/ScriptedFile.txt", "This is the file  * content");
 * 
 * // read from file in iCloud
 * let fmCloud = FileManager.createCloud(); // iCloud
 * let content = fmCloud.readString("/Test Folder/Test.txt")
 * 
 * // create a directory, and move a file to it
 * fmCloud.createDirectory("My Folder", "/");
 * fmCloud.moveItem("/TestFile.txt", "/My Folder/TestFile.txt", false);
 * 
 * // create file manager using a Bookmark
 * let bookmark = Bookmark.findOrCreate("My-Folder");
 * let fm = FileManager.createForBookmark(bookmark);
 * ```
 */
declare class FileManager {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Convenience method to create local file manager. Note that local files are not visible on iOS in the Files app and are only available through the use of scripting.
     * @category Constructors
     */
    static createLocal(): FileManager

    /**
     * Convenience method to create iCloud file manager. iCloud file managers work with files in the `iCloud Drive/Drafts` folder
     * @category Constructors
     */
    static createCloud(): FileManager

    /**
     * Convenience method to create a file manager linked to a [[Bookmark]] object.
     * @category Constructors
     */
    static createForBookmark(bookmark: Bookmark): FileManager

    /**
    * The base local URL (`file:///` format) to the directory used by this FileManager.
    */
    readonly baseURL: string

    /**
    * The base POSIX-style path to the directory used by this FileManager.
    */
    readonly basePath: string

    /**
     * Reads the contents of the file at the path. Returns `undefined` value if the file does not exist or could not be read.
     * @param path should begin with a `/` and be relative to the root directory of the FileManager.
     */
    readString(path: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     */
    writeString(path: string, content: string): boolean

    /**
     * Reads the contents of a JSON formatted file at the path. Returns `undefined` value if the file does not exist or could not be read and parsed as JSON. Contents could be an object, array of objects, etc., depending on the content of the JSON file.
     * @param path should begin with a `/` and be relative to the root directory of the FileManager.
    */
    readJSON(path: string): object | undefined

    /**
     * Write the contents to the path in JSON format. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     */
    writeJSON(path: string, content: object): boolean

     /**
     * Check if a file already exists at the given path.
     */
    exists(path: string): boolean

    /**
     * List files and directories at the specified path. Array of full path will be returned.
     */
    listContents(path: string): string[]

    /**
     * Create a directory with the specified name in the specified path. Returns true if directory successfully created.
     */
    createDirectory(name: string, path: string): boolean

    /**
     * Move file or directory at `fromPath` to the `toPath`. From and to path should be complete paths with file names included.
     * @param fromPath
     * @param toPath
     * @param overwrite If true, replace existing files in at the toPath. If false, abort operation if file exists at destination.
     */
    moveItem(fromPath: string, toPath: string, overwrite?: boolean): boolean

    /**
     * Copy file or directory at `fromPath` to the `toPath`. From and to path should be complete paths with file names included.
     * @param fromPath
     * @param toPath
     * @param overwrite If true, replace existing files in at the toPath. If false, abort operation if file exists at destination.
     */
    copyItem(fromPath: string, toPath: string, overwrite?: boolean): boolean

    /**
     * Get creation date of file at path.
     * @param path
     * @category Attribute
     */
    getCreationDate(path: string): Date

    /**
     * Get modification date of file at path.
     * @param path
     * @category Attribute
     */
    getModificationDate(path: string): Date

    /**
     * Set creation date of file at path. Returns true if successful, false if not.
     * @param path
     * @param date
     * @category Attribute
     */
    setCreationDate(path: string, date: Date): boolean

    /**
     * Set modification date of file at path. Returns true if successful, false if not.
    * @param path
    * @param date
    * @category Attribute
    */
    setModificationDate(path: string, date: Date): boolean

    /**
     * Set tags on the file at path.
     * @param path
     * @param tags
     * @category Attribute
     */
    setTags(path: string, tags: string[]): boolean

    /**
     * Get tags on file at path.
    * @param path
    * @param date
    * @category Attribute
    */
    getTags(path: string): string[]

    /**
     * Creates a new FileManager object.
     * @param isLocal If `true`, the `FileManager` will be using the to the local Drafts app documents directory as its root directory, as it appears in the "On my …" area in the `Files.app`. If `false`, it will use the Drafts5 iCloud folder as its root directory.
     * @category Constructors
     */
    static create(isLocal: boolean): FileManager
}

/**
 * # GitHubMarkdown
 * 
 * Drafts includes Discount-based, GitHub flavored Markdown parser based on [GHMarkdownParser](https://github.com/OliverLetterer/GHMarkdownParser). For details on the meaning of the various options, refer to [Markdown documentation](https://getdrafts.com/settings/markdown).
 *
 * ### Example
 * 
 * ```javascript
 * var inputString = "# Header\n\nMy **markdown** text";
 * var md = GitHubMarkdown.create();
 * 
 * var outputString = md.render(inputString);
 * ```
 */
declare class GitHubMarkdown {
    /**
     * Takes Markdown string passed and processes it with GitHub Markdown parser based on the property selections on the object.
     */
    render(markdownStr: string): string

    /**
     * defaults to true
     */
    smartQuotesEnabled: boolean
    /**
     * defaults to true
     */
    noImages: boolean
    /**
     * defaults to true
     */
    noLinks: boolean
    /**
     * defaults to true
     */
    safeLinks: boolean
    /**
     * defaults to false
     */
    autoLinks: boolean
    /**
     * defaults to false
     */
    strict: boolean
    /**
     * defaults to false
     */
    removeHTMLTags: boolean

    /**
     * create a new object.
     */
    static create(): GitHubMarkdown

    /**
     * Create new instance.
     */
    constructor()

}
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

/**
 * # GmailMessage
 * 
 * The GmailMessage object can be used to create and send mail messages through Gmail accounts, similar to those created by a [Gmail action step](https://getdrafts.com/actions/steps/gmail). Creating and sending these messages happens in the background, with no user interface, so messages must be complete with recipients before calling send(). Sending is done via the [Gmail API](https://developers.google.com/gmail/api/). Gmail accounts are authenticated when used for the first time using OAuth - to use more than one account, call create with different identifier parameters.
 *
 * ### Example
 * 
 * ```javascript
 * let message = GmailMessage.create();
 * message.toRecipients = ["joe@sample.com"];
 * message.subject = "My test message";
 * message.body = "Body text";
 * 
 * var success = message.send();
 * if (!success) {
 *   console.log("Sending gmail failed");
 *   context.fail();
 * }
 * ```
 */
declare class GmailMessage {
    /**
     * Array of email addresses to use as `To:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    toRecipients: string[]
    /**
     * Array of email addresses to use as `CC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    ccRecipients: string[]
    /**
     * Array of email addresses to use as `BCC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    bccRecipients: string[]

    subject: string

    /**
     * Body text of the mail message. Can be plain text or HTML if the `isBodyHTML` property is set to `true`.
     */
    body: string

    /**
     * whether to treat the body string and plain text or HTML. When set to `true`, the `body` property should be set to full valid HTML.
     */
    isBodyHTML: boolean

    /**
     * Send the mail message via the Gmail API.
     */
    send(): boolean

    /**
     * create a new object.
     * @param identifier notes which for Gmail account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): GmailMessage

    /**
     * Create new instance.
     */
    constructor(identifier?: string)    
}

/**
 * # GoogleDrive
 * 
 * GoogleDrive objects can be used to work with files in Google Drive accounts.
 * 
 * ### Example
 * 
 * ```javascript
 * // create GoogleDrive object
 * var drive = GoogleDrive.create();
 * 
 * // setup variables
 * var fileName = "MyTestFile";
 * var parent = ""; // root of drive
 * var content = "text to place in file";
 * 
 * // write to file on GoogleDrive
 * var success = drive.write(fileName, parent, content);
 * 
 * if (success) { // write worked!
 *   var driveContent = drive.read(fileName, parent);
 *   if (driveContent) { // read worked!
 *     if (driveContent == content) {
 *       alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(drive.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(drive.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class GoogleDrive {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the with the file name, in the parent folder, as a string. Returns `undefined` value if the file does not exist or could not be read.
     * @param fileName
     * @param parent Name of folder in the root of the Google Drive, or `""` for root. FIXME: optional?
     */
    read(fileName: string, parent: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param fileName
     * @param parent Name of folder in the root of the Google Drive, or `""` for root.
     * @param content Text to write to file.
     */
    write(fileName: string, parent: string, content: string): boolean

    /**
     * Creates a new GoogleDrive object.
     * @param identifier used to identify a GoogleDrive account. Typically this can be omitted if you only work with one GoogleDrive account in Drafts.
     */
    static create(identifier?: string): GoogleDrive

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * Represents Task for use with [[GoogleTask]] object. Property details available in [Task API reference](https://developers.google.com/tasks/reference/rest/v1/tasks)
 */
type googleTask = object

/**
 * Represents Task List for use with [[GoogleTask]] object. Property details available in [Task API reference](https://developers.google.com/tasks/reference/rest/v1/tasklists)
 */
type googleTaskList = object

/**
 * # GoogleTask
 * 
 * Script integration with [Google Tasks](https://support.google.com/tasks/answer/7675772?co=GENIE.Platform%3DDesktop&hl=en). This object handles OAuth authentication and request signing. The entire [Google Tasks API](https://developers.google.com/tasks) can be used with the `request` method, and convenience methods are provided for common API endpoints to manage tasks and lists.
 *
 * Working with the return values and parameters for these methods requires an understanding of the JSON objects created and returned by the API, so refer to type specifications in the [API Reference](https://developers.google.com/tasks) for details on values supported in task and lists. Specifically, review the supported properties of the [Task](https://developers.google.com/tasks/reference/rest/v1/tasks) and [TaskList](https://developers.google.com/tasks/reference/rest/v1/tasklists) objects to understand the values included in fetched objects, and to make modifications.
 *
 * If an convenince API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * ### Example
 * 
 * See [Examples-Google Task]() action group in the [Drafts Directory](https://actions.getdrafts.com/). It contains several example scripted actions.
 * 
 * ```javascript
 * // create GoogleTask object
 * let gtask = GoogleTask.create();
 * // create task in "Test" list
 * let list = gtask.findList("Test");
 * let t = {
 *     "title": "My Task",
 *     "notes": "My notes on this task"
 * };
 * let task = gtask.createTask(list, t);
 */
declare class GoogleTask {
    /**
     * If a function succeeds, this property will contain the last response returned by the Google Tasks API. The JSON returned by the API will be parsed to an object and placed in this property. Refer to [Google Tasks API documentation](https://developers.google.com/tasks) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // LISTS
    /**
     * Get all lists. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasklists/list)
     * @category Lists
     */
    getLists(): googleTaskList[] | undefined

    /**
     * Get specific list by name. This is a convenience method which will fetch lists and return the first one found with a matching name.
     * @category Lists
     */
    findList(name: string): googleTaskList | undefined

    /**
     * Create list by name.
     * @category Lists
     */
    createList(name: string): googleTaskList | undefined

    // TASKS
    /**
     * Get tasks in a list. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)
     * @category Tasks
     */
    getTasks(list: object): googleTask[] | undefined
    /**
     * Get task a specific task by ID. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)
     * @category Tasks
     */
    getTask(list: object, taskID: String): googleTask | undefined
    /**
     * Create new task in the specified list. Note that the API adds new tasks to the top of lists. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/insert)
     * @category Tasks
     */
    createTask(list: googleTaskList, task: googleTask): googleTask | undefined
    /**
     * Update an existing task. Typical usage would be to modify the contents of a task returned by `getTask` or `getTasks` and sending the modified version as an update [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/patch)
     * @category Tasks
     */
    updateTask(list: googleTaskList, task: googleTask): googleTask | undefined
    /**
     * Move an existing task. Parameters can include `parent` or `previous` values, which should be the taskID for other tasks in the same list. Use `parent` to make the task a sub-task of another task, and `previous` to place the task in order after the specified taskID. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/move)
     * @category Tasks
     */
    moveTask(list: googleTaskList, task: googleTask, params: object): object | undefined

    // FUNCTIONS

    /**
     * Execute a request against the [Google Task API](https://developers.google.com/tasks). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by the API as appropriate to the request made. Refer to API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * Requests should only be made to endpoints in the Google Tasks API which require the `https://www.googleapis.com/auth/tasks` authentication scope.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Google Tasks API](https://developers.google.com/tasks). */
        url: string
        /** The HTTP method, like "GET", "POST", "PATCH", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new GoogleTask object.
     * @param identifier Optional string value used to identify a To Do account. Typically this can be omitted if you only work with one Google Task account in Drafts. Each unique identifier used for To Do accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): GoogleTask

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * # HTML
 * 
 * Helper methods to escape and unescape HTML entities in a string.
 * 
 * _Added: R15_
 * 
 *  ### Examples
 * 
 * ```javascript
 * let s = "<One> & Two";
 * let escaped = HTML.escape(s); // "&#x3C;One&#x3E &#x26; Two"
 * let unescaped = HTML.unescape(encoded); // "<One> & Two"
 * ```
 */
declare class HTML {
    /**
     * Escape HTML entities in a string to be HTML safe.
     * @param string the string to escape
     */
    static escape(string: string): string

    /**
     * Unescape HTML entities in a string.
     * @param string the string to unescape
     */
    static unescape(string: string): string
}/**
 * # HTMLPreview
 * 
 * Display of HTML Preview window, the same as the HTMLPreview action step. Returns true if user closed preview with the "Continue" button, false if the user cancelled.
 * 
 * ### Example
 * 
 * ```javascript
 * let html = "<html><body>My Document</body></html>"
 * 
 * let preview = HTMLPreview.create();
 * if (preview.show(html)) {
 *   // continue button was pressed
 * }
 * else {
 *   // cancel button was pressed
 * }
 * ```
 */
declare class HTMLPreview {
    /**
     * Hides the toolbars and `Cancel` / `Continue` buttons in the  preview window. For use only when combined with JavaScript flow control in the HTML preview. See [docs]() for details.
     */
    hideInterface: boolean

    /**
     * Open HTML Preview window displaying the HTML string passed.
     * @param html The HTML content to display. Should be complete HTML document.
     */
    show(html: string): boolean

    /**
     * Create new instance.
     */
    static create(): HTMLPreview

    /**
     * Create new instance.
     */
    constructor()
}

/**
 * # HTTP
 * 
 * The [[HTTP]] and [[HTTPResponse]] objects are used to run synchronous HTTP requests to communicate with APIs, or just read pages from the web. A full set of custom settings can be passed, and all HTTP methods (GET, POST, PUT, DELETE, etc.) are supported.
 * 
 * ### Example
 * 
 * ```javascript
 * var http = HTTP.create(); // create HTTP object
 * 
 * var response = http.request({
 *   "url": "http://myurl.com/api",
 *   "method": "POST",
 *   "data": {
 *     "key":"value"
 *   },
 *   "headers": {
 *     "HeaderName": "HeaderValue"
 *   }
 * });
 * 
 * if (response.success) {
 *   var text = response.responseText;
 *   var data = response.responseData;
 * }
 * else {
 *   console.log(response.statusCode);
 *   console.log(response.error);
 * }
 * ```
 */
declare class HTTP {
    /**
     * @param settings An object configuring the request.
     */
    request(settings: {
        /**
         * The absolute HTTP URL for the request.
         */
        url: string,
        /**
        * The HTTP method, like "GET", "POST", etc.
        */
        method: string,
        /** An object contain key-values to be added as custom headers in the request. */
        headers?: { [x: string]: string },
        /** Query parameters to merge with the url. Query parameters can also be part of the original url value. */
        parameters?: { [x: string]: string },
        /** An object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string },
        /**
         * Format to encode `data` in the body of request.
         */
        encoding?: 'json' | 'form',
        /** A username to encode for Basic Authentication. */
        username?: string,
        /** A password to encode for Basic Authentication. */
        password?: string
    }): HTTPResponse

    /**
     * Instantiate an `HTTP` object.
     */
    static create(): HTTP

    /**
     * Create new instance.
     */
    constructor()    
}

/**
 * # HTTPResponse
 * 
 * HTTPResponse objects are returned by calls to HTTP methods. For usage details, see [[HTTP]] object.
 */
declare class HTTPResponse {
    /**
     * true/false for whether the request was completed successfully.
     */
    success: boolean

    /**
     * The HTTP status code (like 200, 301, etc.) returned.
     */
    statusCode: number

    /**
     * The raw data returned. Typically an object or array of objects, but exact content varies by server response.
     */
    responseData: any

    /**
     * The data returned as a string format.
     */
    responseText: string

    /**
     * Key-value dictionary containing any HTTP header information returned with the response. Useful for access cookie headers, etc.
     */
    headers: object

    /**
     * Some responses return additional data that is placed in this field.
     */
    otherData: string | undefined

    /**
     * If an error occurred, a description of the type of error.
     */
    error: string | undefined
}/**
 * # Mail
 * 
 * The Mail object can be used to create and send mail messages, similar to those created by a "Mail" action step.
 *
 * ### Example

 * ```javascript
 * var mail = Mail.create();
 * mail.toRecipients = ["joe@sample.com"];
 * mail.subject = "My test message";
 * mail.body = "Body text";
 * 
 * var success = mail.send();
 * if (!success) {
 *   console.log(mail.status);
 *   context.fail();
 * }
 * ```
 * 
 */

type mailStatus =        
    | 'created'
    | 'sent'
    | 'savedAsDraft'
    | 'mailUnavailable'
    | 'userCancelled'
    | 'invalid'
    | 'serviceError'
    | 'unknownError'

declare class Mail {
    /**
     * Array of email addresses to use as `To:` recipients.
     */
    toRecipients: string[]

    /**
     * Array of email addresses to use as `CC:` recipients.
     */
    ccRecipients: string[]

    /**
     * Array of email addresses to use as `BCC:` recipients.
     */
    bccRecipients: string[]

    /**
     * Subject line
     */
    subject: string

    /**
     * Body text of the mail message. Can be plain text or HTML if the `isBodyHTML` property is set to `true`.
     */
    body: string

    /**
     * whether to treat the body string and plain text or HTML. When set to `true`, the `body` property should be set to full valid HTML.
     */
    isBodyHTML: boolean

    /**
     * If `true`, the mail will be sent in the background using a web service rather than via Mail.app - but will come from `drafts5@drafts5.agiletortoise.com`. Defaults to `false`.
     */
    sendInBackground: boolean

    /**
     * Indicates if the message object has already been sent.
     */
    isSent: boolean

    /**
     * One of the following values:
     * * created: Initial value before `send()` has been called.
     * * sent: The message was sent successfully.
     * * savedAsDraft: On iOS, the user exited the Mail.app window saving as draft, but not sending.
     * * mailUnavailable: On iOS, Mail.app services were not available.
     * * userCancelled: The user cancelled the Mail.app window without sending.
     * * invalid: Mail object is invalid. Common cause if of this is sendInBackground being true, but no recipient configured.
     * * serviceError: Background mail service returned an error.
     * * unknownError: An unknown error occurred.
     */
    status: mailStatus
    
    /**
     * Send the mail message. This will open the `Mail.app` sending window. Returns `true` if the message was sent successfully or `false` if not - if, for example, the user cancelled the mail window.
     */
    send(): boolean

    /**
     * Create `Mail` object
     */
    static create(): Mail

    /**
     * Create new instance.
     */
    constructor()
}/**
 * # Medium
 * 
 * Script integration with [Medium.com](http://medium.com/). This object handles OAuth authentication and request signing. The entire [Medium REST API](https://github.com/Medium/medium-api-docs) can be used with the `request` method, and convenience methods are provided for common API endpoints to get user information, list publications and post.
 * 
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 */
declare class Medium {
    /**
     * If a function success, this property will contain the last response returned by Medium. The JSON returned by Medium will be parsed to an object and placed in this property. Refer to [Medium API documentation](https://github.com/Medium/medium-api-docs) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // Convenience
    /**
     * Get User information for current authenticated user. This will include the `id` property needed for other calls.
     */
    getUser(): object
    /**
     * Get list of publications for current authenticated user.
     */
    listPublications(userId: string): object[]
    /**
     * Create a post in the user's Medium stories. See [API docs](https://github.com/Medium/medium-api-docs) for details on what should be included in the options.
     * @param userId 
     * @param options 
     */
    createPost(userId: string, options: object): object

    // FUNCTIONS

    /**
     * Execute a request against the Medium API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Medium as appropriate to the request made. Refer to Medium API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Medium REST API](https://github.com/Medium/medium-api-docs). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Medium object.
     * @param identifier Optional string value used to identify a Medium account. Typically this can be omitted if you only work with one Medium account in Drafts. Each unique identifier used for Medium accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string)

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * # Message
 * 
 * The Message object can be used to create and send mail iMessages, similar to those created by a "Message" action step.   
 * ### Examples
 * 
 * ```javascript
 * var msg = Message.create();
 * msg.toRecipients = ["joe@sample.com"];
 * msg.subject = "My test message";
 * msg.body = "Body text";
 * 
 * var success = msg.send();
 * ```
 */
declare class Message {
    /**
     * Array of phone numbers and email addresses to use as `To:` recipients.
     */
    toRecipients: string[]
    /**
     * Subject line. Only used if subject is enabled in Messages settings on the device.
     */
    subject: string
    /**
     * Body text of the mail message.
     */
    body: string
    /**
     * true/false flag indicated if the message object has already been sent.
     */
    isSent: boolean

    /**
     * One of the following strings
     * * created: Initial value before `send()` has been called.
     * * sent: The message was sent successfully.
     * * messagesUnavailable: On iOS, Mail.app services were not available.
     * * userCancelled: The user cancelled the Mail.app window without sending.
     * * unknownError: An unknown error occurred.
     */
    status:
        | 'created'
        | 'sent'
        | 'messagesUnavailable'
        | 'userCancelled'
        | 'unknownError'

    /**
     * Send the message. This will open the `Messages.app` sending window. Returns `true` if the message was sent successfully or `false` if not - if, for example, the user cancelled the message window.
     */
    send(): boolean

    /**
     * Instantiate `Message` object
     */
    static create(): Message

    /**
     * Create new instance.
     */
    constructor()
}/**
 * Represents Task for use with [[MicrosoftToDo]] object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/todotask?view=graph-rest-1.0)
 */
type microsoftToDoTask = object

/**
 * Represents Task List for use with [[MicrosoftToDo]] object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/todotasklist?view=graph-rest-1.0)
 */
type microsoftToDoTaskList = object

/**
 * Represents Linked Resource for use with [[MicrosoftToDo]] object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/linkedresource?view=graph-rest-1.0)
 */
type microsoftToDoLinkedResource = object

/**
 * # MicrosoftToDo
 * 
 * Script integration with [Microsoft To Do](http://todo.microsoft.com/). This object handles OAuth authentication and request signing. The entire [Microsoft To Do Graph API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) can be used with the `request` method, and convenience methods are provided for common API endpoints to manage tasks and lists.
 *
 * Working with the return values and parameters for these methods requires an understanding of the JSON objects created and returned by the API, so refer to type specifications in the [API Reference](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) for details on values supported in task and lists. Specifically, review the supported properties of the [Task](https://docs.microsoft.com/en-us/graph/api/resources/todotask?view=graph-rest-1.0) and [TaskList](https://docs.microsoft.com/en-us/graph/api/resources/todotasklist?view=graph-rest-1.0) objects to understand the values included in fetched objects, and to make modifications.
 *
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * ### Example
 * 
 * See [Examples-Microsoft To Do](https://actions.getdrafts.com/g/1m3) action group in the [Drafts Directory](https://actions.getdrafts.com/). It contains several example scripted actions.
 * 
 * ```javascript
 * // create MicrosoftToDo object
 * let todo = MicrosoftToDo.create();
 * // create task in "Test" list
 * let list = todo.findList("Test");
 * // create task object, more properties available, see API docs
 * let task = {
	"title": `Task Title`,
	"importance": "high",
    "body": {
        "content": "Notes for the task",
        "contentType": "text"
    };
	"dueDateTime": {
		"dateTime": Date.today().addDays(1).toISOString(),
		"timeZone": "UTC"
	}
};
 * let t = todo.createTask(list, task);
 */
declare class MicrosoftToDo {
    /**
     * If a function succeeds, this property will contain the last response returned by the To Do API. The JSON returned by the API will be parsed to an object and placed in this property. Refer to [To Do API documentation](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // LISTS
    /**
     * Get all lists. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-list-tasks?view=graph-rest-1.0&tabs=http)
     * @category Lists
     */
    getLists(): microsoftToDoTaskList[] | undefined

    /**
     * Get specific list by name. This is a convenience method which will fetch lists and return the first one found with a matching name.
     * @category Lists
     */
    findList(name: string): microsoftToDoTaskList | undefined

    /**
     * Create list by name.
     * @category Lists
     */
    createList(name: string): microsoftToDoTaskList | undefined

    // TASKS
    /**
     * Get tasks in a list. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-get?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    getTasks(list: microsoftToDoTaskList): microsoftToDoTask[] | undefined
    /**
     * Get a specific task by ID. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotask-get?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    getTask(list: microsoftToDoTaskList, taskID: String): microsoftToDoTask | undefined
    /**
     * Create new task in the specified list. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    createTask(list: microsoftToDoTaskList, task: microsoftToDoTask): microsoftToDoTask | undefined
    /**
     * Update an existing task. Typical usage would be to modify the contents of a task returned by `getTask` or `getTasks` and sending the modified version as an update [API documentation](https://docs.microsoft.com/en-us/graph/api/todotask-update?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    updateTask(list: microsoftToDoTaskList, task: microsoftToDoTask): microsoftToDoTask | undefined

    /**
     * Create new linked resource for a task. A linked resource is a reference to content in an external system, such as a link back to a draft. [API documentation](https://docs.microsoft.com/en-us/graph/api/resources/linkedresource?view=graph-rest-1.0)
     * @category Linked Resource
     */
    createLinkedResource(list: microsoftToDoTaskList, task: microsoftToDoTask, linkedResource: microsoftToDoLinkedResource): microsoftToDoLinkedResource | undefined

    // FUNCTIONS

    /**
     * Execute a request against the [Microsoft To Do API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by the API as appropriate to the request made. Refer to API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * Requests should only be made to endpoints in the Microsoft Graph API which require the `Task.ReadWrite` authentication scope.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [To Do API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0). */
        url: string
        /** The HTTP method, like "GET", "POST", "PATCH", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new MicrosoftToDo object.
     * @param identifier Optional string value used to identify a To Do account. Typically this can be omitted if you only work with one To Do account in Drafts. Each unique identifier used for To Do accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): MicrosoftToDo

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * # MultiMarkdown
 * 
 * Drafts includes a full version of the MultiMarkdown 6 engine to render Markdown text to HTML and other supported formats. For details on the meaning of the various options, refer to [MultiMarkdown documentation](https://github.com/fletcher/MultiMarkdown-6).
 * 
 * ### Example
 * 
 * ```javascript
 * var inputString = "# Header\n\nMy **markdown** text";
 * var mmd = MultiMarkdown.create();
 * 
 * mmd.format = "html";
 * mmd.criticMarkup = true;
 * var outputString = mmd.render(inputString);
 * ```
 */
declare class MultiMarkdown {
    /**
     * Takes Markdown string passed and processes it with MultiMarkdown based on the properties and format selections on the object.
     */
    render(markdownStr: string): string

    /**
     * Specify output format. Valid values are:
     * * `html`: HTML. This is the default Markdown output.
     * * `epub`: ePub
     * * `latex`: LaTeX
     * * `beamer`
     * * `memoir`
     * * `odt`: Open document format
     * * `mmd`
     */
    format: 'html' | 'epub' | 'latex' | 'beamer' | 'memoir' | 'odt' | 'mmd'

    /**
     * defaults to `false`
     */
    markdownCompatibilityMode: boolean
    /**
     * defaults to `false`
     */
    completeDocument: boolean
    /**
     * defaults to `false`
     */
    snippetOnly: boolean
    /**
     * defaults to `true`
     */
    smartQuotesEnabled: boolean
    /**
     * defaults to `true`
     */
    footnotesEnabled: boolean
    /**
     * defaults to `true`
     */
    noLabels: boolean
    /**
     * defaults to `true`
     */
    processHTML: boolean
    /**
     * defaults to `false`
     */
    noMetadata: boolean
    /**
     * defaults to `false`
     */
    obfuscate: boolean
    /**
     * defaults to `false`
     */
    criticMarkup: boolean
    /**
     * defaults to `false`
     */
    criticMarkupAccept: boolean
    /**
     * defaults to `false`
     */
    criticMarkupReject: boolean
    /**
     * defaults to `false`
     */
    randomFootnotes: boolean
    /**
     * defaults to `false`
     */
    transclude: boolean

    /** Create object */
    static create(): MultiMarkdown

    /**
     * Create new instance.
     */
    constructor()
}/**
 * # MustacheTemplate
 * 
 * See also: [`Draft.processMustachTemplate`](/classes/draft#processmustachetemplate) for rendering with Mustache similar to how those templates are rendered in actions. The `MustacheTemplate` object is for rendering with your own custom context.
 * 
 * The MustacheTemplate object support rendering of templates using the [Mustache](https://en.wikipedia.org/wiki/Mustache_%28template_system%29) template style.
 *
 * Mustache templates offer advanced features for iterating over items, creating conditional blocks of text and more. This is still a bit of an experimental feature, please send feedback if you are finding edge cases or are interested in more functionality in this area.
 *
 * The object can be used in one of two ways, by passing a specific template as a string and rendering it, or by passing a path to a subdirectory of the `iCloud Drive/Drafts/Library/Templates` folder which can contain more than one Mustache style templates (with file extension `.mustache`), and then rendering them. The late method has the advantage of supporting the use of partial templates in the same folder.
 *
 * For details on using Mustache templates, we recommend reviewing [tutorials](https://www.bersling.com/2017/09/22/the-ultimate-mustache-tutorial/).
 *
 * ### About Passing Data to Templates
 *
 * When rendering Mustache templates, you pass the template itself and a data object which contains the values available to insert. The data object should be a Javascript object with keys and values. Values can be basic data types (numbers, strings, dates) and also arrays or nested objects which can be iterated using conventions of the Mustache syntax.
 *
 * ### Example
 * 
 * ```javascript
 * // create template to loop over drafts
 * let t = `Template Output:
 * {{#drafts}}
 * Draft: {{content}}
 * {{#isFlagged}}Flagged!{{/isFlagged}}{{^isFlagged}}Not Flagged{{/isFlagged}}
 * {{/drafts}}`;
 * 
 * let d1 = Draft.create();
 * d1.content = "First draft";
 * d1.isFlagged = true;
 * let d2 = Draft.create();
 * d2.content = "Second draft";
 * let drafts = [d1, d2];
 * 
 * let data = {
 *   "drafts": drafts
 * };
 * 
 * let template = MustacheTemplate.createWithTemplate(t);
 * let result = template.render(data);
 * ```
 */
declare class MustacheTemplate {
    /**
     * Use in combination with `createWithTemplate(template)` to render the template using the data passsed.
     * @param data A Javascript object with the values to use when rendering the template. The object can have nested sub-objects.
     */
    render(data: { [x: string]: any }): string

    /**
     * Use in combination with `createWithPath(path)` to render the template using the data passsed.
     * @param templateName The name of a template file in the directory passed to create the MustacheTemplate object. Do not include the ".mustache" file extension. For example, if you have a "Document.mustache" file in the directory, pass templateName "Document".
     * @param data  A Javascript object with the values to use when rendering the template. The object can have nested sub-objects.
     */
    renderTemplate(templateName: string, data: any): string

    /**
     * Determines how the Mustache engine renders output. Valid options:
     * * `text`: Render the output as plain text, do not do additional encoding of entities.
     * * `html`: Render output as escaped HTML with entities converted for use in HTML.
     */
    contentType: 'text' | 'html'

    /**
     * Create a new object with a template
     * @param template a valid Mustache template string
     */
    createWithTemplate(template: string): MustacheTemplate

    /**
     * Create a new object configured to point to a directory of Mustache template files in iCloud Drive. When using this method, other Mustache template located in the same directory will be available to be used as partials in the rendering process.
     * @param path Relative path to a directory of Mustache template files (with .mustache file extension) located in `iCloud Drive/Drafts/Library/Templates`. For example to refer to templates in the directory `iCloud Drive/Drafts/Library/Templates/My Mustache Templates/`, pass `My Mustache Templates/` to this method.
     */
    createWithPath(path: string): MustacheTemplate
}/**
 * # Notion
 * 
 * Script integration with [Notion](https://www.notion.so/). This object handles OAuth authentication and request signing. The entire [Notion REST API](https://developers.notion.com) can be used with the `request` method.
 *
 * ### Example
 * 
 * ```
 * // list pages which have been shared with the Drafts integration
 * // API Docs: https://developers.notion.com/reference/post-search
 * let endpoint = "https://api.notion.com/v1/search"
 * 
 * let notion = Notion.create();
 * let result = notion.request({
 * 	"url": endpoint,
 * 	"method": "POST",
 * 	"data": {
 * 		"filter": {
 * 			"value": "page",
 * 			"property": "object"
 * 		}
 * 	}
 * });
 * 
 * // result has JSON payload
 * // with page properties
 * if (result.statusCode == 200) {
 * 	alert(`Notion Pages Loaded:
 * 	
 * ${result.responseText}`)
 * }
 * else {
 * 	alert(`Notion Error: ${result.statusCode}
 * 	
 * ${notion.lastError}`);
 * 	context.fail();
 * }
 * ```
 */
declare class Notion {
    /**
     * If a function succeeds, this property will contain the last response returned by Notion. The JSON returned by Notion will be parsed to an object and placed in this property. Refer to [Notion API documentation](https://developers.notion.com) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // FUNCTIONS

    /**
     * Execute a request against the Notion API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Notion as appropriate to the request made. Refer to Notion's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Notion REST API](hhttps://developers.notion.com.). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. Drafts will automatically include required authentication and versioning headers. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. Refer to API documentation for appropriate information to include. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Notion object.
     * @param identifier Optional string value used to identify a Notion account. Typically this can be omitted if you only work with one Notion account in Drafts. Each unique identifier used for Notion accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Notion

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * # OneDrive
 * 
 * OneDrive objects can be used to work with files in a OneDrive account.
 * 
 * ### Example
 * 
 * ```javascript
 * // create OneDrive object
 * var drive = OneDrive.create();
 * 
 * // setup variables
 * var path = "/test/file.txt";
 * var content = "text to place in file";
 * 
 * // write to file on OneDrive
 * var success = drive.write(path, content, false);
 * 
 * if (success) { // write worked!
 *   var driveContent = drive.read(path);
 *   if (driveContent) { // read worked!
 *     if (driveContent == content) {
 *       alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(drive.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(drive.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class OneDrive {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be undefined.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the path as a string. Returns undefined value if the file does not exist or could not be read. Paths should begin with a `/` and be relative to the root directory of your OneDrive.
     */
    read(path: string): string

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Paths should begin with a `/` and be relative to the root directory of your OneDrive
     * @param content Text to place in the file
     * @param overwrite If `false`, an existing file will not be overwritten
     */
    write(path: string, content: string, overwrite?: boolean): boolean

    /**
     *
     * @param identifier Optional identifier for OneDrive account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): OneDrive

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}

/**
 * # OutlookMessage
 * 
 * The OutlookMessage object can be used to create and send mail messages through Outlook.com integrated accounts, similar to those created by a [Outlook action step](https://getdrafts.com/actions/steps/outlook). Creating and sending these messages happens in the background, with no user interface, so messages must be complete with recipients before calling `send()`. Sending is done via the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph). Outlooks accounts are authenticated when used for the first time using OAuth - to use more than one account, call create with different identifier parameters.
 * 
 * ### Example
 * 
 * ```javascript
 * let message = OutlookMessage.create();
 * message.toRecipients = ["joe@sample.com", "Jim Test <jim@test.com>"];
 * message.subject = "My test message";
 * message.body = "Body text";
 * 
 * var success = message.send();
 * if (!success) {
 *   console.log("Sending outlook message failed");
 *   context.fail();
 * }
 * ```
 */
declare class OutlookMessage {
    /**
     * Array of email addresses to use as `To:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    toRecipients: string[]
    /**
     * Array of email addresses to use as `CC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    ccRecipients: string[]
    /**
     * Array of email addresses to use as `BCC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    bccRecipients: string[]

    subject: string

    /**
     * Body text of the mail message. Can be plain text or HTML if the `isBodyHTML` property is set to `true`.
     */
    body: string

    /**
     * whether to treat the body string and plain text or HTML. When set to `true`, the `body` property should be set to full valid HTML.
     */
    isBodyHTML: boolean

    /**
     * Send the mail message via the Microsoft Graph API.
     */
    send(): boolean

    /**
     * create a new object.
     * @param identifier notes which for Outlook account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): OutlookMessage

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}










type keyboardTypes =
    | 'default'
    | 'numbersAndPunctuation'
    | 'numberPad'
    | 'phonePad'
    | 'namePhonePad'
    | 'emailAddress'
    | 'decimalPad'
    | 'webSearch'
    | 'URL'

type capitalizationTypes = 'none' | 'sentences' | 'words'

/**
 * # Prompt
 * 
 * Prompts allow the creation and display of custom dialogs to request information or confirmation from the user.
 * 
 * ### Example
 * 
 * ```javascript
 * var p = Prompt.create();
 * 
 * p.title = "Hello";
 * p.message = "World!";
 * 
 * p.addTextField("textFieldName", "Label", "");
 * 
 * p.addDatePicker("myDate", "Start date", new Date(), {
 *   "mode": "date"
 * });
 * p.addButton("First");
 * p.addButton("Second");
 * 
 * var didSelect = p.show();
 * 
 * var textFieldContents = p.fieldValues["textFieldName"];
 * var startDate = p.fieldValues["myDate"];
 * 
 * if (p.buttonPressed == "First") {
 *   // do something
 * }
 * ```
 *
 */
declare class Prompt {
    /**
     * Short title.
     * @category Display
     */
    title: string

    /**
     * A longer message explaining the purpose of the dialog, if needed.
     * @category Display
     */
    message: string

    /**
     * If true, a "Cancel" button will be included in the dialog. Defaults to `true`. If the user selects the cancel button, the `show()` method will return `false`. If `false`, no cancel button will be displayed and the user must select one of the button name options.
     * @category Display
     */
    isCancellable: boolean

    /**
     * After the `show()` method is called, this property will contain values from any fields added to the prompt. The dictionary keys will be the names of the fields as passed in when they were created, and the value will be the current contents of that field. They type of data depends on the type of field.
     * @category Result
     */
    fieldValues: { [x: string]: any }

    /**
     * After the `show()` method is called, this property will contain the name of the button selected by the user.
     * @category Result
     */
    buttonPressed: string

    /**
     * Add an information text label to the prompt.
     * @param name Identifier for the field.
     * @param label The text of the label.
     * @param options A dictionary of options for configuring the text field.
     * @category Field
     */
    addLabel(
        name: string,
        label: string,
        options?: { textSize?: 'body' | 'caption' | 'headline' } // FIXME: is this actually optional? and the rest of these
    ): void

    /**
     * Add a text input field to the prompt
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialText The initial text contents for the field.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addTextField(
        name: string,
        label: string,
        initialText: string, // FIXME: is this optional?
        options?: {
            /**
            * Placeholder text to use when field is empty
            */
            placeholder?: string
            /**
            * Should system autocorrect be enabled in field, Default: true
            */
            autocorrect?: boolean
            autocapitalization?: capitalizationTypes
            keyboard?: keyboardTypes
            /**
            * If true, focus this field when prompt is displayed
            */
            wantsFocus?: boolean
        }
    ): void

    /**
     * Add a text input field to the prompt
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialText The initial text contents for the field.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addTextView(
        name: string,
        label: string,
        initialText: string,
        options?: {
            height?: number
            /**
            * Should system autocorrect be enabled in field, Default: true
            */
            autocorrect?: boolean
            autocapitalization?: capitalizationTypes
            keyboard?: keyboardTypes
            /**
            * If true, focus this field when prompt is displayed
            */
            wantsFocus?: boolean
        }
    ): void

    /**
     * Same as addTextField, but the input field will be password masked.
     * @category Field
     */
    addPasswordField(name: string, label: string, initialValue: string): void

    /**
     * Add an on/off toggle switch. The `fieldValues` entry for this item will be a boolean indicating whether the switch was on.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialValue indicate if the switch should be on or off when initially displayed.
     * @category Field
     */
    addSwitch(name: string, label: string, initialValue: boolean): void

    /**
     * Add a date and/or time picker to the prompt, with the arguments as below. The `fieldValues` entry for this will be a date object.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param initialDate The initial date to selected for the field. Minimum and maximum values should be defined in options.
     * @param options A dictionary of options for configuring the text field. 
     * @category Field
     */
    addDatePicker(
        name: string,
        label: string,
        initialDate: Date,
        options?: {
            mode?: 'date' | 'time' | 'dateAndTime'
            minimumDate?: Date
            maximumDate?: Date
            minuteInterval?: number
        }
    ): void

    /**
     * Add a picker to the prompt, with the arguments as below. Picker can contain multiple rows. The `fieldValues` entry for this will be a array of selected index values object.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param columns The values to display in the picker. Should be an array containing arrays of string values, each sub-array representing a column in the picker. Example two column picker: `[["Item 1", "Item 2"],["Column 2 Item 1", "Column 2 Item 2"]]`
     * @param selectedRows Array of zero-based index values to set the initial selected row in each column.
     * @category Field
     */
    addPicker(
        name: string,
        label: string,
        columns: string[][],
        selectedRows: number[]
    ): void

    /**
     * Add a select control. Returns an array of string values in `fieldValues`.
     * @param name Identifier for the field. This will be used as the key in the `fieldValues` dictionary to access the contents of the field after calling `show()`.
     * @param label User-friendly text label to place next to the field.
     * @param values The array of string values that will be available to select.
     * @param selectedValues Array of string values that should be initially selected when the prompt is displayed. All values in this array should match values in the `values` array.
     * @param allowMultiple If `false`, selecting a value will deselect all other values. If `true`, the user may select multiple items.
     * @category Field
     */
    addSelect(
        name: string,
        label: string,
        values: string[],
        selectedValues: string[],
        allowMultiple: boolean
    ): void

    /**
     * Add a button to the array of buttons to be displayed. All buttons should be created before calling `show()`.
     * @param name
     * @param value only needed to associate a different value than will be displayed in the button. For example, if you call `prompt.addButton("First Button", 1)`, after calling `prompt.show()` if that button is pressed, the `prompt.buttonPressed` will contain the number value `1`.
     * @param isDefault used to specify a single button which will be pinned to the bottom of the prompt and respond to `cmd + return` as the default button. If only one button is added to a prompt, it is assumed to be the default.
     * @category Field
     */
    addButton(name: string, value?: object, isDefault?: boolean): void

    /**
     * Displays the prompt. Returns `true` if the user selected one of the buttons in the buttons array, `false` if the user selected the "Cancel" button. After the dialog has been shown, the `buttonPressed` property will contain the name of the button selected by the user.
     */
    show(): boolean

    /**
     * Create new instance.
     */
    static create(): Prompt

    /**
     * Create new instance.
     */
    constructor()
}type queryDateType = 'relative' | 'absolute'
type queryDateField = 'created' | 'modified' | 'accessed'
/**
 * # QueryDate
 * 
 * Represents a dynamic date for use in queries. `QueryDate` is used when configuring [[Workspace]] objects `startDate` and `endDate` properties.
 * 
 * QueryDates always specify a date with time components being ignored. If used a the start of a query range, the time will be moved to the beginning of that day. If used at the end of a query range, time will be moved to the end of that day.
 * 
 * ### Example: Create Workspace with date range
 * 
 * ```javascript
 * // create a workspace
 * let workspace = new Workspace();
 * 
 * // create a QueryDate for three days ago
 * let start = new QueryDate();
 * start.field = "created"
 * start.type = "relative"
 * start.days = -3;
 * 
 * // create a QueryDate for specific date
 * let qDate = new QueryDate();
 * qDate.field = "modified"
 * qDate.type = "absolute"
 * qDate.date = Date.today();
 * 
 * // assign to the workspace and apply
 * workspace.startDate = start; // .endDate also available
 * app.applyWorkspace(workspace);
 * ```
 */
declare class QueryDate {
    /**
     * The date field to use when querying
     */
    field: queryDateField

    /**
     * The type of date range. "relative" dates use the `days` property to add days to the current date when evaluating a query. "absolute" type query dates use the `date` property for a specific day.
     */
    type: queryDateType

    /**
     * Integer number of days to when evaluating query dates of "relative". This value can be negative. For example, a "relative" type with "-3" days, will always evaluated to 3 days ago when the query is run.
     */
    days: number

    /**
     * Absolute date to use when evaluating the query dates of "absolute" type.
     */
    date: Date

    /**
     * Create a new instance.
     */
    static create(): Workspace

    /**
     * Create a new instance.
     */
    constructor()
}/**
 * # Reminder
 * 
 * Reminder objects represent individual tasks in a list in the built-in Reminders app. For examples, see [[ReminderList]] documentation.
 */
declare class Reminder {
    /**
     * The list which this task resides in.
     */
    list: ReminderList

    /**
     * Unique identifier for the reminder.
     */
    identifier: string

    /**
      * The title of the event.
      */
    title: string

    /**
     * Notes associated with the event.
     */
    notes: string

    /**
     * Location of the event.
     */
    location: string

    /**
    * Due date of the reminder
    */
    dueDate?: Date

    /**
    * Does the dueDate property include an assigned time. If false, assignments to the `dueDate` property will ignore time components, making the reminder due on a specific date without a time assigned.
    */
     dueDateIncludesTime: Boolean

    /**
    * Start date of the reminder
    */
    startDate?: Date

    /**
    * Does the startDate property include an assigned time. If false, assignments to the `startDate` property will ignore time components, making the reminder start on a specific date without a time assigned.
    */
    startDateIncludesTime: Boolean

    /**
    * Completion date of the reminder. This value is set automatically when the `isCompleted` property is set to true. Setting this property to `nil` will set `isCompleted` to false.
    */
    completionDate?: Date

    /**
     * Integer number representing priority. Assign values matching those Apple uses as follows:
     * * `0`: No priority
     * * `1`: High
     * * `5`: Medium
     * * `9`: Low
     */
    priority: 0 | 1 | 5 | 9

    /**
     * Flag indicating if the task has been completed.
     */
    isCompleted: boolean

    /**
     * Returns true if the reminder has any alarms.
     */
    readonly hasAlarms: boolean

    /**
     * The alarms assigned to the reminder, if any.
     */
    alarms: Alarm[]

    /**
     * Save the task. Returns true if the task is successfully saved in Reminders.
     */
    update(): boolean

    /**
     * Add an alarm object to the reminder. Be sure to `update()` to save after adding alarms. Return `true` if the alarm was successfully added. Note that reminders only support alarms created with the `Alarm.alarmWithDate` method.
     */
    addAlarm(alarm: Alarm): boolean

    /**
     * Remove any assigned alarms from the reminder.
     */
    removeAlarms(): void
}/**
 * # ReminderList
 * 
 * ReminderList objects are used to manipulate and create lists in the built-in Reminders app.
 * 
 * ### Examples
 * 
 * ```javascript
 * const list = ReminderList.findOrCreate("Groceries");
 * let reminder = list.createReminder();
 * reminder.title = "Bananas";
 * reminder.notes = "Get slightly green ones."
 * reminder.update();
 * ```
 */
declare class ReminderList {
    /**
     * The name of the list.
     */
    title: string
    /**
     * All reminders in the list.
     */
    readonly tasks: Reminder[]
    /**
     * Reminders in the list which are NOT completed.
     */
    readonly incompleteTasks: Reminder[]
    /**
     * Reminders in the list which have been marked completed.
     */
    readonly completeTasks: Reminder[]

    /**
     * Save changes to the list.
     */
    update(): boolean

    /**
     * Create a new Reminder object in this list
     */
    createReminder(): Reminder

    /**
     * Searches for a list in the reminders app matching the title. If none is found, creates a new list with that title. If more than one list with the same name exist in Reminders, the first found will be returned.
     */
    static findOrCreate(title: string): ReminderList

    /**
     * Searches for a reminder lists matching the title. If none is found, return undefined.
     */
    static find(title: string): ReminderList

    /**
     * Get an array all known reminder lists on the device.
     */
    static getAllReminderLists(): ReminderList[]

    /**
     * Returns the system default reminder list configured for new reminders.
     */
    static default(): ReminderList
}/**
 * # Script
 * 
 * When running a [Script action step](https://docs.getdrafts.com/docs/actions/steps/advanced.html#script), a single `script` object will be in context to reference the currently running script.
 * 
 * ### Example
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
}/**
 * # Share
 * 
 * Methods to share via system share sheet.
 * 
 * ### Example

```javascript
 * let s = "My text to share"
 * 
 * let didShare = Share.shareAsText(s);
 * let didShare = Share.shareAsURL("http://getdrafts.com/");
 * let didShare = Share.shareAsFile("My-File.txt", s);
 * ```
 */
declare class Share {
    /**
     * Open system share sheet to share the string provided as text. Returns `true` if share was completed by user, `false` if input was invalid or user cancelled the share.
     */
    static shareAsText(text: string): boolean

    /**
     * Open system share sheet to share the url provided as a URL object. Returns `true` if share was completed by user and `false` if input was invalid or user cancelled share.
     * @param url should be a complete and valid URL
     */
    static shareAsURL(url: string): boolean

    /**
     * Open system share sheet to share the content as a file, with the specified file name (with e). Returns `true` if share was completed by user amd `false` if input was invalid or user cancelled share. Drafts will create a temporary file for the purposes of the share and send it to the share sheet. The temporary file will be deleted after. Useful, for example, to create a text file and share to Mail, and it will be shared as an attachment to the email
     */
    static shareAsFile(filename: string, text: string): boolean
}/**
 * # ShellScript
 * 
 * _**macOS only**. Requires Drafts 19 or greater._
 * 
 * ShellScript objects can be used to execute Unix shell scripts.
 *
 * ### Bash Example
 * 
 * ```javascript
 * // define text of bash script
 * let script = `#!/bin/bash
 * echo "Total arguments : $#"
 * echo "1st Argument = $1"
 * echo "2nd argument = $2"
 * `;
 * let runner = ShellScript.create(script);
 *
 * if (runner.execute(["1", "2"])) {
 * 	alert("STDOUT: " + runner.standardOutput);
 * }
 * else {
 * 	alert("STDERR: " + runner.standardError);
 * }
 * ```
 * 
 * ### Ruby Example
 * 
 * ```javascript
 * let script = `#!/usr/bin/env ruby
 * ARGV.each do |a|
 *   puts "Argument: #{a}"
 * end
 * `;
 * let runner = ShellScript.create(script);
 *
 * if (runner.execute(["1", "2"])) {
 * 	alert("STDOUT:\n" + runner.standardOutput);
 * }
 * else {
 * 	alert("STDERR:\n" + runner.standardError);
 * }
 * ```
 * 
 * **Note:** When executed, scripts are saved to temporary files in the Drafts' script directory at `~/Library/Application Scripts/com.agiletortoise.Drafts-OSX` and run. Scripts should not be written to make assumptions about their location in the file system (e.g. using relative paths). The first time a script is executed, the user will be asked to grant permissions to the script directory.
 */
declare class ShellScript {
    /**
     * Content sent to standard error during the execution of the script
     */
    standardError?: string | undefined

    /**
    * Content sent to standard output during the execution of the script
    */
    standardOutput?: string | undefined

    /**
     * Convenience method to create a ShellScript object.
     * @param script A string containing the shell script. This should contain the appropriate "she bang" to trigger the appropriate scripting language/shell.
     */
    static create(script: string): ShellScript

    /**
     * Create new instance.
     */
    constructor(script: string)

    /**
     * Executes the shell script.
     * @param arguments An array of string arguments to pass to the script. These will appear to the script as command line arguments would.
     * @returns `true` if the script was executed without error, `false` if not. 
     */
    execute(arguments: string[]): boolean

}

type syntaxType = 'builtIn' | 'custom' | 'file'
/**
 * # Syntax
 * 
 * Represents a Syntax definition available in the current installation of Drafts.
 * 
 * ### Example: Find and Assign a Syntax
 * 
 * ```javascript
 * let syntax = Syntax.find("builtIn", "Markdown");
 * draft.syntax = syntax;
 * draft.update();
 * ```
 */
declare class Syntax {
    /**
    * The type (builtIn, custom, file) of the syntax definition.
    * @category Identification
    */
    type: syntaxType

    /**
     * The name of the syntax definition.
     * @category Identification
     */
    name: string

    /**
     * URL which can be used to install this Syntax in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
     * Get list of all available syntaxes.
     */
    static getAll(): Syntax[]

    /**
     * Search for a syntax definition matching the type and name passed and return it if found. Returns undefined if not found.
     */
    static find(type: syntaxType, name: string): Syntax | undefined
}type themeType = 'builtIn' | 'custom' | 'file'
/**
 * # Theme
 * 
 * Represents a Theme definition available in the current installation of Drafts.
 * 
 * ### Example: Find and assign the active light theme
 * 
 * ```javascript
 * let theme = Theme.find("builtIn", "dark");
 * app.lightTheme = theme;
 * ```
 */
declare class Theme {
    /**
    * The type (builtIn, custom, file) of the theme definition.
    * @category Identification
    */
    type: themeType

    /**
     * The name of the theme definition.
     * @category Identification
     */
    name: string

    /**
     * URL which can be used to install this Theme in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
     * Get list of all available themees.
     */
    static getAll(): Theme[]

    /**
     * Search for a theme definition matching the type and name passed and return it if found. Returns undefined if not found.
     */
    static find(type: themeType, name: string): Theme | undefined
}/**
 * # Things
 * 
 
 */

/**
 * # TJSContainer
 * 
 * Wraps an array of todo and/or project items and encodes them into a URL for use to send the request to Things.
 * 
 * ## Things Integration Notes
 * 
 * * [Things](https://culturedcode.com/things/) is a popular task and project management app from Cultured Code. Things supports advanced URL schemes (required Things v3.4 or greater on iOS) which can accept multiple todos, projects, headings in a single call to the app. The scripting interfaces below are convenience wrappers that allow easy creation and encoding of the URLs needed to pass this type of information to Things.
 *
 * The TJS\* JavaScript objects are wrappers around an [open source Swift library](https://github.com/culturedcode/ThingsJSONCoder) provided by Cultured Code, with a few modifications to work in JavaScript. In all cases, nothing is committed to Things until the the items are wrapped in a TJSContainer, and the URL it generates called to send the data to Things. This is best done with Drafts’ `CallbackURL` object (see example below).
 *
 * For more information about what values Things understands in these objects, refer to [their URL scheme documenation](https://support.culturedcode.com/customer/en/portal/articles/2803573).
 * 
 * ### Example
 * 
 * ```javascript
 * // create a Things Project
 * var project = TJSProject.create();
 * project.title = "My Project From Drafts";
 * project.notes = "Let's do this stuff";
 * 
 * // create and add a heading to the project
 * var heading = TJSHeading.create();
 * heading.title = "First Heading";
 * project.addHeading(heading);
 * 
 * // add todos to the project
 * var todo1 = TJSTodo.create();
 * todo1.title = "My first todo";
 * todo1.when = "today";
 * project.addTodo(todo1);
 * 
 * var todo2 = TJSTodo.create();
 * todo2.title = "My second todo";
 * todo2.when = "tomorrow";
 * project.addTodo(todo2);
 * 
 * // create a container to handle creation of Things URL
 * var container = TJSContainer.create([project]);
 * 
 * // Use CallbackURL object to open URL in Things.
 * var cb = CallbackURL.create();
 * cb.baseURL = container.url;
 * var success = cb.open();
 * if (success) {
 * 	console.log("Project created in Things");
 * }
 * else {
 * 	context.fail();
 * }
 * ```
 */
declare class TJSContainer {
    static create(items: Array<TJSProject | TJSTodo>): TJSContainer
    /**
     * The full URL with encoded TJSContainer parameters.
     */
    url: string
}

/**
 * # TJSProject 
 * 
 * Represents a Things project, with headings and todo items. See [[TJSContainer]] documentation for details on making requests to Things.
 */
declare class TJSProject {
    static create(): TJSProject

    title: string
    notes: string
    when: string
    deadline: string
    areaID: string
    area: string
    completed: boolean
    canceled: boolean
    tags: string[]

    addTag(tag: string): void
    addTodo(todo: TJSTodo): void
    addHeading(heading: TJSHeading): void
}

/**
 * # TJSHeading
 * 
 * Represents a Things heading within a project. See [[TJSContainer]] documentation for details on making requests to Things.
 */
declare class TJSHeading {
    static create(): TJSHeading

    title: string
    archived: boolean
}

/**
 * # TJSTodo
 * 
 * Represents a Things todo item. Todos can be added a project or directly to a container. See [[TJSContainer]] documentation for details on making requests to Things.
 */
declare class TJSTodo {
    static create(): TJSTodo

    title: string
    notes: string
    when: string
    deadline: string
    listID: string
    list: string
    tags: string[]
    heading: string
    completed: boolean
    canceled: boolean

    addChecklistItem(item: TJSChecklistItem): void
    addTag(tag: string): void
}

/**
 * # TJSChecklistItem
 * 
 * Represents a Things check list item, which can be added to a Todo. See [[TJSContainer]] documentation for details on making requests to Things.
 */
declare class TJSChecklistItem {
    static create(): TJSChecklistItem

    title: string
    completed: boolean
    canceled: boolean
}/**
 * # Todoist
 * 
 * Script integration with [Todoist](http://todoist.com/). This object handles OAuth authentication and request signing. The entire [Todoist REST API](https://developer.todoist.com/rest/v1/) can be used with the request method, and convenience methods are provided for common API endpoints to manage tasks, projects, comments and labels.
 *
 * The `quickAdd` method is mostly likely what you are looking for to create tasks as it supports the shorthand the task entry box in Todoist supports to parse projects, etc.
 *
 * Other methods are direct mappings of the REST API calls provided by Todoist. Most take an `options` parameter which is a javascript object containing the parameters to be passed to the API, and and the method decodes the JSON response from Todoist and returns it as a Javascript object (or array of objects) with the values as specified in the Todoist API docs.
 *
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * ### Example
 * 
 * See [Examples-Todoist](https://actions.getdrafts.com/g/1L3) action group in the [Action Directory](https://actions.getdrafts.com/).
 * 
 * ```javascript
 * // create Todoist object
 * let todoist = Todoist.create();
 * // create task in inbox
 * todoist.createTask({
 *   "content": "My Task Name",
 *   "due_string": "Next wednesday"
 * });
 * ```
 */
declare class Todoist {
    /**
     * If a function succeeds, this property will contain the last response returned by Todoist. The JSON returned by Todoist will be parsed to an object and placed in this property. Refer to [Todoist API documentation](https://developer.todoist.com/rest/v8) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    /**
     * @param text Text to use to create the task. Supports Todoist quick add notation for specifying projects, priority, labels, etc. just as if you were using the Todoist quick add window.
     * @param note Optional text to attach as a comment with the task.
     * @param reminder Optional natural language date specifying for creating a task reminder.
     * @param options Optional dictionary of additional parameters to include in the request.
     * @returns Object containing respose data from Todoist.
     */
    quickAdd(text: string, note?: string, reminder?: string, options?: object): object

    // TASKS
    /**
     * Get active tasks. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-active-tasks)
     * @category Tasks
     */
    getTasks(options?: object): object[]
    /**
     * Create new task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-task)
     * @category Tasks
     */
    createTask(options: object): object
    /**
     * Get active task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-an-active-task)
     * @category Tasks
     */
    getTask(taskId: string): object
    /**
    * Update active task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-task)
    * @category Tasks
    */
    updateTask(taskId: string, options: object): object
    /**
     * Close task (mark complete)
     * @category Tasks
     */
    closeTask(taskId: string): boolean
    /**
     * Reopen task (mark incomplete)
     * @category Tasks
     */
    reopenTask(taskId: string): boolean

    // PROJECTS
    /**
    * Get all projects. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-projects)
    * @category Projects
    */
    getProjects(): object[]
    /**
    * Create new project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-project)
    * @category Projects
    */
    createProject(options: object): object
    /**
    * Get project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-project)
    * @category Projects
    */
    getProject(projectId: string): object
    /**
    * Update project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-project)
    * @category Projects
    */
    updateProject(projectId: string, options: object): object

    // SECTIONS
    /**
    * Get all sections. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-sections)
    * @category Sections
    */
    getSections(): object[]
    /**
     * Get project sections. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-project-sections)
     * @category Sections
     */
    getProjectSections(projectId: string): object[]
    /**
    * Create new section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-section)
    * @category Sections
    */
    createSection(options: object): object
    /**
    * Get section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-single-section)
    * @category Sections
    */
    getSection(sectionId: string): object
    /**
    * Update section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-section)
    * @category Sections
    */
    updateSection(sectionId: string, options: object): object

    // COMMENTS
    /**
    * Get all comments. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-comments)
    * @category Comments
    */
    getComments(options: object): object[]
    /**
    * Create new comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-comment)
    * @category Comments
    */
    createComment(options: object): object
    /**
    * Get comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-comment)
    * @category Comments
    */
    getComment(commentId: string): object
    /**
    * Update comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-comment)
    * @category Comments
    */
    updateComment(commentId: string, options: object): object

    // LABELS
    /**
    * Get all labels. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-labels)
    * @category Labels
    */
    getLabels(): object[]
    /**
    * Create new labels. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-label)
    * @category Labels
    */
    createLabel(options: object): object
    /**
    * Get label. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-label)
    * @category Labels
    */
    getLabel(labelId: string): object
    /**
    * Update label. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-label)
    * @category Labels
    */
    updateLabel(labelId: string, options: object): object

    // FUNCTIONS

    /**
     * Execute a request against the Todoist API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Todoist as appropriate to the request made. Refer to Todoist’s API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Todoist REST API](https://developer.todoist.com/rest/v1/). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Todoist object.
     * @param identifier Optional string value used to identify a Todoist account. Typically this can be omitted if you only work with one Todoist account in Drafts. Each unique identifier used for Todoist accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Todoist

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
/**
 * # Twitter
 * 
 * Script integration with Twitter. The `updateStatus` method is a convenience method for posting a tweet, but the entire [Twitter API](https://developer.twitter.com/en/docs/api-reference-index) can be used with the request method, which handles OAuth authentication and authorization.
 * 
 * ### Example

 * ```javascript
 * // create twitter object
 * var twitter = Twitter.create();
 * // post tweet
 * var success = twitter.updateStatus("My tweet content!");
 * 
 * if success {
 *   console.log(twitter.lastResponse);
 * }
 * else {
 *   console.log(twitter.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class Twitter {
    /**
     * Post a status update (tweet) to Twitter. Returns `true` if successful, `false` if not. After success the `lastResponse` object can be used to inspect response and get details such as the ID of the tweet created. Refer to [Twitter API POST /status/update documentation](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update) for response details.
     */
    updateStatus(content: string): boolean

    /**
     * Execute a request against the Twitter API. For successful requests, the [[[HTTPResponse]] object will contain an object or array or objects decoded from the JSON returned by Twitter as appropriate to the request made. Refer to Twitter’s API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object with the following properties:
     * * url [string, required]: The full URL to the endpoint in the [Twitter API](https://developer.twitter.com/en/docs/api-reference-index).
     * * method [string, required]: The HTTP method, like "GET", "POST", etc.
     * * headers [object, optional]: An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those.
     * * parameters [object, optional]: An object containing key-values to be added to the request as URL parameters.
     * * data [object, optional]: An object containing data to be encoded into the HTTP body of the request.
     */
    request(settings: {
        url: string
        method: string
        headers?: { [x: string]: string }
        parameters?: { [x: string]: string }
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Twitter object. Identifier is a optional string value used to identify a Twitter account. Typically this can be omitted if you only work with one Twitter account in Drafts. Each unique identifier used for Twitter accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Twitter

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}/**
 * # Version
 * 
 * Version objects represent individual versions in a draft's [version history](https://docs.getdrafts.com/docs/drafts/versionhistory). Versions are accessed using the `versions` property of the [[Draft]] object.
 * 
 * ```javascript
 * // loop over versions of a draft, keeping only most recent 3
 * if (draft.versions.length > 3) {
 *   let versions = draft.versions.slice(3);
 *   for (let version of versions) {
 *     version.delete();
 *   }
 * }
 */
declare class Version {
    /**
     * Unique identifier of this version
     */
    readonly uuid: string
    /**
    * The content of the draft at the time this version was saved
    */
    readonly content: string
    /**
    * Timestamp for the creation of the version
    */
    readonly createdAt: Date
    /**
    * Delete the version. This is permanent and should be used with caution
    */
    delete()
    /**
    * The [[Draft]] object related to the version. Typically not needed, as versions are accessed through the `versions` property of a draft.
    */
    readonly draft?: Draft
}/**
 * # WordPress
 * 
 * Script integration with WordPress sites via the [WordPress XML-RPC API](https://codex.wordpress.org/XML-RPC_WordPress_API). Currently this object has one runMethod function which can be used to call any method available in the XML-RPC interface.
 *
 * The WordPress API offers access to a wide variety of functions, including posting, but also retrieving information about categories and tags, or reading posts contents.
 *
 * Drafts `WordPress` object simplifies working with the XML-RPC interface by accepting input parameters as Javascript objects and converting them to the require XML to make requests of the WordPress site. Similarly, it converts to XML returned by WordPress to Javascript objects. Otherwise it is an exact passthrough, so the [WordPress API reference](https://codex.wordpress.org/XML-RPC_WordPress_API) should be used to determine method names (e.g. `wp.newPost`, `wp.getTaxonomies`) available, the appropriate parameters to send.
 *
 * The WordPress XML-RPC API authenticates via username and password, so it is highly recommended you interact only over HTTPS secure connections, and use `Credential` objects to store host/username/password values, rather than hard-coding them in actions.
 * 
 * ### Example
 * 
 * ```javascript
 * // setup values to use in post
 * let title = "Title of Post"
 * let body = "Body of Post"
 * 
 * // create credentials for site
 * let cred = Credential.createWithHostUsernamePassword("WordPress", "WordPress  * credentials. Include full URL (with http://) of the home page of your WordPress  * site in the host field.");
 * cred.authorize();
 * 
 * // create WordPress object and make request
 * let wp = WordPress.create(cred.getValue("host"), 1, "", "");
 * let method = "wp.newPost"
 * let params = [
 * 	1, // blog_id, in most cases just use 1
 * 	cred.getValue("username"),
 * 	cred.getValue("password"),
 * 	{
 * 		"post_title": title,
 * 		"post_content": body,
 * 		"post_status": "draft",
 * 		"terms_names" : { // assign categories and tags
 * 			"category" : ["Cat1", "BAD"],
 * 			"post_tag" : ["Test1", "NOT-TAG"]
 * 		}
 * 	}
 * ];
 * 
 * let response = wp.runMethod(method, params);
 * if (response.success) {
 * 	let params = response.params;
 * 	console.log("Create WordPress post id: " + params[0]);
 * }
 * else {
 * 	console.log("HTTP Status: " + response.statusCode);
 * 	console.log("Fault: " + response.error);
 * 	context.fail();
 * }
 * ```
 */
declare class WordPress {
    // convenience
    getPost(postId: string): object | undefined
    newPost(content: string): string | undefined
    getPosts(filter?: any): object[] | undefined
    getPostStatusList(): object[] | undefined
    getTaxonomy(taxonomy?: string): object | undefined
    getTaxonomies(): object[] | undefined
    getTerms(taxonomy?: string, filter?: any): object[] | undefined
    getCategories(): object[] | undefined
    getTags(): object[] | undefined

    /**
     * Run an XML-RPC API method on a WordPress site. Any method name supported by the [WordPress XML-RPC API](https://codex.wordpress.org/XML-RPC_WordPress_API) can be used, as long as the authentication information provided has appropriate permissions on the site.
     * @param methodName The method name as documented in the WordPress XML-RPC API, for example `wp.newPost` to create a new post.
     * @param parameters Parameters should be a Javascript array of parameters for the method being used. These vary depending on the method and should follow the documentation provided by WordPress.
     */
    runMethod(methodName: string, parameters: any[]): XMLRPCResponse

    /**
     * Create new instance
     * @param siteURL This should be the full URL to the home page of the WordPress site. e.g. `https://mysite.com` or `https://mysite.com/blog/`.
     * @param blogId For most WordPress installations, use `1`.
     * @param username Username to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     * @param password Password to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     */
    static create(
        siteURL: string,
        blogId: string,
        username?: string,
        password?: string
    ): WordPress

    /**
     * Create new instance
     * @param siteURL This should be the full URL to the home page of the WordPress site. e.g. `https://mysite.com` or `https://mysite.com/blog/`.
     * @param blogId For most WordPress installations, use `1`.
     * @param username Username to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     * @param password Password to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     */
    constructor(
        siteURL: string,
        blogId: string,
        username?: string,
        password?: string
    )
}type sortBy = 'created' | 'modified' | 'accessed' | 'name'
/**
 * # Workspace
 * 
 * Represents a Workspace. Can be used to inquire and load workspaces and apply them using methods on the App object.
 * 
 * ### Example: Find and Load Workspace
 * 
 * ```javascript
 * // find workspace and load it in drafts list
 * let workspace = Workspace.find("Projects");
 * app.applyWorkspace(workspace);
 * ```
 */
declare class Workspace {
    /**
     * The name of the workspace.
     * @category Identification
     */
    name: string

    /**
     * URL which can be used to install this Workspace in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
     * Search string to filter results.
     * @category Filter
     */
    queryString: string

    /**
     * Comma-delimited list tag string like "blue, !green" using "!" to omit a tag.
     * @category Filter
     */
    tagFilter: string

    /**
     * A [[QueryDate]] specifying a date which all drafts in the workspace must be greater than or equal to.
     * @category Filter
     */
    startDate: QueryDate

    /**
     * A [[QueryDate]] specifying a date which all drafts in the workspace must be less than or equal to.
     * @category Filter
     */
    endDate: QueryDate

    /**
     * If `true`, all (AND) tags in the tag filter must match, if `false` match any of the tags (OR)
     * @category Filter
     */
    tagFilterRequireAll: boolean

    /**
     * Show preview of draft body in list.
     * @category Display
     */
    showPreview: boolean

    /**
     * Show date information in list.
     * @category Display
     */
    showDate: boolean

    /**
     * Show draft tags in list.
     * @category Display
     */
    showTags: boolean

    /**
     * Show last logged action for draft in list.
     * @category Display
     */
    showLastAction: boolean

    /**
     * Should flagged drafts be included in inbox.
     * @category Display
     */
    inboxIncludesFlagged: boolean

    /**
     * Should flagged drafts be included in archive.
     * @category Display
     */
    archiveIncludesFlagged: boolean

    /**
     * Folder tab to select when applying the workspace.
     * @category Display
     */
    loadFolder?: draftFolderTab

    /**
     * Action group to load in action list when applying the workspace.
     * @category Display
     */
    loadActionListGroup?: ActionGroup

    /**
     * Action group to load in Action Bar when applying the workspace.
     * @category Display
     */
    loadActionBarGroup?: ActionGroup

    /**
     * Preferred light theme to load when applying the workspace.
     * @category Display
     */
    preferredLightTheme?: Theme

    /**
     * Preferred dark theme to load when applying the workspace.
     * @category Display
     */
    preferredDarkTheme?: Theme

    /**
     * Save changes made to the workspace to the database. This must be called to save changes.
     * 
     */
    update(): void

    /**
     * Set sort order for inbox.
     * @category Sort
     */
    setInboxSort(
        sortBy: sortBy, 
        sortDescending: boolean,
        sortFlaggedToTop: boolean
        ): void

    /**
     * Query for a list of drafts contained in the workspace.
     */
    query(filter: 'inbox' | 'archive' | 'flagged' | 'trash' | 'all'): Draft[]

    /**
     * Set sort order for flagged.
     * @category Sort
     */
    setFlaggedSort(
        sortBy: sortBy,
        sortDescending: boolean
    ): void

    /**
     * Set sort order for archive.
     * @category Sort
     */
    setArchiveSort(
        sortBy: sortBy,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): void

    /**
     * Set sort order for "all" drafts folder.
     * @category Sort
     */
    setAllSort(
        sortBy: sortBy,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): void

    /**
     * create a new workspace object. This is an in-memory object only, unless `update()` is called to save the it. The initial state of the workspace properties is based on the configuration of the user's default workspace.
     */
    static create(): Workspace

    /**
     * Create new instance.
     */
    constructor()

    /**
     * Get list of all available workspaces.
     */
    static getAll(): Workspace[]

    /**
     * Search for workspace matching the name passed and return it if found. Returns undefined if not found.
     */
    static find(name: string): Workspace | undefined
}/**
 * # XMLRPC
 * 
 * The XMLRPC object is a convenience method to provide an easy way to [XML-RPC](http://xmlrpc.scripting.com/) web services. The request function takes care of converting native Javascript objects and values to the XML parameters required for the XML-RPC interface, and converts the XML responses returned to Javascript objects.
 *
 * It will also return faults parsed to error messages in the response if necessary.
 *
 * This object is suitable for communication with a number of popular XML-RPC interfaces, including the [MetaWeblog API](http://xmlrpc.scripting.com/metaWeblogApi.html). WordPress also offers its own XML-RPC interface, which can be used via this object, or the convenience wrapper `WordPress` object.
 * 
 * ### Example: XML-RPC call

 * ```javascript
 * // DEMO of XML-RPC
 * // Calls example method on http://xml-rpc.net/index.html
 * 
 * let url = "http://www.cookcomputing.com/xmlrpcsamples/RPC2.ashx";
 * let methodName = "examples.getStateName";
 * let params = [20];
 * 
 * let response = XMLRPC.request(url, methodName, params);
 * 
 * if (response.success) {
 * 	alert(JSON.stringify(response.params));
 * }
 * else {
 * 	alert("Fault: " + response.faultCode + ", " + response.error);
 * 	context.fail();
 * }
 * 
 * ```
 */
declare class XMLRPC {
    /**
     * Make an XML-RPC request.
     * @param url The full URL of the XML-RPC host endpoint being called.
     * @param methodName Name of the method to call. Supported values are specific to the services provided by the host.
     * @param params The parameters to pass to the request. This should be an array of values, in the proper order, as specified by the documentation of the host being called. This array will be encoded into XML-RPC parameters in XML format by the method - only raw javascript values should be provided.
     */
    static request(url: string, methodName: string, params: any[]): XMLRPCResponse
}

/**
 * # XMLRPCResponse
 * 
 * XMLRPCResponse objects are returned by calls to using XML-RPC interfaces. For details on using XML-RPC, see [[XMLRPC]] object reference.
 */
declare class XMLRPCResponse {
    /**
     * whether the request was completed successfully. This value will be `true` if both the HTTP status code is 200 and no fault code was returned from the API.
     */
    success: boolean

    /**
     * The HTTP status code (like 200, 301, etc.) returned. This will be 200 if communication with the XML-RPC endpoint was successful, even if a fault occurred processing the request. Be sure to use the `success` property and `faultCode` to check for errors.
     */
    statusCode: number

    /**
     * The array of return parameters provided by with the XML-RPC response. Contents of this array will vary with the XML-RPC API being used.
     */
    params: any[]

    /**
     * If the XML-RPC interface returned an error, the error code will be here.
     */
    faultCode?: number

    /**
     * If an error occurred, a description of the type of error.
     */
    error?: string
}