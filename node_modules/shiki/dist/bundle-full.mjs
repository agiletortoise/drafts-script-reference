import { bundledLanguages } from './langs.mjs';
export { bundledLanguagesAlias, bundledLanguagesBase, bundledLanguagesInfo } from './langs.mjs';
import { g as getWasmInlined } from './chunks/wasm-dynamic.mjs';
import { bundledThemes } from './themes.mjs';
export { bundledThemesInfo } from './themes.mjs';
import { createdBundledHighlighter, createWasmOnigEngine, createSingletonShorthands } from '@shikijs/core';
export * from '@shikijs/core';
export { createCssVariablesTheme } from './theme-css-variables.mjs';

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createWasmOnigEngine(getWasmInlined)
});
const {
  codeToHtml,
  codeToHast,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState
} = /* @__PURE__ */ createSingletonShorthands(
  createHighlighter
);
const getHighlighter = (options) => {
  return createHighlighter(options);
};

export { bundledLanguages, bundledThemes, codeToHast, codeToHtml, codeToTokens, codeToTokensBase, codeToTokensWithThemes, createHighlighter, getHighlighter, getLastGrammarState, getSingletonHighlighter, getWasmInlined };
