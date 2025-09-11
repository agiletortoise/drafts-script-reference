let translations = {};
/**
 * Set the available translations to be used by TypeDoc.
 */
export function setTranslations(t) {
    translations = { ...t };
}
/**
 * Add the specified translations to the current translations object
 * Any keys already specified will overwrite current keys
 */
export function addTranslations(t) {
    Object.assign(translations, t);
}
export const i18n = new Proxy({}, {
    get(_, key) {
        return (...args) => {
            const template = String(translations[key] || key);
            return template.replace(/\{(\d+)\}/g, (_, index) => {
                return args[+index] ?? "(no placeholder)";
            });
        };
    },
    has(_, key) {
        return Object.prototype.hasOwnProperty.call(translations, key);
    },
});
export function translateTagName(tag) {
    const tagName = tag.substring(1);
    if (Object.prototype.hasOwnProperty.call(translations, `tag_${tagName}`)) {
        return translations[`tag_${tagName}`];
    }
    // In English, the tag names are the translated names, once turned
    // into title case.
    return (tagName.substring(0, 1).toUpperCase() +
        tagName
            .substring(1)
            .replace(/[a-z][A-Z]/g, (x) => `${x[0]} ${x[1]}`));
}
