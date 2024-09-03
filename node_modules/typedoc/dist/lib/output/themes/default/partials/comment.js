"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSummary = commentSummary;
exports.commentTags = commentTags;
exports.reflectionFlags = reflectionFlags;
const utils_1 = require("../../../../utils");
const models_1 = require("../../../../models");
const anchor_icon_1 = require("./anchor-icon");
const lib_1 = require("../../lib");
// Note: Comment modifiers are handled in `renderFlags`
function commentSummary({ markdown }, props) {
    if (!props.comment?.summary.some((part) => part.text))
        return;
    return (utils_1.JSX.createElement("div", { class: "tsd-comment tsd-typography" },
        utils_1.JSX.createElement(utils_1.Raw, { html: markdown(props.comment.summary) })));
}
function commentTags(context, props) {
    if (!props.comment)
        return;
    const beforeTags = context.hook("comment.beforeTags", context, props.comment, props);
    const afterTags = context.hook("comment.afterTags", context, props.comment, props);
    const tags = props.kindOf(models_1.ReflectionKind.SomeSignature)
        ? props.comment.blockTags.filter((tag) => tag.tag !== "@returns" && !tag.skipRendering)
        : props.comment.blockTags.filter((tag) => !tag.skipRendering);
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        beforeTags,
        utils_1.JSX.createElement("div", { class: "tsd-comment tsd-typography" }, tags.map((item) => {
            const name = item.name
                ? `${context.internationalization.translateTagName(item.tag)}: ${item.name}`
                : context.internationalization.translateTagName(item.tag);
            const anchor = props.getUniqueAliasInPage(name);
            return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("h4", { class: "tsd-anchor-link" },
                    utils_1.JSX.createElement("a", { id: anchor, class: "tsd-anchor" }),
                    name,
                    (0, anchor_icon_1.anchorIcon)(context, anchor)),
                utils_1.JSX.createElement(utils_1.Raw, { html: context.markdown(item.content) })));
        })),
        afterTags));
}
const flagsNotRendered = ["@showCategories", "@showGroups", "@hideCategories", "@hideGroups"];
function reflectionFlags(context, props) {
    const allFlags = props.flags.getFlagStrings(context.internationalization);
    if (props.comment) {
        for (const tag of props.comment.modifierTags) {
            if (!flagsNotRendered.includes(tag)) {
                allFlags.push(context.internationalization.translateTagName(tag));
            }
        }
    }
    return (0, lib_1.join)(" ", allFlags, (item) => utils_1.JSX.createElement("code", { class: "tsd-tag" }, item));
}
