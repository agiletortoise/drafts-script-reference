type mailStatus =        
    | 'created'
    | 'sent'
    | 'savedAsDraft'
    | 'mailUnavailable'
    | 'userCancelled'
    | 'invalid'
    | 'serviceError'
    | 'unknownError'

/**
 * The Mail object can be used to create and send mail messages, similar to those created by a "Mail" action step.
 *
 * @example
 * 
 * ```javascript
 * let mail = Mail.create();
 * mail.toRecipients = ["joe@sample.com"];
 * mail.subject = "My test message";
 * mail.body = "Body text";
 * 
 * let success = mail.send();
 * if (!success) {
 *   console.log(mail.status);
 *   context.fail();
 * }
 * ```
 */
declare class Mail {
    /**
     * Array of email addresses to use as `To:` recipients.
     */
    toRecipients: string[]

    /**
     * Array of email addresses to use as `CC:` recipients.
     */
    ccRecipients: string[]

    /**
     * Array of email addresses to use as `BCC:` recipients.
     */
    bccRecipients: string[]

    /**
     * Array of email addresses to use in `Reply-To:` header. Used only when `sendInBackground` is `true`.
     */
    replyToRecipients: string[]

    /**
     * Subject line
     */
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
     * If `true`, the mail will be sent in the background using a web service rather than via Mail.app - but will come from `drafts-mail@services.getdrafts.com`. Defaults to `false`.
     */
    sendInBackground: boolean

    /**
     * Indicates if the message object has already been sent.
     */
    isSent: boolean

    /**
     * One of the following values:
     * * created: Initial value before `send()` has been called.
     * * sent: The message was sent successfully.
     * * savedAsDraft: On iOS, the user exited the Mail.app window saving as draft, but not sending.
     * * mailUnavailable: On iOS, Mail.app services were not available.
     * * userCancelled: The user cancelled the Mail.app window without sending.
     * * invalid: Mail object is invalid. Common cause if of this is sendInBackground being true, but no recipient configured.
     * * serviceError: Background mail service returned an error.
     * * unknownError: An unknown error occurred.
     */
    status: mailStatus
    
    /**
     * Send the mail message. This will open the `Mail.app` sending window. Returns `true` if the message was sent successfully or `false` if not - if, for example, the user cancelled the mail window.
     */
    send(): boolean

    /**
     * Create `Mail` object
     */
    static create(): Mail

    /**
     * Create new instance.
     */
    constructor()
}
