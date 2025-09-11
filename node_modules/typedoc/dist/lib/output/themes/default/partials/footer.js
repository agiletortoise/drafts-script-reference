import { i18n, JSX } from "#utils";
export function footer(context) {
    const hideGenerator = context.options.getValue("hideGenerator");
    let generatorDisplay = JSX.createElement(JSX.Fragment, null);
    if (!hideGenerator) {
        const message = i18n.theme_generated_using_typedoc();
        // Only handles one occurrence, but that's all I expect...
        const index = message.indexOf("TypeDoc");
        if (index == -1) {
            generatorDisplay = JSX.createElement("p", { class: "tsd-generator" }, message);
        }
        else {
            const pre = message.substring(0, index);
            const post = message.substring(index + "TypeDoc".length);
            generatorDisplay = (JSX.createElement("p", { class: "tsd-generator" },
                pre,
                JSX.createElement("a", { href: "https://typedoc.org/", target: "_blank" }, "TypeDoc"),
                post));
        }
    }
    const customFooterHtml = context.options.getValue("customFooterHtml");
    let customFooterDisplay = JSX.createElement(JSX.Fragment, null);
    if (customFooterHtml) {
        if (context.options.getValue("customFooterHtmlDisableWrapper")) {
            customFooterDisplay = JSX.createElement(JSX.Raw, { html: customFooterHtml });
        }
        else {
            customFooterDisplay = (JSX.createElement("p", null,
                JSX.createElement(JSX.Raw, { html: customFooterHtml })));
        }
    }
    return (JSX.createElement("footer", null,
        context.hook("footer.begin", context),
        generatorDisplay,
        customFooterDisplay,
        context.hook("footer.end", context)));
}
