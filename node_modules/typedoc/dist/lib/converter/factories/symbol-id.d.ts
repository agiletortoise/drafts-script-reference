import { ReflectionSymbolId } from "#models";
import ts from "typescript";
export declare function createSymbolIdImpl(symbol: ts.Symbol, declaration?: ts.Declaration): ReflectionSymbolId;
