/**
 * Display of HTML Preview window, the same as the HTMLPreview action step. Returns true if user closed preview with the "Continue" button, false if the user cancelled.
 * 
 * @example
 * 
 * ```javascript
 * let html = "<html><body>My Document</body></html>"
 * 
 * let preview = HTMLPreview.create();
 * if (preview.show(html)) {
 *   // continue button was pressed
 * }
 * else {
 *   // cancel button was pressed
 * }
 * ```
 */
declare class HTMLPreview {
    /**
     * Hides the toolbars and `Cancel` / `Continue` buttons in the  preview window. For use only when combined with JavaScript flow control in the HTML preview. See [docs]() for details.
     */
    hideInterface: boolean

    /**
     * Open HTML Preview window displaying the HTML string passed.
     * @param html The HTML content to display. Should be complete HTML document.
     */
    show(html: string): boolean

    /**
     * Create new instance.
     */
    static create(): HTMLPreview

    /**
     * Create new instance.
     */
    constructor()
}

