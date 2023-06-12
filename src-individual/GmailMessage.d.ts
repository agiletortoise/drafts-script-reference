/**
 * The GmailMessage object can be used to create and send mail messages through Gmail accounts, similar to those created by a [Gmail action step](https://getdrafts.com/actions/steps/gmail). Creating and sending these messages happens in the background, with no user interface, so messages must be complete with recipients before calling send(). Sending is done via the [Gmail API](https://developers.google.com/gmail/api/). Gmail accounts are authenticated when used for the first time using OAuth - to use more than one account, call create with different identifier parameters.
 *
 * @example
 * 
 * ```javascript
 * let message = GmailMessage.create();
 * message.toRecipients = ["joe@sample.com"];
 * message.subject = "My test message";
 * message.body = "Body text";
 * 
 * let success = message.send();
 * if (!success) {
 *   console.log("Sending gmail failed");
 *   context.fail();
 * }
 * ```
 */
declare class GmailMessage {
    /**
     * Array of email addresses to use as `To:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    toRecipients: string[]
    /**
     * Array of email addresses to use as `CC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    ccRecipients: string[]
    /**
     * Array of email addresses to use as `BCC:` recipients. Each entry can be a valid email address, or a name and email in the format `Name<email>`.
     */
    bccRecipients: string[]

    subject: string

    /**
     * Body text of the mail message. Can be plain text or HTML if the `isBodyHTML` property is set to `true`.
     */
    body: string

    /**
     * whether to treat the body string and plain text or HTML. When set to `true`, the `body` property should be set to full valid HTML.
     */
    isBodyHTML: boolean

    /**
     * Send the mail message via the Gmail API.
     */
    send(): boolean

    /**
     * create a new object.
     * @param identifier notes which for Gmail account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): GmailMessage

    /**
     * Create new instance.
     */
    constructor(identifier?: string)    
}

