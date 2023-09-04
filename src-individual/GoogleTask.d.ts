/**
 * Represents Task for use with {@link GoogleTask} object. Property details available in [Task API reference](https://developers.google.com/tasks/reference/rest/v1/tasks)
 */
type googleTask = object

/**
 * Represents Task List for use with {@link GoogleTask} object. Property details available in [Task API reference](https://developers.google.com/tasks/reference/rest/v1/tasklists)
 */
type googleTaskList = object

/**
 * Script integration with [Google Tasks](https://support.google.com/tasks/answer/7675772?co=GENIE.Platform%3DDesktop&hl=en). This object handles OAuth authentication and request signing. The entire [Google Tasks API](https://developers.google.com/tasks) can be used with the `request` method, and convenience methods are provided for common API endpoints to manage tasks and lists.
 *
 * Working with the return values and parameters for these methods requires an understanding of the JSON objects created and returned by the API, so refer to type specifications in the [API Reference](https://developers.google.com/tasks) for details on values supported in task and lists. Specifically, review the supported properties of the [Task](https://developers.google.com/tasks/reference/rest/v1/tasks) and [TaskList](https://developers.google.com/tasks/reference/rest/v1/tasklists) objects to understand the values included in fetched objects, and to make modifications.
 *
 * If an convenince API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * ##@# Example
 * 
 * See [Examples-Google Task]() action group in the [Drafts Directory](https://actions.getdrafts.com/). It contains several example scripted actions.
 * 
 * ```javascript
 * // create GoogleTask object
 * let gtask = GoogleTask.create();
 * // create task in "Test" list
 * let list = gtask.findList("Test");
 * let t = {
 *     "title": "My Task",
 *     "notes": "My notes on this task"
 * };
 * let task = gtask.createTask(list, t);
 */
declare class GoogleTask {
    /**
     * If a function succeeds, this property will contain the last response returned by the Google Tasks API. The JSON returned by the API will be parsed to an object and placed in this property. Refer to [Google Tasks API documentation](https://developers.google.com/tasks) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // LISTS
    /**
     * Get all lists. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasklists/list)
     * @category Lists
     */
    getLists(): googleTaskList[] | undefined

    /**
     * Get specific list by name. This is a convenience method which will fetch lists and return the first one found with a matching name.
     * @category Lists
     */
    findList(name: string): googleTaskList | undefined

    /**
     * Create list by name.
     * @category Lists
     */
    createList(name: string): googleTaskList | undefined

    // TASKS
    /**
     * Get tasks in a list. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)
     * @category Tasks
     */
    getTasks(list: object): googleTask[] | undefined
    /**
     * Get task a specific task by ID. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/list)
     * @category Tasks
     */
    getTask(list: object, taskID: String): googleTask | undefined
    /**
     * Create new task in the specified list. Note that the API adds new tasks to the top of lists. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/insert)
     * @category Tasks
     */
    createTask(list: googleTaskList, task: googleTask): googleTask | undefined
    /**
     * Update an existing task. Typical usage would be to modify the contents of a task returned by `getTask` or `getTasks` and sending the modified version as an update [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/patch)
     * @category Tasks
     */
    updateTask(list: googleTaskList, task: googleTask): googleTask | undefined
    /**
     * Move an existing task. Parameters can include `parent` or `previous` values, which should be the taskID for other tasks in the same list. Use `parent` to make the task a sub-task of another task, and `previous` to place the task in order after the specified taskID. [API documentation](https://developers.google.com/tasks/reference/rest/v1/tasks/move)
     * @category Tasks
     */
    moveTask(list: googleTaskList, task: googleTask, params: object): object | undefined

    // FUNCTIONS

    /**
     * Execute a request against the [Google Task API](https://developers.google.com/tasks). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by the API as appropriate to the request made. Refer to API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * Requests should only be made to endpoints in the Google Tasks API which require the `https://www.googleapis.com/auth/tasks` authentication scope.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Google Tasks API](https://developers.google.com/tasks). */
        url: string
        /** The HTTP method, like "GET", "POST", "PATCH", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new GoogleTask object.
     * @param identifier Optional string value used to identify a To Do account. Typically this can be omitted if you only work with one Google Task account in Drafts. Each unique identifier used for To Do accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): GoogleTask

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
