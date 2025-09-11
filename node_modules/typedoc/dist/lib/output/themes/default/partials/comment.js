import { JSX, translateTagName } from "#utils";
import { ReflectionKind } from "../../../../models/index.js";
import { anchorIcon } from "./anchor-icon.js";
import { join } from "../../lib.js";
// Note: Comment modifiers are handled in `renderFlags`
export function renderDisplayParts({ markdown }, parts) {
    if (!parts?.length)
        return;
    return (JSX.createElement("div", { class: "tsd-comment tsd-typography" },
        JSX.createElement(JSX.Raw, { html: markdown(parts) })));
}
export function commentShortSummary(context, props) {
    let shortSummary;
    if (props.isDocument()) {
        if (typeof props.frontmatter["summary"] === "string") {
            shortSummary = [{ kind: "text", text: props.frontmatter["summary"] }];
        }
    }
    else {
        shortSummary = props.comment?.getShortSummary(context.options.getValue("useFirstParagraphOfCommentAsSummary"));
    }
    if (!shortSummary?.length && props.isDeclaration() && props.signatures?.length) {
        return commentShortSummary(context, props.signatures[0]);
    }
    if (!shortSummary?.some((part) => part.text))
        return;
    return context.displayParts(shortSummary);
}
export function commentSummary(context, props) {
    if (props.comment?.summary.some((part) => part.text)) {
        return context.displayParts(props.comment.summary);
    }
    const target = (props.isDeclaration() || props.isParameter()) && props.type?.type === "reference"
        ? props.type.reflection
        : undefined;
    if (target?.comment?.hasModifier("@expand") && target?.comment?.summary.some((part) => part.text)) {
        return context.displayParts(target.comment.summary);
    }
}
export function commentTags(context, props) {
    if (!props.comment)
        return;
    const skipSave = props.comment.blockTags.map((tag) => tag.skipRendering);
    const skippedTags = context.options.getValue("notRenderedTags");
    const beforeTags = context.hook("comment.beforeTags", context, props.comment, props);
    const afterTags = context.hook("comment.afterTags", context, props.comment, props);
    const tags = props.kindOf(ReflectionKind.SomeSignature)
        ? props.comment.blockTags.filter((tag) => tag.tag !== "@returns" && !tag.skipRendering && !skippedTags.includes(tag.tag))
        : props.comment.blockTags.filter((tag) => !tag.skipRendering && !skippedTags.includes(tag.tag));
    skipSave.forEach((skip, i) => (props.comment.blockTags[i].skipRendering = skip));
    return (JSX.createElement(JSX.Fragment, null,
        beforeTags,
        JSX.createElement("div", { class: "tsd-comment tsd-typography" }, tags.map((item) => {
            const name = item.name
                ? `${translateTagName(item.tag)}: ${item.name}`
                : translateTagName(item.tag);
            const anchor = context.slugger.slug(name);
            return (JSX.createElement(JSX.Fragment, null,
                JSX.createElement("div", { class: `tsd-tag-${item.tag.substring(1)}` },
                    JSX.createElement("h4", { class: "tsd-anchor-link", id: anchor },
                        name,
                        anchorIcon(context, anchor)),
                    JSX.createElement(JSX.Raw, { html: context.markdown(item.content) }))));
        })),
        afterTags));
}
export function reflectionFlags(context, props) {
    const flagsNotRendered = context.options.getValue("notRenderedTags");
    const allFlags = props.flags.getFlagStrings();
    if (props.comment) {
        for (const tag of props.comment.modifierTags) {
            if (!flagsNotRendered.includes(tag)) {
                allFlags.push(translateTagName(tag));
            }
        }
    }
    return join(" ", allFlags, (item) => JSX.createElement("code", { class: "tsd-tag" }, item));
}
