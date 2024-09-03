/**
 * Script integration with [OpenAI API](https://platform.openai.com/docs/introduction). This object offers convenience over direct HTTP requests by:
 * 
 * * Integrating with Drafts [Credentials system](https://docs.getdrafts.com/docs/settings/credentials) to store your API key.
 * * Handling request authorization headers for requests
 * * Parsing results to JSON
 * * Providing several convenience functions that wrap more complex API calls into simple requests.
 * 
 * > **NOTE:** Drafts does not provide an API Key for use with OpenAI. To use OpenAI features, you will have to setup your own OpenAI account and generate an API Key for use with Drafts in the [developer portal](https://platform.openai.com/account/api-keys).
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
 * // create OpenAI API object and use single response
 * // convenience function to send prompt
 * let ai = new OpenAI()
 * let answer = ai.quickChatResponse(chatPrompt)
 * 
 * // answer == "¿Dónde está la biblioteca?"
 * ```
 * 
 * **Direct API Request**
 * 
 * ```javascript
 * // create OpenAI object
 * let ai = new OpenAI()
 * 
 * // make API request
 * let response = ai.request({
 * 	"path": "/chat/completions",
 * 	"method": "POST",
 * 	"data": {
 * 		"model": "gpt-3.5-turbo",
 * 		"messages": [
 * 			{
 * 				"role": "user",
 * 				"content": "What is your name?"
 * 			}
 * 		]
 * 	}
 * })
 * 
 * // report status
 * console.log(`CODE: ${response.statusCode}
 * 
 * ERR: ${response.error}
 * 
 * ${response.responseText}
 * `)
 * ```
*/
declare class OpenAI {
    /**
     * Submit a single text prompt to ChatGPT conversations endpoint, and return only the message generated. Convenience method for single request prompts.
     * @param prompt Text prompt to submit to ChatGPT
     * @param options Optional key-value object specifying other options to include with the request, see [Completion docs](https://platform.openai.com/docs/api-reference/completions) for supported options. Default `model` value is `gpt-3.5-turbo`
     * @category Convenience
     */
    quickChatResponse(prompt: string, options?: object): string

    /**
     * Submit a single text input and instructions to the [Edits endpoint](https://platform.openai.com/docs/api-reference/edits), using the `text-davinci-edit-001` model, and return only the message generated. Convenience method for single request input.
     * @param input Text input to submit
     * @param instructions Instructions to model
     * @param options Optional key-value object specifying other options to include with the request, see [Edit docs](https://platform.openai.com/docs/api-reference/edits) for supported options. Default `model` value is `text-davinci-edit-001`
     * @category Convenience
     * @deprecated The `edits` endpoint was removed by OpenAI
     */
    quickTextEdit(input: string, instructions: string, options?: object): string

    /**
     * Submit a single text input and instructions to the [Edits endpoint](https://platform.openai.com/docs/api-reference/edits), using the `code-davinci-edit-001` model to generate code or refactor, and return only the message generated.
     * @param input Text input to submit, generally used only if you are instruction the model to refactor existing code.
     * @param instructions Instructions to model
     * @param options Optional key-value object specifying other options to include with the request, see [Edit docs](https://platform.openai.com/docs/api-reference/edits) for supported options. Default `model` value is `text-davinci-edit-001`
     * @category Convenience
     * @deprecated The `edits` endpoint was removed by OpenAI
     */
    quickCodeEdit(input: string, instructions: string, options?: object): string

    /**
     * Execute a request against the OpenAI API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by OpenAI as appropriate to the request made. Refer to OpenAI API documentation for details about the expected parameters and responses.
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
     * Name of the model to use. Model can also be passed as a parameter in requests, but settings this to a supported model will make it the default model for requests using this instance. Default: `gpt-3.5-turbo`
     * @category Options
     */
    model: string

    /**
     * Optional identifier for API Key credentials. If an API Key is not provided as a parameter when instantiating the object, the user will be prompted to enter one of the first time they run an action requiring it. By default, these will be stored as `OpenAI` credentials. If you have the need to store multiple API Keys, or use the action with alternate compatible host services (like [Perplexity.ai](https://www.perplexity.ai)), you can set an alternate identifier for use with the Credential system. Default: `OpenAI`
     * @category Options
     */
    credentialIdentifier?: string

    /**
     * Time in seconds to wait for a request to receive a response from the server. Default: 120 seconds.
     */
    timeout: number

    /**
     * Creates a new OpenAI object. 
     * @param apiKey A valid OpenAI API Key. This value is optional, and if not provided, the default OpenAPI API key stored in Credentials will be used, or the user prompted to provide an API Key to store. Only provide a specific API Key if you desire to override the default.
     * @param host Optionally provide the API endpoint URL for any OpenAI API compatible endpoint, such as a custom Azure AI instance, or Perplexity.ai API. Defaults to `https://api.openai.com`
     */
    static create(apiKey?: string, host?: string): OpenAI

    /**
     * Create new instance.
     */
    constructor(apiKey?: string, host?: string)
}
