/**
 * The Message object can be used to create and send mail iMessages, similar to those created by a "Message" action step.   
 * 
 * @example
 * 
 * ```javascript
 * let msg = Message.create();
 * msg.toRecipients = ["joe@sample.com"];
 * msg.subject = "My test message";
 * msg.body = "Body text";
 * 
 * let success = msg.send();
 * ```
 */

declare class Message {
    /**
     * Array of phone numbers and email addresses to use as `To:` recipients.
     */
    toRecipients: string[]
    /**
     * Subject line. Only used if subject is enabled in Messages settings on the device.
     */
    subject: string
    /**
     * Body text of the mail message.
     */
    body: string
    /**
     * true/false flag indicated if the message object has already been sent.
     */
    isSent: boolean

    /**
     * One of the following strings
     * * created: Initial value before `send()` has been called.
     * * sent: The message was sent successfully.
     * * messagesUnavailable: On iOS, Mail.app services were not available.
     * * userCancelled: The user cancelled the Mail.app window without sending.
     * * unknownError: An unknown error occurred.
     */
    status:
        | 'created'
        | 'sent'
        | 'messagesUnavailable'
        | 'userCancelled'
        | 'unknownError'

    /**
     * Send the message. This will open the `Messages.app` sending window. Returns `true` if the message was sent successfully or `false` if not - if, for example, the user cancelled the message window.
     */
    send(): boolean

    /**
     * Instantiate `Message` object
     */
    static create(): Message

    /**
     * Create new instance.
     */
    constructor()
}
