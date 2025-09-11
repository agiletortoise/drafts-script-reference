import { i18n, JSX } from "#utils";
const isLinkedReferenceType = (type) => type.visit({
    reference: (ref) => ref.reflection !== undefined,
}) ?? false;
function hasAnyLinkedReferenceType(h) {
    if (!h)
        return false;
    if (!h.isTarget && h.types.some(isLinkedReferenceType))
        return true;
    return hasAnyLinkedReferenceType(h.next);
}
export function hierarchy(context, typeHierarchy) {
    if (!typeHierarchy)
        return;
    const summaryLink = context.options.getValue("includeHierarchySummary") && hasAnyLinkedReferenceType(typeHierarchy)
        ? (JSX.createElement(JSX.Fragment, null,
            " ",
            "(",
            JSX.createElement("a", { href: context.relativeURL("hierarchy.html") + "#" + context.model.getFullName() }, i18n.theme_hierarchy_view_summary()),
            ")"))
        : JSX.createElement(JSX.Fragment, null);
    return (JSX.createElement("section", { class: "tsd-panel tsd-hierarchy", "data-refl": context.model.id },
        JSX.createElement("h4", null,
            i18n.theme_hierarchy(),
            summaryLink),
        hierarchyList(context, typeHierarchy)));
}
function hierarchyList(context, props) {
    return (JSX.createElement("ul", { class: "tsd-hierarchy" }, props.types.map((item, i, l) => (JSX.createElement("li", { class: "tsd-hierarchy-item" },
        props.isTarget ? JSX.createElement("span", { class: "tsd-hierarchy-target" }, item.toString()) : context.type(item),
        i === l.length - 1 && !!props.next && hierarchyList(context, props.next))))));
}
