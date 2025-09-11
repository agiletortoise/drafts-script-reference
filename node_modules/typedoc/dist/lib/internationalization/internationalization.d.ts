import { type TranslatedString } from "#utils";
import { type BuiltinTranslatableStringArgs } from "./translatable.js";
/**
 * ### What is translatable?
 * TypeDoc includes a lot of literal strings. By convention, messages which are displayed
 * to the user at the INFO level or above should be present in this object to be available
 * for translation. Messages at the VERBOSE level need not be translated as they are primarily
 * intended for debugging. ERROR/WARNING deprecation messages related to TypeDoc's API, or
 * requesting users submit a bug report need not be translated.
 *
 * Errors thrown by TypeDoc are generally *not* considered translatable as they are not
 * displayed to the user. An exception to this is errors thrown by the `validate` method
 * on options, as option readers will use them to report errors to the user.
 *
 * ### Interface Keys
 * This object uses a similar convention as TypeScript, where the specified key should
 * indicate where placeholders are present by including a number in the name. This is
 * so that translations can easily tell that they are including the appropriate placeholders.
 * This will also be validated at runtime by the {@link Internationalization} class, but
 * it's better to have that hint when editing as well.
 *
 * This interface defines the available translatable strings, and the number of placeholders
 * that are required to use each string. Plugins may use declaration merging to add members
 * to this interface to use TypeDoc's internationalization module.
 *
 * @example
 * ```ts
 * declare module "typedoc" {
 *     interface TranslatableStrings {
 *         // Define a translatable string with no arguments
 *         plugin_msg: [];
 *         // Define a translatable string requiring one argument
 *         plugin_msg_0: [string];
 *     }
 * }
 * ```
 */
export interface TranslatableStrings extends BuiltinTranslatableStringArgs {
}
/**
 * Dynamic proxy type built from {@link TranslatableStrings}
 */
export type TranslationProxy = {
    [K in keyof TranslatableStrings]: (...args: TranslatableStrings[K]) => TranslatedString;
};
/**
 * Load TypeDoc's translations for a specified language
 */
export declare function loadTranslations(lang: string): Record<string, string>;
/**
 * Get languages which TypeDoc includes translations for
 */
export declare function getNativelySupportedLanguages(): string[];
/**
 * Responsible for maintaining loaded internationalized strings.
 */
export declare class Internationalization {
    private locales;
    private loadedLocale;
    constructor();
    setLocale(locale: string): void;
    addTranslations(locale: string, translations: Record<string, string>): void;
    hasTranslations(locale: string): boolean;
    getSupportedLanguages(): string[];
}
