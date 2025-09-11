import type { LineAndCharacter, SourceFileLike } from "typescript";
import type { NormalizedPath } from "./path.js";
export interface MinimalNode {
    getStart(): number;
    getSourceFile(): MinimalSourceFile;
}
export declare class MinimalSourceFile implements SourceFileLike {
    readonly text: string;
    readonly fileName: string;
    constructor(text: string, fileName: NormalizedPath);
    getLineAndCharacterOfPosition(pos: number): LineAndCharacter;
}
