"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLayout = void 0;
const utils_1 = require("../../../../utils");
const lib_1 = require("../../lib");
const defaultLayout = (context, template, props) => (utils_1.JSX.createElement("html", { class: "default", lang: context.options.getValue("lang") },
    utils_1.JSX.createElement("head", null,
        utils_1.JSX.createElement("meta", { charset: "utf-8" }),
        context.hook("head.begin", context),
        utils_1.JSX.createElement("meta", { "http-equiv": "x-ua-compatible", content: "IE=edge" }),
        utils_1.JSX.createElement("title", null, props.model.isProject()
            ? (0, lib_1.getDisplayName)(props.model)
            : `${(0, lib_1.getDisplayName)(props.model)} | ${(0, lib_1.getDisplayName)(props.project)}`),
        utils_1.JSX.createElement("meta", { name: "description", content: "Documentation for " + props.project.name }),
        utils_1.JSX.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
        utils_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/style.css", true) }),
        utils_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/highlight.css", true) }),
        context.options.getValue("customCss") && (utils_1.JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/custom.css", true) })),
        utils_1.JSX.createElement("script", { defer: true, src: context.relativeURL("assets/main.js", true) }),
        utils_1.JSX.createElement("script", { async: true, src: context.relativeURL("assets/icons.js", true), id: "tsd-icons-script" }),
        utils_1.JSX.createElement("script", { async: true, src: context.relativeURL("assets/search.js", true), id: "tsd-search-script" }),
        utils_1.JSX.createElement("script", { async: true, src: context.relativeURL("assets/navigation.js", true), id: "tsd-nav-script" }),
        context.hook("head.end", context)),
    utils_1.JSX.createElement("body", null,
        context.hook("body.begin", context),
        utils_1.JSX.createElement("script", null,
            utils_1.JSX.createElement(utils_1.Raw, { html: 'document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os";' }),
            utils_1.JSX.createElement(utils_1.Raw, { html: 'document.body.style.display="none";' }),
            utils_1.JSX.createElement(utils_1.Raw, { html: 'setTimeout(() => app?app.showPage():document.body.style.removeProperty("display"),500)' })),
        context.toolbar(props),
        utils_1.JSX.createElement("div", { class: "container container-main" },
            utils_1.JSX.createElement("div", { class: "col-content" },
                context.hook("content.begin", context),
                context.header(props),
                template(props),
                context.hook("content.end", context)),
            utils_1.JSX.createElement("div", { class: "col-sidebar" },
                utils_1.JSX.createElement("div", { class: "page-menu" },
                    context.hook("pageSidebar.begin", context),
                    context.pageSidebar(props),
                    context.hook("pageSidebar.end", context)),
                utils_1.JSX.createElement("div", { class: "site-menu" },
                    context.hook("sidebar.begin", context),
                    context.sidebar(props),
                    context.hook("sidebar.end", context)))),
        context.footer(),
        utils_1.JSX.createElement("div", { class: "overlay" }),
        context.hook("body.end", context))));
exports.defaultLayout = defaultLayout;
