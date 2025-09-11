import { ok } from "assert";
import { addTranslations, DefaultMap, setTranslations } from "#utils";
import { readdirSync } from "fs";
import { join } from "path";
import {} from "./translatable.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const req = createRequire(fileURLToPath(import.meta.url));
/**
 * Load TypeDoc's translations for a specified language
 */
export function loadTranslations(lang) {
    // Make sure this isn't abused to load some random file by mistake
    ok(/^[A-Za-z-]+$/.test(lang), "Locale names may only contain letters and dashes");
    try {
        return req(`./locales/${lang}.cjs`);
    }
    catch {
        return loadTranslations("en");
    }
}
/**
 * Get languages which TypeDoc includes translations for
 */
export function getNativelySupportedLanguages() {
    return readdirSync(join(fileURLToPath(import.meta.url), "../locales"))
        .map((x) => x.substring(0, x.indexOf(".")));
}
/**
 * Responsible for maintaining loaded internationalized strings.
 */
export class Internationalization {
    locales = new DefaultMap(() => ({}));
    loadedLocale;
    constructor() {
        this.setLocale("en");
    }
    setLocale(locale) {
        if (this.loadedLocale !== locale) {
            const defaultTranslations = loadTranslations(locale);
            const overrides = this.locales.get(locale);
            setTranslations({ ...defaultTranslations, ...overrides });
            this.loadedLocale = locale;
        }
    }
    addTranslations(locale, translations) {
        Object.assign(this.locales.get(locale), translations);
        if (locale === this.loadedLocale) {
            addTranslations(translations);
        }
    }
    hasTranslations(locale) {
        return this.getSupportedLanguages().includes(locale);
    }
    getSupportedLanguages() {
        const supported = new Set(getNativelySupportedLanguages());
        for (const [locale, translations] of this.locales) {
            if (Object.entries(translations).length) {
                supported.add(locale);
            }
        }
        return Array.from(supported);
    }
}
