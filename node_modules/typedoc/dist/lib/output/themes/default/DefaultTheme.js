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
import { Theme } from "../../theme.js";
import { ReferenceReflection, ReflectionCategory, ReflectionGroup, ReflectionKind, } from "../../../models/index.js";
import { DefaultThemeRenderContext } from "./DefaultThemeRenderContext.js";
import { getIcons } from "./partials/icon.js";
import { filterMap, JSX } from "#utils";
import { classNames, getDisplayName, toStyleClass } from "../lib.js";
import { PageKind } from "../../router.js";
import { loadHighlighter, Option } from "#node-utils";
let DefaultTheme = (() => {
    let _classSuper = Theme;
    let _lightTheme_decorators;
    let _lightTheme_initializers = [];
    let _lightTheme_extraInitializers = [];
    let _darkTheme_decorators;
    let _darkTheme_initializers = [];
    let _darkTheme_extraInitializers = [];
    let _highlightLanguages_decorators;
    let _highlightLanguages_initializers = [];
    let _highlightLanguages_extraInitializers = [];
    let _ignoredHighlightLanguages_decorators;
    let _ignoredHighlightLanguages_initializers = [];
    let _ignoredHighlightLanguages_extraInitializers = [];
    return class DefaultTheme extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _lightTheme_decorators = [Option("lightHighlightTheme")];
            _darkTheme_decorators = [Option("darkHighlightTheme")];
            _highlightLanguages_decorators = [Option("highlightLanguages")];
            _ignoredHighlightLanguages_decorators = [Option("ignoredHighlightLanguages")];
            __esDecorate(this, null, _lightTheme_decorators, { kind: "accessor", name: "lightTheme", static: false, private: false, access: { has: obj => "lightTheme" in obj, get: obj => obj.lightTheme, set: (obj, value) => { obj.lightTheme = value; } }, metadata: _metadata }, _lightTheme_initializers, _lightTheme_extraInitializers);
            __esDecorate(this, null, _darkTheme_decorators, { kind: "accessor", name: "darkTheme", static: false, private: false, access: { has: obj => "darkTheme" in obj, get: obj => obj.darkTheme, set: (obj, value) => { obj.darkTheme = value; } }, metadata: _metadata }, _darkTheme_initializers, _darkTheme_extraInitializers);
            __esDecorate(this, null, _highlightLanguages_decorators, { kind: "accessor", name: "highlightLanguages", static: false, private: false, access: { has: obj => "highlightLanguages" in obj, get: obj => obj.highlightLanguages, set: (obj, value) => { obj.highlightLanguages = value; } }, metadata: _metadata }, _highlightLanguages_initializers, _highlightLanguages_extraInitializers);
            __esDecorate(this, null, _ignoredHighlightLanguages_decorators, { kind: "accessor", name: "ignoredHighlightLanguages", static: false, private: false, access: { has: obj => "ignoredHighlightLanguages" in obj, get: obj => obj.ignoredHighlightLanguages, set: (obj, value) => { obj.ignoredHighlightLanguages = value; } }, metadata: _metadata }, _ignoredHighlightLanguages_initializers, _ignoredHighlightLanguages_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        // Note: This will always contain lowercased names to avoid issues with
        // case-insensitive file systems.
        usedFileNames = new Set();
        /** @internal */
        markedPlugin;
        router;
        /**
         * The icons which will actually be rendered. The source of truth lives on the theme, and
         * the {@link DefaultThemeRenderContext.icons} member will produce references to these.
         *
         * These icons will be written twice. Once to an `icons.svg` file in the assets directory
         * which will be referenced by icons on the context, and once to an `icons.js` file so that
         * references to the icons can be dynamically embedded within the page for use by the search
         * dropdown and when loading the page on `file://` urls.
         *
         * Custom themes may overwrite this entire object or individual properties on it to customize
         * the icons used within the page, however TypeDoc currently assumes that all icons are svg
         * elements, so custom themes must also use svg elements.
         */
        icons;
        ContextClass = DefaultThemeRenderContext;
        #lightTheme_accessor_storage = __runInitializers(this, _lightTheme_initializers, void 0);
        get lightTheme() { return this.#lightTheme_accessor_storage; }
        set lightTheme(value) { this.#lightTheme_accessor_storage = value; }
        #darkTheme_accessor_storage = (__runInitializers(this, _lightTheme_extraInitializers), __runInitializers(this, _darkTheme_initializers, void 0));
        get darkTheme() { return this.#darkTheme_accessor_storage; }
        set darkTheme(value) { this.#darkTheme_accessor_storage = value; }
        #highlightLanguages_accessor_storage = (__runInitializers(this, _darkTheme_extraInitializers), __runInitializers(this, _highlightLanguages_initializers, void 0));
        get highlightLanguages() { return this.#highlightLanguages_accessor_storage; }
        set highlightLanguages(value) { this.#highlightLanguages_accessor_storage = value; }
        #ignoredHighlightLanguages_accessor_storage = (__runInitializers(this, _highlightLanguages_extraInitializers), __runInitializers(this, _ignoredHighlightLanguages_initializers, void 0));
        get ignoredHighlightLanguages() { return this.#ignoredHighlightLanguages_accessor_storage; }
        set ignoredHighlightLanguages(value) { this.#ignoredHighlightLanguages_accessor_storage = value; }
        getRenderContext(pageEvent) {
            return new this.ContextClass(this.router, this, pageEvent, this.application.options);
        }
        documentTemplate = (__runInitializers(this, _ignoredHighlightLanguages_extraInitializers), (pageEvent) => {
            return this.getRenderContext(pageEvent).documentTemplate(pageEvent);
        });
        reflectionTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).reflectionTemplate(pageEvent);
        };
        indexTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).indexTemplate(pageEvent);
        };
        hierarchyTemplate = (pageEvent) => {
            return this.getRenderContext(pageEvent).hierarchyTemplate(pageEvent);
        };
        defaultLayoutTemplate = (pageEvent, template) => {
            return this.getRenderContext(pageEvent).defaultLayout(template, pageEvent);
        };
        getReflectionClasses(reflection) {
            const filters = this.application.options.getValue("visibilityFilters");
            return getReflectionClasses(reflection, filters);
        }
        /**
         * This is used so that themes may define multiple icons for modified icons (e.g. method, and inherited method)
         */
        getReflectionIcon(reflection) {
            return reflection.kind;
        }
        /**
         * Create a new DefaultTheme instance.
         *
         * @param renderer  The renderer this theme is attached to.
         */
        constructor(renderer) {
            super(renderer);
            this.icons = getIcons();
            this.markedPlugin = renderer.markedPlugin;
            this.router = renderer.router;
        }
        render(page) {
            const templateMapping = {
                [PageKind.Index]: this.indexTemplate,
                [PageKind.Document]: this.documentTemplate,
                [PageKind.Hierarchy]: this.hierarchyTemplate,
                [PageKind.Reflection]: this.reflectionTemplate,
            };
            const template = templateMapping[page.pageKind];
            if (!template) {
                throw new Error(`TypeDoc's DefaultTheme does not support the page kind ${page.pageKind}`);
            }
            if (!page.isReflectionEvent()) {
                throw new Error(`TypeDoc's DefaultTheme requires that a page model be a reflection when rendering ${page.pageKind}`);
            }
            const templateOutput = this.defaultLayoutTemplate(page, template);
            return "<!DOCTYPE html>" + JSX.renderElement(templateOutput) + "\n";
        }
        async preRender(_event) {
            await loadHighlighter(this.lightTheme, this.darkTheme, 
            // Checked in option validation
            this.highlightLanguages, this.ignoredHighlightLanguages);
        }
        _navigationCache;
        /**
         * If implementing a custom theme, it is recommended to override {@link buildNavigation} instead.
         */
        getNavigation(project) {
            // This is ok because currently TypeDoc wipes out the theme after each render.
            // Might need to change in the future, but it's fine for now.
            if (this._navigationCache) {
                return this._navigationCache;
            }
            return (this._navigationCache = this.buildNavigation(project));
        }
        buildNavigation(project) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const theme = this;
            const router = this.router;
            const opts = this.application.options.getValue("navigation");
            const leaves = this.application.options.getValue("navigationLeaves");
            return getNavigationElements(project) || [];
            function toNavigation(element) {
                if (opts.excludeReferences && element instanceof ReferenceReflection) {
                    return;
                }
                const children = getNavigationElements(element);
                if (element instanceof ReflectionCategory || element instanceof ReflectionGroup) {
                    if (!children?.length) {
                        return;
                    }
                    return {
                        text: element.title,
                        children,
                    };
                }
                const icon = theme.getReflectionIcon(element) === element.kind
                    ? undefined
                    : theme.getReflectionIcon(element);
                return {
                    text: getDisplayName(element),
                    path: router.getFullUrl(element),
                    kind: element.kind & ReflectionKind.Project ? undefined : element.kind,
                    class: classNames({ deprecated: element.isDeprecated() }, theme.getReflectionClasses(element)),
                    children: children?.length ? children : undefined,
                    icon,
                };
            }
            function getNavigationElements(parent) {
                if (parent instanceof ReflectionCategory) {
                    return filterMap(parent.children, toNavigation);
                }
                if (parent instanceof ReflectionGroup) {
                    if (shouldShowCategories(parent.owningReflection, opts) && parent.categories) {
                        return filterMap(parent.categories, toNavigation);
                    }
                    return filterMap(parent.children, toNavigation);
                }
                if (leaves.includes(parent.getFullName())) {
                    return;
                }
                if (!parent.kindOf(ReflectionKind.MayContainDocuments)) {
                    return;
                }
                if (parent.isDocument()) {
                    return filterMap(parent.children, toNavigation);
                }
                if (!parent.kindOf(ReflectionKind.SomeModule | ReflectionKind.Project)) {
                    // Tricky: Non-module children don't show up in the navigation pane,
                    //   but any documents added by them should.
                    return filterMap(parent.documents, toNavigation);
                }
                if (parent.categories && shouldShowCategories(parent, opts)) {
                    return filterMapWithNoneCollection(parent.categories);
                }
                if (parent.groups && shouldShowGroups(parent, opts)) {
                    return filterMapWithNoneCollection(parent.groups);
                }
                if (opts.includeFolders && parent.childrenIncludingDocuments?.some((child) => child.name.includes("/"))) {
                    return deriveModuleFolders(parent.childrenIncludingDocuments);
                }
                return filterMap(parent.childrenIncludingDocuments, toNavigation);
            }
            function filterMapWithNoneCollection(reflection) {
                const none = reflection.find((x) => x.title.toLocaleLowerCase() === "none");
                const others = reflection.filter((x) => x.title.toLocaleLowerCase() !== "none");
                const mappedOthers = filterMap(others, toNavigation);
                if (none) {
                    const noneMappedChildren = filterMap(none.children, toNavigation);
                    return [...noneMappedChildren, ...mappedOthers];
                }
                return mappedOthers;
            }
            function deriveModuleFolders(children) {
                const result = [];
                const resolveOrCreateParents = (path, root = result) => {
                    if (path.length > 1) {
                        const inner = root.find((el) => el.text === path[0]);
                        if (inner) {
                            inner.children ||= [];
                            return resolveOrCreateParents(path.slice(1), inner.children);
                        }
                        else {
                            root.push({
                                text: path[0],
                                children: [],
                            });
                            return resolveOrCreateParents(path.slice(1), root[root.length - 1].children);
                        }
                    }
                    return root;
                };
                // Note: This might end up putting a module within another module if we document
                // both foo/index.ts and foo/bar.ts.
                for (const child of children.filter((c) => router.hasOwnDocument(c))) {
                    const nav = toNavigation(child);
                    if (nav) {
                        const parts = child.name.split("/");
                        const collection = resolveOrCreateParents(parts);
                        nav.text = parts[parts.length - 1];
                        collection.push(nav);
                    }
                }
                // Now merge single-possible-paths together so we don't have folders in our navigation
                // which contain only another single folder.
                if (opts.compactFolders) {
                    const queue = [...result];
                    while (queue.length) {
                        const review = queue.shift();
                        queue.push(...(review.children || []));
                        if (review.kind || review.path)
                            continue;
                        if (review.children?.length === 1) {
                            const copyFrom = review.children[0];
                            const fullName = `${review.text}/${copyFrom.text}`;
                            delete review.children;
                            Object.assign(review, copyFrom);
                            review.text = fullName;
                            queue.push(review);
                        }
                    }
                }
                return result;
            }
        }
    };
})();
export { DefaultTheme };
function getReflectionClasses(reflection, filters) {
    const classes = new Set();
    // Filter classes should match up with the settings function in
    // partials/navigation.tsx.
    for (const key of Object.keys(filters)) {
        if (key === "inherited") {
            if (reflection.flags.isInherited) {
                classes.add("tsd-is-inherited");
            }
        }
        else if (key === "protected") {
            if (reflection.flags.isProtected) {
                classes.add("tsd-is-protected");
            }
        }
        else if (key === "private") {
            if (reflection.flags.isPrivate) {
                classes.add("tsd-is-private");
            }
        }
        else if (key === "external") {
            if (reflection.flags.isExternal) {
                classes.add("tsd-is-external");
            }
        }
        else if (key.startsWith("@")) {
            if (key === "@deprecated") {
                if (reflection.isDeprecated()) {
                    classes.add(toStyleClass(`tsd-is-${key.substring(1)}`));
                }
            }
            else if (reflection.comment?.hasModifier(key) ||
                reflection.comment?.getTag(key)) {
                classes.add(toStyleClass(`tsd-is-${key.substring(1)}`));
            }
            else if (reflection.isDeclaration()) {
                const ownSignatures = reflection.getNonIndexSignatures();
                // Check methods and accessors, find common tags, elevate
                if (ownSignatures.length &&
                    ownSignatures.every((refl) => refl.comment?.hasModifier(key) || refl.comment?.getTag(key))) {
                    classes.add(toStyleClass(`tsd-is-${key.substring(1)}`));
                }
            }
        }
    }
    return Array.from(classes).join(" ");
}
function shouldShowCategories(reflection, opts) {
    if (opts.includeCategories) {
        return !reflection.comment?.hasModifier("@hideCategories");
    }
    return reflection.comment?.hasModifier("@showCategories") === true;
}
function shouldShowGroups(reflection, opts) {
    if (opts.includeGroups) {
        return !reflection.comment?.hasModifier("@hideGroups");
    }
    return reflection.comment?.hasModifier("@showGroups") === true;
}
