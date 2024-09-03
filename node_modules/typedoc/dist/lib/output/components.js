"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAwareRendererComponent = exports.RendererComponent = exports.Component = void 0;
const Path = __importStar(require("path"));
const component_1 = require("../utils/component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return component_1.Component; } });
const events_1 = require("./events");
const utils_1 = require("../utils");
class RendererComponent extends component_1.AbstractComponent {
}
exports.RendererComponent = RendererComponent;
/**
 * A plugin for the renderer that reads the current render context.
 */
let ContextAwareRendererComponent = (() => {
    var _a, _ContextAwareRendererComponent_useHostedBaseUrlForAbsoluteLinks_accessor_storage;
    let _classSuper = RendererComponent;
    let _useHostedBaseUrlForAbsoluteLinks_decorators;
    let _useHostedBaseUrlForAbsoluteLinks_initializers = [];
    let _useHostedBaseUrlForAbsoluteLinks_extraInitializers = [];
    return _a = class ContextAwareRendererComponent extends _classSuper {
            constructor() {
                super(...arguments);
                /**
                 * The url of the document that is being currently generated.
                 * Set when a page begins rendering.
                 *
                 * Defaulted to '.' so that tests don't have to set up events.
                 */
                this.location = ".";
                /**
                 * Regular expression to test if a string looks like an external url.
                 */
                this.urlPrefix = /^(http|ftp)s?:\/\//;
                _ContextAwareRendererComponent_useHostedBaseUrlForAbsoluteLinks_accessor_storage.set(this, __runInitializers(this, _useHostedBaseUrlForAbsoluteLinks_initializers, void 0));
                this.absoluteToRelativePathMap = (__runInitializers(this, _useHostedBaseUrlForAbsoluteLinks_extraInitializers), new Map());
            }
            get hostedBaseUrl() {
                const url = this.application.options.getValue("hostedBaseUrl");
                return !url || url.endsWith("/") ? url : url + "/";
            }
            get useHostedBaseUrlForAbsoluteLinks() { return __classPrivateFieldGet(this, _ContextAwareRendererComponent_useHostedBaseUrlForAbsoluteLinks_accessor_storage, "f"); }
            set useHostedBaseUrlForAbsoluteLinks(value) { __classPrivateFieldSet(this, _ContextAwareRendererComponent_useHostedBaseUrlForAbsoluteLinks_accessor_storage, value, "f"); }
            /**
             * Create a new ContextAwareRendererPlugin instance.
             *
             * @param renderer  The renderer this plugin should be attached to.
             */
            initialize() {
                this.owner.on(events_1.RendererEvent.BEGIN, this.onBeginRenderer.bind(this));
                this.owner.on(events_1.PageEvent.BEGIN, this.onBeginPage.bind(this));
                this.owner.on(events_1.RendererEvent.END, () => this.absoluteToRelativePathMap.clear());
            }
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
        },
        _ContextAwareRendererComponent_useHostedBaseUrlForAbsoluteLinks_accessor_storage = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _useHostedBaseUrlForAbsoluteLinks_decorators = [(0, utils_1.Option)("useHostedBaseUrlForAbsoluteLinks")];
            __esDecorate(_a, null, _useHostedBaseUrlForAbsoluteLinks_decorators, { kind: "accessor", name: "useHostedBaseUrlForAbsoluteLinks", static: false, private: false, access: { has: obj => "useHostedBaseUrlForAbsoluteLinks" in obj, get: obj => obj.useHostedBaseUrlForAbsoluteLinks, set: (obj, value) => { obj.useHostedBaseUrlForAbsoluteLinks = value; } }, metadata: _metadata }, _useHostedBaseUrlForAbsoluteLinks_initializers, _useHostedBaseUrlForAbsoluteLinks_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ContextAwareRendererComponent = ContextAwareRendererComponent;
