/**
 * The Task object provides information about a tasks found in the text of a draft, based on the task definitions of the syntax definition assigned to the draft. [Task Definitions](https://docs.getdrafts.com/docs/extending/development/syntax-format#task-mark-definitions) in Drafts syntaxes are used to create tappable/clickable tasks with the text. Task objects allow you to easily identify and manipulate task lines found in a draft.
 * 
 * Ultimately, tasks are just ranges of text in a draft, so can be manipulated directly by altering the text of a draft. 
 * 
 * Tasks are readonly and are accessed via `tasks`, `incompleteTasks` and `completedTasks` properties of a {@link Draft} object or the {@link Editor}. Similarly, these task references can be used to change the task states using functions on the {@link Draft} or {@link Editor} object.
 * 
 * When working with tasks, it is important to remember that they are snapshots of the task ranges in a draft at a point in time. If changes are made to the content of a draft, these task objects will be invalid. This can include changes to the tasks themselves. For example, some task types might be defined in ways that change the range of task when changing state - so marking it complete will invalidate the task object. Because of this, if you wish to loop over tasks in a draft, you should work in reverse from last to first task by location in the draft to avoid invalidating other task object ranges.
 * 
 * Deciding whether to access and work with tasks via the Draft or Editor methods depends on the intent of your action. Only use the Editor methods if you are planning to manipulate text while editing a draft, as these method have the advantage of participating in the Editor's undo stack.
 * 
 * For more examples of task scripting, install the [task examples action group](https://directory.getdrafts.com/g/2NA).
 * 
 * @example
 * 
 * **Resetting tasks to default state**
 * 
 * ```javascript
 * const tasks = draft.incompleteTasks
 * for (const task of tasks.reverse()) {
 *     draft.resetTask(task)
 * }
 * draft.update()
 * ```
 */
declare class Task {
    private constructor()

    /**
     * Text of the task line.
     */
    readonly line: string
    /**
     * Range of the task line as an array with location and length values.
     */
    readonly lineRange: textRange
    /**
     * Text of the portion of the task line representing state.
     */
    readonly state: string
    /**
     * Range of the text representing the state of the task line as an array with location and length values.
     */
    readonly stateRange: textRange
    /**
     * Text of the interactive (tappable) portion of the task line.
     */
    readonly interactive: string
    /**
     * Range of the interactive (tappable) portion of the task line as an array with location and length values.
     */
    readonly interactiveRange: textRange
    /**
     * Text of the task label.
    */
   readonly label: string
    /**
     * Range of the task label as an array with location and length values.
     */
   readonly labelRange: textRange
    /**
     * True if the task is in one of the completed states defined by the syntax.
     */
   readonly isCompleted: boolean
}