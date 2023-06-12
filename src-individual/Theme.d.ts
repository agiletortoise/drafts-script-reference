type themeType = 'builtIn' | 'custom' | 'file'
/**
 * Represents a Theme definition available in the current installation of Drafts.
 * 
 * @example
 * 
 * **Find and assign the active light theme**
 * 
 * ```javascript
 * let theme = Theme.find("builtIn", "dark");
 * app.lightTheme = theme;
 * ```
 */
declare class Theme {
    /**
    * The type (builtIn, custom, file) of the theme definition.
    * @category Identification
    */
    type: themeType

    /**
     * The name of the theme definition.
     * @category Identification
     */
    name: string

    /**
     * URL which can be used to install this Theme in another installation of Drafts. Useful for sharing and backups.
     * @category Identification
     */
    readonly installURL: string

    /**
     * Get list of all available themees.
     */
    static getAll(): Theme[]

    /**
     * Search for a theme definition matching the type and name passed and return it if found. Returns undefined if not found.
     */
    static find(type: themeType, name: string): Theme | undefined
}
