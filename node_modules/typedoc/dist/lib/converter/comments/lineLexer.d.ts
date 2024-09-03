import type * as ts from "typescript";
import { type Token } from "./lexer";
export declare function lexLineComments(file: string, ranges: ts.CommentRange[]): Generator<Token, undefined, undefined>;
