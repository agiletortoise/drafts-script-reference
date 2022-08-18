/**
 * Reminder objects represent individual tasks in a list in the built-in Reminders app. For examples, see {@link ReminderList} documentation.
 */
declare class Reminder {
  private constructor()
    /**
     * The list which this task resides in.
     */
    list: ReminderList

    /**
     * Unique identifier for the reminder.
     */
    identifier: string

    /**
      * The title of the event.
      */
    title: string

    /**
     * Notes associated with the event.
     */
    notes: string

    /**
     * Location of the event.
     */
    location: string

    /**
    * Due date of the reminder
    */
    dueDate?: Date

    /**
    * Does the dueDate property include an assigned time. If false, assignments to the `dueDate` property will ignore time components, making the reminder due on a specific date without a time assigned.
    */
    dueDateIncludesTime: Boolean

    /**
    * Start date of the reminder
    */
    startDate?: Date

    /**
    * Does the startDate property include an assigned time. If false, assignments to the `startDate` property will ignore time components, making the reminder start on a specific date without a time assigned.
    */
    startDateIncludesTime: Boolean

    /**
    * Completion date of the reminder. This value is set automatically when the `isCompleted` property is set to true. Setting this property to `nil` will set `isCompleted` to false.
    */
    completionDate?: Date

    /**
     * Integer number representing priority. Assign values matching those Apple uses as follows:
     * * `0`: No priority
     * * `1`: High
     * * `5`: Medium
     * * `9`: Low
     */
    priority: 0 | 1 | 5 | 9

    /**
     * Flag indicating if the task has been completed.
     */
    isCompleted: boolean

    /**
     * Returns true if the reminder has any alarms.
     */
    readonly hasAlarms: boolean

    /**
     * The alarms assigned to the reminder, if any.
     */
    alarms: Alarm[]

    /**
     * Save the task. Returns true if the task is successfully saved in Reminders.
     */
    update(): boolean

    /**
     * Add an alarm object to the reminder. Be sure to `update()` to save after adding alarms. Return `true` if the alarm was successfully added. Note that reminders only support alarms created with the `Alarm.alarmWithDate` method.
     */
    addAlarm(alarm: Alarm): boolean

    /**
     * Remove any assigned alarms from the reminder.
     */
    removeAlarms(): void
}
