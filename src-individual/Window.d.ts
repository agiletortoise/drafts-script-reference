/**
 * Access `Window` properties and functions through the `currentWindow` property of the global `app` object.
 */
declare class Window {
    private constructor()
    /**
     * Array of the drafts currently selected by the user in the draft list. Can be iterated to create custom actions which operate on the selection.
     */
    selectedDrafts: Draft[]

    /**
     * Is the draft list side panel is visible.
     * @category Interface
     */
    readonly isDraftListVisible: boolean

    /**
     * Is the tag filters side panel is visible.
     * @category Interface
     */
    readonly areFiltersVisible: boolean

    /**
     * Is the action list side panel is visible.
     * @category Interface
     */
    readonly isActionListVisible: boolean

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
     * Open command palette window, optionally providing a initial query value.
     * @category Interface
    */
    showCommandPalette(initialQuery?: string): void

    /**
    * Open the "Get Info" view for a draft. If no draft is passed, the current active draft in the editor will be used.
    * @category Interface
    */
    showDraftInfo(draft?: Draft): void

    /**
     * Returns true if tabbed windows are available (Mac only)
     * @category Interface
     */
    readonly canCreateTab: boolean

    /**
    * If able, open the requested draft in a new tab in the current window. This method only functions on Mac. The ability to open new tabs is not available on iPhone or iPad.
    * @returns `true` if successful. `false` if unable to open a new tab.
    * @category Interface
    */
    openInNewTab(draft: Draft): boolean

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
     * Open tag filters side bar.
     * @category Interface
     */
    showFilters(): void

    /**
     * Close tag filters side bar.
     * @category Interface
     */
    hideFilters(): void

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
}
