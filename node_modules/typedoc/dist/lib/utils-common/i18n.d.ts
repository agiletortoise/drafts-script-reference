import type { TranslationProxy } from "../internationalization/internationalization.js";
declare const TranslatedString: unique symbol;
export type TranslatedString = string & {
    [TranslatedString]: true;
};
/**
 * Set the available translations to be used by TypeDoc.
 */
export declare function setTranslations(t: Record<string, string>): void;
/**
 * Add the specified translations to the current translations object
 * Any keys already specified will overwrite current keys
 */
export declare function addTranslations(t: Record<string, string>): void;
export declare const i18n: TranslationProxy;
export declare function translateTagName(tag: `@${string}`): TranslatedString;
export {};
