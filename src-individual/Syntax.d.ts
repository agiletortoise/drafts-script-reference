type syntaxType = 'builtIn' | 'custom' | 'file'
/**
 * Represents a Syntax definition available in the current installation of Drafts.
 * 
 * @example
 * 
 * **Find and Assign a Syntax**
 * 
 * ```javascript
 * let syntax = Syntax.find("builtIn", "Markdown");
 * draft.syntax = syntax;
 * draft.update();
 * ```
 */
declare class Syntax {
    /**
    * The type (builtIn, custom, file) of the syntax definition.
    * @category Identification
    */
    type: syntaxType

    /**
     * The name of the syntax definition.
     * @category Identification
     */
    name: string

    /**
     * URL which can be used to install this Syntax in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
     * Get list of all available syntaxes.
     */
    static getAll(): Syntax[]

    /**
     * Search for a syntax definition matching the type and name passed and return it if found. Returns undefined if not found.
     */
    static find(type: syntaxType, name: string): Syntax | undefined
}
