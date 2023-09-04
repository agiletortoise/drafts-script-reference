/**
 * 
*/

/**
 * Wraps an array of todo and/or project items and encodes them into a URL for use to send the request to Things.
 * 
 * ## Things Integration Notes
 * 
 * * [Things](https://culturedcode.com/things/) is a popular task and project management app from Cultured Code. Things supports advanced URL schemes (required Things v3.4 or greater on iOS) which can accept multiple todos, projects, headings in a single call to the app. The scripting interfaces below are convenience wrappers that allow easy creation and encoding of the URLs needed to pass this type of information to Things.
 *
 * The TJS\* JavaScript objects are wrappers around an [open source Swift library](https://github.com/culturedcode/ThingsJSONCoder) provided by Cultured Code, with a few modifications to work in JavaScript. In all cases, nothing is committed to Things until the the items are wrapped in a TJSContainer, and the URL it generates called to send the data to Things. This is best done with Drafts’ `CallbackURL` object (see example below).
 *
 * For more information about what values Things understands in these objects, refer to [their URL scheme documenation](https://support.culturedcode.com/customer/en/portal/articles/2803573).
 * 
 * @example
 * 
 * ```javascript
 * // create a Things Project
 * let project = TJSProject.create();
 * project.title = "My Project From Drafts";
 * project.notes = "Let's do this stuff";
 * 
 * // create and add a heading to the project
 * let heading = TJSHeading.create();
 * heading.title = "First Heading";
 * project.addHeading(heading);
 * 
 * // add todos to the project
 * let todo1 = TJSTodo.create();
 * todo1.title = "My first todo";
 * todo1.when = "today";
 * project.addTodo(todo1);
 * 
 * let todo2 = TJSTodo.create();
 * todo2.title = "My second todo";
 * todo2.when = "tomorrow";
 * project.addTodo(todo2);
 * 
 * // create a container to handle creation of Things URL
 * let container = TJSContainer.create([project]);
 * 
 * // Use CallbackURL object to open URL in Things.
 * let cb = CallbackURL.create();
 * cb.baseURL = container.url;
 * let success = cb.open();
 * if (success) {
 * 	console.log("Project created in Things");
 * }
 * else {
 * 	context.fail();
 * }
 * ```
 */
declare class TJSContainer {
    static create(items: Array<TJSProject | TJSTodo>): TJSContainer
    /**
     * The full URL with encoded TJSContainer parameters.
     */
    url: string
}

/**
 * Represents a Things project, with headings and todo items. See {@link TJSContainer} documentation for details on making requests to Things.
 * 
 */
declare class TJSProject {
    static create(): TJSProject

    title: string
    notes: string
    when: string
    deadline: string
    areaID: string
    area: string
    completed: boolean
    canceled: boolean
    tags: string[]

    addTag(tag: string): void
    addTodo(todo: TJSTodo): void
    addHeading(heading: TJSHeading): void
}

/**
 * Represents a Things heading within a project. See {@link TJSContainer} documentation for details on making requests to Things.
 */
declare class TJSHeading {
    static create(): TJSHeading

    title: string
    archived: boolean
}

/**
 * Represents a Things todo item. Todos can be added a project or directly to a container. See {@link TJSContainer} documentation for details on making requests to Things.
 */
declare class TJSTodo {
    static create(): TJSTodo

    title: string
    notes: string
    when: string
    deadline: string
    listID: string
    list: string
    tags: string[]
    heading: string
    completed: boolean
    canceled: boolean

    addChecklistItem(item: TJSChecklistItem): void
    addTag(tag: string): void
}

/**
 * Represents a Things check list item, which can be added to a Todo. See {@link TJSContainer} documentation for details on making requests to Things.
 */
declare class TJSChecklistItem {
    static create(): TJSChecklistItem

    title: string
    completed: boolean
    canceled: boolean
}
