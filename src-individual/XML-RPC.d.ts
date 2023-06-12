/**
 * The XMLRPC object is a convenience method to provide an easy way to [XML-RPC](http://xmlrpc.scripting.com/) web services. The request function takes care of converting native Javascript objects and values to the XML parameters required for the XML-RPC interface, and converts the XML responses returned to Javascript objects.
 *
 * It will also return faults parsed to error messages in the response if necessary.
 *
 * This object is suitable for communication with a number of popular XML-RPC interfaces, including the [MetaWeblog API](http://xmlrpc.scripting.com/metaWeblogApi.html). WordPress also offers its own XML-RPC interface, which can be used via this object, or the convenience wrapper `WordPress` object.
 * 
 * @example
 * 
 * **XML-RPC call**

* ```javascript
* // DEMO of XML-RPC
* // Calls example method on http://xml-rpc.net/index.html
* 
* let url = "http://www.cookcomputing.com/xmlrpcsamples/RPC2.ashx";
* let methodName = "examples.getStateName";
* let params = [20];
* 
* let response = XMLRPC.request(url, methodName, params);
* 
* if (response.success) {
* 	alert(JSON.stringify(response.params));
* }
* else {
* 	alert("Fault: " + response.faultCode + ", " + response.error);
* 	context.fail();
* }
* 
* ```
*/
declare class XMLRPC {
    /**
     * Make an XML-RPC request.
     * @param url The full URL of the XML-RPC host endpoint being called.
     * @param methodName Name of the method to call. Supported values are specific to the services provided by the host.
     * @param params The parameters to pass to the request. This should be an array of values, in the proper order, as specified by the documentation of the host being called. This array will be encoded into XML-RPC parameters in XML format by the method - only raw javascript values should be provided.
     */
    static request(url: string, methodName: string, params: any[]): XMLRPCResponse
}

/**
 * # XMLRPCResponse
 * 
 * XMLRPCResponse objects are returned by calls to using XML-RPC interfaces. For details on using XML-RPC, see {@link XMLRPC} object reference.
 */
declare class XMLRPCResponse {
    /**
     * whether the request was completed successfully. This value will be `true` if both the HTTP status code is 200 and no fault code was returned from the API.
     */
    success: boolean

    /**
     * The HTTP status code (like 200, 301, etc.) returned. This will be 200 if communication with the XML-RPC endpoint was successful, even if a fault occurred processing the request. Be sure to use the `success` property and `faultCode` to check for errors.
     */
    statusCode: number

    /**
     * The array of return parameters provided by with the XML-RPC response. Contents of this array will vary with the XML-RPC API being used.
     */
    params: any[]

    /**
     * If the XML-RPC interface returned an error, the error code will be here.
     */
    faultCode?: number

    /**
     * If an error occurred, a description of the type of error.
     */
    error?: string
}
