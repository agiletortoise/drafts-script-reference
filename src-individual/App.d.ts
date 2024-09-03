type clipboardType = 'string' | 'html' | 'url'
/**
 * Drafts defines a single global `app` object which provides access to application level functions.
 * 
 * @example
 * 
 * **Toggle light-dark mode**
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
    private constructor()
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
     * 
     * @param term term to open
     * @category Utility
     */
    lookup(term: string): boolean

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
     * Returns a window object configured representing the active window.
     * @category Interface
     */
    currentWindow: Window

    /**
    * If able, open the requested draft in a new window. This method only functions on iPad and Mac. The ability to open new windows is not available on iPhone.
    * @returns `true` if successful. `false` if unable to open a new window (as on iPhone).
    * @category Interface
    */
    openInNewWindow(draft: Draft): boolean

    /**
     * @deprecated Use `app.currentWindow.loadActionGroup`
     * @category Deprecated
     */
    loadActionGroup(actionGroup: ActionGroup): boolean

    /**
     * @deprecated Use `app.currentWindow.loadActionBarGroup`
     * @category Deprecated
     */
    loadActionBarGroup(actionGroup: ActionGroup): boolean

    /**
     * @deprecated Use `app.currentWindow.loadActionBarGroup`
     * @category Deprecated
     */
    loadKeyboardActionGroup(actionGroup: ActionGroup): boolean

    /**
     * Enable and disable the iOS system sleep timer to prevent screen dimming/sleep.
     * @category Utility
     */
    setIdleDisabled(isDisabled: boolean): void

    // LIVE ACTIVITIES

    /**
     * Check if Live Activities are supported on the current device/platform.
     * @category Live Activities
     */
    readonly areLiveActivitiesSupported: boolean
    /**
     * Start a Live Activity for the selected Draft. Returns true if Live Activity started successfully. Returns false if Live Activity could not be started, or Live Activities are not supported on the device.
     * @category Live Activities
     * @param draft The draft to use in the Live Activity
     */
    startLiveActivity(draft: Draft): boolean
    /**
     * Stop a Live Activity for the selected Draft. Returns true if Live Activity stopped successfully. 
     * @category Live Activities
     * @param draft The draft to use in the Live Activity
     */
    stopLiveActivity(draft: Draft): boolean

    // CLIPBOARD FUNCTIONS

    /**
     * Get current contents of the system clipboard.
     * @category Clipboard
     * @param clipboardType Optionally specify a data type to fetch from the clipboard. Default: "string"
     */
    getClipboard(clipboardType?: clipboardType): string

    /**
     * Set the contents of the system clipboard.
     * @param contents the data to set in the clipboard. If a `string` is passed it is set in the clipboard. Optionally an object with {@link clipboardType} keys and string values can be passed to set multiple data types in the clipboard.
     * @category Clipboard
     */
    setClipboard(contents: string | object): void

    /**
     * Takes HTML string and converts it to rich-text and places it in the system clipboard. Returns true if successful, false if an error occurred in conversion.
     * @param html a possibly-valid html string
     * @category Clipboard
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

    // DEPRECATED

    /**
     * @deprecated Use `app.currentWindow.isDraftListVisible`
     * @category Deprecated
     */
    readonly isDraftListVisible: boolean

    /**
     * @deprecated Use `app.currentWindow.isActionListVisible`
     * @category Deprecated
     */
    readonly isActionListVisible: boolean

    // UI FUNCTIONS

    /**
     * @deprecated Use `app.currentWindow.showDraftList`
     * @category Deprecated
     */
    showDraftList(): void

    /**
     * @deprecated Use `app.currentWindow.hideDraftList`
     * @category Deprecated
     */
    hideDraftList(): void

    /**
     * @deprecated Use `app.currentWindow.showQuickSearch`
     * @category Deprecated
    */
    showQuickSearch(initialQuery?: string): void

    /**
    * @deprecated Use `app.currentWindow.showDraftInfo`
    * @category Deprecated
    */
    showDraftInfo(draft?: Draft): void

    /**
     * @deprecated Use `app.currentWindow.showActionList`
     * @category Deprecated
     */
    showActionList(): void

    /**
     * @deprecated Use `app.currentWindow.hideActionList`
     * @category Deprecated
     */
    hideActionList(): void
}
/**
 * Reference to current app object.
 */
declare const  app: App
