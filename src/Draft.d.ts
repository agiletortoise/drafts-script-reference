/**
 * The Draft object represents a single draft. When an action is run, the current draft is available as the global variable `draft`. Scripts can also create new drafts, access and set values, and update the draft to persist changes.
 */
declare class Draft {
    /**
     * Unique identifier for the draft.
     */
    readonly uuid: string
    content: string

    /**
     * The title. This is generally the first line of the draft.
     */
    readonly title: string

    /**
     * The preferred language grammar (syntax) to use for the draft.
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
     * True if draft is in the archive, false if it is in inbox.
     */
    isArchived: boolean

    /**
     * True if draft is in the trash, false if it is not.
     */
    isTrashed: boolean

    /**
     * Use to access or set flagged status.
     */
    isFlagged: boolean

    readonly createdAt: Date
    createdLongitude: number
    createdLatitude: number
    readonly modifiedAt: Date
    modifiedLongitude: number
    modifiedLatitude: number

    /**
     * URL which can be used to open the draft.
     */
    readonly permalink: string

    /**
     * Save changes made to the draft to the database. _This must be called to save changes made during an action’s execution._
     */
    update(): void

    addTag(tag: string): void

    /**
     * remove a tag if it is assigned to the draft.
     */
    removeTag(tag: string): void

    /**
     * returns boolean indicating whether the tag is currently assigned to the draft.
     */
    hasTag(tag: string): boolean

    /**
     * runs the passed template string through the template engine to evaluate tags (like `[[title]]`, `[[body]]`).
     */
    processTemplate(template: string): string

    /**
     * set a custom tag value for use in templates. For example, calling `setTemplateTag("mytag", "mytext")` will create a tag `[[mytag]]`, which subsequent action step templates can use.
     */
    setTemplateTag(tagName: string, value: string): void

    /**
     * get the current value of a custom template tag.
     */
    getTemplateTag(tagName: string): string

    /**
     * create a new draft object. This is an in-memory object only, unless "update()" is called to save the draft.
     */
    create(): Draft

    /**
     * find an existing draft based on UUID.
     */
    find(uuid: string): Draft

    /**
     * perform a search for drafts and return an array of matching draft objects.
     * @param queryString Search string, as you would type in the search box in the draft list. Will find only drafts with a matching string in their contents. Use empty string (`""`) not to filter.
     * @param filter Filter by one of the allowed values
     * @param tags Results will only include drafts with one or more of these tags assigned.
     * @param omitTags Results will omit drafts with any of these tags assigned.
     * @param sort
     * @param sortDescending If `true`, sort descending. Defaults to `false`.
     * @param sortFlaggedToTop If `true`, sort flagged drafts to beginning. Defaults to `false`.
     */
    query(
        queryString: string,
        filter: 'inbox' | 'archive' | 'flagged' | 'trash' | 'all',
        tags: string[],
        omitTags: string[],
        sort: 'created' | 'modified' | 'accessed',
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): Draft[]

    /**
     * Returns array of recently used tags. Helpful for building prompts to select tags.
     */
    recentTags(): string[]
}
declare const draft: Draft