type draftFolderTab = 'inbox' | 'flagged' | 'archive' | 'trash' | 'all'
/**
 * The Draft object represents a single draft. When an action is run, the current draft is available as the global variable `draft`. Scripts can also create new drafts, access and set values, and update the draft to persist changes.
 * 
 * @example
 * 
 * **Creating a draft**
 * 
 * ```javascript
 * // create a new draft, assign content and save it
 * let d = new Draft();
 * d.content = "My new draft";
 * d.addTag("personal");
 * d.update();
 * ```
 * 
 * **Querying drafts**
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
     * Convenience method to filter lines of a draft, returning only the lines that begin with a certain string. 
     */
    linesWithPrefix(prefix: string): [string]

    /**
    * Convenience method to scan the draft content for valid URLs, and return all found URLs as an array. This will return valid full URL strings - both for `http(s)` and custom URLs found in the text.
    */
    readonly urls: [string]

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
    syntax: Syntax

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
     * Insert text into the draft's `content` at the line indicated. This is a convenience function.
     * @param text The text to in
     * @param line The index of the line number at which to insert the text. Line numbers are zero-based, so `0` is the first line. Drafts will range-check the line.
     */
    insert(text: string, line: number): void

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
     * @param queryString Search string, as you would type in the search box in the draft list. Will find only drafts with a matching string in their contents. Use empty string (`""`) not to filter. Support query string structured details available in [User Guide](https://docs.getdrafts.com/docs/drafts/filtering#searching-drafts).
     * @param filter Filter by one of the allowed values
     * @param tags Results will only include drafts with all the listed tags assigned.
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
        sort: sortBy,
        sortDescending: boolean,
        sortFlaggedToTop: boolean
    ): Draft[]

    /**  
    * Search for drafts containing the title string in the first line of their content. This mimics the logic used by the `/open?title=Title` URL scheme to locate drafts by title when triggering embedded [cross-links](https://docs.getdrafts.com/docs/drafts/cross-linking).
    * @category Querying
    */
    static queryByTitle(title: string): Draft[]

    /**
     * @category Deprecated
     * @deprecated use `Tag.recentTags()` instead.
     */
    static recentTags(): string[]

    /**
     * Provide standard object representation of draft, compatible with `JSON.stringify`.
     */
    toJSON(): object

    /**
    * Array of navigation markers in the content. Navigation markers are defined by the syntax definition assigned to the draft, and are used in the [Navigation](https://docs.getdrafts.com/docs/editor/navigation) feature. 
    * @category Navigation Markers
    */
    navigationMarkers: [navigationMarker]

    /**
    * The next navigation marker in the content, relative to the character location. This is a convenience method to assist in navigating by marker.
    * @category Navigation Markers
    */
    navigationMarkerAfter(location: number): navigationMarker
    /**
    * The previous navigation marker in the content, relative to the character location. This is a convenience method to assist in navigating by marker.
    * @category Navigation Markers
    */
    navigationMarkerBefore(location: number): navigationMarker
    /**
    * Convenience method to return the linked items in the content, as located by the syntax definitions' `linkDefinitions`. In Markdown syntaxes, these map to `[[wiki-style]]` cross-links.
    * @category Linked Items
    */
    readonly linkedItems: [linkedItem]

    /**
     * Array of task lines found in the content of the draft, based on active syntax definition for the draft. See {@link Task} documentation for usage details. Includes all found tasks, regardless of status.
     * @category Tasks
     */
    readonly tasks: [Task]

    /**
     * Array of incomplete task lines found in the content of the draft, based on active syntax definition for the draft. See {@link Task} documentation for usage details.
     * @category Tasks
     */
    readonly incompleteTasks: [Task]

    /**
     * Array of completed task lines found in the content of the draft, based on active syntax definition for the draft. See {@link Task} documentation for usage details.
     * @category Tasks
     */
    readonly completedTasks: [Task]
    /**
    * Update the text representing the task to a completed state as defined by syntax. _Note that the task object is not updated to reflect changes made._
    * @category Tasks
    * @returns boolean If `true`, completion was successful
    */
    completeTask(task: Task): boolean
    /**
    * Update the text representing the task to a next valid state as defined by syntax. If this task has only two states, this is effectively a toggle, if more than two states exist, the next state will be set, including cycling around to the initial state. _Note that the task object is not updated to reflect changes made._
    * @category Tasks
    * @returns boolean If `true`, advance was successful
    */
    advanceTask(task: Task): boolean
    /**
    * Update the text representing the task to a initial state as defined by syntax. _Note that the task object is not updated to reflect changes made._
    * @category Tasks
    * @returns boolean If `true`, reset was successful
    */
    resetTask(task: Task): boolean
}
/**
 * When an action is run, a single draft is always in context and accessible via the `draft` const. This usually points to the draft loaded in the editor at the time the action was run if running actions from the action list or action bar. 
 */
declare const  draft: Draft

