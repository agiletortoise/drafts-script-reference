/**
 * Methods to share via system share sheet.
 * 
 * @example

```javascript
* let s = "My text to share"
* 
* let didShare = Share.shareAsText(s);
* let didShare = Share.shareAsURL("http://getdrafts.com/");
* let didShare = Share.shareAsFile("My-File.txt", s);
* ```
*/
declare class Share {
    /**
     * Open system share sheet to share the string provided as text. Returns `true` if share was completed by user, `false` if input was invalid or user cancelled the share.
     */
    static shareAsText(text: string): boolean

    /**
     * Open system share sheet to share the url provided as a URL object. Returns `true` if share was completed by user and `false` if input was invalid or user cancelled share.
     * @param url should be a complete and valid URL
     */
    static shareAsURL(url: string): boolean

    /**
     * Open system share sheet to share the content as a file, with the specified file name (with e). Returns `true` if share was completed by user amd `false` if input was invalid or user cancelled share. Drafts will create a temporary file for the purposes of the share and send it to the share sheet. The temporary file will be deleted after. Useful, for example, to create a text file and share to Mail, and it will be shared as an attachment to the email
     */
    static shareAsFile(filename: string, text: string): boolean
}
