/**
 * # Alarm
 * 
 * Alarms are alerts which can be attached to [[Reminder]] and [[Event]] objects.
 * 
 * ### Examples
 * 
 * ```javascript
 * let list = ReminderList.findOrCreate("Errands");
 * let reminder = list.createReminder();
 * reminder.title = "Get more paper towels";
 *
 * let alarm = Alarm.alarmWithDate((3).days().fromNow());
 * reminder.addAlarm(alarm);
 * reminder.update();
 * ```
 */

declare class Alarm {
    /**
     * Alarm set to remind at a specific date/time.
     * @param date: Date
     */
    static alarmWithDate(date: Date): Alarm

    /**
     * Alarm set to remind at a specific number of seconds relative to the start date of the event. Note that alarms created with this methods are only supported on [[Event]] objects, not [[Reminder]] objects.
     * @param seconds: Number seconds from now
     */
    static alarmWithOffset(seconds: Number): Alarm
}