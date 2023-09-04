/**
 * Parse Markdown to HTML using [cmark-gfm](), GitHub's implementation of Markdown with extensions for tables, strikethrough, etc. For details on the meaning of the various options, refer to [GitHub's Markdown documentation](https://github.github.com/gfm/).
 *
 * @example
 * 
 * ```javascript
 * let inputString = "# Header\n\nMy **markdown** text";
 * let md = new GitHubMarkdown();
 * 
 * let outputString = md.render(inputString);
 * ```
 */
declare class GitHubMarkdown {
    /**
     * Takes Markdown string passed and processes it with GitHub Markdown parser based on the property selections on the object.
     */
    render(markdownStr: string): string

    /**
     * Parse Markdown tables. Defaults: true
     * @category Extensions
     */
    tables: boolean

    /**
     * Enables expansion of certain partial URLs. Defaults: true
     * @category Extensions
     */
    autoLinks: boolean

    /**
     * Support `~~strikethrough~~` markup. Defaults: true
     * @category Extensions
     */
    strikethrough: boolean

    /**
     * Disallows certain HTML tags. Defaults: false
     * @category Extensions
     */
    tagFilters: boolean

    /**
     * Support `[ ]` task lists. Default: true
     * @category Extensions
     */
    taskLists: boolean

    /**
     * Convert straight quotes to curly, --- to em dashes, -- to en dashes. Default: true
     * @category Options
     */
    smartQuotes: boolean

    /**
     * Include a `data-sourcepos` attribute on all block elements. Default: false
     * @category Options
     */
    sourcePOS: boolean

    /**
     * Render `softbreak` elements as hard line breaks. Default: false
     * @category Options
     */
    hardBreaks: boolean

    /**
     * Suppress raw HTML and unsafe links. Default: true
     * @category Options
     */
    safe: boolean

    /**
     * Render "dangerous" HTML and unsafe links. Default: false
     * @category Options
     */
    unsafe: boolean

    /**
     * Validate UTF-8 before parsing, replacing illegal sequences. Default: false
     * @category Options
     */
    validateUTF8: boolean

    /**
     * Support Markdown Footnotes. Default: true
     * @category Options
     */
    footnotes: boolean
    
    
    /**
     * @deprecated No longer valid with CMark implementation
     * @category Deprecated
     */
    smartQuotesEnabled: boolean
    /**
     * @deprecated No longer valid with CMark implementation.
     * @category Deprecated
     */
    noImages: boolean
    /**
     * @deprecated No longer valid with CMark implementation.
     * @category Deprecated
     */
    noLinks: boolean
    /**
     * @deprecated No longer valid with CMark implementation.
     * @category Deprecated
     */
    safeLinks: boolean
    /**
     * @deprecated No longer valid with CMark implementation.
     * @category Deprecated
     */
    strict: boolean
    /**
     * @deprecated No longer valid with CMark implementation.
     * @category Deprecated
     */
    removeHTMLTags: boolean

    /**
     * create a new object.
     */
    static create(): GitHubMarkdown

    /**
     * Create new instance.
     */
    constructor()

}
