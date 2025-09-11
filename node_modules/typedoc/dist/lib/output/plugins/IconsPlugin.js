import { RendererComponent } from "../components.js";
import { RendererEvent } from "../events.js";
import { writeFile } from "../../utils/fs.js";
import { DefaultTheme } from "../themes/default/DefaultTheme.js";
import { join } from "path";
import { JSX } from "#utils";
const ICONS_JS = `
(function() {
    addIcons();
    function addIcons() {
        if (document.readyState === "loading") return document.addEventListener("DOMContentLoaded", addIcons);
        const svg = document.body.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        svg.innerHTML = \`SVG_HTML\`;
        svg.style.display = "none";
        if (location.protocol === "file:") updateUseElements();
    }

    function updateUseElements() {
        document.querySelectorAll("use").forEach(el => {
            if (el.getAttribute("href").includes("#icon-")) {
                el.setAttribute("href", el.getAttribute("href").replace(/.*#/, "#"));
            }
        });
    }
})()
`.trim();
/**
 * Plugin which is responsible for creating an icons.js file that embeds the icon SVGs
 * within the page on page load to reduce page sizes.
 */
export class IconsPlugin extends RendererComponent {
    iconHtml;
    constructor(owner) {
        super(owner);
        this.owner.on(RendererEvent.BEGIN, this.onBeginRender.bind(this));
    }
    onBeginRender(_event) {
        if (this.owner.theme instanceof DefaultTheme) {
            this.owner.postRenderAsyncJobs.push((event) => this.onRenderEnd(event));
        }
    }
    async onRenderEnd(event) {
        const children = [];
        const icons = this.owner.theme.icons;
        for (const [name, icon] of Object.entries(icons)) {
            children.push(JSX.createElement("g", { id: `icon-${name}`, class: "tsd-no-select" }, icon.call(icons).children));
        }
        const svg = JSX.renderElement(JSX.createElement("svg", { xmlns: "http://www.w3.org/2000/svg" }, children));
        const js = ICONS_JS.replace("SVG_HTML", JSX.renderElement(JSX.createElement(JSX.Fragment, null, children)).replaceAll("`", "\\`"));
        const svgPath = join(event.outputDirectory, "assets/icons.svg");
        const jsPath = join(event.outputDirectory, "assets/icons.js");
        await Promise.all([writeFile(svgPath, svg), writeFile(jsPath, js)]);
    }
}
