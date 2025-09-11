/**
 * Create generable schema to provide to {@link SystemLanguageModel} objects to get back structured, non-string responses.
 * 
 * @example
 * 
 * **Getting Structured Responses**
 * 
 * ```javascript
 * // CREATE A PROMPT TO SEND TO MODEL
 * const prompt = `Generate tag suggestions to use classifying the  * text below:
 * 
 * ${draft.content}`
 * 
 * // CREATE MODEL OBJECT
 * let m = new SystemLanguageModel()
 * // CREATE SCHEMA TO GET BACK STRUCTURED DATA
 * let schema = SystemLanguageModelSchema.create("Tag Suggestions", "A set of tag suggestions to classify a text.")
 * schema.addStringArray("tags", "A list of tags to assign the text")
 * // QUERY THE MODEL
 * let response = m.respond(prompt, schema)
 * ```
 */
declare class SystemLanguageModelSchema {
    /**
     * Add a string type property
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addString(name: string, description: string)

    /**
     * Add a string type property
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addString(name: string, description: string)

    /**
     * Add a boolean type property
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addBoolean(name: string, description: string)

    /**
     * Add an integer type property
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addInt(name: string, description: string)

    /**
     * Add a number type property
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addNumber(name: string, description: string)

    /**
     * Add an array of strings type properties
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addStringArray(name: string, description: string)

    /**
     * Add an array of boolean type properties
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addBooleanArray(name: string, description: string)

    /**
     * Add an array of integer type properties
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addIntArray(name: string, description: string)

    /**
     * Add an array of number type properties
     * @param name Human-readable name for property. This will translate to a key for the value in returned object.
     * @param description Details on the usage and meaning of the property to guide the model in creation of results.
     * @category Values
    */
    addNumberArray(name: string, description: string)

    /**
     * Create new instance
     * @param name Human-readable name for property
     * @param description Detail regarding the use of the property
     * @category Constructor
     */
    static create(name: string, description: string): SystemLanguageModelSchema

    /**
     * Create new instance.
     * @param name Human-readable name for property
     * @param description Detail regarding the use of the property
     * @category Constructor
     */
    constructor(name: string, description: string)
}
