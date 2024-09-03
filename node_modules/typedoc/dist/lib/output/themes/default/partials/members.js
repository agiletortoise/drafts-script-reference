"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.members = members;
const utils_1 = require("../../../../utils");
function getMemberSections(parent) {
    if (parent.categories?.length) {
        return (0, utils_1.filterMap)(parent.categories, (cat) => {
            if (!cat.allChildrenHaveOwnDocument()) {
                return {
                    title: cat.title,
                    children: cat.children.filter((child) => !child.hasOwnDocument),
                };
            }
        });
    }
    if (parent.groups?.length) {
        return parent.groups.flatMap((group) => {
            if (group.categories?.length) {
                return (0, utils_1.filterMap)(group.categories, (cat) => {
                    if (!cat.allChildrenHaveOwnDocument()) {
                        return {
                            title: `${group.title} - ${cat.title}`,
                            children: cat.children.filter((child) => !child.hasOwnDocument),
                        };
                    }
                });
            }
            return {
                title: group.title,
                children: group.children.filter((child) => !child.hasOwnDocument),
            };
        });
    }
    return [];
}
function members(context, props) {
    const sections = getMemberSections(props).filter((sect) => sect.children.length);
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null, sections.map(({ title, children }) => {
        context.page.startNewSection(title);
        return (utils_1.JSX.createElement("details", { class: "tsd-panel-group tsd-member-group tsd-accordion", open: true },
            utils_1.JSX.createElement("summary", { class: "tsd-accordion-summary", "data-key": "section-" + title },
                utils_1.JSX.createElement("h2", null,
                    context.icons.chevronDown(),
                    " ",
                    title)),
            utils_1.JSX.createElement("section", null, children.map((item) => context.member(item)))));
    })));
}
