"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCommentCache = clearCommentCache;
exports.getComment = getComment;
exports.getNodeComment = getNodeComment;
exports.getFileComment = getFileComment;
exports.getSignatureComment = getSignatureComment;
exports.getJsDocComment = getJsDocComment;
const typescript_1 = __importDefault(require("typescript"));
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const blockLexer_1 = require("./blockLexer");
const discovery_1 = require("./discovery");
const lineLexer_1 = require("./lineLexer");
const parser_1 = require("./parser");
const jsDocCommentKinds = [
    typescript_1.default.SyntaxKind.JSDocPropertyTag,
    typescript_1.default.SyntaxKind.JSDocCallbackTag,
    typescript_1.default.SyntaxKind.JSDocTypedefTag,
    typescript_1.default.SyntaxKind.JSDocTemplateTag,
    typescript_1.default.SyntaxKind.JSDocEnumTag,
];
let commentDiscoveryId = 0;
let commentCache = new WeakMap();
// We need to do this for tests so that changing the tsLinkResolution option
// actually works. Without it, we'd get the old parsed comment which doesn't
// have the TS symbols attached.
function clearCommentCache() {
    commentCache = new WeakMap();
    commentDiscoveryId = 0;
}
function getCommentWithCache(discovered, config, logger, checker, files) {
    if (!discovered)
        return;
    const { file, ranges, jsDoc } = discovered;
    const cache = commentCache.get(file) || new Map();
    if (cache.has(ranges[0].pos)) {
        const clone = cache.get(ranges[0].pos).clone();
        clone.inheritedFromParentDeclaration =
            discovered.inheritedFromParentDeclaration;
        return clone;
    }
    let comment;
    switch (ranges[0].kind) {
        case typescript_1.default.SyntaxKind.MultiLineCommentTrivia:
            comment = (0, parser_1.parseComment)((0, blockLexer_1.lexBlockComment)(file.text, ranges[0].pos, ranges[0].end, jsDoc, checker), config, file, logger, files);
            break;
        case typescript_1.default.SyntaxKind.SingleLineCommentTrivia:
            comment = (0, parser_1.parseComment)((0, lineLexer_1.lexLineComments)(file.text, ranges), config, file, logger, files);
            break;
        default:
            (0, utils_1.assertNever)(ranges[0].kind);
    }
    comment.discoveryId = ++commentDiscoveryId;
    comment.inheritedFromParentDeclaration =
        discovered.inheritedFromParentDeclaration;
    cache.set(ranges[0].pos, comment);
    commentCache.set(file, cache);
    return comment.clone();
}
function getCommentImpl(commentSource, config, logger, moduleComment, checker, files) {
    const comment = getCommentWithCache(commentSource, config, logger, config.useTsLinkResolution ? checker : undefined, files);
    if (comment?.getTag("@import") || comment?.getTag("@license")) {
        return;
    }
    if (moduleComment && comment) {
        // Module comment, make sure it is tagged with @packageDocumentation or @module.
        // If it isn't then the comment applies to the first statement in the file, so throw it away.
        if (!comment.hasModifier("@packageDocumentation") &&
            !comment.getTag("@module")) {
            return;
        }
    }
    if (!moduleComment && comment) {
        // Ensure module comments are not attached to non-module reflections.
        if (comment.hasModifier("@packageDocumentation") ||
            comment.getTag("@module")) {
            return;
        }
    }
    return comment;
}
function getComment(symbol, kind, config, logger, checker, files) {
    const declarations = symbol.declarations || [];
    if (declarations.length &&
        declarations.every((d) => jsDocCommentKinds.includes(d.kind))) {
        return getJsDocComment(declarations[0], config, logger, checker, files);
    }
    const sf = declarations.find(typescript_1.default.isSourceFile);
    if (sf) {
        return getFileComment(sf, config, logger, checker, files);
    }
    const isModule = declarations.some((decl) => {
        if (typescript_1.default.isModuleDeclaration(decl) && typescript_1.default.isStringLiteral(decl.name)) {
            return true;
        }
        return false;
    });
    const comment = getCommentImpl((0, discovery_1.discoverComment)(symbol, kind, logger, config.commentStyle, checker), config, logger, isModule, checker, files);
    if (!comment && kind === models_1.ReflectionKind.Property) {
        return getConstructorParamPropertyComment(symbol, config, logger, checker, files);
    }
    return comment;
}
function getNodeComment(node, moduleComment, config, logger, checker, files) {
    return getCommentImpl((0, discovery_1.discoverNodeComment)(node, config.commentStyle), config, logger, moduleComment, checker, files);
}
function getFileComment(file, config, logger, checker, files) {
    for (const commentSource of (0, discovery_1.discoverFileComments)(file, config.commentStyle)) {
        const comment = getCommentWithCache(commentSource, config, logger, config.useTsLinkResolution ? checker : undefined, files);
        if (comment?.getTag("@license") || comment?.getTag("@import")) {
            continue;
        }
        if (comment?.getTag("@module") ||
            comment?.hasModifier("@packageDocumentation")) {
            return comment;
        }
        return;
    }
}
function getConstructorParamPropertyComment(symbol, config, logger, checker, files) {
    const decl = symbol.declarations?.find(typescript_1.default.isParameter);
    if (!decl)
        return;
    const ctor = decl.parent;
    const comment = getSignatureComment(ctor, config, logger, checker, files);
    const paramTag = comment?.getIdentifiedTag(symbol.name, "@param");
    if (paramTag) {
        const result = new models_1.Comment(paramTag.content);
        result.sourcePath = comment.sourcePath;
        return result;
    }
}
function getSignatureComment(declaration, config, logger, checker, files) {
    return getCommentImpl((0, discovery_1.discoverSignatureComment)(declaration, checker, config.commentStyle), config, logger, false, checker, files);
}
function getJsDocComment(declaration, config, logger, checker, files) {
    const file = declaration.getSourceFile();
    // First, get the whole comment. We know we'll need all of it.
    let parent = declaration.parent;
    while (!typescript_1.default.isJSDoc(parent)) {
        parent = parent.parent;
    }
    // Then parse it.
    const comment = getCommentWithCache({
        file,
        ranges: [
            {
                kind: typescript_1.default.SyntaxKind.MultiLineCommentTrivia,
                pos: parent.pos,
                end: parent.end,
            },
        ],
        jsDoc: parent,
        inheritedFromParentDeclaration: false,
    }, config, logger, config.useTsLinkResolution ? checker : undefined, files);
    // And pull out the tag we actually care about.
    if (typescript_1.default.isJSDocEnumTag(declaration)) {
        const result = new models_1.Comment(comment.getTag("@enum")?.content);
        result.sourcePath = comment.sourcePath;
        return result;
    }
    if (typescript_1.default.isJSDocTemplateTag(declaration) &&
        declaration.comment &&
        declaration.typeParameters.length > 1) {
        // We could just put the same comment on everything, but due to how comment parsing works,
        // we'd have to search for any @template with a name starting with the first type parameter's name
        // which feels horribly hacky.
        logger.warn(logger.i18n.multiple_type_parameters_on_template_tag_unsupported(), declaration);
        return;
    }
    let name;
    if (typescript_1.default.isJSDocTemplateTag(declaration)) {
        // This isn't really ideal.
        name = declaration.typeParameters[0].name.text;
    }
    else {
        name = declaration.name?.getText();
    }
    if (!name) {
        return;
    }
    const tag = comment.getIdentifiedTag(name, `@${declaration.tagName.text}`);
    if (!tag) {
        logger.error(logger.i18n.failed_to_find_jsdoc_tag_for_name_0(name), declaration);
    }
    else {
        const result = new models_1.Comment(models_1.Comment.cloneDisplayParts(tag.content));
        result.sourcePath = comment.sourcePath;
        return result;
    }
}
