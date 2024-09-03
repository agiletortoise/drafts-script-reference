/**
 * FileManager objects can be used to read from or write to files in either the local Drafts app Documents directory, or iCloud Drive (inside the `Drafts` folder).Note that local files are not visible on iOS, and are only available for reading and writing via scripting.
 *
 * @example
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
 * 
 * // create file manager using a Bookmark
 * let bookmark = Bookmark.findOrCreate("My-Folder");
 * let fm = FileManager.createForBookmark(bookmark);
 * ```
 */
declare class FileManager {
    /**
     * If a function fails, this property will contain the last error as a string message, otherwise it will be `undefined`.
     */
    lastError: string | undefined

    /**
     * Convenience method to create local file manager. Note that local files are not visible on iOS in the Files app and are only available through the use of scripting.
     * @category Constructors
     */
    static createLocal(): FileManager

    /**
     * Convenience method to create iCloud file manager. iCloud file managers work with files in the `iCloud Drive/Drafts` folder
     * @category Constructors
     */
    static createCloud(): FileManager

    /**
     * Convenience method to create a file manager linked to a {@link Bookmark} object.
     * @category Constructors
     */
    static createForBookmark(bookmark: Bookmark): FileManager

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
     * Reads the contents of a JSON formatted file at the path. Returns `undefined` value if the file does not exist or could not be read and parsed as JSON. Contents could be an object, array of objects, etc., depending on the content of the JSON file.
     * @param path should begin with a `/` and be relative to the root directory of the FileManager.
    */
    readJSON(path: string): object | undefined

    /**
     * Write the contents to the path in JSON format. Returns true if successful, false if the file could not be written successfully. This will override existing files!
     */
    writeJSON(path: string, content: object): boolean

    /**
     * Check if a file already exists at the given path.
     */
    exists(path: string): boolean

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
     * Get creation date of file at path.
     * @param path
     * @category Attribute
     */
    getCreationDate(path: string): Date

    /**
     * Get modification date of file at path.
     * @param path
     * @category Attribute
     */
    getModificationDate(path: string): Date

    /**
     * Set creation date of file at path. Returns true if successful, false if not.
     * @param path
     * @param date
     * @category Attribute
     */
    setCreationDate(path: string, date: Date): boolean

    /**
     * Set modification date of file at path. Returns true if successful, false if not.
    * @param path
    * @param date
    * @category Attribute
    */
    setModificationDate(path: string, date: Date): boolean

    /**
     * Set tags on the file at path.
     * @param path
     * @param tags
     * @category Attribute
     */
    setTags(path: string, tags: string[]): boolean

    /**
     * Get tags on file at path.
    * @param path
    * @category Attribute
    */
    getTags(path: string): string[]

    /**
     * Creates a new FileManager object.
     * @param isLocal If `true`, the `FileManager` will be using the to the local Drafts app documents directory as its root directory, as it appears in the "On my …" area in the `Files.app`. If `false`, it will use the Drafts5 iCloud folder as its root directory.
     * @category Constructors
     */
    static create(isLocal: boolean): FileManager
}

