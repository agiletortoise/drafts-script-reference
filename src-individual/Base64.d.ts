/**
 * Helper methods to encode and decode [Base64](https://en.wikipedia.org/wiki/Base64) strings.
 * 
 * @example
 * 
 * ```javascript
 * let s = "My String";
 * let encoded = Base64.encode(s);
 * let decoded = Base64.decode(encoded);
 * ```
 */
declare class Base64 {
    private constructor()
    /**
     * Base64 encode a string.
     * @param data the string to encode
     */
    static encode(data: string): string

    /**
     * Base64 decode a string.
     * @param data the string to decode
     */
    static decode(data: string): string
}
