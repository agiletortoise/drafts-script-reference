/**
 * # ActionGroup
 * 
 * Represents an action group. Can be used to inquire and load action groups in the action list and extended keyboard using methods on the [[App]] object.
 * 
 * ### Examples
 *
 * ```javascript
 * var group = ActionGroup.find("Basic");
 * app.loadActionGroup(group);
 * ```
 * 
 */
declare class ActionGroup {
    /**
     * Get list of all available action groups.
     */
    static getAll(): ActionGroup[]

    /**
     * Search for action group matching the name passed and return it if found. Returns `undefined` if not found.
     * @param name The display name of the action group.
     */
    static find(name: string): ActionGroup | undefined

    /**
     * The display name of the action group.
     */
    readonly name: string
}
