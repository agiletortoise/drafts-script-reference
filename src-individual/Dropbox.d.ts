type dropboxMode = 'add' | 'overwrite'

interface DropboxRequestSettings {
    /**
     * The full URL to the RPC endpoint in the [Dropbox API](https://www.dropbox.com/developers/documentation/http/documentation). RPC endpoint are typically on the `api.dropboxapi.com` domain.
     */
    url: string,
    /**
    * The HTTP method, like "GET", "POST", etc.
    */
    method: string,
    /** 
     * An object contain key-values to be added as custom headers in the request. 
     */
    headers?: { [x: string]: string },
    /** Query parameters to merge with the url. Query parameters can also be part of the original url value. */
    parameters?: { [x: string]: string },
    /** An object containing data to be encoded into the HTTP body of the request. */
    data?: { [x: string]: string },
    /** An object containing the parameters to encode in the `dropbox-api-args` header, per API documentation. Drafts will take care of properly ASCII escaping values. Required only for `contentUploadRequest` and `contentDownloadRequest` functions. */
    'dropbox-api-args'?: { [x: string]: string },
}

/**
 * Dropbox objects can be used to work with files in a [Dropbox](http://dropbox.com) account. The `read` and `write` methods are simple wrappers for uploading and reading content of files on Dropbox.
 * 
 * For advanced uses, the `rpcRequest`, `contentUploadRequest` and `contentDownloadRequest` methods enable direct use of any Dropbox API 2.0 endpoints. These methods are an advanced feature which return raw results from the Dropbox API and may require advanced understanding of the API to process the results. They do enable full access to the API, however, which enabled things like querying files, listing folder contents, uploading to Paper, etc. For details on availalbe methods, see [Dropbox API documentation](https://www.dropbox.com/developers/documentation/http/overview).  In the case of all of these methods Drafts takes care of the OAuth request signing and authentication process when necessary.
 * 
 * @example
 * 
 * ```javascript
 * // create Dropbox object
 * let db = Dropbox.create();
 *
 * // setup variables
 * let path = "/test/file.txt";
 * let content = "text to place in file";
 *
 * // write to file on Dropbox
 * let success = db.write(path, content, "add", true);
 *
 * if (success) { // write worked!
 *   var dbContent = db.read(path);
 *   if (dbContent) { // read worked!
 *     if (dbContent == content) {
 *      alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(db.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(db.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class Dropbox {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the with the file name, in the parent folder, as a string. Returns `undefined` value if the file does not exist or could not be read.
     * @param path Path related to root of Dropbox folder.
     */
    read(path: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Path related to root of Dropbox folder.
     * @param content Text to write to file.
     * @param mode Either "add" or "overwrite" to determine if the write method should overwrite an existing file at the path if it exists.
     * @param autorename
     */
    write(path: string, content: string, mode: dropboxMode, autorename: boolean): boolean

    /**
     * Execute a request against the Dropbox API for an [endpoint of RPC type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Dropbox as appropriate to the request made. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request.
     */
    rpcRequest(settings: DropboxRequestSettings): HTTPResponse 

    /**
     * Execute a request against the Dropbox API for an [endpoint of Content Upload type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an object or array or objects decoded from the JSON returned by Dropbox as appropriate to the request made. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request.
     */
    contentUploadRequest(settings: DropboxRequestSettings): HTTPResponse

    /**
     * Execute a request against the Dropbox API for an [endpoint of Content Download type](https://www.dropbox.com/developers/documentation/http/documentation#formats). For successful requests, the HTTPResponse object will contain an raw data in the `responseData` property and, if the data can be converted to a string value, the text version in the `responseText` property. The HTTPResponse `otherData` property will contain a Javascript object decoded from the JSON returned in the `Dropbox-API-Result` header. Refer to Dropbox's API documentation for details about the expected parameters and responses. Drafts will handle wrapping the request in the appropriate OAuth authentication flow.
     * @param settings Object containing options for the request. 
     */
    contentDownloadRequest(settings: DropboxRequestSettings): HTTPResponse

    /**
     * Creates a new Dropbox object.
     * @param identifier used to identify a Dropbox account. Typically this can be omitted if you only work with one Dropbox account in Drafts.
     */
    static create(identifier?: string): Dropbox
    
    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
