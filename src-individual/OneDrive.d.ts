/**
 * OneDrive objects can be used to work with files in a OneDrive account.
 * 
 * @example
 * 
 * ```javascript
 * // create OneDrive object
 * let drive = OneDrive.create();
 * 
 * // setup variables
 * let path = "/test/file.txt";
 * let content = "text to place in file";
 * 
 * // write to file on OneDrive
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
declare class OneDrive {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be undefined.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the path as a string. Returns undefined value if the file does not exist or could not be read. Paths should begin with a `/` and be relative to the root directory of your OneDrive.
     */
    read(path: string): string

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param path Paths should begin with a `/` and be relative to the root directory of your OneDrive
     * @param content Text to place in the file
     * @param overwrite If `false`, an existing file will not be overwritten
     */
    write(path: string, content: string, overwrite?: boolean): boolean

    /**
     *
     * @param identifier Optional identifier for OneDrive account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): OneDrive

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}

