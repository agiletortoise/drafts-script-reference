/** 
 * Alarms are alerts which can be attached to {@link Reminder} and {@link Event} objects.
 * 
 * @example
 * 
 * ```javascript
 * // create reminder with alarm
 * let list = ReminderList.findOrCreate("Errands")
 * let reminder = list.createReminder()
 * reminder.title = "Get more paper towels"
 *
 * let alarm = Alarm.alarmWithDate((3).days().fromNow())
 * reminder.addAlarm(alarm)
 * reminder.update()
 * ```
 */

declare class Alarm {
    /**
     * Alarm set to remind at a specific date/time.
     * @param date Specific date time to assign trigger the alarm.
     */
    static alarmWithDate(date: Date): Alarm

    /**
     * Alarm set to remind at a specific number of seconds relative to the start date of the event. Note that alarms created with this methods are only supported on {@link Event} objects, not [[Reminder objects.
     * @param seconds Number seconds from now
     */
    static alarmWithOffset(seconds: Number): Alarm

    /**
     * The date the alarm is schedule for, if it is a date-based alarm.
     */
    readonly absoluteDate?: Date

    /**
     * The relative offset in seconds for alarms scheduled relative to the event time.
     */
    readonly relativeOffset: Number
}
