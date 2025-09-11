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
import { CategoryPlugin } from "../converter/plugins/CategoryPlugin.js";
import { GroupPlugin } from "../converter/plugins/GroupPlugin.js";
import { ProjectReflection, Reflection, ReflectionKind } from "../models/index.js";
import { createNormalizedUrl } from "#node-utils";
import { Option } from "../utils/index.js";
import { Slugger } from "./themes/default/Slugger.js";
import { getHierarchyRoots } from "./themes/lib.js";
/**
 * The type of page which should be rendered. This may be extended in the future.
 *
 * Note: TypeDoc any string may be used as the page kind. TypeDoc defines a few
 * described by this object.
 * @enum
 */
export const PageKind = {
    Index: "index",
    Reflection: "reflection",
    Document: "document",
    Hierarchy: "hierarchy",
};
function getFullName(target) {
    if (target instanceof ProjectReflection) {
        return target.name;
    }
    const parts = [target.name];
    let current = target;
    while (!(current instanceof ProjectReflection)) {
        parts.unshift(current.name);
        current = current.parent;
    }
    return parts.join(".");
}
/**
 * Base router class intended to make it easier to implement a router.
 *
 * Child classes need only {@link getIdealBaseName}, this class will take care
 * of the recursing through child reflections.
 * @group Routers
 */
