import { i18n, JSX } from "#utils";
function sourceLink(context, item) {
    if (!item.url) {
        return (JSX.createElement("li", null,
            i18n.theme_defined_in(),
            " ",
            item.fileName,
            ":",
            item.line));
    }
    if (context.options.getValue("sourceLinkExternal")) {
        return (JSX.createElement("li", null,
            i18n.theme_defined_in(),
            " ",
            JSX.createElement("a", { href: item.url, class: "external", target: "_blank" },
                item.fileName,
                ":",
                item.line)));
    }
    return (JSX.createElement("li", null,
        i18n.theme_defined_in(),
        " ",
        JSX.createElement("a", { href: item.url },
            item.fileName,
            ":",
            item.line)));
}
export const memberSources = (context, props) => {
    const sources = [];
    if (props.implementationOf) {
        sources.push(JSX.createElement("p", null,
            i18n.theme_implementation_of(),
            " ",
            context.typeAndParent(props.implementationOf)));
    }
    if (props.inheritedFrom) {
        sources.push(JSX.createElement("p", null,
            i18n.theme_inherited_from(),
            " ",
            context.typeAndParent(props.inheritedFrom)));
    }
    if (props.overwrites) {
        sources.push(JSX.createElement("p", null,
            i18n.theme_overrides(),
            " ",
            context.typeAndParent(props.overwrites)));
    }
    if (props.sources?.length) {
        sources.push(JSX.createElement("ul", null, props.sources.map((item) => sourceLink(context, item))));
    }
    if (sources.length === 0) {
        return JSX.createElement(JSX.Fragment, null);
    }
    return JSX.createElement("aside", { class: "tsd-sources" }, sources);
};
