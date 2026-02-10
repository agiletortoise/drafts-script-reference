import { getSimilarValues } from "#utils";
/**
 * Responsible for getting a unique anchor for elements within a page.
 */
export class Slugger {
    options;
    seen = new Map();
    serialize(value) {
        // There are quite a few trade-offs here. We used to remove HTML tags here,
        // but TypeDoc now removes the HTML tags before passing text into the slug
        // method, which allows us to skip doing that here. This improves the slugger
        // generation for headers which look like the following:
        // (html allowed in markdown)
        // # test &lt;t&gt;
        // (html disallowed in markdown)
        // # test <t>
        // both of the above should slug to test-t
        return (value
            .trim()
            // remove unwanted chars
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
            // change whitespace to dash
            .replace(/\s/g, "-")
            // combine adjacent dashes
            .replace(/--+/, "-"));
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
