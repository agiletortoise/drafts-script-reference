/**
 * Event object represent individual calendar events. For usage examples, see {@link Calendar} object documentation.
 */
declare class Event {
    /**
     * The calendar which this event resides in.
     */
    calendar: Calendar

    /**
     * Unique identifier for the event
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
    * URL associated with the event. Setting URL value will fail if the value is not a valid URL.
    */
    url?: string

    /**
     * Start date of the event.
     */
    startDate: Date

    /**
     * End date of the event.
     */
    endDate: Date

    /**
     * Flag for all day events.
     */
    isAllDay: boolean

    /**
     * Location of the event.
     */
    location: string

    /**
     * Original creation date of the event.
     */
    readonly creationDate: Date

    /**
     * Last change to the event.
     */
    readonly lastModifiedDate: Date

    /**
     * Attendees of the event as an array of objects in the format:
     * 
     * ```
     * {
     *    "isCurrentUser": false,
     *    "name": "John Appleseed",
     *    "status": "accepted",
     *    "type": "person",
     *    "role": "required"
     * }
     * ```
     */
    readonly attendees: Object[]

    /**
     * Availability for scheduling. Not supported by all Calendar servers.
     */
    availability: 'busy'
        | 'free'
        | 'tentative'
        | 'unavailable'
        | 'notSupported'

    /**
     * Returns true if the event has any alarms.
     */
    readonly hasAlarms: boolean

    /**
     * The alarms assigned to the event, if any.
     */
    alarms: Alarm[]

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Save the event. Returns true if the event is successfully saved in Calendars.
     */
    update(): boolean

    /**
     * Open the event in the system event editing card. The user will be able to modify/edit the event values and add to a calendar from this view. Returns true if the event was saved, false if the user canceled or deleted the event.
     */
    edit(): boolean

    /**
     * Add an alarm object to the event. Be sure to `update()` to save after adding alarms.
     */
    addAlarm(alarm: Alarm): void

    /**
     * Remove any assigned alarms from the event.
     */
    removeAlarms(): void
}
