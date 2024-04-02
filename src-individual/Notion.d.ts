/**
 * Script integration with [Notion](https://www.notion.so/). This object handles OAuth authentication and request signing. The entire [Notion REST API](https://developers.notion.com) can be used with the `request` method.
 *
 * @example
 * 
 * ```
 * // list pages which have been shared with the Drafts integration
 * // API Docs: https://developers.notion.com/reference/post-search
 * let endpoint = "https://api.notion.com/v1/search"
 * 
 * let notion = Notion.create();
 * let result = notion.request({
 * 	"url": endpoint,
 * 	"method": "POST",
 * 	"data": {
 * 		"filter": {
 * 			"value": "page",
 * 			"property": "object"
 * 		}
 * 	}
 * });
 * 
 * // result has JSON payload
 * // with page properties
 * if (result.statusCode == 200) {
 * 	alert(`Notion Pages Loaded:
 * 	
 * ${result.responseText}`)
 * }
 * else {
 * 	alert(`Notion Error: ${result.statusCode}
 * 	
 * ${notion.lastError}`);
 * 	context.fail();
 * }
 * ```
 */
declare class Notion {
    /**
     * Release version of the Notion API to target. Default is "2022-02-22". If you need capabilities not available in a particular version, you can override the value. See [Notion's versioning docs](https://developers.notion.com/reference/versioning) for details.
     */
    version: string

    /**
     * If a function succeeds, this property will contain the last response returned by Notion. The JSON returned by Notion will be parsed to an object and placed in this property. Refer to [Notion API documentation](https://developers.notion.com) for details on the contents of this object based on call made.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string

    // FUNCTIONS

    /**
     * Execute a request against the Notion API. For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Notion as appropriate to the request made. Refer to Notion's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings an object configuring the request.
     */
    request(settings: {
        /** The full URL to the endpoint in the [Notion REST API](https://developers.notion.com.). */
        url: string
        /** The HTTP method, like "GET", "POST", etc. */
        method: string
        /** An object contain key-values to be added as custom headers in the request. There is no need to provide authorization headers, Drafts will add those. Drafts will automatically include required authentication and versioning headers. */
        headers?: { [x: string]: string }
        /** An object containing key-values to be added to the request as URL parameters. */
        parameters?: { [x: string]: string }
        /** A JavaScript object containing data to be encoded into the HTTP body of the request. Refer to API documentation for appropriate information to include. */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Notion object.
     * @param identifier Optional string value used to identify a Notion account. Typically this can be omitted if you only work with one Notion account in Drafts. Each unique identifier used for Notion accounts will share credentials - across both action steps and scripts.
     */
    static create(identifier: string): Notion

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
