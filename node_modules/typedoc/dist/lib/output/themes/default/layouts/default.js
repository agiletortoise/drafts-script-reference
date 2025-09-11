import { JSX } from "#utils";
import { getDisplayName, getHierarchyRoots } from "../../lib.js";
import { extname } from "path";
function favicon(context) {
    const fav = context.options.getValue("favicon");
    if (!fav)
        return null;
    if (/^https?:\/\//i.test(fav)) {
        return JSX.createElement("link", { rel: "icon", href: fav });
    }
    switch (extname(fav)) {
        case ".ico":
            return JSX.createElement("link", { rel: "icon", href: context.relativeURL("assets/favicon.ico", true) });
        case ".png":
            return JSX.createElement("link", { rel: "icon", href: context.relativeURL("assets/favicon.png", true), type: "image/png" });
        case ".svg":
            return JSX.createElement("link", { rel: "icon", href: context.relativeURL("assets/favicon.svg", true), type: "image/svg+xml" });
        default:
            return null;
    }
}
// See #2760
function buildSiteMetadata(context) {
    try {
        // We have to know where we are hosted in order to generate this block
        const url = new URL(context.options.getValue("hostedBaseUrl"));
        // No point in generating this if we aren't the root page on the site
        if (url.pathname !== "/") {
            return null;
        }
        return (JSX.createElement("script", { type: "application/ld+json" },
            JSX.createElement(JSX.Raw, { html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: context.model.project.name,
                    url: url.toString(),
                }) })));
    }
    catch {
        return null;
    }
}
export const defaultLayout = (context, template, props) => (JSX.createElement("html", { class: "default", lang: context.options.getValue("lang"), "data-base": context.relativeURL("./") },
    JSX.createElement("head", null,
        JSX.createElement("meta", { charset: "utf-8" }),
        context.hook("head.begin", context),
        JSX.createElement("meta", { "http-equiv": "x-ua-compatible", content: "IE=edge" }),
        JSX.createElement("title", null, props.model.isProject()
            ? getDisplayName(props.model)
            : `${getDisplayName(props.model)} | ${getDisplayName(props.project)}`),
        favicon(context),
        props.url === "index.html" && buildSiteMetadata(context),
        JSX.createElement("meta", { name: "description", content: "Documentation for " + props.project.name }),
        JSX.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
        JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/style.css", true) }),
        JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/highlight.css", true) }),
        context.options.getValue("customCss") && (JSX.createElement("link", { rel: "stylesheet", href: context.relativeURL("assets/custom.css", true) })),
        JSX.createElement("script", { defer: true, src: context.relativeURL("assets/main.js", true) }),
        context.options.getValue("customJs") && (JSX.createElement("script", { defer: true, src: context.relativeURL("assets/custom.js", true) })),
        JSX.createElement("script", { async: true, src: context.relativeURL("assets/icons.js", true), id: "tsd-icons-script" }),
        JSX.createElement("script", { async: true, src: context.relativeURL("assets/search.js", true), id: "tsd-search-script" }),
        JSX.createElement("script", { async: true, src: context.relativeURL("assets/navigation.js", true), id: "tsd-nav-script" }),
        !!getHierarchyRoots(props.project).length && (JSX.createElement("script", { async: true, src: context.relativeURL("assets/hierarchy.js", true), id: "tsd-hierarchy-script" })),
        context.hook("head.end", context)),
    JSX.createElement("body", null,
        context.hook("body.begin", context),
        JSX.createElement("script", null,
            JSX.createElement(JSX.Raw, { html: 'document.documentElement.dataset.theme = localStorage.getItem("tsd-theme") || "os";' }),
            JSX.createElement(JSX.Raw, { html: 'document.body.style.display="none";' }),
            JSX.createElement(JSX.Raw, { html: 'setTimeout(() => window.app?app.showPage():document.body.style.removeProperty("display"),500)' })),
        context.toolbar(props),
        JSX.createElement("div", { class: "container container-main" },
            JSX.createElement("div", { class: "col-content" },
                context.hook("content.begin", context),
                context.header(props),
                template(props),
                context.hook("content.end", context)),
            JSX.createElement("div", { class: "col-sidebar" },
                JSX.createElement("div", { class: "page-menu" },
                    context.hook("pageSidebar.begin", context),
                    context.pageSidebar(props),
                    context.hook("pageSidebar.end", context)),
                JSX.createElement("div", { class: "site-menu" },
                    context.hook("sidebar.begin", context),
                    context.sidebar(props),
                    context.hook("sidebar.end", context)))),
        context.footer(),
        JSX.createElement("div", { class: "overlay" }),
        context.hook("body.end", context))));
