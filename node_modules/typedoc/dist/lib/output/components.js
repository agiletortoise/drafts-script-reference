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
import * as Path from "path";
import { AbstractComponent } from "../utils/component.js";
import { PageEvent, RendererEvent } from "./events.js";
import { Option } from "../utils/index.js";
export class RendererComponent extends AbstractComponent {
}
/**
 * A plugin for the renderer that reads the current render context.
 */
let ContextAwareRendererComponent = (() => {
    let _classSuper = RendererComponent;
    let _useHostedBaseUrlForAbsoluteLinks_decorators;
    let _useHostedBaseUrlForAbsoluteLinks_initializers = [];
    let _useHostedBaseUrlForAbsoluteLinks_extraInitializers = [];
    return class ContextAwareRendererComponent extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _useHostedBaseUrlForAbsoluteLinks_decorators = [Option("useHostedBaseUrlForAbsoluteLinks")];
            __esDecorate(this, null, _useHostedBaseUrlForAbsoluteLinks_decorators, { kind: "accessor", name: "useHostedBaseUrlForAbsoluteLinks", static: false, private: false, access: { has: obj => "useHostedBaseUrlForAbsoluteLinks" in obj, get: obj => obj.useHostedBaseUrlForAbsoluteLinks, set: (obj, value) => { obj.useHostedBaseUrlForAbsoluteLinks = value; } }, metadata: _metadata }, _useHostedBaseUrlForAbsoluteLinks_initializers, _useHostedBaseUrlForAbsoluteLinks_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        /**
         * The project that is currently processed.
         */
        project;
        /**
         * The reflection that is currently processed.
         */
        page;
        /**
         * The url of the document that is being currently generated.
         * Set when a page begins rendering.
         *
         * Defaulted to '.' so that tests don't have to set up events.
         */
        location = ".";
        /**
         * Regular expression to test if a string looks like an external url.
         */
        urlPrefix = /^(http|ftp)s?:\/\//;
        get hostedBaseUrl() {
            const url = this.application.options.getValue("hostedBaseUrl");
            return !url || url.endsWith("/") ? url : url + "/";
        }
        #useHostedBaseUrlForAbsoluteLinks_accessor_storage = __runInitializers(this, _useHostedBaseUrlForAbsoluteLinks_initializers, void 0);
        get useHostedBaseUrlForAbsoluteLinks() { return this.#useHostedBaseUrlForAbsoluteLinks_accessor_storage; }
        set useHostedBaseUrlForAbsoluteLinks(value) { this.#useHostedBaseUrlForAbsoluteLinks_accessor_storage = value; }
        constructor(owner) {
            super(owner);
            this.owner.on(RendererEvent.BEGIN, this.onBeginRenderer.bind(this));
            this.owner.on(PageEvent.BEGIN, this.onBeginPage.bind(this));
            this.owner.on(RendererEvent.END, () => this.absoluteToRelativePathMap.clear());
        }
        absoluteToRelativePathMap = (__runInitializers(this, _useHostedBaseUrlForAbsoluteLinks_extraInitializers), new Map());
        /**
         * Transform the given absolute path into a relative path.
         *
         * @param absolute  The absolute path to transform.
         * @returns A path relative to the document currently processed.
         */
        getRelativeUrl(absolute) {
            if (this.urlPrefix.test(absolute)) {
                return absolute;
            }
            else {
                const key = `${this.location}:${absolute}`;
                let path = this.absoluteToRelativePathMap.get(key);
                if (path)
                    return path;
                if (this.useHostedBaseUrlForAbsoluteLinks) {
                    path = new URL(absolute, this.hostedBaseUrl).toString();
                }
                else {
                    path = Path.posix.relative(this.location, absolute) || ".";
                }
                this.absoluteToRelativePathMap.set(key, path);
                return path;
            }
        }
        /**
         * Triggered before the renderer starts rendering a project.
         *
         * @param event  An event object describing the current render operation.
         */
        onBeginRenderer(event) {
            this.project = event.project;
        }
        /**
         * Triggered before a document will be rendered.
         *
         * @param page  An event object describing the current render operation.
         */
        onBeginPage(page) {
            this.location = Path.posix.dirname(page.url);
            this.page = page;
        }
    };
})();
export { ContextAwareRendererComponent };
