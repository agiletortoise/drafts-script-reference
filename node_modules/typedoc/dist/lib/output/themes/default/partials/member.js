import { classNames, getDisplayName, wbr } from "../../lib.js";
import { JSX } from "#utils";
import {} from "../../../../models/index.js";
import { anchorIcon } from "./anchor-icon.js";
export function member(context, props) {
    const anchor = context.getAnchor(props);
    context.page.pageHeadings.push({
        link: `#${anchor}`,
        text: getDisplayName(props),
        kind: props.kind,
        classes: context.getReflectionClasses(props),
    });
    // With the default url derivation, we'll never hit this case as documents are always placed into their
    // own pages. Handle it here in case someone creates a custom url scheme which embeds guides within the page.
    if (props.isDocument()) {
        return (JSX.createElement("section", { class: classNames({ "tsd-panel": true, "tsd-member": true }, context.getReflectionClasses(props)) },
            !!props.name && (JSX.createElement("h3", { class: "tsd-anchor-link", id: anchor },
                context.reflectionFlags(props),
                JSX.createElement("span", { class: classNames({ deprecated: props.isDeprecated() }) }, wbr(props.name)),
                anchorIcon(context, anchor))),
            JSX.createElement("div", { class: "tsd-comment tsd-typography" },
                JSX.createElement(JSX.Raw, { html: context.markdown(props.content) }))));
    }
    return (JSX.createElement("section", { class: classNames({ "tsd-panel": true, "tsd-member": true }, context.getReflectionClasses(props)) },
        !!props.name && (JSX.createElement("h3", { class: "tsd-anchor-link", id: anchor },
            context.reflectionFlags(props),
            JSX.createElement("span", { class: classNames({ deprecated: props.isDeprecated() }) }, wbr(props.name)),
            anchorIcon(context, anchor))),
        props.signatures
            ? context.memberSignatures(props)
            : props.hasGetterOrSetter()
                ? context.memberGetterSetter(props)
                : context.memberDeclaration(props),
        props.groups?.map((item) => item.children.map((item) => !context.router.hasOwnDocument(item) && context.member(item)))));
}
