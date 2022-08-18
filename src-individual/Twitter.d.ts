/**
 * Script integration with Twitter. The `updateStatus` method is a convenience method for posting a tweet, but the entire [Twitter API](https://developer.twitter.com/en/docs/api-reference-index) can be used with the request method, which handles OAuth authentication and authorization.
 * 
 * #### Example

* ```javascript
* // create twitter object
* var twitter = Twitter.create();
* // post tweet
* var success = twitter.updateStatus("My tweet content!");
* 
* if success {
*   console.log(twitter.lastResponse);
* }
* else {
*   console.log(twitter.lastError);
*   context.fail();
* }
* ```
*/
declare class Twitter {
    /**
     * Post a status update (tweet) to Twitter. Returns `true` if successful, `false` if not. After success the `lastResponse` object can be used to inspect response and get details such as the ID of the tweet created. Refer to [Twitter API POST /status/update documentation](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update) for response details.
     */
    updateStatus(content: string): boolean

    /**
     * Execute a request against the Twitter API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by Twitter as appropriate to the request made. Refer to Twitter’s API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object with the following properties:
     * * url [string, required]: The full URL to the endpoint in the [Twitter API](https://developer.twitter.com/en/docs/api-reference-index).
     * * method [string, required]: The HTTP method, like "GET", "POST", etc.
     * * headers [object, optional]: An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those.
     * * parameters [object, optional]: An object containing key-values to be added to the request as URL parameters.
     * * data [object, optional]: An object containing data to be encoded into the HTTP body of the request.
     */
    request(settings: {
        url: string
        method: string
        headers?: { [x: string]: string }
        parameters?: { [x: string]: string }
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Twitter object. Identifier is a optional string value used to identify a Twitter account. Typically this can be omitted if you only work with one Twitter account in Drafts. Each unique identifier used for Twitter accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Twitter

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
