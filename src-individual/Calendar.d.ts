/**
 * Calendar objects are used to manipulate and create calendars in the built-in Calendars app and its associated accounts.
 * 
 * @example
 * 
 * **Event Creation**
 * 
 * ```javascript
 * let calendar = Calendar.findOrCreate("Activities");
 * let event = calendar.createEvent();
 * event.title = "Dinner Party";
 * event.notes = "Bring side dish.";
 * event.startDate = Date.parse("7pm next friday");
 * event.endDate = Date.parse("10pm next friday");
 * event.isAllDay = false;
 * if (!event.update()) {
 *   console.log(event.lastError);
 * }
 * ```
 * 
 * **Reading Calendar Events**
 * 
 * ```javascript
 * // load a calendar
 * let cal = Calendar.find("Test");
 * // loop over events in the last 30 days and alert the name of each.
 * if (cal) {
 * 	let events = cal.events((30).days().ago(), new Date());
 * 	for (let event of events) {
 * 		alert(event.title);
 * 	}
 * }
 * ```
 */
declare class Calendar {
    title: string
    /**
     * A Boolean value that indicates whether you can add, edit, and delete items in the calendar.
     */
    allowsContentModificationx: boolean
    /**
     * A Boolean value indicating whether the calendar’s properties can be edited or deleted.
     */
    isImmutable: boolean

    /**
     * Save changes to the calendar.
     */
    update(): boolean

    /**
     * Create a new Event object in this calendar.
     */
    createEvent(): Event

    /**
     * Returns array of events on the calendar between the start and end dates specified.
     */
    events(startDate: Date, endDate: Date): Event[]

    /**
     * Searches for a calendar matching the title. If none is found, creates a new list with that title in your default calendars account. If more than one calendar with the same name exist in Calendars, the first found will be returned.
     */
    static findOrCreate(title: string): Calendar

    /**
     * Searches for a calendar matching the title. If none is found, return `undefined`.
     */
    static find(title: string): Calendar | undefined

    /**
     * Get an array all known calendars on the device.
     */
    static getAllCalendars(): Calendar[]

    /**
     * Returns the system default calendar configured for new events.
     */
    static default(): Calendar
}

