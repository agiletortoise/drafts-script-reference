/**
 * Airtable objects can be used to work bases and tables in an [Airtable](http://airtable.com) account. Integration works via the [Airtable API](https://airtable.com/developers/web/api/introduction) so plan to reference their documentation for details on parameters and return value objects. Drafts will take care of the OAuth authentication, and conversion to and from JSON for passing parameters and receiving return values.
 * 
 * @example
 * 
 * ```javascript
 * // set values from your account
 * let baseId = "YOUR-BASE-ID"
 * let tableName = "YOUR-TABLE-ID-OR-NAME"
 * 
 * // create Airtable value
 * let at = new Airtable()
 * // sample values...need to match the target table
 * let record = {
 * 	"fields": {
 * 		"F1": "Text for Field 1",
 * 		"F2": "Text for Field 2",
 * 		"Complete": true // checkbox field
 * 	},
 * 	"typecast": true
 * }
 * 
 * let result = at.createRecords(baseId, tableName, record)
 * if (result) { // success! result contains record info
 * 	console.log("Airtable record created")
 * }
 * else { // something went wrong, log error
 * 	console.log(at.lastError)
 * 	context.fail()
 * }
 * ```
 */
declare class Airtable {
    /**
     * If a convenience function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Convenience wrapper arounc the [list records](https://airtable.com/developers/web/api/list-records) endpoint used to retreive records in a table.
     * @param baseId Valid id of an existing base in the Airtable account.
     * @param tableIdOrName Valid id, or name, of a table that exists in the Airtable account.
     * @param options 
     * @category Records
     * @returns Object containing the parsed JSON returned by the API.
     */
    listRecords(baseId: string, tableIdOrName: string, options?: object): object | undefined

    /**
     * Convenience wrapper arounc the [list records](https://airtable.com/developers/web/api/create-records) endpoint used to retreive records in a table.
     * @param baseId Valid id of an existing base in the Airtable account.
     * @param tableIdOrName Valid id, or name, of a table that exists in the Airtable account.
     * @param records An object containing a single record field values, or an array of up to 10 record field values to create. See API docs for details on configuring records.
     * @category Records
     * @returns Object containing the parsed JSON returned by the API.
     */
    createRecords(baseId: string, tableIdOrName: string, records: object): object | undefined

    /**
     * Convenience wrapper arounc the [list records](https://airtable.com/developers/web/api/update-record) endpoint used to update values of an existing record in a table.
     * @param baseId Valid id of an existing base in the Airtable account.
     * @param tableIdOrName Valid id, or name, of a table that exists in the Airtable account.
     * @param recordId Valid id of an existing record in the table.
     * @param fields An object containing field values. See API docs for details. 
     * @category Records
     * @returns Object containing the parsed JSON returned by the API.
     */
    updateRecord(baseId: string, tableIdOrName: string, recordId: string, fields: object): object | undefined

    /**
     * Convenience wrapper arounc the [list bases](https://airtable.com/developers/web/api/list-bases) endpoint used to retreive a list of available bases in the account.
     * @category Bases
     * @returns Object containing the parsed JSON returned by the API.
     */
    listBases(): object | undefined

    /**
     * Convenience wrapper arounc the [get base schema](https://airtable.com/developers/web/api/get-base-schema) endpoint used to retreive the table schema of all tables in the base.
     * @category Bases
     * @returns Object containing the parsed JSON returned by the API.
     */
    getBaseSchema(baseId: string): object | undefined

    /**
     * Execute a request against the Airtable API. For successful requests, the {@link HTTPResponse} object will contain an object or array or objects decoded from the JSON returned by Airtable as appropriate to the request made. Refer to [Airtable API documentation](https://airtable.com/developers/web/api/introduction) for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow and translating passed and received data object to and from JSON.
     */
    request(settings: {
        /**
         * The URL of the API endpoint in the [Airtable API](https://airtable.com/developers/web/api/introduction). This should include the entire URL, including api version, usually something like `https://api.airtable.com/v0/...` 
         */
        url: string
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
         * An object containing data to be encoded into the HTTP body of the request.
         */
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * Creates a new Airtable object.
     * @param identifier used to identify a Airtable account. Typically this can be omitted if you only work with one Airtable account in Drafts.
     */
    static create(identifier?: string): Airtable
    
    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
