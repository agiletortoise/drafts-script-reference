/**
 * Box objects can be used to work with files in a Box.com account.
 *
 * @example
 * 
 * ```javascript
 * // create Box object
 * let drive = Box.create();
 * 
 * // setup variables
 * let path = "/test/file.txt";
 * let content = "text to place in file";
 * 
 * // write to file on Box
 * let success = drive.write(path, content, false);
 * 
 * if (success) { // write worked!
 *   var driveContent = drive.read(path);
 *   if (driveContent) { // read worked!
 *     if (driveContent == content) {
 *       alert("File contents match!");
 *     }
 *     else {
 *       console.log("File did not match");
 *       context.fail();
 *     }
 *   }
 *   else { // read failed, log error
 *     console.log(drive.lastError);
 *     context.fail();
 *   }
 * }
 * else { // write failed, log error
 *   console.log(drive.lastError);
 *   context.fail();
 * }
 * ```
 */
declare class Box {
    readonly lastError?: string

    /**
     * Reads the contents of the file at the path as a string. Returns `undefined` value if the file does not exist or could not be read. Paths should begin with a `/` and be relative to the root directory of your Box.com account.
     * @param path
     */
    read(path: string): string

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Paths should begin with a `/` and be relative to the root directory of your Box
     * @param content Text to place in the file.
     * @param overwrite If false, an existing file will not be overwritten.
     */
    write(path: string, content: string, overwrite?: boolean): boolean

    /**
     * Creates a new Box object. Identifier is a optional string value used to identify a Box.com account. Typically this can be omitted if you only work with one Box.com account in Drafts.
     */
    static create(identifier?: string): Box

    /**
    * Create new instance.
    */
    constructor(identifier?: string)
}
