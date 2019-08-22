/**
 * # Version
 * 
 * Version objects represent individual versions in a draft's version history
 */
declare class Version {
    /**
     * Unique identifier of this version
     */
    uuid: string
    /**
    * The content of the draft at the time this version was saved
    */
    content: string
    /**
    * Timestamp for the creation of the version
    */
    createdAt: Date
}