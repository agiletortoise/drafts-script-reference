import ts from "typescript";
import { type Token } from "./lexer.js";
import type { Context } from "../context.js";
export declare function lexBlockComment(file: string, pos?: number, end?: number, createSymbolId?: Context["createSymbolId"], jsDoc?: ts.JSDoc, checker?: ts.TypeChecker): Generator<Token, undefined, undefined>;
