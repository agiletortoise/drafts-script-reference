import ts from "typescript";
import { ReflectionKind } from "../../models";
import { type Logger } from "../../utils";
import { CommentStyle } from "../../utils/options/declaration";
export interface DiscoveredComment {
    file: ts.SourceFile;
    ranges: ts.CommentRange[];
    jsDoc: ts.JSDoc | undefined;
    inheritedFromParentDeclaration: boolean;
}
export declare function discoverFileComments(node: ts.SourceFile, commentStyle: CommentStyle): DiscoveredComment[];
export declare function discoverNodeComment(node: ts.Node, commentStyle: CommentStyle): DiscoveredComment | undefined;
export declare function discoverComment(symbol: ts.Symbol, kind: ReflectionKind, logger: Logger, commentStyle: CommentStyle, checker: ts.TypeChecker): DiscoveredComment | undefined;
export declare function discoverSignatureComment(declaration: ts.SignatureDeclaration | ts.JSDocSignature, checker: ts.TypeChecker, commentStyle: CommentStyle): DiscoveredComment | undefined;
