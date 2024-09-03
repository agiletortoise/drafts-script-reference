"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkedPlugin = void 0;
const markdown_it_1 = __importDefault(require("markdown-it"));
const components_1 = require("../components");
const events_1 = require("../events");
const utils_1 = require("../../utils");
const highlighter_1 = require("../../utils/highlighter");
const html_1 = require("../../utils/html");
const DefaultTheme_1 = require("./default/DefaultTheme");
const anchor_icon_1 = require("./default/partials/anchor-icon");
const models_1 = require("../../models");
let defaultSlugger;
function getDefaultSlugger(logger) {
    if (!defaultSlugger) {
        logger.warn(logger.i18n.custom_theme_does_not_define_getSlugger());
        defaultSlugger = new DefaultTheme_1.Slugger();
    }
    return defaultSlugger;
}
/**
 * Implements markdown and relativeURL helpers for templates.
 * @internal
 */
let MarkedPlugin = (() => {
    var _MarkedPlugin_lightTheme_accessor_storage, _MarkedPlugin_darkTheme_accessor_storage, _MarkedPlugin_markdownItOptions_accessor_storage;
    let _classDecorators = [(0, components_1.Component)({ name: "marked" })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = components_1.ContextAwareRendererComponent;
    let _lightTheme_decorators;
    let _lightTheme_initializers = [];
    let _lightTheme_extraInitializers = [];
    let _darkTheme_decorators;
    let _darkTheme_initializers = [];
    let _darkTheme_extraInitializers = [];
    let _markdownItOptions_decorators;
    let _markdownItOptions_initializers = [];
    let _markdownItOptions_extraInitializers = [];
    var MarkedPlugin = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            _MarkedPlugin_lightTheme_accessor_storage.set(this, __runInitializers(this, _lightTheme_initializers, void 0));
            _MarkedPlugin_darkTheme_accessor_storage.set(this, (__runInitializers(this, _lightTheme_extraInitializers), __runInitializers(this, _darkTheme_initializers, void 0)));
            _MarkedPlugin_markdownItOptions_accessor_storage.set(this, (__runInitializers(this, _darkTheme_extraInitializers), __runInitializers(this, _markdownItOptions_initializers, void 0)));
            this.parser = __runInitializers(this, _markdownItOptions_extraInitializers);
            /**
             * This needing to be here really feels hacky... probably some nicer way to do this.
             * Revisit when adding support for arbitrary pages in 0.26.
             */
            this.renderContext = null;
            this.lastHeaderSlug = "";
        }
        get lightTheme() { return __classPrivateFieldGet(this, _MarkedPlugin_lightTheme_accessor_storage, "f"); }
        set lightTheme(value) { __classPrivateFieldSet(this, _MarkedPlugin_lightTheme_accessor_storage, value, "f"); }
        get darkTheme() { return __classPrivateFieldGet(this, _MarkedPlugin_darkTheme_accessor_storage, "f"); }
        set darkTheme(value) { __classPrivateFieldSet(this, _MarkedPlugin_darkTheme_accessor_storage, value, "f"); }
        get markdownItOptions() { return __classPrivateFieldGet(this, _MarkedPlugin_markdownItOptions_accessor_storage, "f"); }
        set markdownItOptions(value) { __classPrivateFieldSet(this, _MarkedPlugin_markdownItOptions_accessor_storage, value, "f"); }
        /**
         * Create a new MarkedPlugin instance.
         */
        initialize() {
            super.initialize();
            this.owner.on(events_1.MarkdownEvent.PARSE, this.onParseMarkdown.bind(this));
        }
        /**
         * Highlight the syntax of the given text using HighlightJS.
         *
         * @param text  The text that should be highlighted.
         * @param lang  The language that should be used to highlight the string.
         * @return A html string with syntax highlighting.
         */
        getHighlighted(text, lang) {
            lang = lang || "typescript";
            lang = lang.toLowerCase();
            if (!(0, highlighter_1.isSupportedLanguage)(lang)) {
                this.application.logger.warn(this.application.i18n.unsupported_highlight_language_0_not_highlighted_in_comment_for_1(lang, this.page?.model.getFriendlyFullName() ?? "(unknown)"));
                return text;
            }
            if (!(0, highlighter_1.isLoadedLanguage)(lang)) {
                this.application.logger.warn(this.application.i18n.unloaded_language_0_not_highlighted_in_comment_for_1(lang, this.page?.model.getFriendlyFullName() ?? "(unknown)"));
                return text;
            }
            return (0, highlighter_1.highlight)(text, lang);
        }
        /**
         * Parse the given markdown string and return the resulting html.
         *
         * @param input  The markdown string that should be parsed.
         * @returns The resulting html string.
         */
        parseMarkdown(input, page, context) {
            let markdown = input;
            if (typeof markdown !== "string") {
                markdown = this.displayPartsToMarkdown(page, context, markdown);
            }
            this.renderContext = context;
            const event = new events_1.MarkdownEvent(page, markdown, markdown);
            this.owner.trigger(events_1.MarkdownEvent.PARSE, event);
            this.renderContext = null;
            return event.parsedText;
        }
        displayPartsToMarkdown(page, context, parts) {
            const useHtml = !!this.markdownItOptions["html"];
            const result = [];
            for (const part of parts) {
                switch (part.kind) {
                    case "text":
                    case "code":
                        result.push(part.text);
                        break;
                    case "inline-tag":
                        switch (part.tag) {
                            case "@label":
                            case "@inheritdoc": // Shouldn't happen
                                break; // Not rendered.
                            case "@link":
                            case "@linkcode":
                            case "@linkplain": {
                                if (part.target) {
                                    let url;
                                    let kindClass;
                                    if (typeof part.target === "string") {
                                        url = part.target;
                                    }
                                    else if ("id" in part.target) {
                                        // No point in trying to resolve a ReflectionSymbolId at this point, we've already
                                        // tried and failed during the resolution step.
                                        url = context.urlTo(part.target);
                                        kindClass = models_1.ReflectionKind.classString(part.target.kind);
                                    }
                                    if (useHtml) {
                                        const text = part.tag === "@linkcode" ? `<code>${part.text}</code>` : part.text;
                                        result.push(url
                                            ? `<a href="${url}"${kindClass ? ` class="${kindClass}"` : ""}>${text}</a>`
                                            : part.text);
                                    }
                                    else {
                                        const text = part.tag === "@linkcode" ? "`" + part.text + "`" : part.text;
                                        result.push(url ? `[${text}](${url})` : text);
                                    }
                                }
                                else {
                                    result.push(part.text);
                                }
                                break;
                            }
                            default:
                                // Hmm... probably want to be able to render these somehow, so custom inline tags can be given
                                // special rendering rules. Future capability. For now, just render their text.
                                result.push(`{${part.tag} ${part.text}}`);
                                break;
                        }
                        break;
                    case "relative-link":
                        switch (typeof part.target) {
                            case "number": {
                                const refl = page.project.files.resolve(part.target);
                                if (typeof refl === "object") {
                                    result.push(context.urlTo(refl));
                                    break;
                                }
                                const fileName = page.project.files.getName(part.target);
                                if (fileName) {
                                    result.push(context.relativeURL(`media/${fileName}`));
                                    break;
                                }
                            }
                            // fall through
                            case "undefined":
                                result.push(part.text);
                                break;
                        }
                        break;
                    default:
                        (0, utils_1.assertNever)(part);
                }
            }
            return result.join("");
        }
        /**
         * Triggered before the renderer starts rendering a project.
         *
         * @param event  An event object describing the current render operation.
         */
        onBeginRenderer(event) {
            super.onBeginRenderer(event);
            this.setupParser();
        }
        getSlugger() {
            if ("getSlugger" in this.owner.theme) {
                return this.owner.theme.getSlugger(this.page.model);
            }
            return getDefaultSlugger(this.application.logger);
        }
        /**
         * Creates an object with options that are passed to the markdown parser.
         *
         * @returns The options object for the markdown parser.
         */
        setupParser() {
            this.parser = (0, markdown_it_1.default)({
                ...this.markdownItOptions,
                highlight: (code, lang) => {
                    code = this.getHighlighted(code, lang || "ts");
                    code = code.replace(/\n$/, "") + "\n";
                    if (!lang) {
                        return `<pre><code>${code}</code><button>${this.application.i18n.theme_copy()}</button></pre>\n`;
                    }
                    return `<pre><code class="${(0, html_1.escapeHtml)(lang)}">${code}</code><button type="button">${this.application.i18n.theme_copy()}</button></pre>\n`;
                },
            });
            const loader = this.application.options.getValue("markdownItLoader");
            loader(this.parser);
            // Add anchor links for headings in readme, and add them to the "On this page" section
            this.parser.renderer.rules["heading_open"] = (tokens, idx) => {
                const token = tokens[idx];
                const content = getTokenTextContent(tokens[idx + 1]);
                const level = token.markup.length;
                const slug = this.getSlugger().slug(content);
                this.lastHeaderSlug = slug;
                // Prefix the slug with an extra `md:` to prevent conflicts with TypeDoc's anchors.
                this.page.pageHeadings.push({
                    link: `#md:${slug}`,
                    text: content,
                    level,
                });
                return `<a id="md:${slug}" class="tsd-anchor"></a><${token.tag} class="tsd-anchor-link">`;
            };
            this.parser.renderer.rules["heading_close"] = (tokens, idx) => {
                return `${(0, utils_1.renderElement)((0, anchor_icon_1.anchorIcon)(this.renderContext, `md:${this.lastHeaderSlug}`))}</${tokens[idx].tag}>`;
            };
            // Rewrite anchor links inline in a readme file to links targeting the `md:` prefixed anchors
            // that TypeDoc creates.
            this.parser.renderer.rules["link_open"] = (tokens, idx, options, _env, self) => {
                const token = tokens[idx];
                const href = token.attrGet("href")?.replace(/^#(?:md:)?(.+)/, "#md:$1");
                if (href) {
                    token.attrSet("href", href);
                }
                return self.renderToken(tokens, idx, options);
            };
        }
        /**
         * Triggered when {@link MarkedPlugin} parses a markdown string.
         *
         * @param event
         */
        onParseMarkdown(event) {
            event.parsedText = this.parser.render(event.parsedText);
        }
    };
    _MarkedPlugin_lightTheme_accessor_storage = new WeakMap();
    _MarkedPlugin_darkTheme_accessor_storage = new WeakMap();
    _MarkedPlugin_markdownItOptions_accessor_storage = new WeakMap();
    __setFunctionName(_classThis, "MarkedPlugin");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _lightTheme_decorators = [(0, utils_1.Option)("lightHighlightTheme")];
        _darkTheme_decorators = [(0, utils_1.Option)("darkHighlightTheme")];
        _markdownItOptions_decorators = [(0, utils_1.Option)("markdownItOptions")];
        __esDecorate(_classThis, null, _lightTheme_decorators, { kind: "accessor", name: "lightTheme", static: false, private: false, access: { has: obj => "lightTheme" in obj, get: obj => obj.lightTheme, set: (obj, value) => { obj.lightTheme = value; } }, metadata: _metadata }, _lightTheme_initializers, _lightTheme_extraInitializers);
        __esDecorate(_classThis, null, _darkTheme_decorators, { kind: "accessor", name: "darkTheme", static: false, private: false, access: { has: obj => "darkTheme" in obj, get: obj => obj.darkTheme, set: (obj, value) => { obj.darkTheme = value; } }, metadata: _metadata }, _darkTheme_initializers, _darkTheme_extraInitializers);
        __esDecorate(_classThis, null, _markdownItOptions_decorators, { kind: "accessor", name: "markdownItOptions", static: false, private: false, access: { has: obj => "markdownItOptions" in obj, get: obj => obj.markdownItOptions, set: (obj, value) => { obj.markdownItOptions = value; } }, metadata: _metadata }, _markdownItOptions_initializers, _markdownItOptions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MarkedPlugin = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MarkedPlugin = _classThis;
})();
exports.MarkedPlugin = MarkedPlugin;
function getTokenTextContent(token) {
    if (token.children) {
        return token.children.map(getTokenTextContent).join("");
    }
    return token.content;
}
