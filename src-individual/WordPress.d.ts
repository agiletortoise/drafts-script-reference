/**
 * Script integration with WordPress sites via the [WordPress XML-RPC API](https://codex.wordpress.org/XML-RPC_WordPress_API). Currently this object has one runMethod function which can be used to call any method available in the XML-RPC interface.
 *
 * The WordPress API offers access to a wide variety of functions, including posting, but also retrieving information about categories and tags, or reading posts contents.
 *
 * Drafts `WordPress` object simplifies working with the XML-RPC interface by accepting input parameters as Javascript objects and converting them to the require XML to make requests of the WordPress site. Similarly, it converts to XML returned by WordPress to Javascript objects. Otherwise it is an exact passthrough, so the [WordPress API reference](https://codex.wordpress.org/XML-RPC_WordPress_API) should be used to determine method names (e.g. `wp.newPost`, `wp.getTaxonomies`) available, the appropriate parameters to send.
 *
 * The WordPress XML-RPC API authenticates via username and password, so it is highly recommended you interact only over HTTPS secure connections, and use `Credential` objects to store host/username/password values, rather than hard-coding them in actions.
 * 
 * @example
 * 
 * ```javascript
 * // setup values to use in post
 * let title = "Title of Post"
 * let body = "Body of Post"
 * 
 * // create credentials for site
 * let cred = Credential.createWithHostUsernamePassword("WordPress", "WordPress  * credentials. Include full URL (with http://) of the home page of your WordPress  * site in the host field.");
 * cred.authorize();
 * 
 * // create WordPress object and make request
 * let wp = WordPress.create(cred.getValue("host"), 1, "", "");
 * let method = "wp.newPost"
 * let params = [
 * 	1, // blog_id, in most cases just use 1
 * 	cred.getValue("username"),
 * 	cred.getValue("password"),
 * 	{
 * 		"post_title": title,
 * 		"post_content": body,
 * 		"post_status": "draft",
 * 		"terms_names" : { // assign categories and tags
 * 			"category" : ["Cat1", "BAD"],
 * 			"post_tag" : ["Test1", "NOT-TAG"]
 * 		}
 * 	}
 * ];
 * 
 * let response = wp.runMethod(method, params);
 * if (response.success) {
 * 	let params = response.params;
 * 	console.log("Create WordPress post id: " + params[0]);
 * }
 * else {
 * 	console.log("HTTP Status: " + response.statusCode);
 * 	console.log("Fault: " + response.error);
 * 	context.fail();
 * }
 * ```
 */
declare class WordPress {
    // convenience
    getPost(postId: string): object | undefined
    newPost(content: string): string | undefined
    getPosts(filter?: any): object[] | undefined
    getPostStatusList(): object[] | undefined
    getTaxonomy(taxonomy?: string): object | undefined
    getTaxonomies(): object[] | undefined
    getTerms(taxonomy?: string, filter?: any): object[] | undefined
    getCategories(): object[] | undefined
    getTags(): object[] | undefined

    /**
     * Run an XML-RPC API method on a WordPress site. Any method name supported by the [WordPress XML-RPC API](https://codex.wordpress.org/XML-RPC_WordPress_API) can be used, as long as the authentication information provided has appropriate permissions on the site.
     * @param methodName The method name as documented in the WordPress XML-RPC API, for example `wp.newPost` to create a new post.
     * @param parameters Parameters should be a Javascript array of parameters for the method being used. These vary depending on the method and should follow the documentation provided by WordPress.
     */
    runMethod(methodName: string, parameters: any[]): XMLRPCResponse

    /**
     * Create new instance
     * @param siteURL This should be the full URL to the home page of the WordPress site. e.g. `https://mysite.com` or `https://mysite.com/blog/`.
     * @param blogId For most WordPress installations, use `1`.
     * @param username Username to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     * @param password Password to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     */
    static create(
        siteURL: string,
        blogId: string,
        username?: string,
        password?: string
    ): WordPress

    /**
     * Create new instance
     * @param siteURL This should be the full URL to the home page of the WordPress site. e.g. `https://mysite.com` or `https://mysite.com/blog/`.
     * @param blogId For most WordPress installations, use `1`.
     * @param username Username to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     * @param password Password to login to the WordPress site. Optional if only using runMethod, as credentials will be required directly in parameters for those calls.
     */
    constructor(
        siteURL: string,
        blogId: string,
        username?: string,
        password?: string
    )
}
