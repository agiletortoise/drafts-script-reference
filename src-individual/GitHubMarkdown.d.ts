/**
 * Drafts includes Discount-based, GitHub flavored Markdown parser based on [GHMarkdownParser](https://github.com/OliverLetterer/GHMarkdownParser). For details on the meaning of the various options, refer to [Markdown documentation](https://getdrafts.com/settings/markdown).
 *
 * ### Example
 * 
 * ```javascript
 * var inputString = "# Header\n\nMy **markdown** text";
 * var md = GitHubMarkdown.create();
 * 
 * var outputString = md.render(inputString);
 * ```
 */
declare class GitHubMarkdown {
    /**
     * Takes Markdown string passed and processes it with GitHub Markdown parser based on the property selections on the object.
     */
    render(markdownStr: string): string

    /**
     * defaults to true
     */
    smartQuotesEnabled: boolean
    /**
     * defaults to true
     */
    noImages: boolean
    /**
     * defaults to true
     */
    noLinks: boolean
    /**
     * defaults to true
     */
    safeLinks: boolean
    /**
     * defaults to false
     */
    autoLinks: boolean
    /**
     * defaults to false
     */
    strict: boolean
    /**
     * defaults to false
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
