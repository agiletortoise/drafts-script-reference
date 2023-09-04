/**
 * Version objects represent individual versions in a draft's [version history](https://docs.getdrafts.com/docs/drafts/versionhistory). Versions are accessed using the `versions` property of the {@link Draft} object.
 * 
 * @example
 * 
 * ```javascript
 * // loop over versions of a draft, keeping only most recent 3
 * if (draft.versions.length > 3) {
 *   let versions = draft.versions.slice(3);
 *   for (let version of versions) {
 *     version.delete();
 *   }
 * }
 * ```
 */
declare class Version {
    private constructor()
    /**
     * Unique identifier of this version
     */
    readonly uuid: string
    /**
    * The content of the draft at the time this version was saved
    */
    readonly content: string
    /**
    * Timestamp for the creation of the version
    */
    readonly createdAt: Date
    /**
    * Delete the version. This is permanent and should be used with caution
    */
    delete()
    /**
    * The {@link Draft} object related to the version. Typically not needed, as versions are accessed through the `versions` property of a draft.
    */
    readonly draft?: Draft
}
