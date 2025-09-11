/**
 * Module which handles sorting reflections according to a user specified strategy.
 * @module
 */
import type { DeclarationReflection } from "../models/DeclarationReflection.js";
import type { Options } from "./options/index.js";
import type { DocumentReflection } from "../models/index.js";
export declare const SORT_STRATEGIES: readonly ["source-order", "alphabetical", "alphabetical-ignoring-documents", "enum-value-ascending", "enum-value-descending", "enum-member-source-order", "static-first", "instance-first", "visibility", "required-first", "kind", "external-last", "documents-first", "documents-last"];
export type SortStrategy = (typeof SORT_STRATEGIES)[number];
export declare function isValidSortStrategy(strategy: string): strategy is SortStrategy;
export declare function getSortFunction(opts: Options, strategies?: readonly SortStrategy[]): (reflections: (DeclarationReflection | DocumentReflection)[]) => void;
