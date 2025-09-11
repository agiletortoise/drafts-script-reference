import { JSX } from "#utils";
export function breadcrumbs(context, props) {
    const path = [];
    let refl = props;
    while (refl.parent) {
        path.push(refl);
        refl = refl.parent;
    }
    return (JSX.createElement("ul", { class: "tsd-breadcrumb", "aria-label": "Breadcrumb" }, path.reverse().map((r, index) => (JSX.createElement("li", null,
        JSX.createElement("a", { href: context.urlTo(r), "aria-current": index === path.length - 1 ? "page" : undefined }, r.name))))));
}
