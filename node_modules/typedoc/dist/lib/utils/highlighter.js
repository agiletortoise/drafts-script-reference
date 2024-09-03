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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadShikiMetadata = loadShikiMetadata;
exports.loadHighlighter = loadHighlighter;
exports.isSupportedLanguage = isSupportedLanguage;
exports.getSupportedLanguages = getSupportedLanguages;
exports.getSupportedLanguagesWithoutAliases = getSupportedLanguagesWithoutAliases;
exports.getSupportedThemes = getSupportedThemes;
exports.isLoadedLanguage = isLoadedLanguage;
exports.highlight = highlight;
exports.getStyles = getStyles;
const assert_1 = require("assert");
const JSX = __importStar(require("./jsx"));
const array_1 = require("./array");
const aliases = new Map();
let supportedLanguagesWithoutAliases = [];
let supportedLanguages = [];
let supportedThemes = [];
async function loadShikiMetadata() {
    if (aliases.size)
        return;
    const shiki = await import("shiki");
    for (const lang of shiki.bundledLanguagesInfo) {
        for (const alias of lang.aliases || []) {
            aliases.set(alias, lang.id);
        }
    }
    supportedLanguages = (0, array_1.unique)([
        "text",
        ...aliases.keys(),
        ...shiki.bundledLanguagesInfo.map((lang) => lang.id),
    ]).sort();
    supportedLanguagesWithoutAliases = (0, array_1.unique)(["text", ...shiki.bundledLanguagesInfo.map((lang) => lang.id)]);
    supportedThemes = Object.keys(shiki.bundledThemes);
}
class DoubleHighlighter {
    constructor(highlighter, light, dark) {
        this.highlighter = highlighter;
        this.light = light;
        this.dark = dark;
        this.schemes = new Map();
    }
    supports(lang) {
        return this.highlighter.getLoadedLanguages().includes(lang);
    }
    highlight(code, lang) {
        const tokens = this.highlighter.codeToTokensWithThemes(code, {
            themes: { light: this.light, dark: this.dark },
            lang: lang,
        });
        const docEls = [];
        for (const line of tokens) {
            for (const token of line) {
                docEls.push(JSX.createElement("span", { class: this.getClass(token.variants) }, token.content));
            }
            docEls.push(JSX.createElement("br", null));
        }
        docEls.pop(); // Remove last <br>
        docEls.pop(); // Remove last <br>
        return JSX.renderElement(JSX.createElement(JSX.Fragment, null, docEls));
    }
    getStyles() {
        const style = [":root {"];
        const lightRules = [];
        const darkRules = [];
        let i = 0;
        for (const key of this.schemes.keys()) {
            const [light, dark] = key.split(" | ");
            style.push(`    --light-hl-${i}: ${light};`);
            style.push(`    --dark-hl-${i}: ${dark};`);
            lightRules.push(`    --hl-${i}: var(--light-hl-${i});`);
            darkRules.push(`    --hl-${i}: var(--dark-hl-${i});`);
            i++;
        }
        style.push(`    --light-code-background: ${this.highlighter.getTheme(this.light).bg};`);
        style.push(`    --dark-code-background: ${this.highlighter.getTheme(this.dark).bg};`);
        lightRules.push(`    --code-background: var(--light-code-background);`);
        darkRules.push(`    --code-background: var(--dark-code-background);`);
        style.push("}", "");
        style.push("@media (prefers-color-scheme: light) { :root {");
        style.push(...lightRules);
        style.push("} }", "");
        style.push("@media (prefers-color-scheme: dark) { :root {");
        style.push(...darkRules);
        style.push("} }", "");
        style.push(":root[data-theme='light'] {");
        style.push(...lightRules);
        style.push("}", "");
        style.push(":root[data-theme='dark'] {");
        style.push(...darkRules);
        style.push("}", "");
        for (i = 0; i < this.schemes.size; i++) {
            style.push(`.hl-${i} { color: var(--hl-${i}); }`);
        }
        style.push("pre, code { background: var(--code-background); }", "");
        return style.join("\n");
    }
    getClass(variants) {
        const key = `${variants["light"].color} | ${variants["dark"].color}`;
        let scheme = this.schemes.get(key);
        if (scheme == null) {
            scheme = `hl-${this.schemes.size}`;
            this.schemes.set(key, scheme);
        }
        return scheme;
    }
}
let highlighter;
async function loadHighlighter(lightTheme, darkTheme, langs) {
    if (highlighter)
        return;
    const shiki = await import("shiki");
    const hl = await shiki.createHighlighter({ themes: [lightTheme, darkTheme], langs });
    highlighter = new DoubleHighlighter(hl, lightTheme, darkTheme);
}
function isSupportedLanguage(lang) {
    return getSupportedLanguages().includes(lang);
}
function getSupportedLanguages() {
    (0, assert_1.ok)(supportedLanguages.length > 0, "loadShikiMetadata has not been called");
    return supportedLanguages;
}
function getSupportedLanguagesWithoutAliases() {
    (0, assert_1.ok)(supportedLanguagesWithoutAliases.length > 0, "loadShikiMetadata has not been called");
    return supportedLanguages;
}
function getSupportedThemes() {
    (0, assert_1.ok)(supportedThemes.length > 0, "loadShikiMetadata has not been called");
    return supportedThemes;
}
function isLoadedLanguage(lang) {
    return lang === "text" || (highlighter?.supports(lang) ?? false);
}
function highlight(code, lang) {
    (0, assert_1.ok)(highlighter, "Tried to highlight with an uninitialized highlighter");
    if (lang === "text") {
        return JSX.renderElement(JSX.createElement(JSX.Fragment, null, code));
    }
    return highlighter.highlight(code, aliases.get(lang) ?? lang);
}
function getStyles() {
    (0, assert_1.ok)(highlighter, "Tried to highlight with an uninitialized highlighter");
    return highlighter.getStyles();
}
