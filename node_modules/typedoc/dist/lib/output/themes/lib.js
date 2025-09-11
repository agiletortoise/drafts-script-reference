import { DeclarationReflection, ProjectReflection, ReferenceReflection, ReflectionKind, SignatureReflection, } from "../../models/index.js";
import { DefaultMap, filterMap, JSX } from "#utils";
export function stringify(data) {
    if (typeof data === "bigint") {
        return data.toString() + "n";
    }
    return JSON.stringify(data);
}
export function getDisplayName(refl) {
    let version = "";
    if ((refl instanceof DeclarationReflection || refl instanceof ProjectReflection) && refl.packageVersion) {
        version = ` - v${refl.packageVersion}`;
    }
    return `${refl.name}${version}`;
}
export function toStyleClass(str) {
    return str.replace(/(\w)([A-Z])/g, (_m, m1, m2) => m1 + "-" + m2).toLowerCase();
}
export function getKindClass(refl) {
    if (refl instanceof ReferenceReflection) {
        return getKindClass(refl.getTargetReflectionDeep());
    }
    return ReflectionKind.classString(refl.kind);
}
/**
 * Insert word break tags ``<wbr>`` into the given string.
 *
 * Breaks the given string at ``_``, ``-`` and capital letters.
 *
 * @param str The string that should be split.
 * @return The original string containing ``<wbr>`` tags where possible.
 */
