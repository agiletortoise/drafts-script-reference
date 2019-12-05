type sortDirections = 'created' | 'modified' | 'accessed' | 'name'
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
     */
    name: string

    /**
     * Search string to filter results.
     */
    queryString: string

    /**
     * Comma-delimited list tag string like "blue, !green" using "!" to omit a tag.
     */
    tagFilter: string

    /**
     * If `true`, all (AND) tags in the tag filter must match, if `false` match any of the tags (OR)
     */
    tagFilterRequireAll: boolean

    /**
     * Show preview of draft body in list.
     */
    showPreview: boolean

    /**
     * Show draft tags in list.
     */
    showTags: boolean

    /**
     * Show last logged action for draft in list.
     */
    showLastAction: boolean

    /**
     * Should flagged drafts be included in inbox.
     */
    inboxIncludesFlagged: boolean

    /**
     * Should flagged drafts be included in archive.
     */
    archiveIncludesFlagged: boolean

    /**
     * Save changes made to the workspace to the database. This must be called to save changes.
     */
    update(): void

    /**
     * Set sort order for inbox.
     */
    setInboxSort(sortBy: sortDirections, sortDescending: boolean): void

    /**
     * Query for a list of drafts contained in the workspace.
     */
    query(filter: 'inbox' | 'archive' | 'flagged' | 'trash' | 'all'): Draft[]

    /**
     * Set sort order for flagged.
     */
    setFlaggedSort(
        sortBy: sortDirections,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): void

    /**
     * Set sort order for archive.
     */
    setFlaggedSort(
        sortBy: sortDirections,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): void

    /**
     * Set sort order for "all" drafts folder.
     */
    setFlaggedSort(
        sortBy: sortDirections,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): void

    /**
     * create a new workspace object. This is an in-memory object only, unless `update()` is called to save the it. The initial state of the workspace properties is based on the configuration of the user's default workspace.
     */
    static create(): Workspace

    /**
     * Get list of all available workspaces.
     */
    static getAll(): Workspace[]

    /**
     * Search for workspace matching the name passed and return it if found. Returns undefined if not found.
     */
    static find(name: string): Workspace | undefined
}