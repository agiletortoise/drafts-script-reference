/**
 * See also: [`Draft.processMustachTemplate`](/classes/draft#processmustachetemplate) for rendering with Mustache similar to how those templates are rendered in actions. The `MustacheTemplate` object is for rendering with your own custom context.
 * 
 * The MustacheTemplate object support rendering of templates using the [Mustache](https://en.wikipedia.org/wiki/Mustache_%28template_system%29) template style.
 *
 * Mustache templates offer advanced features for iterating over items, creating conditional blocks of text and more. This is still a bit of an experimental feature, please send feedback if you are finding edge cases or are interested in more functionality in this area.
 *
 * The object can be used in one of two ways, by passing a specific template as a string and rendering it, or by passing a path to a subdirectory of the `iCloud Drive/Drafts/Library/Templates` folder which can contain more than one Mustache style templates (with file extension `.mustache`), and then rendering them. The late method has the advantage of supporting the use of partial templates in the same folder.
 *
 * For details on using Mustache templates, we recommend reviewing [tutorials](https://www.tsmean.com/articles/mustache/the-ultimate-mustache-tutorial/).
 *
 * ### About Passing Data to Templates
 *
 * When rendering Mustache templates, you pass the template itself and a data object which contains the values available to insert. The data object should be a Javascript object with keys and values. Values can be basic data types (numbers, strings, dates) and also arrays or nested objects which can be iterated using conventions of the Mustache syntax.
 *
 * @example
 * 
 * ```javascript
 * // create template to loop over drafts
 * let t = `Template Output:
 * {{#drafts}}
 * Draft: {{content}}
 * {{#isFlagged}}Flagged!{{/isFlagged}}{{^isFlagged}}Not Flagged{{/isFlagged}}
 * {{/drafts}}`;
 * 
 * let d1 = Draft.create();
 * d1.content = "First draft";
 * d1.isFlagged = true;
 * let d2 = Draft.create();
 * d2.content = "Second draft";
 * let drafts = [d1, d2];
 * 
 * let data = {
 *   "drafts": drafts
 * };
 * 
 * let template = MustacheTemplate.createWithTemplate(t);
 * let result = template.render(data);
 * ```
 */
declare class MustacheTemplate {
    /**
     * Use in combination with `createWithTemplate(template)` to render the template using the data passsed.
     * @param data A Javascript object with the values to use when rendering the template. The object can have nested sub-objects.
     */
    render(data: { [x: string]: any }): string

    /**
     * Use in combination with `createWithPath(path)` to render the template using the data passsed.
     * @param templateName The name of a template file in the directory passed to create the MustacheTemplate object. Do not include the ".mustache" file extension. For example, if you have a "Document.mustache" file in the directory, pass templateName "Document".
     * @param data  A Javascript object with the values to use when rendering the template. The object can have nested sub-objects.
     */
    renderTemplate(templateName: string, data: any): string

    /**
     * Determines how the Mustache engine renders output. Valid options:
     * * `text`: Render the output as plain text, do not do additional encoding of entities.
     * * `html`: Render output as escaped HTML with entities converted for use in HTML.
     */
    contentType: 'text' | 'html'

    /**
     * Create a new object with a template
     * @param template a valid Mustache template string
     */
    createWithTemplate(template: string): MustacheTemplate

    /**
     * Create a new object configured to point to a directory of Mustache template files in iCloud Drive. When using this method, other Mustache template located in the same directory will be available to be used as partials in the rendering process.
     * @param path Relative path to a directory of Mustache template files (with .mustache file extension) located in `iCloud Drive/Drafts/Library/Templates`. For example to refer to templates in the directory `iCloud Drive/Drafts/Library/Templates/My Mustache Templates/`, pass `My Mustache Templates/` to this method.
     */
    createWithPath(path: string): MustacheTemplate
}
