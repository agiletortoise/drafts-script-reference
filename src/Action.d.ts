/**
 * @module Global
 * # Action
 * 
 * In addition to being able to lookup an action using the find method, a single global `action` object is created and available in scripts to inquire about the current action and control flow.
 * 
 * ### Example
 * 
 * ```javascript
 * // find action
 * let action = Action.find("Copy");
 * 
 * // queue to action to run after the current action
 * app.queueAction(action, draft);
```
 */
declare class Action {
    /**
     * Search for action matching the name passed and return it if found. Useful to lookup and action and queue it to be run using `app.queueAction(action, draft)`
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
    */
    readonly isSeparator: boolean
}
/**
 * The current running action.
 */
declare const action: Action