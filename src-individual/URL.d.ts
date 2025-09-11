/**
 * URL objects are used as a convenience in parsing values out of a URL string. This implementation closely mirrors the [Web API's `URL` object](https://developer.mozilla.org/en-US/docs/Web/API/URL) for compatibility purposes
 * 
 * @example
 * 
 * ```javascript
 * let url = URL.parse("http://getdrafts.com?q=boo")
 * let host = url.host // "getdrafts.com"
 * let q = url.searchParams["q"] // "boo"
 * ```
 */
declare class URL {
    /**
     * Host (domain name) portion of the URL
     */
    hostname: string

    /**
     * The hash string starting with a `#` of the URL, if present. When setting, if the string does not begin with a `#` it will be added, and the value
     */
    fragment: string


    /**
     * Creates a new URL object with provided URL.
     * @param url A string representing an absolute URL or a relative reference to a base URL. If `url` is a relative reference, `base` is required.
     * @param base A string representing the base URL to resolve against if `url` is a relative reference. 
     */
    static parse(url: string, base?: string): URL

}

