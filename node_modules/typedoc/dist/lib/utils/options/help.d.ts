import type { Options } from "./options.js";
export interface ParameterHelp {
    names: string[];
    helps: string[];
    margin: number;
}
export declare function getOptionsHelp(options: Options): string;