let BaseRouter = (() => {
    let _sluggerConfiguration_decorators;
    let _sluggerConfiguration_initializers = [];
    let _sluggerConfiguration_extraInitializers = [];
    let _includeHierarchySummary_decorators;
    let _includeHierarchySummary_initializers = [];
    let _includeHierarchySummary_extraInitializers = [];
    return class BaseRouter {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sluggerConfiguration_decorators = [Option("sluggerConfiguration")];
            _includeHierarchySummary_decorators = [Option("includeHierarchySummary")];
            __esDecorate(this, null, _sluggerConfiguration_decorators, { kind: "accessor", name: "sluggerConfiguration", static: false, private: false, access: { has: obj => "sluggerConfiguration" in obj, get: obj => obj.sluggerConfiguration, set: (obj, value) => { obj.sluggerConfiguration = value; } }, metadata: _metadata }, _sluggerConfiguration_initializers, _sluggerConfiguration_extraInitializers);
            __esDecorate(this, null, _includeHierarchySummary_decorators, { kind: "accessor", name: "includeHierarchySummary", static: false, private: false, access: { has: obj => "includeHierarchySummary" in obj, get: obj => obj.includeHierarchySummary, set: (obj, value) => { obj.includeHierarchySummary = value; } }, metadata: _metadata }, _includeHierarchySummary_initializers, _includeHierarchySummary_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        application;
        extension = ".html";
        // Note: This will always contain lowercased names to avoid issues with
        // case-insensitive file systems.
        usedFileNames = new Set();
        sluggers = new Map();
        fullUrls = new Map();
        anchors = new Map();
        #sluggerConfiguration_accessor_storage = __runInitializers(this, _sluggerConfiguration_initializers, void 0);
        get sluggerConfiguration() { return this.#sluggerConfiguration_accessor_storage; }
        set sluggerConfiguration(value) { this.#sluggerConfiguration_accessor_storage = value; }
        #includeHierarchySummary_accessor_storage = (__runInitializers(this, _sluggerConfiguration_extraInitializers), __runInitializers(this, _includeHierarchySummary_initializers, void 0));
        get includeHierarchySummary() { return this.#includeHierarchySummary_accessor_storage; }
        set includeHierarchySummary(value) { this.#includeHierarchySummary_accessor_storage = value; }
        constructor(application) {
            __runInitializers(this, _includeHierarchySummary_extraInitializers);
            this.application = application;
        }
        buildPages(project) {
            this.usedFileNames = new Set();
            this.sluggers = new Map([
                [project, new Slugger(this.sluggerConfiguration)],
            ]);
            const pages = [];
            if (project.readme?.length) {
                pages.push({
                    url: this.getFileName("index"),
                    kind: PageKind.Index,
                    model: project,
                });
                pages.push({
                    url: this.getFileName("modules"),
                    kind: PageKind.Reflection,
                    model: project,
                });
            }
            else {
                pages.push({
                    url: this.getFileName("index"),
                    kind: PageKind.Reflection,
                    model: project,
                });
            }
            this.fullUrls.set(project, pages[pages.length - 1].url);
            if (this.includeHierarchySummary && getHierarchyRoots(project)) {
                pages.push({
                    url: this.getFileName("hierarchy"),
                    kind: PageKind.Hierarchy,
                    model: project,
                });
            }
            for (const child of project.childrenIncludingDocuments || []) {
                this.buildChildPages(child, pages);
            }
            return pages;
        }
        hasUrl(target) {
            return this.fullUrls.has(target);
        }
        getLinkTargets() {
            return Array.from(this.fullUrls.keys());
        }
        getAnchor(target) {
            if (!this.anchors.has(target)) {
                this.application.logger.verbose(`${getFullName(target)} does not have an anchor but one was requested, this is a bug in the theme`);
            }
            return this.anchors.get(target);
        }
        hasOwnDocument(target) {
            return this.anchors.get(target) === undefined && this.hasUrl(target);
        }
        relativeUrl(from, to) {
            let slashes = 0;
            while (!this.hasOwnDocument(from)) {
                // We know we must have a parent here as the Project is the only
                // root level element without a parent, and the project always has
                // an own document.
                from = from.parent;
            }
            let toPage = to;
            while (!this.hasOwnDocument(toPage)) {
                toPage = toPage.parent;
            }
            // We unfortunately have to special case ProjectReflection as it is
            // the model used twice for rendering. This should be changed in a
            // future version to remove this hackery.
            if (from === toPage && !(to instanceof ProjectReflection)) {
                return to === toPage ? "" : `#${this.getAnchor(to)}`;
            }
            const fromUrl = this.getFullUrl(from);
            const toUrl = this.getFullUrl(to);
            let equal = true;
            let start = 0;
            for (let i = 0; i < fromUrl.length; ++i) {
                equal = equal && fromUrl[i] === toUrl[i];
                if (fromUrl[i] === "/") {
                    if (equal) {
                        start = i + 1;
                    }
                    else {
                        ++slashes;
                    }
                }
            }
            // If equal is still set, we're going to a page either in
            // the same directory as this page, or a lower directory,
            // don't bother going up directories just to come back down.
            if (equal) {
                return toUrl.substring(start);
            }
            // Otherwise, go up until we get to the common directory
            // and then back down to the target path.
            return "../".repeat(slashes) + toUrl.substring(start);
        }
        baseRelativeUrl(from, target) {
            let slashes = 0;
            const full = this.getFullUrl(from);
            for (let i = 0; i < full.length; ++i) {
                if (full[i] === "/")
                    ++slashes;
            }
            // #2910 avoid urls like ".././"
            if (target == "./" && slashes !== 0) {
                return "../".repeat(slashes);
            }
            return "../".repeat(slashes) + target;
        }
        getFullUrl(target) {
            const url = this.fullUrls.get(target);
            if (!url) {
                throw new Error(`Tried to get a URL of a router target ${getFullName(target)} which did not receive a URL`);
            }
            return url;
        }
        getSlugger(target) {
            if (this.sluggers.has(target)) {
                return this.sluggers.get(target);
            }
            // A slugger should always be defined at least for the project
            return this.getSlugger(target.parent);
        }
        /**
         * Should the page kind to use if a reflection should have its own rendered
         * page in the output. Note that once `undefined` is returned, children of
         * that reflection will not have their own document.
         */
        getPageKind(target) {
            if (!(target instanceof Reflection)) {
                return undefined;
            }
            const pageReflectionKinds = ReflectionKind.Class |
                ReflectionKind.Interface |
                ReflectionKind.Enum |
                ReflectionKind.Module |
                ReflectionKind.Namespace |
                ReflectionKind.TypeAlias |
                ReflectionKind.Function |
                ReflectionKind.Variable;
            const documentReflectionKinds = ReflectionKind.Document;
            if (target.kindOf(pageReflectionKinds)) {
                return PageKind.Reflection;
            }
            if (target.kindOf(documentReflectionKinds)) {
                return PageKind.Document;
            }
        }
        buildChildPages(target, outPages) {
            const kind = this.getPageKind(target);
            if (kind) {
                const idealName = this.getIdealBaseName(target);
                const actualName = this.getFileName(idealName);
                this.fullUrls.set(target, actualName);
                this.sluggers.set(target, new Slugger(this.sluggerConfiguration));
                outPages.push({
                    kind,
                    model: target,
                    url: actualName,
                });
                if (target instanceof Reflection) {
                    target.traverse((child) => {
                        this.buildChildPages(child, outPages);
                        return true;
                    });
                }
            }
            else {
                this.buildAnchors(target, target.parent);
            }
        }
        buildAnchors(target, pageTarget) {
            if (!(target instanceof Reflection) || !(pageTarget instanceof Reflection)) {
                return;
            }
            if (!target.isDeclaration() &&
                !target.isSignature() &&
                !target.isTypeParameter()) {
                return;
            }
            // We support linking to reflections for types directly contained within an export
            // but not any deeper. This is because TypeDoc may or may not render the type details
            // for a property depending on whether or not it is deemed useful, and defining a link
            // which might not be used may result in a link being generated which isn't valid. #2808.
            // This should be kept in sync with the renderingChildIsUseful function.
            if (target.kindOf(ReflectionKind.TypeLiteral) &&
                (!target.parent?.kindOf(ReflectionKind.SomeExport) ||
                    target.parent.type?.type !==
                        "reflection")) {
                return;
            }
            if (!target.kindOf(ReflectionKind.TypeLiteral)) {
                let refl = target;
                const parts = [refl.name];
                while (refl.parent && refl.parent !== pageTarget) {
                    refl = refl.parent;
                    // Avoid duplicate names for signatures and useless __type in anchors
                    if (!refl.kindOf(ReflectionKind.TypeLiteral |
                        ReflectionKind.FunctionOrMethod)) {
                        parts.unshift(refl.name);
                    }
                }
                const anchor = this.getSlugger(pageTarget).slug(parts.join("."));
                this.fullUrls.set(target, this.fullUrls.get(pageTarget) + "#" + anchor);
                this.anchors.set(target, anchor);
            }
            target.traverse((child) => {
                this.buildAnchors(child, pageTarget);
                return true;
            });
        }
        /** Strip non-url safe characters from the specified string. */
        getUrlSafeName(name) {
            return createNormalizedUrl(name);
        }
        getFileName(baseName) {
            const lowerBaseName = baseName.toLocaleLowerCase();
            if (this.usedFileNames.has(lowerBaseName)) {
                let index = 1;
                while (this.usedFileNames.has(`${lowerBaseName}-${index}`)) {
                    ++index;
                }
                this.usedFileNames.add(`${lowerBaseName}-${index}`);
                return `${baseName}-${index}${this.extension}`;
            }
            this.usedFileNames.add(lowerBaseName);
            return `${baseName}${this.extension}`;
        }
    };
})();
export { BaseRouter };
/**
 * Router which places reflections in folders according to their kind.
 * @group Routers
 */
export class KindRouter extends BaseRouter {
    directories = new Map([
        [ReflectionKind.Class, "classes"],
        [ReflectionKind.Interface, "interfaces"],
        [ReflectionKind.Enum, "enums"],
        [ReflectionKind.Namespace, "modules"],
        [ReflectionKind.Module, "modules"],
        [ReflectionKind.TypeAlias, "types"],
        [ReflectionKind.Function, "functions"],
        [ReflectionKind.Variable, "variables"],
        [ReflectionKind.Document, "documents"],
    ]);
    getIdealBaseName(reflection) {
        const dir = this.directories.get(reflection.kind);
        const parts = [createNormalizedUrl(reflection.name)];
        while (reflection.parent && !reflection.parent.isProject()) {
            reflection = reflection.parent;
            parts.unshift(createNormalizedUrl(reflection.name));
        }
        const baseName = parts.join(".");
        return `${dir}/${baseName}`;
    }
}
/**
 * Router which places reflections in folders according to their kind,
 * but creates each page as `/index.html` to allow for clean URLs.
 * @group Routers
 */
export class KindDirRouter extends KindRouter {
    fixLink(link) {
        return link.replace(/\/index\.html(#|$)/, "/$1");
    }
    buildChildPages(reflection, outPages) {
        this.extension = `/index.html`;
        return super.buildChildPages(reflection, outPages);
    }
    getFullUrl(refl) {
        return this.fixLink(super.getFullUrl(refl));
    }
    relativeUrl(from, to) {
        return this.fixLink(super.relativeUrl(from, to));
    }
}
/**
 * Router which places reflections in folders according to the module structure.
 * @group Routers
 */
export class StructureRouter extends BaseRouter {
    getIdealBaseName(reflection) {
        // Special case: Modules allow slashes in their name. We actually want
        // to allow that here to mirror file structures.
        const parts = [...reflection.name.split("/").map(createNormalizedUrl)];
        while (reflection.parent && !reflection.parent.isProject()) {
            reflection = reflection.parent;
            parts.unshift(...reflection.name.split("/").map(createNormalizedUrl));
        }
        // This should only happen if someone tries to break things with @module
        // I don't think it will ever occur in normal usage.
        if (parts.includes("..")) {
            throw new Error("structure router cannot be used with a project that has a name containing '..'");
        }
        return parts.join("/");
    }
}
/**
 * Router which places reflections in folders according to the module structure,
 * but creates each page as `/index.html` to allow for clean URLs.
 * @group Routers
 */
export class StructureDirRouter extends StructureRouter {
    fixLink(link) {
        return link.replace(/\/index\.html(#|$)/, "/$1");
    }
    buildChildPages(reflection, outPages) {
        this.extension = `/index.html`;
        return super.buildChildPages(reflection, outPages);
    }
    getFullUrl(refl) {
        return this.fixLink(super.getFullUrl(refl));
    }
    relativeUrl(from, to) {
        return this.fixLink(super.relativeUrl(from, to));
    }
}
/**
 * Router which places reflections in folders according to `@group` tags.
 * @group Routers
 */
let GroupRouter = (() => {
    let _classSuper = BaseRouter;
    let _groupReferencesByType_decorators;
    let _groupReferencesByType_initializers = [];
    let _groupReferencesByType_extraInitializers = [];
    return class GroupRouter extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _groupReferencesByType_decorators = [Option("groupReferencesByType")];
            __esDecorate(this, null, _groupReferencesByType_decorators, { kind: "accessor", name: "groupReferencesByType", static: false, private: false, access: { has: obj => "groupReferencesByType" in obj, get: obj => obj.groupReferencesByType, set: (obj, value) => { obj.groupReferencesByType = value; } }, metadata: _metadata }, _groupReferencesByType_initializers, _groupReferencesByType_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #groupReferencesByType_accessor_storage = __runInitializers(this, _groupReferencesByType_initializers, void 0);
        get groupReferencesByType() { return this.#groupReferencesByType_accessor_storage; }
        set groupReferencesByType(value) { this.#groupReferencesByType_accessor_storage = value; }
        getGroup(reflection) {
            if (reflection.isDeclaration() || reflection.isDocument()) {
                const group = GroupPlugin.getGroups(reflection, this.groupReferencesByType);
                return group.values().next().value;
            }
            throw new Error("Tried to render a non declaration/document to a page, not supported by GroupRouter");
        }
        getIdealBaseName(reflection) {
            const group = this.getGroup(reflection)
                .split("/")
                .map(createNormalizedUrl)
                .join("/");
            const parts = [createNormalizedUrl(reflection.name)];
            while (reflection.parent && !reflection.parent.isProject()) {
                reflection = reflection.parent;
                parts.unshift(createNormalizedUrl(reflection.name));
            }
            const baseName = parts.join(".");
            return `${group}/${baseName}`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _groupReferencesByType_extraInitializers);
        }
    };
})();
export { GroupRouter };
/**
 * Router which places reflections in folders according to `@category` tags.
 * @group Routers
 */
let CategoryRouter = (() => {
    let _classSuper = BaseRouter;
    let _defaultCategory_decorators;
    let _defaultCategory_initializers = [];
    let _defaultCategory_extraInitializers = [];
    return class CategoryRouter extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _defaultCategory_decorators = [Option("defaultCategory")];
            __esDecorate(this, null, _defaultCategory_decorators, { kind: "accessor", name: "defaultCategory", static: false, private: false, access: { has: obj => "defaultCategory" in obj, get: obj => obj.defaultCategory, set: (obj, value) => { obj.defaultCategory = value; } }, metadata: _metadata }, _defaultCategory_initializers, _defaultCategory_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #defaultCategory_accessor_storage = __runInitializers(this, _defaultCategory_initializers, void 0);
        get defaultCategory() { return this.#defaultCategory_accessor_storage; }
        set defaultCategory(value) { this.#defaultCategory_accessor_storage = value; }
        getCategory(reflection) {
            if (reflection.isDeclaration() || reflection.isDocument()) {
                const cats = CategoryPlugin.getCategories(reflection);
                return cats.size
                    ? cats.values().next().value
                    : this.defaultCategory;
            }
            throw new Error("Tried to render a non declaration/document to a page, not supported by GroupRouter");
        }
        getIdealBaseName(reflection) {
            const cat = this.getCategory(reflection)
                .split("/")
                .map(createNormalizedUrl)
                .join("/");
            const parts = [createNormalizedUrl(reflection.name)];
            while (reflection.parent && !reflection.parent.isProject()) {
                reflection = reflection.parent;
                parts.unshift(createNormalizedUrl(reflection.name));
            }
            const baseName = parts.join(".");
            return `${cat}/${baseName}`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _defaultCategory_extraInitializers);
        }
    };
})();
export { CategoryRouter };
