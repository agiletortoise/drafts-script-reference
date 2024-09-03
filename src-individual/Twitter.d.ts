/**
 * *Twitter integration no longer supported due to policy changes at Twitter. This class has been deprecated.*
*/
declare class Twitter {
    /**
     * @deprecated No longer supported
     */
    updateStatus(content: string): boolean

    /**
     * @deprecated No longer supported
     * @param settings 
     */
    request(settings: {
        url: string
        method: string
        headers?: { [x: string]: string }
        parameters?: { [x: string]: string }
        data?: { [x: string]: string }
    }): HTTPResponse

    /**
     * @deprecated No longer supported
     */
    static create(identifier: string): Twitter

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
