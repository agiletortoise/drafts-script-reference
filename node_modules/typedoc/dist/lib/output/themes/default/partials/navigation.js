import { ReflectionFlag, ReflectionFlags } from "../../../../models/index.js";
import { i18n, JSX, translateTagName } from "#utils";
import { classNames, getDisplayName, wbr } from "../../lib.js";
export function sidebar(context, props) {
    return (JSX.createElement(JSX.Fragment, null,
        context.sidebarLinks(),
        context.navigation(props)));
}
function buildFilterItem(context, name, displayName, defaultValue) {
    return (JSX.createElement("li", { class: "tsd-filter-item" },
        JSX.createElement("label", { class: "tsd-filter-input" },
            JSX.createElement("input", { type: "checkbox", id: `tsd-filter-${name}`, name: name, checked: defaultValue }),
            context.icons.checkbox(),
            JSX.createElement("span", null, displayName))));
}
export function sidebarLinks(context) {
    const links = Object.entries(context.options.getValue("sidebarLinks"));
    const navLinks = Object.entries(context.options.getValue("navigationLinks"));
    if (!links.length && !navLinks.length)
        return null;
    return (JSX.createElement("nav", { id: "tsd-sidebar-links", class: "tsd-navigation" },
        links.map(([label, url]) => JSX.createElement("a", { href: url }, label)),
        navLinks.map(([label, url]) => (JSX.createElement("a", { href: url, class: "tsd-nav-link" }, label)))));
}
const flagOptionNameToReflectionFlag = {
    protected: ReflectionFlag.Protected,
    private: ReflectionFlag.Private,
    external: ReflectionFlag.External,
    inherited: ReflectionFlag.Inherited,
};
export function settings(context) {
    const defaultFilters = context.options.getValue("visibilityFilters");
    const visibilityOptions = [];
    for (const key of Object.keys(defaultFilters)) {
        if (key.startsWith("@")) {
            const filterName = key
                .substring(1)
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();
            visibilityOptions.push(buildFilterItem(context, filterName, translateTagName(key), defaultFilters[key]));
        }
        else if ((key === "protected" && !context.options.getValue("excludeProtected")) ||
            (key === "private" && !context.options.getValue("excludePrivate")) ||
            (key === "external" && !context.options.getValue("excludeExternals")) ||
            key === "inherited") {
            visibilityOptions.push(buildFilterItem(context, key, ReflectionFlags.flagString(flagOptionNameToReflectionFlag[key]), defaultFilters[key]));
        }
    }
    // Settings panel above navigation
    return (JSX.createElement("div", { class: "tsd-navigation settings" },
        JSX.createElement("details", { class: "tsd-accordion", open: false },
            JSX.createElement("summary", { class: "tsd-accordion-summary" },
                context.icons.chevronDown(),
                JSX.createElement("h3", null, i18n.theme_settings())),
            JSX.createElement("div", { class: "tsd-accordion-details" },
                !!visibilityOptions.length && (JSX.createElement("div", { class: "tsd-filter-visibility" },
                    JSX.createElement("span", { class: "settings-label" }, i18n.theme_member_visibility()),
                    JSX.createElement("ul", { id: "tsd-filter-options" }, ...visibilityOptions))),
                JSX.createElement("div", { class: "tsd-theme-toggle" },
                    JSX.createElement("label", { class: "settings-label", for: "tsd-theme" }, i18n.theme_theme()),
                    JSX.createElement("select", { id: "tsd-theme" },
                        JSX.createElement("option", { value: "os" }, i18n.theme_os()),
                        JSX.createElement("option", { value: "light" }, i18n.theme_light()),
                        JSX.createElement("option", { value: "dark" }, i18n.theme_dark())))))));
}
export const navigation = function navigation(context, props) {
    return (JSX.createElement("nav", { class: "tsd-navigation" },
        JSX.createElement("a", { href: context.urlTo(props.project), class: classNames({
                current: props.url === context.router.getFullUrl(props.model) && props.model.isProject(),
            }) }, getDisplayName(props.project)),
        JSX.createElement("ul", { class: "tsd-small-nested-navigation", id: "tsd-nav-container" },
            JSX.createElement("li", null, i18n.theme_loading()))));
};
export function pageSidebar(context, props) {
    return (JSX.createElement(JSX.Fragment, null,
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
        const built = (JSX.createElement("ul", null, level.map((l) => JSX.createElement("li", null, l))));
        levels[levels.length - 1].push(built);
    }
    function getInferredHeadingLevel(heading) {
        if (heading.level) {
            // Regular heading
            return heading.level + 2;
        }
        if (heading.kind) {
            // Reflection
            return 2;
        }
        // Group/category
        return 1;
    }
    for (const heading of headings) {
        const inferredLevel = getInferredHeadingLevel(heading);
        while (inferredLevel < levels.length) {
            finalizeLevel(false);
        }
        while (inferredLevel > levels.length) {
            // Lower level than before
            levels.push([]);
        }
        levels[levels.length - 1].push(JSX.createElement("a", { href: heading.link, class: classNames({}, heading.classes) },
            heading.kind && context.icons[heading.kind](),
            JSX.createElement("span", null, wbr(heading.text))));
    }
    while (levels.length > 1) {
        finalizeLevel(true);
    }
    levels.unshift([]);
    finalizeLevel(true);
    return levels[0];
}
export function pageNavigation(context, props) {
    if (!props.pageSections.some((sect) => sect.headings.length)) {
        return JSX.createElement(JSX.Fragment, null);
    }
    const sections = [];
    for (const section of props.pageSections) {
        if (section.title) {
            sections.push(JSX.createElement("details", { open: true, class: "tsd-accordion tsd-page-navigation-section" },
                JSX.createElement("summary", { class: "tsd-accordion-summary", "data-key": `section-${section.title}` },
                    context.icons.chevronDown(),
                    section.title),
                JSX.createElement("div", null, buildSectionNavigation(context, section.headings))));
        }
        else {
            sections.push(buildSectionNavigation(context, section.headings));
        }
    }
    return (JSX.createElement("details", { open: true, class: "tsd-accordion tsd-page-navigation" },
        JSX.createElement("summary", { class: "tsd-accordion-summary" },
            context.icons.chevronDown(),
            JSX.createElement("h3", null, i18n.theme_on_this_page())),
        JSX.createElement("div", { class: "tsd-accordion-details" }, sections)));
}
