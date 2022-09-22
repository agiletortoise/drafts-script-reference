/**
 * Tools for querying and working with tags.
 * 
 * ### Example: Querying tags
 * 
 * ```javascript
 * // query a list of all unique tag names
 * let tags = Tag.query("")
 * 
 * // get filtered list of tags matching "bl", like "blue", "black"
 * let blueTags = Tag.query("bl")
 * ```
 */
declare class Tag {
    /**
     * Perform a search for tags and return an array of tag names.
     * @param queryString Search string, as you would type in the search box in the filter list. Use empty string (`""`) not to filter.
     * @category Querying
     */
    static query(
        queryString: string
    ): string[]

    /**
     * Return array of recently used tags. Helpful for building prompts to select tags.
     * @category Tag
     */
    static recentTags(): string[]
}
