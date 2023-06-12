/**
 * The `name` option sorts by full text of the draft, otherwise the sort is based on the specified date value. 
 */
type sortBy = 'created' | 'modified' | 'accessed' | 'name'
type flagStatus = 'flagged' | 'unflagged' | 'any'
/**
 * Represents a Workspace. Can be used to inquire and load workspaces and apply them using methods on the {@link App} object.
 * 
 * Note that is can also be useful in script to create and load temporary workspaces to apply filters or query drafts. If you create a new `Workspace` object and never call `update()` that workspace will not be saved after the end of an action's execution.
 * 
 * @example
 * 
 * **Find and Load Workspace**
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
     * Filter by flagged status of drafts.
     * @category Filter
     */
    flaggedStatus: flagStatus

    /**
     * A {@link QueryDate} specifying a date which all drafts in the workspace must be greater than or equal to.
     * @category Filter
     */
    startDate: QueryDate

    /**
     * A {@link QueryDate} specifying a date which all drafts in the workspace must be less than or equal to.
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
}
