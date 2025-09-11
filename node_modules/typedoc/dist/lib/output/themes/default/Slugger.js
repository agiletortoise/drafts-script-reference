import { getSimilarValues } from "#utils";
/**
 * Responsible for getting a unique anchor for elements within a page.
 */
export class Slugger {
    options;
    seen = new Map();
    serialize(value) {
        // Notes:
        // There are quite a few trade-offs here.
        return (value
            .trim()
            // remove html tags
            .replace(/<[!/a-z].*?>/gi, "")
            // remove unwanted chars
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
            .replace(/\s/g, "-"));
    }
    constructor(options) {
        this.options = options;
    }
    slug(value) {
        const originalSlug = this.serialize(value);
        const lowerOriginalSlug = originalSlug.toLocaleLowerCase();
        let count = 0;
        let slug = lowerOriginalSlug;
        if (this.seen.has(lowerOriginalSlug)) {
            count = this.seen.get(lowerOriginalSlug);
            do {
                count++;
                slug = `${lowerOriginalSlug}-${count}`;
            } while (this.seen.has(slug));
        }
        this.seen.set(lowerOriginalSlug, count);
        if (!this.options.lowercase) {
            return count === 0 ? originalSlug : `${originalSlug}-${count}`;
        }
        return slug;
    }
    hasAnchor(anchor) {
        return this.seen.has(anchor);
    }
    getSimilarAnchors(anchor) {
        return getSimilarValues(this.seen.keys(), anchor);
    }
}
