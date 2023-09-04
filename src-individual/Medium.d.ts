/**
 * Script integration with [Medium.com](http://medium.com/). This object handles OAuth authentication and request signing. The entire [Medium REST API](https://github.com/Medium/medium-api-docs) can be used with the `request` method, and convenience methods are provided for common API endpoints to get user information, list publications and post.
 * 
 * If an API calls fails, typically the result will be an `undefined` value, and the `lastError` property will contains error detail information for troubleshooting.
 *
 */
declare class Medium {
    /**
     * If a function success, this property will contain the last response returned by Medium. The JSON returned by Medium will be parsed to an object and placed in this property. Refer to [Medium API documentation](https://github.com/Medium/medium-api-docs) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // Convenience
    /**
     * Get User information for current authenticated user. This will include the `id` property needed for other calls.
     */
    getUser(): object
    /**
     * Get list of publications for current authenticated user.
     */
    listPublications(userId: string): object[]
    /**
     * Create a post in the user's Medium stories. See [API docs](https://github.com/Medium/medium-api-docs) for details on what should be included in the options.
     * @param userId 
     * @param options 
     */
    createPost(userId: string, options: object): object

    // FUNCTIONS

    /**
     * Execute a request against the Medium API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Medium as appropriate to the request made. Refer to Medium API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Medium REST API](https://github.com/Medium/medium-api-docs). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Medium object.
     * @param identifier Optional string value used to identify a Medium account. Typically this can be omitted if you only work with one Medium account in Drafts. Each unique identifier used for Medium accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string)

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
