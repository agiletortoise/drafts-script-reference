import { classNames, getMemberSections, isNoneSection, renderName } from "../../lib.js";
import { i18n, JSX } from "#utils";
function renderSection({ urlTo, reflectionIcon, getReflectionClasses, markdown }, item) {
    return (JSX.createElement("section", { class: "tsd-index-section" },
        !isNoneSection(item) && JSX.createElement("h3", { class: "tsd-index-heading" }, item.title),
        item.description && (JSX.createElement("div", { class: "tsd-comment tsd-typography" },
            JSX.createElement(JSX.Raw, { html: markdown(item.description) }))),
        JSX.createElement("div", { class: "tsd-index-list" }, item.children.map((item) => (JSX.createElement(JSX.Fragment, null,
            JSX.createElement("a", { href: urlTo(item), class: classNames({ "tsd-index-link": true, deprecated: item.isDeprecated() }, getReflectionClasses(item)) },
                reflectionIcon(item),
                JSX.createElement("span", null, renderName(item))),
            "\n"))))));
}
export function index(context, props) {
    const sections = getMemberSections(props);
    return (JSX.createElement(JSX.Fragment, null,
        JSX.createElement("section", { class: "tsd-panel-group tsd-index-group" },
            JSX.createElement("section", { class: "tsd-panel tsd-index-panel" },
                JSX.createElement("details", { class: "tsd-index-content tsd-accordion", open: true },
                    JSX.createElement("summary", { class: "tsd-accordion-summary tsd-index-summary" },
                        context.icons.chevronDown(),
                        JSX.createElement("h5", { class: "tsd-index-heading uppercase" }, i18n.theme_index())),
                    JSX.createElement("div", { class: "tsd-accordion-details" }, sections.map(s => renderSection(context, s))))))));
}
