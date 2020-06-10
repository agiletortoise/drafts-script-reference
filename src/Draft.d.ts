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
 * let d = Draft.create();
 * d.content = "My new draft";
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
     * Unique identifier for the draft.
     */
    readonly uuid: string

    /**
    * The full text content of the draft.
    */
    content: string

    /**
     * The title. The first line of the draft.
     */
    readonly title: string

    /**
    * The display title. This is generally the first line of the draft, but cleaned up as it would be displayed in the draft list in the user interface, removing Markdown header characters, etc.
    */
    readonly displayTitle: string

    /**
    * The lines of text in the draft separated into an array on `\n` line feeds. This is a convenience method an equivalent to `content.split('\n');`
    */
    readonly lines: [string]

    /**
     * The preferred language grammar (syntax) to use for the draft. Can be any valid installed language grammar.
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
     * The index location in the string of the beginning of the last text selection.
     */
    readonly selectionStart: number

    /**
     * The length of the last text selection.
     */
    readonly selectionLength: number

    /**
     * Array of string tag names assigned to the draft.
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

    readonly createdAt: Date
    readonly createdLongitude: number
    readonly createdLatitude: number
    readonly modifiedAt: Date
    readonly modifiedLongitude: number
    readonly modifiedLatitude: number

    /**
     * URL which can be used to open the draft.
     */
    readonly permalink: string

    /**
     * Save changes made to the draft to the database. _This must be called to save changes made during an action’s execution._
     */
    update(): void

    /**
    * Assign a tag
    */
    addTag(tag: string): void

    /**
     * Remove a tag if it is assigned to the draft.
     */
    removeTag(tag: string): void

    /**
     * Check whether a tag is currently assigned to the draft.
     */
    hasTag(tag: string): boolean

    /**
     * Runs the template string through the template engine to evaluate tags (like `[[title]]`, `[[body]]`).
     */
    processTemplate(template: string): string

    /**
     * Set a custom template tag value for use in templates. For example, calling `setTemplateTag("mytag", "mytext")` will create a tag `[[mytag]]`, which subsequent action steps in the same action can use in their templates.
     */
    setTemplateTag(tagName: string, value: string): void

    /**
     * Get the current value of a custom template tag.
     */
    getTemplateTag(tagName: string): string

    /**
     * Array of versions representing the entire saved version history for this draft.
     */
    readonly versions: Version[]

    /**
     * Create a version in the version history representing the current state of the draft.
     */
    saveVersion()

    /**
     * Create a new draft object. This is an in-memory object only, unless "update()" is called to save the draft.
     */
    static create(): Draft

    /**
     * Find an existing draft based on UUID.
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
    */
    static queryByTitle(title: string): Draft[]

    /**
     * Return array of recently used tags. Helpful for building prompts to select tags.
     */
    static recentTags(): string[]
}
/**
 * The current draft points to the draft open in the editor when the action was run.
 */
declare const draft: Draft