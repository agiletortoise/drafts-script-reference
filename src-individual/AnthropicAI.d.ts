/**
 * Script integration with [Anthropic's AI API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api), including support for conversing with its Claude models. This object offers convenience over direct HTTP requests by:
 * 
 * * Integrating with Drafts [Credentials system](https://docs.getdrafts.com/docs/settings/credentials) to store your API key.
 * * Handling request authorization headers for requests
 * * Parsing results to JSON
 * * Providing several convenience functions that wrap more complex API calls into simple requests.
 * 
 * > **NOTE:** Drafts does not provide an API Key for use with Anthropic. To use Anthropic AI features, you will have to setup your own API Key for use with Drafts in the [Anthropic Console](https://console.anthropic.com/dashboard).
 * 
 * @example
 * 
 * **Translation**
 * 
 * ```javascript
 * // build prompt
 * const targetLanguage = "Spanish"
 * const text = "Where is the library?"
 * const chatPrompt = `Translate the following text into ${targetLanguage}: "${text}"`
 * 
 * // create API object and use single response
 * // convenience function to send prompt
 * let ai = new AnthropicAI()
 * let answer = ai.quickPrompt(chatPrompt)
 * 
 * // answer == "¿Dónde está la biblioteca?"
 * ```
 * 
*/
declare class AnthropicAI {
    /**
     * Submit a single text prompt to Anthropic AI, and return only the message generated. Convenience method for single request prompts to the [`messages` endpoint](https://docs.anthropic.com/claude/reference/messages_post).
     * @param prompt Text prompt to submit
     * @param options An optional object containing parameters to pass with the body of the request. If not included, a default version with the required `model` (claude-3-haiku-20240307) and `max_tokens` (1024) values will be used.
     * @category Convenience
     */
    quickPrompt(prompt: string, options?: object): string

    /**
     * Execute a request against the Anthropic AI API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by the API as appropriate to the request made in the `responseData` property. Refer to [Anthropic API documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api) for details about the expected parameters and responses.
     */
    request(settings: {
        /**
         * The path to the API endpoint in the [Anthropic API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api). Include only the path portion of the URL, the default host will be appended.
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
     * Optional identifier for API Key credentials. If an API Key is not provided as a parameter when instantiating the object, the user will be prompted to enter one of the first time they run an action requiring it. By default, these will be stored as `Anthropic AI` credentials.
     * @category Options
     */
    credentialIdentifier?: string

    /**
     * Time in seconds to wait for a request to receive a response from the server. Default: 120 seconds.
     */
    timeout: number

    /**
     * Returns a list of current known model versions. Anthropic does not provide an API endpoint to request available models, so this list will be updated periodically with known models for the API. The list currently returns the current Clause Haiku, Sonnet, and Open model versions. If you are using these values to pass a model name to other functions, in general, the first model in this array will be the fastest, the last the most sophisticated. The only purpose of this function over statically defining model names in your actions is that it may be updated overtime if Anthropic releases updated model versions.
     */
    static knownModels(): [string]

    /**
     * Creates a new AnthropicAI object. 
     * @param apiKey A valid Anthropic API Key. This value is optional, and if not provided, the default Anthropic AI API key stored in Credentials will be used, or the user prompted to provide an API Key to store. Only provide a specific API Key if you desire to override the default.
     */
    static create(apiKey?: string): OpenAI

    /**
     * Create new instance.
     */
    constructor(apiKey?: string)

    /**
     * If a function succeeds, this property will contain the last response returned.
     */
    lastResponse: any

    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError?: string
}
