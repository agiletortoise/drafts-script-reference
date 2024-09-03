"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Internationalization = void 0;
const assert_1 = require("assert");
const utils_1 = require("../utils");
const translatable_1 = require("./translatable");
const fs_1 = require("fs");
const path_1 = require("path");
const kind_1 = require("../models/reflections/kind");
const models_1 = require("../models");
// If we're running in ts-node, then we need the TS source rather than
// the compiled file.
const ext = process[Symbol.for("ts-node.register.instance")]
    ? "cts"
    : "cjs";
/**
 * Simple internationalization module which supports placeholders.
 * See {@link TranslatableStrings} for a description of how this module works and how
 * plugins should add translations.
 */
class Internationalization {
    /**
     * If constructed without an application, will use the default language.
     * Intended for use in unit tests only.
     * @internal
     */
    constructor(application) {
        this.application = application;
        this.allTranslations = new utils_1.DefaultMap((lang) => {
            // Make sure this isn't abused to load some random file by mistake
            (0, assert_1.ok)(/^[A-Za-z-]+$/.test(lang), "Locale names may only contain letters and dashes");
            try {
                return new Map(
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                Object.entries(require(`./locales/${lang}.${ext}`)));
            }
            catch {
                return new Map();
            }
        });
        /**
         * Proxy object which supports dynamically translating
         * all supported keys. This is generally used rather than the translate
         * method so that renaming a key on the `translatable` object that contains
         * all of the default translations will automatically update usage locations.
         */
        this.proxy = new Proxy(this, {
            get(internationalization, key) {
                return (...args) => internationalization.translate(key, ...args);
            },
        });
    }
    /**
     * Get the translation of the specified key, replacing placeholders
     * with the arguments specified.
     */
    translate(key, ...args) {
        return (this.allTranslations.get(this.application?.lang ?? "en").get(key) ??
            translatable_1.translatable[key]).replace(/\{(\d+)\}/g, (_, index) => {
            return args[+index] ?? "(no placeholder)";
        });
    }
    kindSingularString(kind) {
        switch (kind) {
            case kind_1.ReflectionKind.Project:
                return this.proxy.kind_project();
            case kind_1.ReflectionKind.Module:
                return this.proxy.kind_module();
            case kind_1.ReflectionKind.Namespace:
                return this.proxy.kind_namespace();
            case kind_1.ReflectionKind.Enum:
                return this.proxy.kind_enum();
            case kind_1.ReflectionKind.EnumMember:
                return this.proxy.kind_enum_member();
            case kind_1.ReflectionKind.Variable:
                return this.proxy.kind_variable();
            case kind_1.ReflectionKind.Function:
                return this.proxy.kind_function();
            case kind_1.ReflectionKind.Class:
                return this.proxy.kind_class();
            case kind_1.ReflectionKind.Interface:
                return this.proxy.kind_interface();
            case kind_1.ReflectionKind.Constructor:
                return this.proxy.kind_constructor();
            case kind_1.ReflectionKind.Property:
                return this.proxy.kind_property();
            case kind_1.ReflectionKind.Method:
                return this.proxy.kind_method();
            case kind_1.ReflectionKind.CallSignature:
                return this.proxy.kind_call_signature();
            case kind_1.ReflectionKind.IndexSignature:
                return this.proxy.kind_index_signature();
            case kind_1.ReflectionKind.ConstructorSignature:
                return this.proxy.kind_constructor_signature();
            case kind_1.ReflectionKind.Parameter:
                return this.proxy.kind_parameter();
            case kind_1.ReflectionKind.TypeLiteral:
                return this.proxy.kind_type_literal();
            case kind_1.ReflectionKind.TypeParameter:
                return this.proxy.kind_type_parameter();
            case kind_1.ReflectionKind.Accessor:
                return this.proxy.kind_accessor();
            case kind_1.ReflectionKind.GetSignature:
                return this.proxy.kind_get_signature();
            case kind_1.ReflectionKind.SetSignature:
                return this.proxy.kind_set_signature();
            case kind_1.ReflectionKind.TypeAlias:
                return this.proxy.kind_type_alias();
            case kind_1.ReflectionKind.Reference:
                return this.proxy.kind_reference();
            case kind_1.ReflectionKind.Document:
                return this.proxy.kind_document();
        }
    }
    kindPluralString(kind) {
        switch (kind) {
            case kind_1.ReflectionKind.Project:
                return this.proxy.kind_plural_project();
            case kind_1.ReflectionKind.Module:
                return this.proxy.kind_plural_module();
            case kind_1.ReflectionKind.Namespace:
                return this.proxy.kind_plural_namespace();
            case kind_1.ReflectionKind.Enum:
                return this.proxy.kind_plural_enum();
            case kind_1.ReflectionKind.EnumMember:
                return this.proxy.kind_plural_enum_member();
            case kind_1.ReflectionKind.Variable:
                return this.proxy.kind_plural_variable();
            case kind_1.ReflectionKind.Function:
                return this.proxy.kind_plural_function();
            case kind_1.ReflectionKind.Class:
                return this.proxy.kind_plural_class();
            case kind_1.ReflectionKind.Interface:
                return this.proxy.kind_plural_interface();
            case kind_1.ReflectionKind.Constructor:
                return this.proxy.kind_plural_constructor();
            case kind_1.ReflectionKind.Property:
                return this.proxy.kind_plural_property();
            case kind_1.ReflectionKind.Method:
                return this.proxy.kind_plural_method();
            case kind_1.ReflectionKind.CallSignature:
                return this.proxy.kind_plural_call_signature();
            case kind_1.ReflectionKind.IndexSignature:
                return this.proxy.kind_plural_index_signature();
            case kind_1.ReflectionKind.ConstructorSignature:
                return this.proxy.kind_plural_constructor_signature();
            case kind_1.ReflectionKind.Parameter:
                return this.proxy.kind_plural_parameter();
            case kind_1.ReflectionKind.TypeLiteral:
                return this.proxy.kind_plural_type_literal();
            case kind_1.ReflectionKind.TypeParameter:
                return this.proxy.kind_plural_type_parameter();
            case kind_1.ReflectionKind.Accessor:
                return this.proxy.kind_plural_accessor();
            case kind_1.ReflectionKind.GetSignature:
                return this.proxy.kind_plural_get_signature();
            case kind_1.ReflectionKind.SetSignature:
                return this.proxy.kind_plural_set_signature();
            case kind_1.ReflectionKind.TypeAlias:
                return this.proxy.kind_plural_type_alias();
            case kind_1.ReflectionKind.Reference:
                return this.proxy.kind_plural_reference();
            case kind_1.ReflectionKind.Document:
                return this.proxy.kind_plural_document();
        }
    }
    flagString(flag) {
        switch (flag) {
            case models_1.ReflectionFlag.None:
                throw new Error("Should be unreachable");
            case models_1.ReflectionFlag.Private:
                return this.proxy.flag_private();
            case models_1.ReflectionFlag.Protected:
                return this.proxy.flag_protected();
            case models_1.ReflectionFlag.Public:
                return this.proxy.flag_public();
            case models_1.ReflectionFlag.Static:
                return this.proxy.flag_static();
            case models_1.ReflectionFlag.External:
                return this.proxy.flag_external();
            case models_1.ReflectionFlag.Optional:
                return this.proxy.flag_optional();
            case models_1.ReflectionFlag.Rest:
                return this.proxy.flag_rest();
            case models_1.ReflectionFlag.Abstract:
                return this.proxy.flag_abstract();
            case models_1.ReflectionFlag.Const:
                return this.proxy.flag_const();
            case models_1.ReflectionFlag.Readonly:
                return this.proxy.flag_readonly();
            case models_1.ReflectionFlag.Inherited:
                return this.proxy.flag_inherited();
        }
    }
    translateTagName(tag) {
        const tagName = tag.substring(1);
        const translations = this.allTranslations.get(this.application?.lang ?? "en");
        if (translations.has(`tag_${tagName}`)) {
            return translations.get(`tag_${tagName}`);
        }
        // In English, the tag names are the translated names, once turned
        // into title case.
        return (tagName.substring(0, 1).toUpperCase() +
            tagName
                .substring(1)
                .replace(/[a-z][A-Z]/g, (x) => `${x[0]} ${x[1]}`));
    }
    /**
     * Add translations for a string which will be displayed to the user.
     */
    addTranslations(lang, translations, override = false) {
        const target = this.allTranslations.get(lang);
        for (const [key, val] of Object.entries(translations)) {
            if (!target.has(key) || override) {
                target.set(key, val);
            }
        }
    }
    /**
     * Checks if we have any translations in the specified language.
     */
    hasTranslations(lang) {
        return this.allTranslations.get(lang).size > 0;
    }
    /**
     * Gets a list of all languages with at least one translation.
     */
    getSupportedLanguages() {
        return (0, utils_1.unique)([
            ...(0, fs_1.readdirSync)((0, path_1.join)(__dirname, "locales")).map((x) => x.substring(0, x.indexOf("."))),
            ...this.allTranslations.keys(),
        ]).sort();
    }
}
exports.Internationalization = Internationalization;
