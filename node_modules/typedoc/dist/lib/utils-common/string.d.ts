/**
 * Resolves a string type into a union of characters, `"ab"` turns into `"a" | "b"`.
 */
export type Chars<T extends string> = T extends `${infer C}${infer R}` ? C | Chars<R> : never;
/** Count the number of times `search` appears in `text` */
export declare function countMatches(text: string, search: string): number;
export declare function dedent(text: string): string;
export declare function editDistance(s: string, t: string): number;
export declare function getSimilarValues(values: Iterable<string>, compareTo: string): string[];
export declare function escapeRegExp(s: string): string;
export declare function escapeHtml(html: string): string;
