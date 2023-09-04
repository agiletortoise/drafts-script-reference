/**
 * Helper methods to escape and unescape HTML entities in a string.
 * 
 * @example
 * 
 * ```javascript
 * let s = "<One> & Two";
 * let escaped = HTML.escape(s); // "&#x3C;One&#x3E &#x26; Two"
 * let unescaped = HTML.unescape(encoded); // "<One> & Two"
 * ```
 */
declare class HTML {
    /**
     * Escape HTML entities in a string to be HTML safe.
     * @param string the string to escape
     */
    static escape(string: string): string

    /**
     * Unescape HTML entities in a string.
     * @param string the string to unescape
     */
    static unescape(string: string): string
}
