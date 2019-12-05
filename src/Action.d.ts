/**
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
     */
    readonly name: string
}
/**
 * The current running action.
 */
declare const action: Action