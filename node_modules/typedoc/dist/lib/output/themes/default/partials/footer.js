"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footer = footer;
const utils_1 = require("../../../../utils");
function footer(context) {
    const hideGenerator = context.options.getValue("hideGenerator");
    let generatorDisplay = utils_1.JSX.createElement(utils_1.JSX.Fragment, null);
    if (!hideGenerator) {
        const message = context.i18n.theme_generated_using_typedoc();
        // Only handles one occurrence, but that's all I expect...
        const index = message.indexOf("TypeDoc");
        if (index == -1) {
            generatorDisplay = utils_1.JSX.createElement("p", { class: "tsd-generator" }, message);
        }
        else {
            const pre = message.substring(0, index);
            const post = message.substring(index + "TypeDoc".length);
            generatorDisplay = (utils_1.JSX.createElement("p", { class: "tsd-generator" },
                pre,
                utils_1.JSX.createElement("a", { href: "https://typedoc.org/", target: "_blank" }, "TypeDoc"),
                post));
        }
    }
    const customFooterHtml = context.options.getValue("customFooterHtml");
    let customFooterDisplay = utils_1.JSX.createElement(utils_1.JSX.Fragment, null);
    if (customFooterHtml) {
        if (context.options.getValue("customFooterHtmlDisableWrapper")) {
            customFooterDisplay = utils_1.JSX.createElement(utils_1.JSX.Raw, { html: customFooterHtml });
        }
        else {
            customFooterDisplay = (utils_1.JSX.createElement("p", null,
                utils_1.JSX.createElement(utils_1.JSX.Raw, { html: customFooterHtml })));
        }
    }
    return (utils_1.JSX.createElement("footer", null,
        context.hook("footer.begin", context),
        generatorDisplay,
        customFooterDisplay,
        context.hook("footer.end", context)));
}
