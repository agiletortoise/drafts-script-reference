/**
 * ReminderList objects are used to manipulate and create lists in the built-in Reminders app.
 * 
 * @example
 * 
 * ```javascript
 * declare const  list = ReminderList.findOrCreate("Groceries");
 * let reminder = list.createReminder();
 * reminder.title = "Bananas";
 * reminder.notes = "Get slightly green ones."
 * reminder.update();
 * ```
 */
declare class ReminderList {
    /**
     * The name of the list.
     */
    title: string
    /**
     * All reminders in the list.
     */
    readonly tasks: Reminder[]
    /**
     * Reminders in the list which are NOT completed.
     */
    readonly incompleteTasks: Reminder[]
    /**
     * Reminders in the list which have been marked completed.
     */
    readonly completeTasks: Reminder[]

    /**
     * Save changes to the list.
     */
    update(): boolean

    /**
     * Create a new Reminder object in this list
     */
    createReminder(): Reminder

    /**
     * Searches for a list in the reminders app matching the title. If none is found, creates a new list with that title. If more than one list with the same name exist in Reminders, the first found will be returned.
     */
    static findOrCreate(title: string): ReminderList

    /**
     * Searches for a reminder lists matching the title. If none is found, return undefined.
     */
    static find(title: string): ReminderList

    /**
     * Get an array all known reminder lists on the device.
     */
    static getAllReminderLists(): ReminderList[]

    /**
     * Returns the system default reminder list configured for new reminders.
     */
    static default(): ReminderList
}
