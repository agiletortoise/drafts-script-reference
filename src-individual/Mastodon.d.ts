type mastodonVisibility =        
    | 'public'
    | 'private'
    | 'unlisted'
    | 'direct'

    /**
 * Script integration with [Mastodon](https://joinmastodon.org). The `updateStatus` method is a convenience method for posting a status update, but the entire [Mastodon API](https://docs.joinmastodon.org/api/guidelines/) can be used with the request method, which handles OAuth authentication and authorization to Mastodon hosts.
 * 
 * @example
 * 
 * **Post Status**
 * 
 * ```javascript
 * // create Mastodon object
 * let mastodon = Mastodon.create("host.name");
 * // post status
 * let success = mastodon.updateStatus("My post content!");
 * 
 * if success {
 *   console.log(mastodon.lastResponse);
 * }
 * else {
 *   console.log(mastodon.lastError); 
 *   context.fail();
 * }
 * ```
 * 
 * **Retreive Bookmarks**
 * 
 * ```javascript
 * // Setup credentials to use
 * let host = "mastodon.social"
 * let id = "debug"
 * 
 * // create Mastodon object
 * let mastodon = Mastodon.create(host, id)
 * 
 * // api endpoint path
 * let path = "/api/v1/bookmarks"
 * // run the request to get data
 * let response = mastodon.request({
 *   "path": path,
 *   "method": "GET"
 * })
 * 
 * if (response.success) {
 *   // request was successful, output text
 *   alert(response.responseText)
 * }
 * else {
 *   // log failure
 *   console.log(response.error)
 *   context.fail()
 * }
 * ```
*/
declare class Mastodon {
    /**
     * Post a status update to a Mastodon account. Returns `true` if successful, `false` if not. After success the `lastResponse` object can be used to inspect response and get details such as the ID of the post created. Refer to [Mastodon API POST /statuses documentation](https://docs.joinmastodon.org/methods/statuses/#create) for response details.
     * @param content Content for the status update
     * @param contentWarning Optional short string to use as the content warning (aka "spoiler text") for the post.
     * @param visibility The visibility status of the post, default "public"
     * @param isSensitive If true, the post will be marked as containing sensitive content.
     */
    updateStatus(content: string, contentWarning?: string, visibility?: mastodonVisibility, isSensitive?: boolean): boolean

    /**
     * Execute a request against the Mastodon API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by Mastodon as appropriate to the request made. Refer to Mastodon API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     */
    request(settings: {
        /**
         * The path to the API endpoint in the [Mastodon API](https://docs.joinmastodon.org/api/guidelines/). This should include the entire path, including api version, usually something like `/api/v1/statuses` This will be combined with the `host` used by the Mastodon instance making the call to build a complete URL.
         */
        path: string
        /**
         * The HTTP method, like "GET", "POST", etc.
         */
        method: string
        /**
         * An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those.
         */
        headers?: { [x: string]: string }
        /**
         * An object containing key-values to be added to the request as URL parameters. Drafts will take care of encoding these.
         */
        parameters?: { [x: string]: string }
        /**
         * An object containing data to be encoded into the HTTP body of the request..
         */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Mastodon object. Host parameter should be specified as the domain name of the instance you wish to target (i.e. `mastodon.social`), not a full URL. Identifier is optional but recommend if you work with more than one Mastodon account.
     * @param host The domain name of the Mastodon instance to use. Use only the host name, not the full URL, i.e. `mastodon.social`.
     * @param identifier Optional, but recommended, credential identifier for the account. This appears for identification purposes in Drafts Settings > Credentials and should be unique for each Mastodon account. We recommend using `@username` to help with identification.
     */
    static create(host: string, identifier: string): Mastodon

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
