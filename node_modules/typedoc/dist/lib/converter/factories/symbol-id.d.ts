import { ReflectionSymbolId } from "#models";
import ts from "typescript";
export declare function createSymbolId(symbol: ts.Symbol, declaration?: ts.Declaration): ReflectionSymbolId;
export declare function addInferredDeclarationMapPaths(opts: ts.CompilerOptions, files: readonly string[]): void;
