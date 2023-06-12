/**
 * In addition to being able to lookup an action using the find method, a single global `action` object is created and available in scripts to inquire about the current action and control flow.
 * 
 * @example
 * 
 * **Queuing an action to run**
 * ```javascript
 * // find action by name
 * let otherAction = Action.find("Copy");
 * 
 * // queue to action to run after the current action, on the same draft
 * app.queueAction(otherAction, draft);
 * ```
 * 
 * **Branching based on current action**
 * ```javascript
 * // use global `action` to branch logic in a script reused in multiple actions
 * if (action.name == "Copy") {
 *     // do something
 * }
 * else {
 *     // do something else
 * }
 * ```
*/
declare class Action {
    private constructor()
    /**
     * Search for action matching the name passed and return it if found. Useful to lookup and action and queue it to be run using the {@link App.queueAction} function of the {@link App} object. This method will return only the first found action with the given name, be sure to avoid duplicate names in your action list.
     * @category Query
     * @param name Name of a valid, installed action.
     */
    static find(name: string): Action | undefined

    /**
     * The display name of the action as displayed in the action list.
     * @category Identification
     */
    readonly name: string

    /**
     * URL which can be used to install this Action in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
    * The unique identifier of the action group.
    * @category Identification
    */
    readonly uuid: string

    /**
    * If true, the action is a separator.
    * @category Identification
    */
    readonly isSeparator: boolean
}
/**
 * The current running action. This can be used in script to branch based on action name. 
 */
declare const  action: Action
