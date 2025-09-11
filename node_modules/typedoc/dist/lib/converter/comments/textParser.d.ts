/**
 * Parser to handle plain text markdown.
 *
 * Responsible for recognizing relative paths within the text and turning
 * them into references.
 * @module
 */
import type { TranslationProxy } from "../../internationalization/index.js";
import type { CommentDisplayPart } from "../../models/index.js";
import type { FileRegistry } from "../../models/FileRegistry.js";
import { type Token } from "./lexer.js";
import type { NormalizedPath, TranslatedString } from "#utils";
/**
 * This is incredibly unfortunate. The comment lexer owns the responsibility
 * for splitting up text into text/code, this is totally fine for HTML links
 * but for markdown links, ``[`code`](./link)`` is valid, so we need to keep
 * track of state across calls to {@link textContent}.
 */
export declare class TextParserReentryState {
    withinLinkLabel: boolean;
    withinLinkDest: boolean;
    private lastPartWasNewline;
    checkState(token: Token): void;
}
/**
 * Look for relative links within a piece of text and add them to the {@link FileRegistry}
 * so that they can be correctly resolved during rendering.
 */
export declare function textContent(sourcePath: NormalizedPath, token: Token, i18n: TranslationProxy, warning: (msg: TranslatedString, token: Token) => void, outContent: CommentDisplayPart[], files: FileRegistry, atNewLine: boolean, reentry: TextParserReentryState): void;
