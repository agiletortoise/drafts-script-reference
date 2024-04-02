/**
 * Represents Task for use with {@link MicrosoftToDo} object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/todotask?view=graph-rest-1.0)
 */
type microsoftToDoTask = object

/**
 * Represents Task List for use with {@link MicrosoftToDo} object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/todotasklist?view=graph-rest-1.0)
 */
type microsoftToDoTaskList = object

/**
 * Represents Linked Resource for use with {@link MicrosoftToDo} object. Property details available in [To Do API reference](https://docs.microsoft.com/en-us/graph/api/resources/linkedresource?view=graph-rest-1.0)
 */
type microsoftToDoLinkedResource = object

/**
 * Script integration with [Microsoft To Do](https://to-do.office.com/tasks). This object handles OAuth authentication and request signing. The entire [Microsoft To Do Graph API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) can be used with the `request` method, and convenience methods are provided for common API endpoints to manage tasks and lists.
 *
 * Working with the return values and parameters for these methods requires an understanding of the JSON objects created and returned by the API, so refer to type specifications in the [API Reference](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) for details on values supported in task and lists. Specifically, review the supported properties of the [Task](https://docs.microsoft.com/en-us/graph/api/resources/todotask?view=graph-rest-1.0) and [TaskList](https://docs.microsoft.com/en-us/graph/api/resources/todotasklist?view=graph-rest-1.0) objects to understand the values included in fetched objects, and to make modifications.
 *
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * @example
 * 
 * See [Examples-Microsoft To Do](https://actions.getdrafts.com/g/1m3) action group in the [Drafts Directory](https://actions.getdrafts.com/). It contains several example scripted actions.
 * 
 * ```javascript
 * // create MicrosoftToDo object
 * let todo = MicrosoftToDo.create();
 * // create task in "Test" list
 * let list = todo.findList("Test");
 * // create task object, more properties available, see API docs
 * let task = {
 *   "title": `Task Title`,
 *   "importance": "high",
 *   "body": {
 *       "content": "Notes for the task",
 *       "contentType": "text"
 *   };
 *   "dueDateTime": {
 *       "dateTime": Date.today().addDays(1).toISOString(),
 *       "timeZone": "UTC"
 *   }
 * };
 * let t = todo.createTask(list, task);
 * ```
*/
declare class MicrosoftToDo {
    /**
     * If a function succeeds, this property will contain the last response returned by the To Do API. The JSON returned by the API will be parsed to an object and placed in this property. Refer to [To Do API documentation](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // LISTS
    /**
     * Get all lists. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-list-tasks?view=graph-rest-1.0&tabs=http)
     * @category Lists
     */
    getLists(): microsoftToDoTaskList[] | undefined

    /**
     * Get specific list by name. This is a convenience method which will fetch lists and return the first one found with a matching name.
     * @category Lists
     */
    findList(name: string): microsoftToDoTaskList | undefined

    /**
     * Create list by name.
     * @category Lists
     */
    createList(name: string): microsoftToDoTaskList | undefined

    // TASKS
    /**
     * Get tasks in a list. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-get?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    getTasks(list: microsoftToDoTaskList): microsoftToDoTask[] | undefined
    /**
     * Get a specific task by ID. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotask-get?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    getTask(list: microsoftToDoTaskList, taskID: String): microsoftToDoTask | undefined
    /**
     * Create new task in the specified list. [API documentation](https://docs.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    createTask(list: microsoftToDoTaskList, task: microsoftToDoTask): microsoftToDoTask | undefined
    /**
     * Update an existing task. Typical usage would be to modify the contents of a task returned by `getTask` or `getTasks` and sending the modified version as an update [API documentation](https://docs.microsoft.com/en-us/graph/api/todotask-update?view=graph-rest-1.0&tabs=http)
     * @category Tasks
     */
    updateTask(list: microsoftToDoTaskList, task: microsoftToDoTask): microsoftToDoTask | undefined

    /**
     * Create new linked resource for a task. A linked resource is a reference to content in an external system, such as a link back to a draft. [API documentation](https://docs.microsoft.com/en-us/graph/api/resources/linkedresource?view=graph-rest-1.0)
     * @category Linked Resource
     */
    createLinkedResource(list: microsoftToDoTaskList, task: microsoftToDoTask, linkedResource: microsoftToDoLinkedResource): microsoftToDoLinkedResource | undefined

    // FUNCTIONS

    /**
     * Execute a request against the [Microsoft To Do API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by the API as appropriate to the request made. Refer to API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * Requests should only be made to endpoints in the Microsoft Graph API which require the `Task.ReadWrite` authentication scope.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [To Do API](https://docs.microsoft.com/en-us/graph/api/resources/todo-overview?view=graph-rest-1.0). */
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
     * Creates a new MicrosoftToDo object.
     * @param identifier Optional string value used to identify a To Do account. Typically this can be omitted if you only work with one To Do account in Drafts. Each unique identifier used for To Do accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): MicrosoftToDo

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
