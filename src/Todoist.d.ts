/**
 * # Todoist
 * 
 * Script integration with [Todoist](http://todoist.com/). This object handles OAuth authentication and request signing. The entire [Todoist REST API](https://developer.todoist.com/rest/v1/) can be used with the request method, and convenience methods are provided for common API endpoints to manage tasks, projects, comments and labels.
 *
 * The `quickAdd` method is mostly likely what you are looking for to create tasks as it supports the shorthand the task entry box in Todoist supports to parse projects, etc.
 *
 * Other methods are direct mappings of the REST API calls provided by Todoist. Most take an `options` parameter which is a javascript object containing the parameters to be passed to the API, and and the method decodes the JSON response from Todoist and returns it as a Javascript object (or array of objects) with the values as specified in the Todoist API docs.
 *
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * ### Example
 * 
 * See [Examples-Todoist](https://actions.getdrafts.com/g/1L3) action group in the [Action Directory](https://actions.getdrafts.com/).
 * 
 * ```javascript
 * // create Todoist object
 * let todoist = Todoist.create();
 * // create task in inbox
 * todoist.createTask({
 *   "content": "My Task Name",
 *   "due_string": "Next wednesday"
 * });
 * ```
 */
declare class Todoist {
    /**
     * If a function success, this property will contain the last response returned by Todoist. The JSON returned by Todoist will be parsed to an object and placed in this property. Refer to [Todoist API documentation](https://developer.todoist.com/rest/v8) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    /**
     * @param text Text to use to create the task. Supports Todoist quick add notation for specifying projects, priority, labels, etc. just as if you were using the Todoist quick add window.
     * @param note Optional text to attach as a comment with the task.
     * @param reminder Optional natural language date specifying for creating a task reminder.
     * @returns Object containing respose data from Todoist.
     */
    quickAdd(text: string, note?: string, reminder?: string): object

    // TASKS
    getTasks(options?: object): object[]
    createTask(options: object): object
    getTask(taskId: string): object
    updateTask(taskId: string, options: object): object

    /**
     * Close task (mark complete)
     */
    closeTask(taskId: string): boolean

    /**
     * Reopen task (mark incomplete)
     */
    reopenTask(taskId: string): boolean

    // PROJECTS
    getProjects(): object[]
    createProject(options: object): object
    getProject(projectId: string): object
    updateProject(projectId: string, options: object): object

    // COMMENTS
    getComments(options: object): object[]
    createComment(options: object): object
    getComment(commentId: string): object
    updateComment(commentId: string, options: object): object

    // LABELS
    getLabels(): object[]
    createLabel(options: object): object
    getLabel(labelId: string): object
    updateLabel(labelId: string, options: object): object

    // FUNCTIONS

    /**
     * Execute a request against the Todoist API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Todoist as appropriate to the request made. Refer to Todoist’s API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Todoist REST API](https://developer.todoist.com/rest/v1/). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Todoist object.
     * @param identifier Optional string value used to identify a Todoist account. Typically this can be omitted if you only work with one Todoist account in Drafts. Each unique identifier used for Todoist accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Todoist

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
