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
import lunr from "lunr";
import { Reflection } from "../../models/index.js";
import { RendererComponent } from "../components.js";
import { IndexEvent, RendererEvent } from "../events.js";
import { Option, writeFile } from "../../utils/index.js";
import { DefaultTheme } from "../themes/default/DefaultTheme.js";
import { GroupPlugin } from "../../converter/plugins/GroupPlugin.js";
import { CategoryPlugin } from "../../converter/plugins/CategoryPlugin.js";
import { compressJson } from "../../utils/compress.js";
import { i18n } from "#utils";
/**
 * A plugin that exports an index of the project to a javascript file.
 *
 * The resulting javascript file can be used to build a simple search function.
 */
let JavascriptIndexPlugin = (() => {
    let _classSuper = RendererComponent;
    let _searchComments_decorators;
    let _searchComments_initializers = [];
    let _searchComments_extraInitializers = [];
    let _searchDocuments_decorators;
    let _searchDocuments_initializers = [];
    let _searchDocuments_extraInitializers = [];
    let _searchGroupBoosts_decorators;
    let _searchGroupBoosts_initializers = [];
    let _searchGroupBoosts_extraInitializers = [];
    let _searchCategoryBoosts_decorators;
    let _searchCategoryBoosts_initializers = [];
    let _searchCategoryBoosts_extraInitializers = [];
    let _groupReferencesByType_decorators;
    let _groupReferencesByType_initializers = [];
    let _groupReferencesByType_extraInitializers = [];
    return class JavascriptIndexPlugin extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _searchComments_decorators = [Option("searchInComments")];
            _searchDocuments_decorators = [Option("searchInDocuments")];
            _searchGroupBoosts_decorators = [Option("searchGroupBoosts")];
            _searchCategoryBoosts_decorators = [Option("searchCategoryBoosts")];
            _groupReferencesByType_decorators = [Option("groupReferencesByType")];
            __esDecorate(this, null, _searchComments_decorators, { kind: "accessor", name: "searchComments", static: false, private: false, access: { has: obj => "searchComments" in obj, get: obj => obj.searchComments, set: (obj, value) => { obj.searchComments = value; } }, metadata: _metadata }, _searchComments_initializers, _searchComments_extraInitializers);
            __esDecorate(this, null, _searchDocuments_decorators, { kind: "accessor", name: "searchDocuments", static: false, private: false, access: { has: obj => "searchDocuments" in obj, get: obj => obj.searchDocuments, set: (obj, value) => { obj.searchDocuments = value; } }, metadata: _metadata }, _searchDocuments_initializers, _searchDocuments_extraInitializers);
            __esDecorate(this, null, _searchGroupBoosts_decorators, { kind: "accessor", name: "searchGroupBoosts", static: false, private: false, access: { has: obj => "searchGroupBoosts" in obj, get: obj => obj.searchGroupBoosts, set: (obj, value) => { obj.searchGroupBoosts = value; } }, metadata: _metadata }, _searchGroupBoosts_initializers, _searchGroupBoosts_extraInitializers);
            __esDecorate(this, null, _searchCategoryBoosts_decorators, { kind: "accessor", name: "searchCategoryBoosts", static: false, private: false, access: { has: obj => "searchCategoryBoosts" in obj, get: obj => obj.searchCategoryBoosts, set: (obj, value) => { obj.searchCategoryBoosts = value; } }, metadata: _metadata }, _searchCategoryBoosts_initializers, _searchCategoryBoosts_extraInitializers);
            __esDecorate(this, null, _groupReferencesByType_decorators, { kind: "accessor", name: "groupReferencesByType", static: false, private: false, access: { has: obj => "groupReferencesByType" in obj, get: obj => obj.groupReferencesByType, set: (obj, value) => { obj.groupReferencesByType = value; } }, metadata: _metadata }, _groupReferencesByType_initializers, _groupReferencesByType_extraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #searchComments_accessor_storage = __runInitializers(this, _searchComments_initializers, void 0);
        get searchComments() { return this.#searchComments_accessor_storage; }
        set searchComments(value) { this.#searchComments_accessor_storage = value; }
        #searchDocuments_accessor_storage = (__runInitializers(this, _searchComments_extraInitializers), __runInitializers(this, _searchDocuments_initializers, void 0));
        get searchDocuments() { return this.#searchDocuments_accessor_storage; }
        set searchDocuments(value) { this.#searchDocuments_accessor_storage = value; }
        #searchGroupBoosts_accessor_storage = (__runInitializers(this, _searchDocuments_extraInitializers), __runInitializers(this, _searchGroupBoosts_initializers, void 0));
        get searchGroupBoosts() { return this.#searchGroupBoosts_accessor_storage; }
        set searchGroupBoosts(value) { this.#searchGroupBoosts_accessor_storage = value; }
        #searchCategoryBoosts_accessor_storage = (__runInitializers(this, _searchGroupBoosts_extraInitializers), __runInitializers(this, _searchCategoryBoosts_initializers, void 0));
        get searchCategoryBoosts() { return this.#searchCategoryBoosts_accessor_storage; }
        set searchCategoryBoosts(value) { this.#searchCategoryBoosts_accessor_storage = value; }
        #groupReferencesByType_accessor_storage = (__runInitializers(this, _searchCategoryBoosts_extraInitializers), __runInitializers(this, _groupReferencesByType_initializers, void 0));
        get groupReferencesByType() { return this.#groupReferencesByType_accessor_storage; }
        set groupReferencesByType(value) { this.#groupReferencesByType_accessor_storage = value; }
        unusedGroupBoosts = (__runInitializers(this, _groupReferencesByType_extraInitializers), new Set());
        unusedCatBoosts = new Set();
        constructor(owner) {
            super(owner);
            this.owner.on(RendererEvent.BEGIN, this.onRendererBegin.bind(this));
        }
        onRendererBegin(_event) {
            this.unusedGroupBoosts = new Set(Object.keys(this.searchGroupBoosts));
            this.unusedCatBoosts = new Set(Object.keys(this.searchCategoryBoosts));
            if (!(this.owner.theme instanceof DefaultTheme)) {
                return;
            }
            this.owner.preRenderAsyncJobs.push((event) => this.buildSearchIndex(event));
        }
        async buildSearchIndex(event) {
            const theme = this.owner.theme;
            const rows = [];
            const initialSearchResults = this.owner
                .router.getLinkTargets()
                .filter((refl) => refl instanceof Reflection &&
                (refl.isDeclaration() || refl.isDocument()) &&
                refl.name &&
                !refl.flags.isExternal);
            const indexEvent = new IndexEvent(initialSearchResults);
            this.owner.trigger(IndexEvent.PREPARE_INDEX, indexEvent);
            const builder = new lunr.Builder();
            builder.pipeline.add(lunr.trimmer);
            builder.ref("id");
            for (const [key, boost] of Object.entries(indexEvent.searchFieldWeights)) {
                builder.field(key, { boost });
            }
            for (const reflection of indexEvent.searchResults) {
                const boost = this.getBoost(reflection);
                if (boost <= 0) {
                    continue;
                }
                let parent = reflection.parent;
                if (parent?.isProject()) {
                    parent = undefined;
                }
                const row = {
                    kind: reflection.kind,
                    name: reflection.name,
                    url: theme.router.getFullUrl(reflection),
                    classes: theme.getReflectionClasses(reflection),
                };
                const icon = theme.getReflectionIcon(reflection);
                if (icon !== reflection.kind) {
                    row.icon = icon;
                }
                if (parent) {
                    row.parent = parent.getFullName();
                }
                builder.add({
                    name: reflection.name,
                    comment: this.getCommentSearchText(reflection),
                    document: this.getDocumentSearchText(reflection),
                    ...indexEvent.searchFields[rows.length],
                    id: rows.length,
                }, { boost });
                rows.push(row);
            }
            const index = builder.build();
            const jsonFileName = Path.join(event.outputDirectory, "assets", "search.js");
            const data = {
                rows,
                index,
            };
            await writeFile(jsonFileName, `window.searchData = "${await compressJson(data)}";`);
            if (this.unusedGroupBoosts.size &&
                this.application.options.isSet("searchGroupBoosts")) {
                this.application.logger.warn(i18n.not_all_search_group_boosts_used_0(Array.from(this.unusedGroupBoosts).join("\n\t")));
            }
            if (this.unusedCatBoosts.size &&
                this.application.options.isSet("searchCategoryBoosts")) {
                this.application.logger.warn(i18n.not_all_search_category_boosts_used_0(Array.from(this.unusedCatBoosts).join("\n\t")));
            }
        }
        getBoost(refl) {
            let boost = 1;
            for (const group of GroupPlugin.getGroups(refl, this.groupReferencesByType)) {
                boost *= this.searchGroupBoosts[group] ?? 1;
                this.unusedGroupBoosts.delete(group);
            }
            for (const cat of CategoryPlugin.getCategories(refl)) {
                boost *= this.searchCategoryBoosts[cat] ?? 1;
                this.unusedCatBoosts.delete(cat);
            }
            return boost;
        }
        getCommentSearchText(reflection) {
            if (!this.searchComments)
                return;
            const comments = [];
            if (reflection.comment)
                comments.push(reflection.comment);
            if (reflection.isDeclaration()) {
                reflection.signatures?.forEach((s) => s.comment && comments.push(s.comment));
                if (reflection.getSignature?.comment) {
                    comments.push(reflection.getSignature.comment);
                }
                if (reflection.setSignature?.comment) {
                    comments.push(reflection.setSignature.comment);
                }
            }
            if (!comments.length) {
                return;
            }
            return comments
                .flatMap((c) => {
                return [...c.summary, ...c.blockTags.flatMap((t) => t.content)];
            })
                .map((part) => part.text)
                .join("\n");
        }
        getDocumentSearchText(reflection) {
            if (!this.searchDocuments)
                return;
            if (reflection.isDocument()) {
                return reflection.content.flatMap((c) => c.text).join("\n");
            }
        }
    };
})();
export { JavascriptIndexPlugin };
