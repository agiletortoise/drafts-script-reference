/**
 * Convert HTML to Markdown. Based on [html2text](https://github.com/slsrepo/html2text-swift), this object allows you to take HTML input strings, and convert to Markdown. 
 * 
 * When initialized, the options of the `HTMLToMarkdown` object will default to those configured in Drafts settings.
 *
 * @example
 * 
 * ```javascript
 * let html = "A <strong>Markdown</strong> string"
 * let h = new HTMLToMarkdown()
 * 
 * let output = h.process(html)
 * // output == "A **Markdown** string"
 * ```
 */
declare class HTMLToMarkdown {
    /**
     * Takes an HTML string passed and processes it with attempts ot output Markdown from it's content.
     */
    process(html: string): string

    /**
     * Use `[]()` inline links, rather than reference style links
     * @category Options
     */
    inlineLinks: boolean
    /**
     * Place reference-style links after the paragraph they occur in, rather than at the end.
     * @category Options
     */
    linksEachParagraph: boolean
    /**
     * Do not include formatting for links
     * @category Options
     */
    ignoreLinks: boolean
    /**
     * Do not include formatting for images
     * @category Options
     */
    ignoreImages: boolean
    /**
     * Do not include formatting for emphasis
     * @category Options
     */
    ignoreEmphasis: boolean
    /**
     * Character to use replacing `<li>` tags in unordered lists. Default: `-`
     * @category Options
     */
    ulItemMark: string
    /**
     * Characters to use replacing `<strong>` and `<b>` tags. Default: `**`
     * @category Options
     */
    strongMark: string
    /**
     * Character to use replacign `<em>` and `<i>` tags. Defaults: `_`
     * @category Options
     */
    emphasisMark: string
    /**
     * create a new object.
     */
    static create(): HTMLToMarkdown

    /**
     * Create new instance.
     */
    constructor()

}
