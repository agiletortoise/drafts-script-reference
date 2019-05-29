/**
 * In addition to being able to lookup an action using the find method, a single global action object is created and available in scripts to inquire about the current action and control flow.
 */
declare class Action {
    /**
     * Search for action matching the name passed and return it if found
     * @param name name to search for
     */
    static find(name: string): string | undefined

    /**
     * The display name of the action as displayed in the action list.
     */
    readonly name: string
}
/**
 * The current running action.
 */
declare const action: Action