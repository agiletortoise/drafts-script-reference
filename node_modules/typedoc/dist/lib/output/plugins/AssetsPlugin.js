var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { RendererComponent } from "../components.js";
import { RendererEvent } from "../events.js";
import { copySync, isFile, readFile, writeFileSync } from "../../utils/fs.js";
import { DefaultTheme } from "../themes/default/DefaultTheme.js";
import { getStyles } from "../../utils/highlighter.js";
import { getEnumKeys, i18n } from "#utils";
import { existsSync } from "fs";
import { extname, join } from "path";
import { fileURLToPath } from "url";
import { ReflectionKind } from "../../models/index.js";
import { Option } from "../../utils/index.js";
/**
 * A plugin that copies the subdirectory ´assets´ from the current themes
 * source folder to the output directory.
 */
let AssetsPlugin = (() => {
    let _classSuper = RendererComponent;
    let _favicon_decorators;
    let _favicon_initializers = [];
    let _favicon_extraInitializers = [];
    let _customCss_decorators;
    let _customCss_initializers = [];
    let _customCss_extraInitializers = [];
    let _customJs_decorators;
    let _customJs_initializers = [];
    let _customJs_extraInitializers = [];
    return class AssetsPlugin extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _favicon_decorators = [Option("favicon")];
            _customCss_decorators = [Option("customCss")];
            _customJs_decorators = [Option("customJs")];
            __esDecorate(this, null, _favicon_decorators, { kind: "accessor", name: "favicon", static: false, private: false, access: { has: obj => "favicon" in obj, get: obj => obj.favicon, set: (obj, value) => { obj.favicon = value; } }, metadata: _metadata }, _favicon_initializers, _favicon_extraInitializers);
            __esDecorate(this, null, _customCss_decorators, { kind: "accessor", name: "customCss", static: false, private: false, access: { has: obj => "customCss" in obj, get: obj => obj.customCss, set: (obj, value) => { obj.customCss = value; } }, metadata: _metadata }, _customCss_initializers, _customCss_extraInitializers);
            __esDecorate(this, null, _customJs_decorators, { kind: "accessor", name: "customJs", static: false, private: false, access: { has: obj => "customJs" in obj, get: obj => obj.customJs, set: (obj, value) => { obj.customJs = value; } }, metadata: _metadata }, _customJs_initializers, _customJs_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #favicon_accessor_storage = __runInitializers(this, _favicon_initializers, void 0);
        get favicon() { return this.#favicon_accessor_storage; }
        set favicon(value) { this.#favicon_accessor_storage = value; }
        #customCss_accessor_storage = (__runInitializers(this, _favicon_extraInitializers), __runInitializers(this, _customCss_initializers, void 0));
        get customCss() { return this.#customCss_accessor_storage; }
        set customCss(value) { this.#customCss_accessor_storage = value; }
        #customJs_accessor_storage = (__runInitializers(this, _customCss_extraInitializers), __runInitializers(this, _customJs_initializers, void 0));
        get customJs() { return this.#customJs_accessor_storage; }
        set customJs(value) { this.#customJs_accessor_storage = value; }
        constructor(owner) {
            super(owner);
            __runInitializers(this, _customJs_extraInitializers);
            this.owner.on(RendererEvent.BEGIN, this.onRenderBegin.bind(this));
            this.owner.on(RendererEvent.END, this.onRenderEnd.bind(this));
        }
        getTranslatedStrings() {
            const translations = {
                copy: i18n.theme_copy(),
                copied: i18n.theme_copied(),
                normally_hidden: i18n.theme_normally_hidden(),
                hierarchy_expand: i18n.theme_hierarchy_expand(),
                hierarchy_collapse: i18n.theme_hierarchy_collapse(),
                folder: i18n.theme_folder(),
                search_index_not_available: i18n.theme_search_index_not_available(),
                search_no_results_found_for_0: i18n.theme_search_no_results_found_for_0("{0}"),
            };
            for (const key of getEnumKeys(ReflectionKind)) {
                const kind = ReflectionKind[key];
                translations[`kind_${kind}`] = ReflectionKind.singularString(kind);
            }
            return translations;
        }
        onRenderBegin(event) {
            const dest = join(event.outputDirectory, "assets");
            if (!/^https?:\/\//i.test(this.favicon) &&
                [".ico", ".png", ".svg"].includes(extname(this.favicon))) {
                copySync(this.favicon, join(dest, "favicon" + extname(this.favicon)));
            }
            if (this.customCss) {
                this.application.watchFile(this.customCss);
                if (existsSync(this.customCss)) {
                    copySync(this.customCss, join(dest, "custom.css"));
                }
                else {
                    this.application.logger.error(i18n.custom_css_file_0_does_not_exist(this.customCss));
                }
            }
            if (this.customJs) {
                this.application.watchFile(this.customJs);
                if (existsSync(this.customJs)) {
                    copySync(this.customJs, join(dest, "custom.js"));
                }
                else {
                    this.application.logger.error(i18n.custom_js_file_0_does_not_exist(this.customJs));
                }
            }
        }
        /**
         * Triggered before the renderer starts rendering a project.
         *
         * @param event  An event object describing the current render operation.
         */
        onRenderEnd(event) {
            if (this.owner.theme instanceof DefaultTheme) {
                const src = join(fileURLToPath(import.meta.url), "../../../../../static");
                const dest = join(event.outputDirectory, "assets");
                copySync(join(src, "style.css"), join(dest, "style.css"));
                const mainJs = readFile(join(src, "main.js"));
                writeFileSync(join(dest, "main.js"), [
                    '"use strict";',
                    `window.translations=${JSON.stringify(this.getTranslatedStrings())};`,
                    mainJs,
                ].join("\n"));
                writeFileSync(join(dest, "highlight.css"), getStyles());
                const media = join(event.outputDirectory, "media");
                const toCopy = event.project.files.getNameToAbsoluteMap();
                for (const [fileName, absolute] of toCopy.entries()) {
                    if (isFile(absolute)) {
                        copySync(absolute, join(media, fileName));
                    }
                    else {
                        this.application.logger.warn(i18n.relative_path_0_is_not_a_file_and_will_not_be_copied_to_output(absolute));
                    }
                }
            }
        }
    };
})();
export { AssetsPlugin };
