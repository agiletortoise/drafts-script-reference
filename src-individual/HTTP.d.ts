/**
 * The {@link HTTP} and [[HTTPResponse objects are used to run synchronous HTTP requests to communicate with APIs, or just read pages from the web. A full set of custom settings can be passed, and all HTTP methods (GET, POST, PUT, DELETE, etc.) are supported.
 * 
 * @example
 * 
 * ```javascript
 * let http = HTTP.create(); // create HTTP object
 * 
 * let response = http.request({
 *   "url": "http://myurl.com/api",
 *   "method": "POST",
 *   "data": {
 *     "key":"value"
 *   },
 *   "headers": {
 *     "HeaderName": "HeaderValue"
 *   }
 * });
 * 
 * if (response.success) {
 *   var text = response.responseText;
 *   var data = response.responseData;
 * }
 * else {
 *   console.log(response.statusCode);
 *   console.log(response.error);
 * }
 * ```
 */
declare class HTTP {
    /**
     * @param settings An object configuring the request.
     */
    request(settings: {
        /**
         * The absolute HTTP URL for the request.
         */
        url: string,
        /**
        * The HTTP method, like "GET", "POST", etc.
        */
        method: string,
        /** An object contain key-values to be added as custom headers in the request. */
        headers?: { [x: string]: string },
        /** Query parameters to merge with the url. Query parameters can also be part of the original url value. */
        parameters?: { [x: string]: string },
        /** An object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string },
        /**
         * Format to encode `data` in the body of request.
         */
        encoding?: 'json' | 'form',
        /** A username to encode for Basic Authentication. */
        username?: string,
        /** A password to encode for Basic Authentication. */
        password?: string
    }): HTTPResponse

    /**
     * If true, requests will automatically resolve 301/302 redirect responses. Defaults: true
     * @category Options
     */
    followRedirects: boolean

    /**
     * Time in seconds to wait for a request to receive a response from the server. Default: 60 seconds.
     */
    timeout: number

    /**
     * Instantiate an `HTTP` object.
     */
    static create(): HTTP

    /**
     * Create new instance.
     */
    constructor()    
}

/**
 * # HTTPResponse
 * 
 * HTTPResponse objects are returned by calls to HTTP methods. For usage details, see {@link HTTP} object.
 */
declare class HTTPResponse {
    /**
     * true/false for whether the request was completed successfully.
     */
    success: boolean

    /**
     * The HTTP status code (like 200, 301, etc.) returned.
     */
    statusCode: number

    /**
     * The raw data returned. Typically an object or array of objects, but exact content varies by server response.
     */
    responseData: any

    /**
     * The data returned as a string format.
     */
    responseText: string

    /**
     * Key-value dictionary containing any HTTP header information returned with the response. Useful for access cookie headers, etc.
     */
    headers: object

    /**
     * Some responses return additional data that is placed in this field.
     */
    otherData: string | undefined

    /**
     * If an error occurred, a description of the type of error.
     */
    error: string | undefined
}
