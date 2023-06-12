/**
 * Drafts includes a full version of the MultiMarkdown 6 engine to render Markdown text to HTML and other supported formats. For details on the meaning of the various options, refer to [MultiMarkdown documentation](https://github.com/fletcher/MultiMarkdown-6).
 * 
 * @example
 * 
 * ```javascript
 * let inputString = "# Header\n\nMy **markdown** text";
 * let mmd = MultiMarkdown.create();
 * 
 * mmd.format = "html";
 * mmd.criticMarkup = true;
 * let outputString = mmd.render(inputString);
 * ```
 */
declare class MultiMarkdown {
    /**
     * Takes Markdown string passed and processes it with MultiMarkdown based on the properties and format selections on the object.
     */
    render(markdownStr: string): string

    /**
     * Specify output format. Valid values are:
     * * `html`: HTML. This is the default Markdown output.
     * * `epub`: ePub
     * * `latex`: LaTeX
     * * `beamer`
     * * `memoir`
     * * `odt`: Open document format
     * * `mmd`
     */
    format: 'html' | 'epub' | 'latex' | 'beamer' | 'memoir' | 'odt' | 'mmd'

    /**
     * defaults to `false`
     */
    markdownCompatibilityMode: boolean
    /**
     * defaults to `false`
     */
    completeDocument: boolean
    /**
     * defaults to `false`
     */
    snippetOnly: boolean
    /**
     * defaults to `true`
     */
    smartQuotesEnabled: boolean
    /**
     * defaults to `true`
     */
    footnotesEnabled: boolean
    /**
     * defaults to `true`
     */
    noLabels: boolean
    /**
     * defaults to `true`
     */
    processHTML: boolean
    /**
     * defaults to `false`
     */
    noMetadata: boolean
    /**
     * defaults to `false`
     */
    obfuscate: boolean
    /**
     * defaults to `false`
     */
    criticMarkup: boolean
    /**
     * defaults to `false`
     */
    criticMarkupAccept: boolean
    /**
     * defaults to `false`
     */
    criticMarkupReject: boolean
    /**
     * defaults to `false`
     */
    randomFootnotes: boolean
    /**
     * defaults to `false`
     */
    transclude: boolean

    /** Create object */
    static create(): MultiMarkdown

    /**
     * Create new instance.
     */
    constructor()
}
