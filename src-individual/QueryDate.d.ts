type queryDateType = 'relative' | 'absolute'
type queryDateField = 'created' | 'modified' | 'accessed'
/**
 * Represents a dynamic date for use in queries. `QueryDate` is used when configuring {@link Workspace} objects `startDate` and `endDate` properties.
 * 
 * QueryDates always specify a date with time components being ignored. If used a the start of a query range, the time will be moved to the beginning of that day. If used at the end of a query range, time will be moved to the end of that day.
 * 
 * @example
 * 
 * **Create Workspace with date range**
 * 
 * ```javascript
 * // create a workspace
 * let workspace = new Workspace();
 * 
 * // create a QueryDate for three days ago
 * let start = new QueryDate();
 * start.field = "created"
 * start.type = "relative"
 * start.days = -3;
 * 
 * // create a QueryDate for specific date
 * let qDate = new QueryDate();
 * qDate.field = "modified"
 * qDate.type = "absolute"
 * qDate.date = Date.today();
 * 
 * // assign to the workspace and apply
 * workspace.startDate = start; // .endDate also available
 * app.applyWorkspace(workspace);
 * ```
 */
declare class QueryDate {
    /**
     * The date field to use when querying
     */
    field: queryDateField

    /**
     * The type of date range. "relative" dates use the `days` property to add days to the current date when evaluating a query. "absolute" type query dates use the `date` property for a specific day.
     */
    type: queryDateType

    /**
     * Integer number of days to when evaluating query dates of "relative". This value can be negative. For example, a "relative" type with "-3" days, will always evaluated to 3 days ago when the query is run.
     */
    days: number

    /**
     * Absolute date to use when evaluating the query dates of "absolute" type.
     */
    date: Date

    /**
     * Create a new instance.
     */
    static create(): Workspace

    /**
     * Create a new instance.
     */
    constructor()
}
