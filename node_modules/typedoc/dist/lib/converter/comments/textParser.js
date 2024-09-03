"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextParserReentryState = void 0;
exports.textContent = textContent;
const html_1 = require("../../utils/html");
const lexer_1 = require("./lexer");
const markdown_it_1 = __importDefault(require("markdown-it"));
const MdHelpers = new markdown_it_1.default().helpers;
/**
 * This is incredibly unfortunate. The comment lexer owns the responsibility
 * for splitting up text into text/code, this is totally fine for HTML links
 * but for markdown links, ``[`code`](./link)`` is valid, so we need to keep
 * track of state across calls to {@link textContent}.
 */
class TextParserReentryState {
    constructor() {
        this.withinLinkLabel = false;
        this.lastPartWasNewline = false;
    }
    checkState(token) {
        switch (token.kind) {
            case lexer_1.TokenSyntaxKind.Code:
                if (/\n\s*\n/.test(token.text)) {
                    this.withinLinkLabel = false;
                }
                break;
            case lexer_1.TokenSyntaxKind.NewLine:
                if (this.lastPartWasNewline) {
                    this.withinLinkLabel = false;
                }
                break;
        }
        this.lastPartWasNewline = token.kind === lexer_1.TokenSyntaxKind.NewLine;
    }
}
exports.TextParserReentryState = TextParserReentryState;
/**
 * Look for relative links within a piece of text and add them to the {@link FileRegistry}
 * so that they can be correctly resolved during rendering.
 */
function textContent(sourcePath, token, i18n, warning, outContent, files, atNewLine, reentry) {
    let lastPartEnd = 0;
    const data = {
        sourcePath,
        token,
        pos: 0, // relative to the token
        i18n,
        warning,
        files: files,
        atNewLine,
    };
    function addRef(ref) {
        outContent.push({
            kind: "text",
            text: token.text.slice(lastPartEnd, ref.pos),
        });
        outContent.push({
            kind: "relative-link",
            text: token.text.slice(ref.pos, ref.end),
            target: ref.target,
        });
        lastPartEnd = ref.end;
        data.pos = ref.end;
        if (!ref.target) {
            warning(i18n.relative_path_0_is_not_a_file_and_will_not_be_copied_to_output(token.text.slice(ref.pos, ref.end)), {
                kind: lexer_1.TokenSyntaxKind.Text,
                // ref.pos is relative to the token, but this pos is relative to the file.
                pos: token.pos + ref.pos,
                text: token.text.slice(ref.pos, ref.end),
            });
        }
    }
    while (data.pos < token.text.length) {
        const link = checkMarkdownLink(data, reentry);
        if (link) {
            addRef(link);
            continue;
        }
        const reference = checkReference(data);
        if (reference) {
            addRef(reference);
            continue;
        }
        const tagLink = checkTagLink(data);
        if (tagLink) {
            addRef(tagLink);
            continue;
        }
        ++data.pos;
    }
    if (lastPartEnd !== token.text.length) {
        outContent.push({ kind: "text", text: token.text.slice(lastPartEnd) });
    }
}
/**
 * Links are inline text with the form `[ text ]( url title )`.
 *
 * Images are just links with a leading `!` and lack of support for `[ref]` referring to a path
 * defined elsewhere, we don't care about that distinction here as we'll only replace the path
 * piece of the image.
 *
 * Reference: https://github.com/markdown-it/markdown-it/blob/14.1.0/lib/rules_inline/link.mjs
 * Reference: https://github.com/markdown-it/markdown-it/blob/14.1.0/lib/rules_inline/image.mjs
 *
 */