export function wbr(str) {
    // Keep this in sync with the same helper in Navigation.ts
    // We use lookahead/lookbehind to indicate where the string should
    // be split without consuming a character.
    // (?<=[^A-Z])(?=[A-Z]) -- regular camel cased text
    // (?<=[A-Z])(?=[A-Z][a-z]) -- acronym
    // (?<=[_-])(?=[^_-]) -- snake
    const parts = str.split(/(?<=[^A-Z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[_-])(?=[^_-])/);
    return parts.flatMap(p => [p, JSX.createElement("wbr", null)]).slice(0, -1);
}
export function join(joiner, list, cb) {
    const result = [];
    for (const item of list) {
        if (result.length > 0) {
            result.push(joiner);
        }
        result.push(cb(item));
    }
    return JSX.createElement(JSX.Fragment, null, result);
}
export function classNames(names, extraCss) {
    const css = Object.keys(names)
        .filter((key) => names[key])
        .concat(extraCss || "")
        .join(" ")
        .trim()
        .replace(/\s+/g, " ");
    return css.length ? css : undefined;
}
export function hasTypeParameters(reflection) {
    return ((reflection instanceof DeclarationReflection || reflection instanceof SignatureReflection) &&
        reflection.typeParameters != null &&
        reflection.typeParameters.length > 0);
}
export function renderTypeParametersSignature(context, typeParameters) {
    if (!typeParameters || typeParameters.length === 0)
        return JSX.createElement(JSX.Fragment, null);
    return (JSX.createElement(JSX.Fragment, null,
        JSX.createElement("span", { class: "tsd-signature-symbol" }, "<"),
        join(JSX.createElement("span", { class: "tsd-signature-symbol" }, ", "), typeParameters, (item) => (JSX.createElement(JSX.Fragment, null,
            (item.flags.isConst || item.varianceModifier) && (JSX.createElement("span", { class: "tsd-signature-keyword" },
                item.flags.isConst && "const ",
                item.varianceModifier && `${item.varianceModifier} `)),
            JSX.createElement("span", { class: "tsd-signature-type tsd-kind-type-parameter" }, item.name),
            !!item.type && (JSX.createElement(JSX.Fragment, null,
                " ",
                JSX.createElement("span", { class: "tsd-signature-keyword" }, "extends"),
                " ",
                context.type(item.type)))))),
        JSX.createElement("span", { class: "tsd-signature-symbol" }, ">")));
}
/**
 * Renders the reflection name with an additional `?` if optional.
 */
export function renderName(refl) {
    if (refl.flags.isOptional) {
        return JSX.createElement(JSX.Fragment, null,
            wbr(refl.name),
            "?");
    }
    return wbr(refl.name);
}
// This is cached to avoid slowness with large projects.
const rootsCache = new WeakMap();
export function getHierarchyRoots(project) {
    const cached = rootsCache.get(project);
    if (cached)
        return cached;
    const allClasses = project.getReflectionsByKind(ReflectionKind.ClassOrInterface);
    const roots = allClasses.filter((refl) => {
        // If nobody extends this class, there's no possible hierarchy to display.
        if (!refl.implementedBy && !refl.extendedBy) {
            return false;
        }
        // If we don't extend anything, then we are a root
        if (!refl.implementedTypes && !refl.extendedTypes) {
            return true;
        }
        // We might still be a root, if our extended/implemented types are not included
        // in the documentation.
        const types = [...(refl.implementedTypes || []), ...(refl.extendedTypes || [])];
        return types.every((type) => !type.visit({
            reference(ref) {
                return ref.reflection !== undefined;
            },
        }));
    });
    const result = roots.sort((a, b) => a.name.localeCompare(b.name));
    rootsCache.set(project, result);
    return result;
}
export function isNoneSection(section) {
    return section.title.toLocaleLowerCase() === "none";
}
function sortNoneSectionFirst(a, b) {
    if (isNoneSection(a)) {
        return -1;
    }
    if (isNoneSection(b)) {
        return 1;
    }
    return 0;
}
export function getMemberSections(parent, childFilter = () => true) {
    if (parent.categories?.length) {
        return filterMap(parent.categories, (cat) => {
            const children = cat.children.filter(childFilter);
            if (!children.length)
                return;
            return {
                title: cat.title,
                description: cat.description,
                children,
            };
        }).sort(sortNoneSectionFirst);
    }
    if (parent.groups?.length) {
        return parent.groups.flatMap((group) => {
            if (group.categories?.length) {
                return filterMap(group.categories.slice().sort(sortNoneSectionFirst), (cat) => {
                    const children = cat.children.filter(childFilter);
                    if (!children.length)
                        return;
                    return {
                        title: isNoneSection(cat) ? group.title : `${group.title} - ${cat.title}`,
                        description: cat.description,
                        children,
                    };
                });
            }
            const children = group.children.filter(childFilter);
            if (!children.length)
                return [];
            return {
                title: group.title,
                description: group.description,
                children,
            };
        }).sort(sortNoneSectionFirst);
    }
    if (parent.children?.length) {
        return [{
                title: "none",
                children: parent.children || [],
            }];
    }
    return [];
}
const nameCollisionCache = new WeakMap();
function getNameCollisionCount(project, name) {
    let collisions = nameCollisionCache.get(project);
    if (collisions === undefined) {
        collisions = new DefaultMap(() => 0);
        for (const reflection of project.getReflectionsByKind(ReflectionKind.SomeExport)) {
            collisions.set(reflection.name, collisions.get(reflection.name) + 1);
        }
        nameCollisionCache.set(project, collisions);
    }
    return collisions.get(name);
}
function getNamespacedPath(reflection) {
    const path = [reflection];
    let parent = reflection.parent;
    while (parent?.kindOf(ReflectionKind.Namespace)) {
        path.unshift(parent);
        parent = parent.parent;
    }
    return path;
}
/**
 * Returns a (hopefully) globally unique path for the given reflection.
 *
 * This only works for exportable symbols, so e.g. methods are not affected by this.
 *
 * If the given reflection has a globally unique name already, then it will be returned as is. If the name is
 * ambiguous (i.e. there are two classes with the same name in different namespaces), then the namespaces path of the
 * reflection will be returned.
 */
export function getUniquePath(reflection) {
    if (reflection.kindOf(ReflectionKind.SomeExport)) {
        if (getNameCollisionCount(reflection.project, reflection.name) >= 2) {
            return getNamespacedPath(reflection);
        }
    }
    return [reflection];
}
