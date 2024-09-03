"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigation = void 0;
exports.sidebar = sidebar;
exports.sidebarLinks = sidebarLinks;
exports.settings = settings;
exports.pageSidebar = pageSidebar;
exports.pageNavigation = pageNavigation;
const models_1 = require("../../../../models");
const utils_1 = require("../../../../utils");
const lib_1 = require("../../lib");
function sidebar(context, props) {
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        context.sidebarLinks(),
        context.navigation(props)));
}
function buildFilterItem(context, name, displayName, defaultValue) {
    return (utils_1.JSX.createElement("li", { class: "tsd-filter-item" },
        utils_1.JSX.createElement("label", { class: "tsd-filter-input" },
            utils_1.JSX.createElement("input", { type: "checkbox", id: `tsd-filter-${name}`, name: name, checked: defaultValue }),
            context.icons.checkbox(),
            utils_1.JSX.createElement("span", null, displayName))));
}
function sidebarLinks(context) {
    const links = Object.entries(context.options.getValue("sidebarLinks"));
    const navLinks = Object.entries(context.options.getValue("navigationLinks"));
    if (!links.length && !navLinks.length)
        return null;
    return (utils_1.JSX.createElement("nav", { id: "tsd-sidebar-links", class: "tsd-navigation" },
        links.map(([label, url]) => (utils_1.JSX.createElement("a", { href: url }, label))),
        navLinks.map(([label, url]) => (utils_1.JSX.createElement("a", { href: url, class: "tsd-nav-link" }, label)))));
}
const flagOptionNameToReflectionFlag = {
    protected: models_1.ReflectionFlag.Protected,
    private: models_1.ReflectionFlag.Private,
    external: models_1.ReflectionFlag.External,
    inherited: models_1.ReflectionFlag.Inherited,
};
function settings(context) {
    const defaultFilters = context.options.getValue("visibilityFilters");
    const visibilityOptions = [];
    for (const key of Object.keys(defaultFilters)) {
        if (key.startsWith("@")) {
            const filterName = key
                .substring(1)
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();
            visibilityOptions.push(buildFilterItem(context, filterName, context.internationalization.translateTagName(key), defaultFilters[key]));
        }
        else if ((key === "protected" && !context.options.getValue("excludeProtected")) ||
            (key === "private" && !context.options.getValue("excludePrivate")) ||
            (key === "external" && !context.options.getValue("excludeExternals")) ||
            key === "inherited") {
            visibilityOptions.push(buildFilterItem(context, key, context.internationalization.flagString(flagOptionNameToReflectionFlag[key]), defaultFilters[key]));
        }
    }
    // Settings panel above navigation
    return (utils_1.JSX.createElement("div", { class: "tsd-navigation settings" },
        utils_1.JSX.createElement("details", { class: "tsd-accordion", open: false },
            utils_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
                utils_1.JSX.createElement("h3", null,
                    context.icons.chevronDown(),
                    context.i18n.theme_settings())),
            utils_1.JSX.createElement("div", { class: "tsd-accordion-details" },
                visibilityOptions.length && (utils_1.JSX.createElement("div", { class: "tsd-filter-visibility" },
                    utils_1.JSX.createElement("span", { class: "settings-label" }, context.i18n.theme_member_visibility()),
                    utils_1.JSX.createElement("ul", { id: "tsd-filter-options" }, ...visibilityOptions))),
                utils_1.JSX.createElement("div", { class: "tsd-theme-toggle" },
                    utils_1.JSX.createElement("label", { class: "settings-label", for: "tsd-theme" }, context.i18n.theme_theme()),
                    utils_1.JSX.createElement("select", { id: "tsd-theme" },
                        utils_1.JSX.createElement("option", { value: "os" }, context.i18n.theme_os()),
                        utils_1.JSX.createElement("option", { value: "light" }, context.i18n.theme_light()),
                        utils_1.JSX.createElement("option", { value: "dark" }, context.i18n.theme_dark())))))));
}
const navigation = function navigation(context, props) {
    return (utils_1.JSX.createElement("nav", { class: "tsd-navigation" },
        utils_1.JSX.createElement("a", { href: context.urlTo(props.project), class: (0, lib_1.classNames)({ current: props.project === props.model }) },
            context.icons[models_1.ReflectionKind.Project](),
            utils_1.JSX.createElement("span", null, (0, lib_1.getDisplayName)(props.project))),
        utils_1.JSX.createElement("ul", { class: "tsd-small-nested-navigation", id: "tsd-nav-container", "data-base": context.relativeURL("./") },
            utils_1.JSX.createElement("li", null, context.i18n.theme_loading()))));
};
exports.navigation = navigation;
function pageSidebar(context, props) {
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        context.settings(),
        context.pageNavigation(props)));
}
function buildSectionNavigation(context, headings) {
    const levels = [[]];
    function finalizeLevel(finishedHandlingHeadings) {
        const level = levels.pop();
        if (levels[levels.length - 1].length === 0 && finishedHandlingHeadings) {
            levels[levels.length - 1] = level;
            return;
        }
        const built = (utils_1.JSX.createElement("ul", null, level.map((l) => (utils_1.JSX.createElement("li", null, l)))));
        levels[levels.length - 1].push(built);
    }
    for (const heading of headings) {
        const inferredLevel = heading.level
            ? heading.level + 2 // regular heading
            : heading.kind
                ? 2 // reflection
                : 1; // group/category
        while (inferredLevel < levels.length) {
            finalizeLevel(false);
        }
        while (inferredLevel > levels.length) {
            // Lower level than before
            levels.push([]);
        }
        levels[levels.length - 1].push(utils_1.JSX.createElement("a", { href: heading.link, class: heading.classes },
            heading.kind && context.icons[heading.kind](),
            utils_1.JSX.createElement("span", null, (0, lib_1.wbr)(heading.text))));
    }
    while (levels.length > 1) {
        finalizeLevel(true);
    }
    levels.unshift([]);
    finalizeLevel(true);
    return levels[0];
}
function pageNavigation(context, props) {
    if (!props.pageSections.some((sect) => sect.headings.length)) {
        return utils_1.JSX.createElement(utils_1.JSX.Fragment, null);
    }
    const sections = [];
    for (const section of props.pageSections) {
        if (section.title) {
            sections.push(utils_1.JSX.createElement("details", { open: true, class: "tsd-accordion tsd-page-navigation-section" },
                utils_1.JSX.createElement("summary", { class: "tsd-accordion-summary", "data-key": `tsd-otp-${section.title}` },
                    context.icons.chevronDown(),
                    section.title),
                utils_1.JSX.createElement("div", null, buildSectionNavigation(context, section.headings))));
        }
        else {
            sections.push(buildSectionNavigation(context, section.headings));
        }
    }
    return (utils_1.JSX.createElement("details", { open: true, class: "tsd-accordion tsd-page-navigation" },
        utils_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
            utils_1.JSX.createElement("h3", null,
                context.icons.chevronDown(),
                context.i18n.theme_on_this_page())),
        utils_1.JSX.createElement("div", { class: "tsd-accordion-details" }, sections)));
}
