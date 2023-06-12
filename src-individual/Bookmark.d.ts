/**
 * Bookmark objects are used to work with folder bookmarks and the {@link FileManager} object to provide access to folders outside the Drafts App Sandbox. Bookmarks are unique by name. A user-friendly name should be used, as the first time a bookmark is required, the user is prompted to select the folder in their file system to associate with the bookmark, and a useful name can help guide them to selecting the correct folder.
 * 
 * _Learn more about [Bookmarks in the User Guide](https://docs.getdrafts.com/docs/settings/bookmarks)_
 *
 * @example
 * 
 * ```javascript
 * // find or create a named Bookmark
 * let bookmark = Bookmark.findOrCreate("My-Folder");
 * let fm = FileManager.createForBookmark(bookmark);
 * 
 * // write to a file at the root of the bookmark folder
 * let success = fm.writeString("/ScriptedFile.txt", "This is the file  * content");
 * 
 * // read from file in bookmarked folder
 * let content = fm.readString("/Test Folder/Test.txt") 
 * ```
 */
declare class Bookmark {
    private constructor()
    /**
     * Get a bookmark object with the specified name. If no bookmark with the specified name exists, a new one will be created.
     */
    static findOrCreate(name: string): Bookmark

    /**
    * The name of the bookmark.
    */
    readonly name: string

    /**
     * Forget the bookmark, resetting any associated permissions. Generally, this would be a function the user performs in the user interface, but could be useful in the case of an action which wishes to request and use a one-time bookmark and revoke permissions on completion of an action.
     */
    forget()
}

