/**
 * Represents an action group. Can be used to inquire and load action groups in the action list and action bar using methods on the {@link App} object.
 * 
 * @example
 * 
 * **Loading action group in action list**
 *
 * ```javascript
 * let group = ActionGroup.find("Basic")
 * app.currentWindow.loadActionGroup(group)
 * ```
 * 
 */
declare class ActionGroup {
    private constructor()
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
