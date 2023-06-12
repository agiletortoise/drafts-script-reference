/**
 * Script integration with [Todoist](http://todoist.com/). This object handles OAuth authentication and request signing. The entire [Todoist REST API](https://developer.todoist.com/rest/v1/) can be used with the request method, and convenience methods are provided for common API endpoints to manage tasks, projects, comments and labels.
 *
 * The `quickAdd` method is mostly likely what you are looking for to create tasks as it supports the shorthand the task entry box in Todoist supports to parse projects, etc.
 *
 * Other methods are direct mappings of the REST API calls provided by Todoist. Most take an `options` parameter which is a javascript object containing the parameters to be passed to the API, and and the method decodes the JSON response from Todoist and returns it as a Javascript object (or array of objects) with the values as specified in the Todoist API docs.
 *
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 * @example
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
     * If a function succeeds, this property will contain the last response returned by Todoist. The JSON returned by Todoist will be parsed to an object and placed in this property. Refer to [Todoist API documentation](https://developer.todoist.com/rest/v8) for details on the contents of this object based on call made.
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
     * @param options Optional dictionary of additional parameters to include in the request.
     * @returns Object containing respose data from Todoist.
     */
    quickAdd(text: string, note?: string, reminder?: string, options?: object): object

    // TASKS
    /**
     * Get active tasks. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-active-tasks)
     * @category Tasks
     */
    getTasks(options?: object): object[]
    /**
     * Create new task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-task)
     * @category Tasks
     */
    createTask(options: object): object
    /**
     * Get active task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-an-active-task)
     * @category Tasks
     */
    getTask(taskId: string): object
    /**
    * Update active task. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-task)
    * @category Tasks
    */
    updateTask(taskId: string, options: object): object
    /**
     * Close task (mark complete)
     * @category Tasks
     */
    closeTask(taskId: string): boolean
    /**
     * Reopen task (mark incomplete)
     * @category Tasks
     */
    reopenTask(taskId: string): boolean

    // PROJECTS
    /**
    * Get all projects. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-projects)
    * @category Projects
    */
    getProjects(): object[]
    /**
    * Create new project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-project)
    * @category Projects
    */
    createProject(options: object): object
    /**
    * Get project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-project)
    * @category Projects
    */
    getProject(projectId: string): object
    /**
    * Update project. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-project)
    * @category Projects
    */
    updateProject(projectId: string, options: object): object

    // SECTIONS
    /**
    * Get all sections. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-sections)
    * @category Sections
    */
    getSections(): object[]
    /**
     * Get project sections. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-project-sections)
     * @category Sections
     */
    getProjectSections(projectId: string): object[]
    /**
    * Create new section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-section)
    * @category Sections
    */
    createSection(options: object): object
    /**
    * Get section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-single-section)
    * @category Sections
    */
    getSection(sectionId: string): object
    /**
    * Update section. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-section)
    * @category Sections
    */
    updateSection(sectionId: string, options: object): object

    // COMMENTS
    /**
    * Get all comments. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-comments)
    * @category Comments
    */
    getComments(options: object): object[]
    /**
    * Create new comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-comment)
    * @category Comments
    */
    createComment(options: object): object
    /**
    * Get comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-comment)
    * @category Comments
    */
    getComment(commentId: string): object
    /**
    * Update comment. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-comment)
    * @category Comments
    */
    updateComment(commentId: string, options: object): object

    // LABELS
    /**
    * Get all labels. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-all-labels)
    * @category Labels
    */
    getLabels(): object[]
    /**
    * Create new labels. [Todoist API documentation](https://developer.todoist.com/rest/v1/#create-a-new-label)
    * @category Labels
    */
    createLabel(options: object): object
    /**
    * Get label. [Todoist API documentation](https://developer.todoist.com/rest/v1/#get-a-label)
    * @category Labels
    */
    getLabel(labelId: string): object
    /**
    * Update label. [Todoist API documentation](https://developer.todoist.com/rest/v1/#update-a-label)
    * @category Labels
    */
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
