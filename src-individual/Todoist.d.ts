/**
 * > **Update Note**
 * > Drafts v49 modified convenience methods on this object to point to the new v1 API. Previous REST API is being shutdown in February 2026. 
 * 
 * Script integration with [Todoist](http://todoist.com/). This object handles OAuth authentication and request signing. The entire [Todoist API](https://developer.todoist.com/api/v1) can be used with the request method, and convenience methods are provided for common API endpoints to manage tasks, projects, comments and labels.
 *
 * The `quickAdd` method is mostly likely what you are looking for to create tasks as it supports the shorthand the task entry box in Todoist supports to parse projects, etc.
 *
 * Other methods are direct mappings of the API calls provided by Todoist. Most take an `options` parameter which is a javascript object containing the parameters to be passed to the API, and and the method decodes the JSON response from Todoist and returns it as a Javascript object (or array of objects) with the values as specified in the Todoist API docs.
 * 
 * Note that the `get...` methods that return multiple items will return the array of items from the Todoist response, not the entire response object. This is to maintain compatibility with older versions of the API. If you need support for pagination, you can use the `request` method to make direct API calls, or access the full response in the `lastResponse` property after making one of these calls.
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
     * If a function succeeds, this property will contain the last response returned by Todoist. The JSON returned by Todoist will be parsed to an object and placed in this property. Refer to [API reference](https://developer.todoist.com/api/v1) for details on the contents of this object based on call made.
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
     * Get active tasks. [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/get_tasks_api_v1_tasks_get)
     * @param options Optional dictionary of additional parameters to include in the request.
     * @category Tasks
     */
    getTasks(options?: object): object[]
    /**
     * Get tasks that match the filter parameter passed. [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/get_tasks_by_filter_api_v1_tasks_filter_get)
     * @param options Optional dictionary of additional parameters to include in the request.
     * @category Tasks
     */
    getTasksByFilter(options?: object): object[]
    /**
     * Create new task. [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/create_task_api_v1_tasks_post)
     * @param options Optional dictionary of additional parameters to include in the request.
     * @category Tasks
     */
    createTask(options: object): object
    /**
     * Get task. [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/get_task_api_v1_tasks__task_id__get)
     * @category Tasks
     */
    getTask(taskId: string): object
    /**
    * Update active task. [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/update_task_api_v1_tasks__task_id__post)
    * @category Tasks
    */
    updateTask(taskId: string, options: object): object
    /**
     * Close task (mark complete). [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/close_task_api_v1_tasks__task_id__close_post)
     * @category Tasks
     */
    closeTask(taskId: string): boolean
    /**
     * Reopen task (mark incomplete). [API reference](https://developer.todoist.com/api/v1/#tag/Tasks/operation/reopen_task_api_v1_tasks__task_id__reopen_post)
     * @category Tasks
     */
    reopenTask(taskId: string): boolean

    // PROJECTS
    /**
    * Get all projects. Returns the `result` key from the response, which is an array of objects. If you need access to the full response for pagination, it can be accessed using the `lastResponse` property after the method call. [API reference](https://developer.todoist.com/api/v1/#tag/Projects/operation/get_projects_api_v1_projects_get)
    * @category Projects
    */
    getProjects(options?: object): object[]
    /**
    * Create new project. [API reference](https://developer.todoist.com/api/v1/#tag/Projects/operation/create_project_api_v1_projects_post)
    * @category Projects
    */
    createProject(options: object): object
    /**
    * Get project. [API reference](https://developer.todoist.com/api/v1/#tag/Projects/operation/get_project_api_v1_projects__project_id__get)
    * @category Projects
    */
    getProject(projectId: string): object
    /**
    * Update project. [API reference](https://developer.todoist.com/api/v1/#tag/Projects/operation/update_project_api_v1_projects__project_id__post)
    * @category Projects
    */
    updateProject(projectId: string, options: object): object

    // SECTIONS
    /**
    * Get sections. If you need access to the full response for pagination, it can be accessed using the `lastResponse` property after the method call. [API reference](https://developer.todoist.com/api/v1/#tag/Sections/operation/get_sections_api_v1_sections_get)
    * @category Sections
    */
    getSections(options?: object): object[]
    /**
     * Get project sections. If you need access to the full response for pagination, it can be accessed using the `lastResponse` property after the method call. [API reference](https://developer.todoist.com/api/v1/#tag/Sections/operation/get_sections_api_v1_sections_get)
     * @category Sections
     */
    getProjectSections(projectId: string): object[]
    /**
    * Create new section. [API reference](https://developer.todoist.com/rest/v1/#create-a-new-section)
    * @category Sections
    */
    createSection(options: object): object
    /**
    * Get section. [API reference](https://developer.todoist.com/api/v1/#tag/Sections/operation/create_section_api_v1_sections_post)
    * @category Sections
    */
    getSection(sectionId: string): object
    /**
    * Update section. [API reference](hhttps://developer.todoist.com/api/v1/#tag/Sections/operation/update_section_api_v1_sections__section_id__post)
    * @category Sections
    */
    updateSection(sectionId: string, options: object): object

    // COMMENTS
    /**
    * Get comments. If you need access to the full response for pagination, it can be accessed using the `lastResponse` property after the method call. [API reference](https://developer.todoist.com/rest/v1/#get-all-comments)
    * @category Comments
    */
    getComments(options: object): object[]
    /**
    * Create new comment. [API reference](https://developer.todoist.com/api/v1/#tag/Comments/operation/create_comment_api_v1_comments_post)
    * @category Comments
    */
    createComment(options: object): object
    /**
    * Get comment. [API reference](https://developer.todoist.com/api/v1/#tag/Comments/operation/get_comment_api_v1_comments__comment_id__get)
    * @category Comments
    */
    getComment(commentId: string): object
    /**
    * Update comment. [API reference](https://developer.todoist.com/api/v1/#tag/Comments/operation/update_comment_api_v1_comments__comment_id__post)
    * @category Comments
    */
    updateComment(commentId: string, options: object): object

    // LABELS
    /**
    * Get labels. If you need access to the full response for pagination, it can be accessed using the `lastResponse` property after the method call. [API reference](https://developer.todoist.com/rest/v1/#get-all-labels)
    * @category Labels
    */
    getLabels(options?: object): object[]
    /**
    * Create new labels. [API reference](https://developer.todoist.com/api/v1/#tag/Labels/operation/get_labels_api_v1_labels_get)
    * @category Labels
    */
    createLabel(options: object): object
    /**
    * Get label. [API reference](https://developer.todoist.com/api/v1/#tag/Labels/operation/create_label_api_v1_labels_post)
    * @category Labels
    */
    getLabel(labelId: string): object
    /**
    * Update label. [API reference](https://developer.todoist.com/api/v1/#tag/Labels/operation/update_label_api_v1_labels__label_id__post)
    * @category Labels
    */
    updateLabel(labelId: string, options: object): object

    // FUNCTIONS

    /**
     * Execute a request against the Todoist API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Todoist as appropriate to the request made. Refer to Todoist’s API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Todoist REST API](https://developer.todoist.com/api/v1/). */
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
