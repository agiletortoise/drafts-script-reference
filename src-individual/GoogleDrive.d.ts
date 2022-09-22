/**
 * GoogleDrive objects can be used to work with files in Google Drive accounts.
 * 
 * ### Example
 * 
 * ```javascript
 * // create GoogleDrive object
 * var drive = GoogleDrive.create();
 * 
 * // setup variables
 * var fileName = "MyTestFile";
 * var parent = ""; // root of drive
 * var content = "text to place in file";
 * 
 * // write to file on GoogleDrive
 * var success = drive.write(fileName, parent, content);
 * 
 * if (success) { // write worked!
 *   var driveContent = drive.read(fileName, parent);
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
declare class GoogleDrive {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Reads the contents of the file at the with the file name, in the parent folder, as a string. Returns `undefined` value if the file does not exist or could not be read.
     * @param fileName
     * @param parent Name of folder in the root of the Google Drive, or `""` for root. FIXME: optional?
     */
    read(fileName: string, parent: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     * @param fileName
     * @param parent Name of folder in the root of the Google Drive, or `""` for root.
     * @param content Text to write to file.
     */
    write(fileName: string, parent: string, content: string): boolean

    /**
     * Creates a new GoogleDrive object.
     * @param identifier used to identify a GoogleDrive account. Typically this can be omitted if you only work with one GoogleDrive account in Drafts.
     */
    static create(identifier?: string): GoogleDrive

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