function checkMarkdownLink(data, reentry) {
    const { token, sourcePath, files } = data;
    let searchStart;
    if (reentry.withinLinkLabel) {
        searchStart = data.pos;
        reentry.withinLinkLabel = false;
    }
    else if (token.text[data.pos] === "[") {
        searchStart = data.pos + 1;
    }
    else {
        return;
    }
    const labelEnd = findLabelEnd(token.text, searchStart);
    if (labelEnd === -1) {
        // This markdown link might be split across multiple display parts
        // [ `text` ](link)
        // ^^ text
        //   ^^^^^^ code
        //         ^^^^^^^^ text
        reentry.withinLinkLabel = true;
        return;
    }
    if (token.text[labelEnd] === "]" && token.text[labelEnd + 1] === "(") {
        const link = MdHelpers.parseLinkDestination(token.text, labelEnd + 2, token.text.length);
        if (link.ok) {
            // Only make a relative-link display part if it's actually a relative link.
            // Discard protocol:// links, unix style absolute paths, and windows style absolute paths.
            if (isRelativePath(link.str)) {
                return {
                    pos: labelEnd + 2,
                    end: link.pos,
                    target: files.register(sourcePath, link.str),
                };
            }
            // This was a link, skip ahead to ensure we don't happen to parse
            // something else as a link within the link.
            data.pos = link.pos - 1;
        }
    }
}
/**
 * Reference definitions are blocks with the form `[label]: link title`
 * Reference: https://github.com/markdown-it/markdown-it/blob/14.1.0/lib/rules_block/reference.mjs
 *
 * Note: This may include false positives where TypeDoc recognizes a reference block that markdown
 * does not if users start lines with something that looks like a reference block without fully
 * separating it from an above paragraph. For a first cut, this is good enough.
 */
function checkReference(data) {
    const { atNewLine, pos, token, files, sourcePath } = data;
    if (atNewLine) {
        let lookahead = pos;
        while (/[ \t]/.test(token.text[lookahead])) {
            ++lookahead;
        }
        if (token.text[lookahead] === "[") {
            while (lookahead < token.text.length &&
                /[^\n\]]/.test(token.text[lookahead])) {
                ++lookahead;
            }
            if (token.text.startsWith("]:", lookahead)) {
                lookahead += 2;
                while (/[ \t]/.test(token.text[lookahead])) {
                    ++lookahead;
                }
                const link = MdHelpers.parseLinkDestination(token.text, lookahead, token.text.length);
                if (link.ok) {
                    if (isRelativePath(link.str)) {
                        return {
                            pos: lookahead,
                            end: link.pos,
                            target: files.register(sourcePath, link.str),
                        };
                    }
                    data.pos = link.pos - 1;
                }
            }
        }
    }
}
/**
 * Looks for `<a href="./relative">` and `<img src="./relative">`
 */
function checkTagLink(data) {
    const { pos, token } = data;
    if (token.text.startsWith("<img ", pos)) {
        data.pos += 4;
        return checkAttribute(data, "src");
    }
    if (token.text.startsWith("<a ", pos)) {
        data.pos += 3;
        return checkAttribute(data, "href");
    }
}
function checkAttribute(data, attr) {
    const parser = new html_1.HtmlAttributeParser(data.token.text, data.pos);
    while (parser.state !== html_1.ParserState.END) {
        if (parser.state === html_1.ParserState.BeforeAttributeValue &&
            parser.currentAttributeName === attr) {
            parser.step();
            if (isRelativePath(parser.currentAttributeValue)) {
                data.pos = parser.pos;
                return {
                    pos: parser.currentAttributeValueStart,
                    end: parser.currentAttributeValueEnd,
                    target: data.files.register(data.sourcePath, parser.currentAttributeValue),
                };
            }
            return;
        }
        parser.step();
    }
}
function isRelativePath(link) {
    // Lots of edge cases encoded right here!
    // Originally, this attempted to match protocol://, but...
    // `mailto:example@example.com` is not a relative path
    // `C:\foo` is not a relative path
    // `/etc/passwd` is not a relative path
    // `#anchor` is not a relative path
    return !/^[a-z]+:|^\/|^#/i.test(link);
}
function findLabelEnd(text, pos) {
    while (pos < text.length) {
        switch (text[pos]) {
            case "\n":
            case "]":
            case "[":
                return pos;
        }
        ++pos;
    }
    return -1;
}
