/**
 * ActionLog objects represent entries in the [action log](https://docs.getdrafts.com/docs/actions/action-log.html). ActionLog objects are accessed using the `actionLogs` property of the {@link Draft} object.
 * 
 * @example
 * 
 * ```javascript
 * // loop over log entries, deleting any more than 100 days old
 * for(let log of draft.actionLogs) {
 *   if (log.executedAt < Date.today.addDays(-100)) {
 *     log.delete()
 *   }
 * }
 * ```
 */
declare class ActionLog {
    private constructor()
    /**
     * Unique identifier
     * @category Identification
     */
    readonly uuid: string
    /**
    * The content of the log
    * @category Content
    */
    readonly log: string
    /**
    * Status of the log. "failed" indicates the action ended in an error, "completed" indicates successful completion of the action.
    * @category Content
    */
    readonly status: "pending" | "in-progress" | "completed" | "failed" | "cancelled"
    /**
    * Timestamp for the creation of the log entry
    * @category Content
    */
    readonly executedAt: Date
    /**
    * The {@link Draft} object related to the log. This value may be `undefined` if the action was performed without a draft in context, or if the related draft no longer exists.
    * @category Identification
    */
    readonly draft?: Draft
    /**
    * The {@link Action} object related to the log. This value may be `undefined` if the action no longer exists.
    * @category Identification
    */
    readonly action?: Action
    /**
    * The longitude portion of the location recorded when action was executed, if location services are enabled.
    * @category Content
    */
    readonly executedLongitude: number
    /**
    * The latitude portion of the location recorded when action was executed, if location services are enabled.
    * @category Content
    */
    readonly executedLatitude: number
    /**
    * Which device the action was performed on, typically 'iPhone', 'iPad', or 'Mac'
    * @category Content
    */
    readonly executedDevice: string
    /**
    * Delete the action log. This is permanent and should be used with caution
    */
    delete()
}
