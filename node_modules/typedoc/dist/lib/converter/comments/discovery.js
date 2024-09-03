"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverFileComments = discoverFileComments;
exports.discoverNodeComment = discoverNodeComment;
exports.discoverComment = discoverComment;
exports.discoverSignatureComment = discoverSignatureComment;
const typescript_1 = __importDefault(require("typescript"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const declaration_1 = require("../../utils/options/declaration");
const paths_1 = require("../../utils/paths");
const assert_1 = require("assert");
const array_1 = require("../../utils/array");
const variablePropertyKinds = [
    typescript_1.default.SyntaxKind.PropertyDeclaration,
    typescript_1.default.SyntaxKind.PropertySignature,
    typescript_1.default.SyntaxKind.BinaryExpression,
    typescript_1.default.SyntaxKind.PropertyAssignment,
    typescript_1.default.SyntaxKind.ShorthandPropertyAssignment,
    // class X { constructor(/** Comment */ readonly z: string) }
    typescript_1.default.SyntaxKind.Parameter,
    // Variable values
    typescript_1.default.SyntaxKind.VariableDeclaration,
    typescript_1.default.SyntaxKind.BindingElement,
    typescript_1.default.SyntaxKind.ExportAssignment,
    typescript_1.default.SyntaxKind.PropertyAccessExpression,
];
// Note: This does NOT include JSDoc syntax kinds. This is important!
// Comments from @typedef and @callback tags are handled specially by
// the JSDoc converter because we only want part of the comment when
// getting them.
const wantedKinds = {
    [models_1.ReflectionKind.Project]: [
        typescript_1.default.SyntaxKind.SourceFile,
        typescript_1.default.SyntaxKind.ModuleDeclaration,
    ],
    [models_1.ReflectionKind.Module]: [
        typescript_1.default.SyntaxKind.SourceFile,
        typescript_1.default.SyntaxKind.ModuleDeclaration,
    ],
    [models_1.ReflectionKind.Namespace]: [
        typescript_1.default.SyntaxKind.ModuleDeclaration,
        typescript_1.default.SyntaxKind.SourceFile,
        typescript_1.default.SyntaxKind.BindingElement,
        typescript_1.default.SyntaxKind.ExportSpecifier,
        typescript_1.default.SyntaxKind.NamespaceExport,
        // @namespace support
        typescript_1.default.SyntaxKind.VariableDeclaration,
        typescript_1.default.SyntaxKind.BindingElement,
        typescript_1.default.SyntaxKind.ExportAssignment,
        typescript_1.default.SyntaxKind.PropertyAccessExpression,
        typescript_1.default.SyntaxKind.PropertyDeclaration,
        typescript_1.default.SyntaxKind.PropertyAssignment,
        typescript_1.default.SyntaxKind.ShorthandPropertyAssignment,
    ],
    [models_1.ReflectionKind.Enum]: [
        typescript_1.default.SyntaxKind.EnumDeclaration,
        typescript_1.default.SyntaxKind.VariableDeclaration,
    ],
    [models_1.ReflectionKind.EnumMember]: [
        typescript_1.default.SyntaxKind.EnumMember,
        // These here so that @enum gets comments
        typescript_1.default.SyntaxKind.PropertyAssignment,
        typescript_1.default.SyntaxKind.PropertySignature,
    ],
    [models_1.ReflectionKind.Variable]: variablePropertyKinds,
    [models_1.ReflectionKind.Function]: [
        typescript_1.default.SyntaxKind.FunctionDeclaration,
        typescript_1.default.SyntaxKind.BindingElement,
        typescript_1.default.SyntaxKind.VariableDeclaration,
        typescript_1.default.SyntaxKind.ExportAssignment,
        typescript_1.default.SyntaxKind.PropertyAccessExpression,
        typescript_1.default.SyntaxKind.PropertyDeclaration,
        typescript_1.default.SyntaxKind.PropertyAssignment,
        typescript_1.default.SyntaxKind.ShorthandPropertyAssignment,
    ],
    [models_1.ReflectionKind.Class]: [
        typescript_1.default.SyntaxKind.ClassDeclaration,
        typescript_1.default.SyntaxKind.BindingElement,
        // If marked with @class
        typescript_1.default.SyntaxKind.VariableDeclaration,
        typescript_1.default.SyntaxKind.ExportAssignment,
        typescript_1.default.SyntaxKind.FunctionDeclaration,
    ],
    [models_1.ReflectionKind.Interface]: [
        typescript_1.default.SyntaxKind.InterfaceDeclaration,
        typescript_1.default.SyntaxKind.TypeAliasDeclaration,
    ],
    [models_1.ReflectionKind.Constructor]: [typescript_1.default.SyntaxKind.Constructor],
    [models_1.ReflectionKind.Property]: variablePropertyKinds,
    [models_1.ReflectionKind.Method]: [
        typescript_1.default.SyntaxKind.FunctionDeclaration,
        typescript_1.default.SyntaxKind.MethodDeclaration,
    ],
    [models_1.ReflectionKind.CallSignature]: [
        typescript_1.default.SyntaxKind.FunctionDeclaration,
        typescript_1.default.SyntaxKind.VariableDeclaration,
        typescript_1.default.SyntaxKind.MethodDeclaration,
        typescript_1.default.SyntaxKind.MethodDeclaration,
        typescript_1.default.SyntaxKind.PropertyDeclaration,
        typescript_1.default.SyntaxKind.PropertySignature,
        typescript_1.default.SyntaxKind.CallSignature,
    ],
    [models_1.ReflectionKind.IndexSignature]: [typescript_1.default.SyntaxKind.IndexSignature],
    [models_1.ReflectionKind.ConstructorSignature]: [typescript_1.default.SyntaxKind.ConstructSignature],
    [models_1.ReflectionKind.Parameter]: [typescript_1.default.SyntaxKind.Parameter],
    [models_1.ReflectionKind.TypeLiteral]: [typescript_1.default.SyntaxKind.TypeLiteral],
    [models_1.ReflectionKind.TypeParameter]: [typescript_1.default.SyntaxKind.TypeParameter],
    [models_1.ReflectionKind.Accessor]: [typescript_1.default.SyntaxKind.PropertyDeclaration],
    [models_1.ReflectionKind.GetSignature]: [typescript_1.default.SyntaxKind.GetAccessor],
    [models_1.ReflectionKind.SetSignature]: [typescript_1.default.SyntaxKind.SetAccessor],
    [models_1.ReflectionKind.TypeAlias]: [typescript_1.default.SyntaxKind.TypeAliasDeclaration],
    [models_1.ReflectionKind.Reference]: [
        typescript_1.default.SyntaxKind.NamespaceExport,
        typescript_1.default.SyntaxKind.ExportSpecifier,
    ],
    // Non-TS kind, will never have comments.
    [models_1.ReflectionKind.Document]: [],
};
function discoverFileComments(node, commentStyle) {
    const text = node.text;
    const comments = collectCommentRanges(typescript_1.default.getLeadingCommentRanges(text, node.pos));
    const selectedDocComments = comments.filter((ranges) => permittedRange(text, ranges, commentStyle));
    return selectedDocComments.map((ranges) => {
        return {
            file: node,
            ranges,
            jsDoc: findJsDocForComment(node, ranges),
            inheritedFromParentDeclaration: false,
        };
    });
}
function discoverNodeComment(node, commentStyle) {
    const text = node.getSourceFile().text;
    const comments = collectCommentRanges(typescript_1.default.getLeadingCommentRanges(text, node.pos));
    comments.reverse();
    const selectedDocComment = comments.find((ranges) => permittedRange(text, ranges, commentStyle));
    if (selectedDocComment) {
        return {
            file: node.getSourceFile(),
            ranges: selectedDocComment,
            jsDoc: findJsDocForComment(node, selectedDocComment),
            inheritedFromParentDeclaration: false,
        };
    }
}
function checkCommentDeclarations(commentNodes, reverse, commentStyle) {
    const discovered = [];
    for (const { node, inheritedFromParentDeclaration } of commentNodes) {
        const text = node.getSourceFile().text;
        const comments = collectCommentRanges(typescript_1.default.getLeadingCommentRanges(text, node.pos));
        if (reverse) {
            comments.reverse();
        }
        const selectedDocComment = comments.find((ranges) => permittedRange(text, ranges, commentStyle));
        if (selectedDocComment) {
            discovered.push({
                file: node.getSourceFile(),
                ranges: selectedDocComment,
                jsDoc: findJsDocForComment(node, selectedDocComment),
                inheritedFromParentDeclaration,
            });
        }
    }
    return discovered;
}
function discoverComment(symbol, kind, logger, commentStyle, checker) {
    // For a module comment, we want the first one defined in the file,
    // not the last one, since that will apply to the import or declaration.
    const reverse = !symbol.declarations?.some(typescript_1.default.isSourceFile);
    const wantedDeclarations = (0, array_1.filter)(symbol.declarations, (decl) => wantedKinds[kind].includes(decl.kind));
    const commentNodes = wantedDeclarations.flatMap((decl) => declarationToCommentNodes(decl, checker));
    // Special behavior here!
    // Signatures and symbols have two distinct discovery methods as of TypeDoc 0.26.
    // This method discovers comments for symbols, and function-likes will only have
    // a symbol comment if there is more than one signature (== more than one declaration)
    // and there is a comment on the implementation signature.
    if (kind & models_1.ReflectionKind.ContainsCallSignatures) {
        const canHaveOverloads = wantedDeclarations.some((node) => [
            typescript_1.default.SyntaxKind.FunctionDeclaration,
            typescript_1.default.SyntaxKind.MethodDeclaration,
            typescript_1.default.SyntaxKind.Constructor,
        ].includes(node.kind));
        const isOverloaded = canHaveOverloads && wantedDeclarations.length > 1;
        if (isOverloaded) {
            commentNodes.length = 0;
            const implementationNode = wantedDeclarations.find((node) => node.body);
            if (implementationNode) {
                commentNodes.push({
                    node: implementationNode,
                    inheritedFromParentDeclaration: false,
                });
            }
        }
        else if (canHaveOverloads) {
            // Single signature function, function reflection doesn't get a comment,
            // the signatures do.
            commentNodes.length = 0;
        }
        else {
            // Variable declaration which happens to include signatures.
        }
    }
    const discovered = checkCommentDeclarations(commentNodes, reverse, commentStyle);
    switch (discovered.length) {
        case 0:
            return undefined;
        case 1:
            return discovered[0];
        default: {
            if (discovered.filter((n) => !n.inheritedFromParentDeclaration)
                .length > 1) {
                logger.warn(logger.i18n.symbol_0_has_multiple_declarations_with_comment(symbol.name));
                const locations = discovered.map(({ file, ranges: [{ pos }] }) => {
                    const path = (0, paths_1.nicePath)(file.fileName);
                    const line = typescript_1.default.getLineAndCharacterOfPosition(file, pos).line +
                        1;
                    return `${path}:${line}`;
                });
                logger.info(logger.i18n.comments_for_0_are_declared_at_1(symbol.name, locations.join("\n\t")));
            }
            return discovered[0];
        }
    }
}
function discoverSignatureComment(declaration, checker, commentStyle) {
    for (const { node, inheritedFromParentDeclaration, } of declarationToCommentNodes(declaration, checker)) {
        if (typescript_1.default.isJSDocSignature(node)) {
            const comment = node.parent.parent;
            (0, assert_1.ok)(typescript_1.default.isJSDoc(comment));
            return {
                file: node.getSourceFile(),
                ranges: [
                    {
                        kind: typescript_1.default.SyntaxKind.MultiLineCommentTrivia,
                        pos: comment.pos,
                        end: comment.end,
                    },
                ],
                jsDoc: comment,
                inheritedFromParentDeclaration,
            };
        }
        const text = node.getSourceFile().text;
        const comments = collectCommentRanges(typescript_1.default.getLeadingCommentRanges(text, node.pos));
        comments.reverse();
        const comment = comments.find((ranges) => permittedRange(text, ranges, commentStyle));
        if (comment) {
            return {
                file: node.getSourceFile(),
                ranges: comment,
                jsDoc: findJsDocForComment(node, comment),
                inheritedFromParentDeclaration,
            };
        }
    }
}
function findJsDocForComment(node, ranges) {
    if (ranges[0].kind === typescript_1.default.SyntaxKind.MultiLineCommentTrivia) {
        const jsDocs = typescript_1.default
            .getJSDocCommentsAndTags(node)
            .map((doc) => typescript_1.default.findAncestor(doc, typescript_1.default.isJSDoc));
        return jsDocs.find((doc) => doc.pos === ranges[0].pos);
    }
}
/**
 * Check whether the given module declaration is the topmost.
 *
 * This function returns TRUE if there is no trailing module defined, in
 * the following example this would be the case only for module `C`.
 *
 * ```
 * module A.B.C { }
 * ```
 *
 * @param node  The module definition that should be tested.
 * @return TRUE if the given node is the topmost module declaration, FALSE otherwise.
 */
function isTopmostModuleDeclaration(node) {
    return node.getChildren().some(typescript_1.default.isModuleBlock);
}
/**
 * Return the root module declaration of the given module declaration.
 *
 * In the following example this function would always return module
 * `A` no matter which of the modules was passed in.
 *
 * ```
 * module A.B.C { }
 * ```
 */
function getRootModuleDeclaration(node) {
    while (node.parent.kind === typescript_1.default.SyntaxKind.ModuleDeclaration) {
        const parent = node.parent;
        if (node.name.pos === parent.name.end + 1) {
            node = parent;
        }
        else {
            break;
        }
    }
    return node;
}
function declarationToCommentNodeIgnoringParents(node) {
    // ts.SourceFile is a counterexample
    if (!node.parent)
        return node;
    // function foo(x: number)
    //              ^^^^^^^^^
    if (node.kind === typescript_1.default.SyntaxKind.Parameter) {
        return node;
    }
    // const abc = 123
    //       ^^^
    if (node.parent.kind === typescript_1.default.SyntaxKind.VariableDeclarationList) {
        return node.parent.parent;
    }
    // const a = () => {}
    //           ^^^^^^^^
    if (node.parent.kind === typescript_1.default.SyntaxKind.VariableDeclaration) {
        return node.parent.parent.parent;
    }
    // class X { y = () => {} }
    //               ^^^^^^^^
    // function Z() {}
    // Z.method = () => {}
    //            ^^^^^^^^
    // export default () => {}
    //                ^^^^^^^^
    if ([
        typescript_1.default.SyntaxKind.PropertyDeclaration,
        typescript_1.default.SyntaxKind.BinaryExpression,
        typescript_1.default.SyntaxKind.ExportAssignment,
    ].includes(node.parent.kind)) {
        return node.parent;
    }
    if (typescript_1.default.isModuleDeclaration(node)) {
        if (!isTopmostModuleDeclaration(node)) {
            return;
        }
        else {
            return getRootModuleDeclaration(node);
        }
    }
    if (node.kind === typescript_1.default.SyntaxKind.ExportSpecifier) {
        return node.parent.parent;
    }
    if (typescript_1.default.SyntaxKind.NamespaceExport === node.kind) {
        return node.parent;
    }
}
function declarationToCommentNodes(node, checker) {
    const commentNode = declarationToCommentNodeIgnoringParents(node);
    if (commentNode) {
        return [
            {
                node: commentNode,
                inheritedFromParentDeclaration: false,
            },
        ];
    }
    const result = [
        {
            node,
            inheritedFromParentDeclaration: false,
        },
    ];
    const seenSymbols = new Set();
    const bases = findBaseOfDeclaration(checker, node, (symbol) => {
        if (!seenSymbols.has(symbol)) {
            seenSymbols.add(symbol);
            return symbol.declarations?.map((node) => declarationToCommentNodeIgnoringParents(node) || node);
        }
    });
    for (const parentCommentNode of bases || []) {
        result.push({
            node: parentCommentNode,
            inheritedFromParentDeclaration: true,
        });
    }
    return result;
}
// Lifted from the TS source, with a couple minor modifications
function findBaseOfDeclaration(checker, declaration, cb) {
    const classOrInterfaceDeclaration = declaration.parent?.kind === typescript_1.default.SyntaxKind.Constructor
        ? declaration.parent.parent
        : declaration.parent;
    if (!classOrInterfaceDeclaration)
        return;
    const isStaticMember = typescript_1.default.getCombinedModifierFlags(declaration) & typescript_1.default.ModifierFlags.Static;
    return (0, array_1.firstDefined)(typescript_1.default.getAllSuperTypeNodes(classOrInterfaceDeclaration), (superTypeNode) => {
        const baseType = checker.getTypeAtLocation(superTypeNode);
        const type = isStaticMember && baseType.symbol
            ? checker.getTypeOfSymbol(baseType.symbol)
            : baseType;
        const symbol = checker.getPropertyOfType(type, declaration.symbol.name);
        return symbol ? cb(symbol) : undefined;
    });
}
/**
 * Separate comment ranges into arrays so that multiple line comments are kept together
 * and each block comment is left on its own.
 */
function collectCommentRanges(ranges) {
    const result = [];
    let collect = [];
    for (const range of ranges || []) {
        collect.push(range);
        switch (range.kind) {
            case typescript_1.default.SyntaxKind.MultiLineCommentTrivia:
                if (collect.length) {
                    result.push(collect);
                    collect = [];
                }
                result.push([range]);
                break;
            case typescript_1.default.SyntaxKind.SingleLineCommentTrivia:
                collect.push(range);
                break;
            /* istanbul ignore next */
            default:
                (0, utils_1.assertNever)(range.kind);
        }
    }
    if (collect.length) {
        result.push(collect);
    }
    return result;
}
function permittedRange(text, ranges, commentStyle) {
    switch (commentStyle) {
        case declaration_1.CommentStyle.All:
            return true;
        case declaration_1.CommentStyle.Block:
            return ranges[0].kind === typescript_1.default.SyntaxKind.MultiLineCommentTrivia;
        case declaration_1.CommentStyle.Line:
            return ranges[0].kind === typescript_1.default.SyntaxKind.SingleLineCommentTrivia;
        case declaration_1.CommentStyle.JSDoc:
            return (ranges[0].kind === typescript_1.default.SyntaxKind.MultiLineCommentTrivia &&
                text[ranges[0].pos] === "/" &&
                text[ranges[0].pos + 1] === "*" &&
                text[ranges[0].pos + 2] === "*");
    }
}
