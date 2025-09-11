import Path from "path";
import { RendererComponent } from "../components.js";
import { RendererEvent } from "../events.js";
import { DefaultTheme } from "../themes/default/DefaultTheme.js";
import { writeFile } from "#node-utils";
import { escapeHtml, JSX } from "#utils";
export class SitemapPlugin extends RendererComponent {
    get hostedBaseUrl() {
        const url = this.application.options.getValue("hostedBaseUrl");
        return !url || url.endsWith("/") ? url : url + "/";
    }
    constructor(owner) {
        super(owner);
        this.owner.on(RendererEvent.BEGIN, this.onRendererBegin.bind(this));
    }
    onRendererBegin(_event) {
        if (!(this.owner.theme instanceof DefaultTheme)) {
            return;
        }
        if (!this.hostedBaseUrl) {
            return;
        }
        this.owner.hooks.on("head.begin", (context) => {
            if (context.page.url === "index.html") {
                return {
                    tag: "link",
                    props: { rel: "canonical", href: this.hostedBaseUrl },
                    children: [],
                };
            }
            return { tag: JSX.Fragment, props: null, children: [] };
        });
        this.owner.preRenderAsyncJobs.push((event) => this.buildSitemap(event));
    }
    async buildSitemap(event) {
        // cSpell:words lastmod urlset
        const sitemapXml = Path.join(event.outputDirectory, "sitemap.xml");
        const lastmod = new Date(this.owner.renderStartTime).toISOString();
        const urls = event.pages.map((page) => {
            return {
                tag: "url",
                children: [
                    {
                        tag: "loc",
                        children: new URL(page.url, this.hostedBaseUrl).toString(),
                    },
                    {
                        tag: "lastmod",
                        children: lastmod,
                    },
                ],
            };
        });
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
            stringifyXml({
                tag: "urlset",
                attr: { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" },
                children: urls,
            }) +
            "\n";
        await writeFile(sitemapXml, sitemap);
    }
}
function stringifyXml(xml, indent = 0) {
    const parts = ["\t".repeat(indent), "<", xml.tag];
    for (const [key, val] of Object.entries(xml.attr || {})) {
        parts.push(" ", key, '="', escapeHtml(val), '"');
    }
    parts.push(">");
    if (typeof xml.children === "string") {
        parts.push(escapeHtml(xml.children));
    }
    else {
        for (const child of xml.children) {
            parts.push("\n");
            parts.push(stringifyXml(child, indent + 1));
        }
        parts.push("\n", "\t".repeat(indent));
    }
    parts.push("</", xml.tag, ">");
    return parts.join("");
}
