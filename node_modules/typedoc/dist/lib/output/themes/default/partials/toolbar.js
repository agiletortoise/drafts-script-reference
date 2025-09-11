import { i18n, JSX } from "#utils";
import { getDisplayName } from "../../lib.js";
export const toolbar = (context, props) => (JSX.createElement("header", { class: "tsd-page-toolbar" },
    JSX.createElement("div", { class: "tsd-toolbar-contents container" },
        JSX.createElement("a", { href: context.options.getValue("titleLink") || context.relativeURL("index.html"), class: "title" }, getDisplayName(props.project)),
        JSX.createElement("div", { id: "tsd-toolbar-links" }, Object.entries(context.options.getValue("navigationLinks")).map(([label, url]) => (JSX.createElement("a", { href: url }, label)))),
        JSX.createElement("button", { id: "tsd-search-trigger", class: "tsd-widget", "aria-label": i18n.theme_search() }, context.icons.search()),
        JSX.createElement("dialog", { id: "tsd-search", "aria-label": i18n.theme_search() },
            JSX.createElement("input", { role: "combobox", id: "tsd-search-input", "aria-controls": "tsd-search-results", "aria-autocomplete": "list", "aria-expanded": "true", spellcheck: false, autocapitalize: "off", autocomplete: "off", placeholder: i18n.theme_search_placeholder(), maxLength: 100 }),
            JSX.createElement("ul", { role: "listbox", id: "tsd-search-results" }),
            JSX.createElement("div", { id: "tsd-search-status", "aria-live": "polite", "aria-atomic": "true" },
                JSX.createElement("div", null, i18n.theme_preparing_search_index()))),
        JSX.createElement("a", { href: "#", class: "tsd-widget menu", id: "tsd-toolbar-menu-trigger", "data-toggle": "menu", "aria-label": i18n.theme_menu() }, context.icons.menu()))));
