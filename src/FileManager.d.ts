/**
 * # FileManager
 * 
 * FileManager objects can be used to read from or write to files in either the local Drafts app Documents directory (as visible in the `Files.app`), or iCloud Drive (inside the `Drafts` folder).
 *
 * ### Example
 * 
 * ```javascript
 * // create a local file in App documents
 * let fmLocal = FileManager.createLocal(); // Local file in app container
 * let success = fmLocal.writeString("/ScriptedFile.txt", "This is the file  * content");
 * 
 * // read from file in iCloud
 * let fmCloud = FileManager.createCloud(); // iCloud
 * let content = fmCloud.readString("/Test Folder/Test.txt")
 * 
 * // create a directory, and move a file to it
 * fmCloud.createDirectory("My Folder", "/");
 * fmCloud.moveItem("/TestFile.txt", "/My Folder/TestFile.txt", false);
 * ```
 */
declare class FileManager {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Convenience method to create local file manager.
     */
    static createLocal(): FileManager

    /**
     * Convenience method to create iCloud file manager.
     */
    static createCloud(): FileManager

    /**
    * The base local URL (`file:///` format) to the directory used by this FileManager.
    */
    readonly baseURL: string

    /**
    * The base POSIX-style path to the directory used by this FileManager.
    */
    readonly basePath: string

    /**
     * Reads the contents of the file at the path. Returns `undefined` value if the file does not exist or could not be read.
     * @param path should begin with a `/` and be relative to the root directory of the FileManager.
     */
    readString(path: string): string | undefined

    /**
     * Write the contents of the file at the path. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     */
    writeString(path: string, content: string): boolean

    /**
     * List files and directories at the specified path. Array of full path will be returned.
     */
    listContents(path: string): string[]

    /**
     * Create a directory with the specified name in the specified path. Returns true if directory successfully created.
     */
    createDirectory(name: string, path: string): boolean

    /**
     * Move file or directory at `fromPath` to the `toPath`. From and to path should be complete paths with file names included.
     * @param fromPath
     * @param toPath
     * @param overwrite If true, replace existing files in at the toPath. If false, abort operation if file exists at destination.
     */
    moveItem(fromPath: string, toPath: string, overwrite?: boolean): boolean

    /**
     * Copy file or directory at `fromPath` to the `toPath`. From and to path should be complete paths with file names included.
     * @param fromPath
     * @param toPath
     * @param overwrite If true, replace existing files in at the toPath. If false, abort operation if file exists at destination.
     */
    copyItem(fromPath: string, toPath: string, overwrite?: boolean): boolean

    /**
     * Creates a new FileManager object.
     * @param isLocal If `true`, the `FileManager` will be using the to the local Drafts app documents directory as its root directory, as it appears in the "On my …" area in the `Files.app`. If `false`, it will use the Drafts5 iCloud folder as its root directory.
     */
    static create(isLocal: boolean): FileManager
}

