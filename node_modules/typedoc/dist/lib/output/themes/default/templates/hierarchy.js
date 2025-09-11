import { i18n, JSX } from "#utils";
import { getHierarchyRoots } from "../../lib.js";
function fullHierarchy(context, root, seen) {
    if (seen.has(root)) {
        return (JSX.createElement("li", { "data-refl": root.id },
            JSX.createElement("a", { href: context.urlTo(root) },
                context.reflectionIcon(root),
                root.name)));
    }
    seen.add(root);
    const children = [];
    for (const child of [...(root.implementedBy || []), ...(root.extendedBy || [])]) {
        if (child.reflection) {
            children.push(fullHierarchy(context, child.reflection, seen));
        }
    }
    // Note: We don't use root.anchor for the anchor, because those are built on a per page basis.
    // And classes/interfaces get their own page, so all the anchors will be empty anyways.
    // Full name should be safe here, since this list only includes classes/interfaces.
    return (JSX.createElement("li", { "data-refl": root.id, id: root.getFullName() },
        JSX.createElement("a", { href: context.urlTo(root) },
            context.reflectionIcon(root),
            root.name),
        !!children.length && JSX.createElement("ul", null, children)));
}
export function hierarchyTemplate(context, props) {
    const seen = new Set();
    return (JSX.createElement(JSX.Fragment, null,
        JSX.createElement("h2", null, i18n.theme_hierarchy_summary()),
        getHierarchyRoots(props.project).map((root) => (JSX.createElement("ul", { class: "tsd-full-hierarchy" }, fullHierarchy(context, root, seen))))));
}
