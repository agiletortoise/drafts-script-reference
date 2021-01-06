/**
 * # App
 * 
 * Drafts defines a single global `app` object which provides access to application level functions.
 */
declare class App {
    /**
     * Returns true if app has an active Drafts Pro subscription.
    */
    readonly isPro: boolean

    /**
     * Version number of current installation of Drafts.
     */
    readonly version: string

    /**
     * Get or set themeMode.
     */
    themeMode: 'light' | 'dark' | 'automatic'

    /**
     * Returns the active theme mode, light or dark, taking into account automatic switching of themes if active. If writing scripts to branch logic based on the current mode, this is the best property to use.
     */
    readonly currentThemeMode: 'light' | 'dark'

    /**
     * Is the draft list side panel is visible.
     */
    readonly isDraftListVisible: boolean

    /**
     * Is the action list side panel is visible.
     */
    readonly isActionListVisible: boolean

    /**
     * Is system sleep timer disabled preventing screen dimming/sleep.
     */
    isIdleDisabled: boolean

    /**
     * Request system opens the URL passed. Returns true if URL was opened, false if the URL was invalid or no available app can open the URL on the device.
     * @param url url to open
     * @param useSafari whether to use the Safari View Controller (true) or default browser (false).
     */
    openURL(url: string, useSafari?: boolean): boolean

    /**
     * Queues an action to run on a draft after the current action is complete.
     * @param action Actions can be obtained using the `Action.find(name)` method.
     * @param draft A draft object.
     */
    queueAction(action: Action, draft: Draft): boolean

    /**
     * Open draft selection interface and wait for user to select a draft. Returns the select draft object, or `undefined` if user cancelled.
     * @param workspace If provided, the workspace will define the default filtering, display, and sort options for the selection window.
     */
    selectDraft(workspace?: Workspace): Draft | undefined

    // UI FUNCTIONS

    /**
     * Open draft list side bar.
     */
    showDraftList(): void

    /**
     * Close draft list side bar.
     */
    hideDraftList(): void

    /**
     * Open quick search window, optionally providing a initial query value.
    */
    showQuickSearch(initialQuery?: string): void

    /**
    * Open the "Get Info" view for a draft. If no draft is passed, the current active draft in the editor will be used.
    */
    showDraftInfo(draft?: Draft): void

    /**
    * If able, open the requested draft in a new window. This method only functions on iPad and Mac. The ability to open new windows is not available on iPhone.
    * @returns `true` if successful. `false` if unable to open a new window (as on iPhone).
    */
    openInNewWindow(draft: Draft): boolean

    /**
     * Open action list side bar.
     */
    showActionList(): void

    /**
     * Close action list side bar.
     */
    hideActionList(): void

    /**
     * Apply the Workspace as if it was selected in draft list. Calling this function with no arguments will clear filters and apply the default workspace.
     **/
    applyWorkspace(workspace?: Workspace): boolean

    /**
     * Returns a workspace object configured like the workspace currently loaded in the draft list of the active window. Useful when creating logic which reacts contextually to the workspace loaded.
     */
    currentWorkspace: Workspace

    /**
     * Load the ActionGroup in the action list side bar.
     */
    loadActionGroup(actionGroup: ActionGroup): boolean

    /**
     * Load the ActionGroup in the action bar below editor.
     */
    loadActionBarGroup(actionGroup: ActionGroup): boolean

    /**
     * @deprecated replaced by `loadActionBarGroup`.
     */
    loadKeyboardActionGroup(actionGroup: ActionGroup): boolean

    /**
     * Enable and disable the iOS system sleep timer to prevent screen dimming/sleep.
     */
    setIdleDisabled(isDisabled: boolean): void

    // CLIPBOARD FUNCTIONS

    /**
     * Get current contents of the system clipboard.
     */
    getClipboard(): string

    /**
     * Set the contents of the system clipboard.
     * @param string the data to set
     */
    setClipboard(contents: string): void

    /**
     * Takes HTML string and converts it to rich-text and places it in the system clipboard. Returns true if successful, false if an error occurred in conversion.
     * @param html a possibly-valid html string
     */
    htmlToClipboard(html: string): boolean

    // MESSAGES FUNCTIONS
    /**
     * Show success banner notification with the message passed.
     */
    displaySuccessMessage(message: string): void
    /**
     * Show info banner notification with the message passed.
     */
    displayInfoMessage(message: string): void
    /**
     * Show warning banner notification with the message passed.
     */
    displayWarningMessage(message: string): void
    /**
     * Show error banner notification with the message passed.
     */
    displayErrorMessage(message: string): void
}
/**
 * Reference to current app object.
 */
declare const app: App