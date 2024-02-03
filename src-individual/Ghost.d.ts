/**
 * Script integration with the [Ghost Admin API](https://ghost.org/docs/admin-api/) to support working with sites hosting using the [Ghost](https://ghost.org) open source CMS platform. This object offers convenience over direct HTTP requests by:
 * 
 * * Integrating with Drafts [Credentials system](https://docs.getdrafts.com/docs/settings/credentials) to store your API key.
 * * Handling request JWT authorization headers for requests
 * * Parsing results to JSON
 * 
 * @example
 * 
 * **Creating a Post**
 * 
 * ```javascript
 * // construct a post object to send to Ghost API
 * let post = {
 * 	"title": "Post title",
 * 	"html": "My HTML content",
 * 	"status": "draft",
 * }
 * // wrap it in an array, per docs
 * let data = {
 * 	"posts": [
 * 		post
 * 	]
 * }
 * 
 * // make request to API
 * let g = new Ghost()
 * let response = g.request({
 * 	"path": "/admin/posts/",
 * 	"method": "POST",
 * 	"parameters": {"source": "html"},
 * 	"data": data
 * })
 * if (response.success) { // successful
 * 	// get the URL of the post from the response data
 * 	let url = response.responseData["posts"][0]["url"]
 * 	if (url) {
 * 		console.log(`Ghost Post Created: ${url}`)
 * 	}
 * 	console.log(response.responseText)
 * }
 * else {
 * 	console.log(`Ghost Post Failed: ${response.statusCode}
 * ${response.responseText}
 * `)
 * 	context.fail()
 * }
 * ```
*/
declare class Ghost {
    /**
     * Execute a request against the Ghost Admin API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by your Ghost installation as appropriate to the request made. Refer to [Ghost Admin API documentation](https://ghost.org/docs/admin-api/) for details about the expected parameters and responses.
     */
    request(settings: {
        /**
         * The path to the API endpoint in the [OpenAI API](https://platform.openai.com/docs/introduction). This should include the path after the API version. For example `/chat/completion`
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
         * An object containing data to be encoded into the HTTP body of the request. Drafts will take care of the JSON conversion.
         */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Ghost object. 
     * @param identifier Credential identifier used to distinguish between multiple Ghost sites. Only needed if multiple sites are being targeted.
     */
    static create(identifier?: string): OpenAI

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
