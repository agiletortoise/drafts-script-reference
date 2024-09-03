/**
 * Script integration with [Google's Gemini AI API](https://ai.google.dev/docs/gemini_api_overview). This object offers convenience over direct HTTP requests by:
 * 
 * * Integrating with Drafts [Credentials system](https://docs.getdrafts.com/docs/settings/credentials) to store your API key.
 * * Handling request authorization headers for requests
 * * Parsing results to JSON
 * * Providing several convenience functions that wrap more complex API calls into simple requests.
 * 
 * > **NOTE:** Drafts does not provide an API Key for use with Google Gemini. To use Google AI features, you will have to setup your own API Key for use with Drafts in the [Google AI Studio](https://aistudio.google.com/app/u/1/apikey?pli=1).
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
 * let ai = new GoogleAI()
 * let answer = ai.quickPrompt(chatPrompt)
 * 
 * // answer == "¿Dónde está la biblioteca?"
 * ```
 * 
*/
declare class GoogleAI {
    /**
     * Submit a single text prompt to Google Gemini, and return only the message generated. Convenience method for single request prompts.
     * @param prompt Text prompt to submit
     * @param model Default: "models/gemini-pro". If you wish to target other models available to your API key, you can override this value.
     * @category Convenience
     */
    quickPrompt(prompt: string, model?: string): string

    /**
     * Request a list of available model names from Google. Returns an array of known models which can be used in subsequent requests to the API.
     * @category Convenience
     */
    getModels(): [string]

    /**
     * Execute a request against the Google Gemini API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by Google Gemini as appropriate to the request made. Refer to Google Gemini API documentation for details about the expected parameters and responses.
     */
    request(settings: {
        /**
         * The path to the API endpoint in the [Google Gemini API](https://ai.google.dev/api/rest). 
         */
        path: string
        /**
         * The name of a model available to your API key. Defaults: `models/gemini-pro`
         */
        model?: string
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
     * Optional identifier for API Key credentials. If an API Key is not provided as a parameter when instantiating the object, the user will be prompted to enter one of the first time they run an action requiring it. By default, these will be stored as `Google AI` credentials. If you have the need to store multiple API Keys, you can set an alternate identifier for use with the Credential system. Default: `Google AI`
     * @category Options
     */
    credentialIdentifier?: string

    /**
     * Time in seconds to wait for a request to receive a response from the server. Default: 120 seconds.
     */
    timeout: number

    /**
     * Creates a new GoogleAI object. 
     * @param apiKey A valid Google Gemini API Key. This value is optional, and if not provided, the default Google AI API key stored in Credentials will be used, or the user prompted to provide an API Key to store. Only provide a specific API Key if you desire to override the default.
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
