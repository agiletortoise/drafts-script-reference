/**
 * The OutlookMessage object can be used to create and send mail messages through Outlook.com integrated accounts, similar to those created by a [Outlook action step](https://getdrafts.com/actions/steps/outlook). Creating and sending these messages happens in the background, with no user interface, so messages must be complete with recipients before calling `send()`. Sending is done via the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph). Outlooks accounts are authenticated when used for the first time using OAuth - to use more than one account, call create with different identifier parameters.
 * 
 * @example
 * 
 * ```javascript
 * let message = OutlookMessage.create();
 * message.toRecipients = ["joe@sample.com", "Jim Test <jim@test.com>"];
 * message.subject = "My test message";
 * message.body = "Body text";
 * 
 * let success = message.send();
 * if (!success) {
 *   console.log("Sending outlook message failed");
 *   context.fail();
 * }
 * ```
 */
declare class OutlookMessage {
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
     * Send the mail message via the Microsoft Graph API.
     */
    send(): boolean

    /**
     * create a new object.
     * @param identifier notes which for Outlook account to use. This string is an arbitrary value, but we recommend using the email address you wish to associate with the script. Each unique identifier will be associated with its own [Credential](https://getdrafts.com/settings/credentials).
     */
    static create(identifier?: string): OutlookMessage

    /**
     * Create new instance.
     */
    constructor(identifier?: string)
}
