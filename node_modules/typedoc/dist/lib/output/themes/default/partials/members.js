import { JSX } from "#utils";
import {} from "../../../../models/index.js";
import { getMemberSections, isNoneSection } from "../../lib.js";
export function members(context, props) {
    const sections = getMemberSections(props, (child) => !context.router.hasOwnDocument(child));
    return (JSX.createElement(JSX.Fragment, null, sections.map((section) => {
        if (isNoneSection(section)) {
            return (JSX.createElement("section", { class: "tsd-panel-group tsd-member-group" }, section.children.map((item) => context.member(item))));
        }
        context.page.startNewSection(section.title);
        return (JSX.createElement("details", { class: "tsd-panel-group tsd-member-group tsd-accordion", open: true },
            JSX.createElement("summary", { class: "tsd-accordion-summary", "data-key": "section-" + section.title },
                context.icons.chevronDown(),
                JSX.createElement("h2", null, section.title)),
            JSX.createElement("section", null, section.children.map((item) => context.member(item)))));
    })));
}
