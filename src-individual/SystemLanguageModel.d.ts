/**
 * Prompt the on-device SystemLanguageModel, part of the [Foundation Models API](https://developer.apple.com/documentation/foundationmodels?changes=_10_5) introduced in iOS/macOS 26. Requires OS 26 and a device that supports (and has enabled) Apple Intelligence.
 * 
 * While not as powerful as larger, cloud-based LLMs, the local model is useful for a variety of smaller tasks, and operates completely privately and locally on the device.
 * 
 * Be aware that use of this class is best suited to small tasks, as it is subject to the 4k token limit per session.
 * 
 * For example actions, [see User Guide](https://docs.getdrafts.com/docs/actions/ai#on-device-ai-foundation-models)
 * 
 * > **NOTE:** Each instance of `SystemLanguageModel` operates as a session, so repeated calls to `respond` will maintain the context of previous calls – and are cummulatively subject to the 4k token limit.
 * 
 * @example
 * 
 * **Prompting the On-Device LLM**
 * 
 * ```javascript
 * // create a prompt based on the content of the current draft
 * let prompt = draft.processTemplate("[[draft]]")
 * 
 * // create model instance and submit prompt
 * let lm = new SystemLanguageModel()
 * // only if you are using Drafts tools
 * lm.enableAllTools()
 * 
 * let response = lm.respond(prompt)
 * 
 * if (!response) { // handle failure
 * 	  alert(lm.lastError)
 * 	  context.fail()
 * }
 * else { // update draft to include response
 * 	  editor.setText(`${prompt}
 * 
 * ===
 * 
 * ${response}`)
 * }
 * ```
 */
declare class SystemLanguageModel {
    /**
     * Get a response from the on-device language model.
     * @param prompt Text prompt to submit to the model.
     * @param schema Optional schema object to get responses in a structured format. If schema is not passed, responses will be in string format.
    */
    respond(prompt: string, schema?: SystemLanguageModelSchema): object
    
    /**
     * Enable all known Drafts' tools for the session. Tools can also be enabled individually by setting `tools`
    */
    enableAllTools()

    /**
     * Optional array of Drafts' tools to make available to the model. Tools are experimental and likely to change in upcoming releases. Use `enableAllTools()` to add all Drafts-specific tools. Supported values:
     * 
     * - `draft.query`: Allows the model to query drafts in your draft library by tags or query string.
     * - `draft.find`: Allow locating individual drafts by UUID. 
     * - `draft.create`: Supports creation of drafts with content.
     * - `draft.append`: Supports appending content to a draft.
     * - `draft.prepend`: Supports prepending content to a draft.
     * - `editor.open`: Supports opening drafts in the editor.
     * - `action.run`: Supports running actions by name.
     * - `workspace.find`: Allows the model to know the workspaces you have created.
     */
    tools?: [string]

    /**
     * If a previous function returned an error, the error description will be available in this property
     */
    lastError?: string

    /**
     * Create new instance
     * @category Constructor
     */
    static create(tools?: [string]): SystemLanguageModel

    /**
     * Create new instance.
     * @category Constructor
     */
    constructor(tools?: [string])
}
