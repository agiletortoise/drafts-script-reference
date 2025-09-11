import { i18n, JSX } from "#utils";
export function anchorIcon(context, anchor) {
    if (!anchor)
        return JSX.createElement(JSX.Fragment, null);
    return (JSX.createElement("a", { href: `#${anchor}`, "aria-label": i18n.theme_permalink(), class: "tsd-anchor-icon" }, context.icons.anchor()));
}
export function anchorTargetIfPresent(context, refl) {
    return context.router.hasUrl(refl) ? context.router.getAnchor(refl) : undefined;
}
