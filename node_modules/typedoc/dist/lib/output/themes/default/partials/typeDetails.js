import { Comment, Reflection, ReflectionKind, } from "../../../../models/index.js";
import { assert, i18n, JSX } from "#utils";
import { classNames, getKindClass } from "../../lib.js";
import { anchorTargetIfPresent } from "./anchor-icon.js";
function renderingTypeDetailsIsUseful(container, type) {
    const isUsefulVisitor = {
        array(type) {
            return renderingTypeDetailsIsUseful(container, type.elementType);
        },
        intersection(type) {
            return type.types.some(t => renderingTypeDetailsIsUseful(container, t));
        },
        union(type) {
            return !!type.elementSummaries || type.types.some(t => renderingTypeDetailsIsUseful(container, t));
        },
        reflection(type) {
            return renderingChildIsUseful(type.declaration);
        },
        reference(type) {
            return shouldExpandReference(container, type);
        },
    };
    return type.visit(isUsefulVisitor) ?? false;
}
export function typeDeclaration(context, reflectionOwningType, type) {
    assert(reflectionOwningType instanceof Reflection, "typeDeclaration(reflectionOwningType, type) called incorrectly");
    if (renderingTypeDetailsIsUseful(reflectionOwningType, type)) {
        return (JSX.createElement("div", { class: "tsd-type-declaration" },
            JSX.createElement("h4", null, i18n.theme_type_declaration()),
            context.typeDetails(reflectionOwningType, type, true)));
    }
    return null;
}
const expandTypeCache = new WeakMap();
function getExpandTypeInfo(refl) {
    const cache = expandTypeCache.get(refl);
    if (cache)
        return cache;
    const expandType = new Set();
    const preventExpand = new Set();
    if (!refl.isProject()) {
        const info = getExpandTypeInfo(refl.parent);
        for (const item of info.expandType) {
            expandType.add(item);
        }
        for (const item of info.preventExpand) {
            preventExpand.add(item);
        }
    }
    for (const tag of refl.comment?.blockTags || []) {
        if (tag.tag === "@expandType") {
            const name = Comment.combineDisplayParts(tag.content);
            expandType.add(name);
            preventExpand.delete(name);
        }
        else if (tag.tag === "@preventExpand") {
            const name = Comment.combineDisplayParts(tag.content);
            preventExpand.add(name);
            expandType.delete(name);
        }
    }
    expandTypeCache.set(refl, { expandType, preventExpand });
    return { expandType, preventExpand };
}
const expanded = new Set();
function shouldExpandReference(container, reference) {
    const target = reference.reflection;
    if (!target) {
        // If it doesn't exist, expand only if there are specific properties
        // which the user annotated. Assume they know what they're doing.
        return reference.highlightedProperties !== undefined;
    }
    // Prevent expansion of non-types
    if (!target.kindOf(ReflectionKind.TypeAlias | ReflectionKind.Interface))
        return false;
    // Prevent recursive expand
    if (expanded.has(target))
        return false;
    const info = getExpandTypeInfo(container);
    // Expand if the user explicitly requested it with @param or @expand
    if (reference.highlightedProperties || target.comment?.hasModifier("@expand") || info.expandType.has(target.name)) {
        return !info.preventExpand.has(target.name);
    }
    return false;
}
export function typeDetails(context, reflectionOwningType, type, renderAnchors) {
    return typeDetailsImpl(context, reflectionOwningType, type, renderAnchors);
}
export function typeDetailsImpl(context, reflectionOwningType, type, renderAnchors, highlighted) {
    const result = type.visit({
        array(type) {
            return context.typeDetails(reflectionOwningType, type.elementType, renderAnchors);
        },
        intersection(type) {
            return type.types.map((t) => context.typeDetails(reflectionOwningType, t, renderAnchors));
        },
        union(type) {
            const result = [];
            for (let i = 0; i < type.types.length; ++i) {
                result.push(JSX.createElement("li", null,
                    context.type(type.types[i]),
                    context.displayParts(type.elementSummaries?.[i]),
                    context.typeDetailsIfUseful(reflectionOwningType, type.types[i])));
            }
            return JSX.createElement("ul", null, result);
        },
        reflection(type) {
            const declaration = type.declaration;
            if (highlighted) {
                return highlightedDeclarationDetails(context, declaration, renderAnchors, highlighted);
            }
            return declarationDetails(context, declaration, renderAnchors);
        },
        reference(reference) {
            if (shouldExpandReference(reflectionOwningType, reference)) {
                const target = reference.reflection;
                if (!target?.isDeclaration()) {
                    return highlightedPropertyDetails(context, reference.highlightedProperties);
                }
                // Ensure we don't go into an infinite loop here
                expanded.add(target);
                const details = target.type
                    ? context.typeDetails(reflectionOwningType, target.type, renderAnchors)
                    : declarationDetails(context, target, renderAnchors);
                expanded.delete(target);
                return details;
            }
        },
        // tuple??
    });
    if (!result && highlighted) {
        return highlightedPropertyDetails(context, highlighted);
    }
    return result;
}
export function typeDetailsIfUseful(context, reflectionOwningType, type) {
    assert(reflectionOwningType instanceof Reflection, "typeDetailsIfUseful(reflectionOwningType, type) called incorrectly");
    if (type && renderingTypeDetailsIsUseful(reflectionOwningType, type)) {
        return context.typeDetails(reflectionOwningType, type, false);
    }
}
function highlightedPropertyDetails(context, highlighted) {
    if (!highlighted?.size)
        return;
    return (JSX.createElement("ul", { class: "tsd-parameters" }, Array.from(highlighted.entries(), ([name, parts]) => {
        return (JSX.createElement("li", { class: "tsd-parameter" },
            JSX.createElement("h5", null,
                JSX.createElement("span", null, name)),
            context.displayParts(parts)));
    })));
}
function highlightedDeclarationDetails(context, declaration, renderAnchors, highlightedProperties) {
    return (JSX.createElement("ul", { class: "tsd-parameters" }, declaration
        .getProperties()
        ?.map((child) => highlightedProperties?.has(child.name) &&
        renderChild(context, child, renderAnchors, highlightedProperties.get(child.name)))));
}
function declarationDetails(context, declaration, renderAnchors) {
    return (JSX.createElement(JSX.Fragment, null,
        context.commentSummary(declaration),
        JSX.createElement("ul", { class: "tsd-parameters" },
            declaration.signatures && (JSX.createElement("li", { class: "tsd-parameter-signature" },
                JSX.createElement("ul", { class: classNames({ "tsd-signatures": true }, context.getReflectionClasses(declaration)) }, declaration.signatures.map((item) => {
                    const anchor = context.router.hasUrl(item) ? context.getAnchor(item) : undefined;
                    return (JSX.createElement(JSX.Fragment, null,
                        JSX.createElement("li", { class: "tsd-signature", id: anchor }, context.memberSignatureTitle(item, {
                            hideName: true,
                        })),
                        JSX.createElement("li", { class: "tsd-description" }, context.memberSignatureBody(item, {
                            hideSources: true,
                        }))));
                })))),
            declaration.indexSignatures?.map((index) => renderIndexSignature(context, index)),
            declaration.getProperties()?.map((child) => renderChild(context, child, renderAnchors)))));
}
function renderChild(context, child, renderAnchors, highlight) {
    if (child.signatures) {
        return (JSX.createElement("li", { class: "tsd-parameter" },
            JSX.createElement("h5", { id: anchorTargetIfPresent(context, child) },
                !!child.flags.isRest && JSX.createElement("span", { class: "tsd-signature-symbol" }, "..."),
                JSX.createElement("span", { class: getKindClass(child) }, child.name),
                JSX.createElement("span", { class: "tsd-signature-symbol" },
                    !!child.flags.isOptional && "?",
                    ":"),
                " function"),
            context.memberSignatures(child)));
    }
    function highlightOrComment(refl) {
        if (highlight) {
            return context.displayParts(highlight);
        }
        return (JSX.createElement(JSX.Fragment, null,
            context.commentSummary(refl),
            context.commentTags(refl)));
    }
    // standard type
    if (child.type) {
        return (JSX.createElement("li", { class: "tsd-parameter" },
            JSX.createElement("h5", { id: anchorTargetIfPresent(context, child) },
                context.reflectionFlags(child),
                !!child.flags.isRest && JSX.createElement("span", { class: "tsd-signature-symbol" }, "..."),
                JSX.createElement("span", { class: getKindClass(child) }, child.name),
                JSX.createElement("span", { class: "tsd-signature-symbol" },
                    !!child.flags.isOptional && "?",
                    ": "),
                context.type(child.type)),
            highlightOrComment(child),
            child.getProperties().some(renderingChildIsUseful) && (JSX.createElement("ul", { class: "tsd-parameters" }, child.getProperties().map((c) => renderChild(context, c, renderAnchors))))));
    }
    // getter/setter
    return (JSX.createElement(JSX.Fragment, null,
        child.getSignature && (JSX.createElement("li", { class: "tsd-parameter" },
            JSX.createElement("h5", { id: anchorTargetIfPresent(context, child) },
                context.reflectionFlags(child.getSignature),
                JSX.createElement("span", { class: "tsd-signature-keyword" }, "get"),
                " ",
                JSX.createElement("span", { class: getKindClass(child) }, child.name),
                JSX.createElement("span", { class: "tsd-signature-symbol" }, "():"),
                " ",
                context.type(child.getSignature.type)),
            highlightOrComment(child.getSignature))),
        child.setSignature && (JSX.createElement("li", { class: "tsd-parameter" },
            JSX.createElement("h5", { id: !child.getSignature ? anchorTargetIfPresent(context, child) : undefined },
                context.reflectionFlags(child.setSignature),
                JSX.createElement("span", { class: "tsd-signature-keyword" }, "set"),
                " ",
                JSX.createElement("span", { class: getKindClass(child) }, child.name),
                JSX.createElement("span", { class: "tsd-signature-symbol" }, "("),
                child.setSignature.parameters?.map((item) => (JSX.createElement(JSX.Fragment, null,
                    item.name,
                    JSX.createElement("span", { class: "tsd-signature-symbol" }, ":"),
                    " ",
                    context.type(item.type)))),
                JSX.createElement("span", { class: "tsd-signature-symbol" }, "):"),
                " ",
                context.type(child.setSignature.type)),
            highlightOrComment(child.setSignature)))));
}
function renderIndexSignature(context, index) {
    return (JSX.createElement("li", { class: "tsd-parameter-index-signature" },
        JSX.createElement("h5", null,
            index.flags.isReadonly && (JSX.createElement(JSX.Fragment, null,
                JSX.createElement("span", { class: "tsd-signature-keyword" }, "readonly"),
                " ")),
            JSX.createElement("span", { class: "tsd-signature-symbol" }, "["),
            index.parameters.map((item) => (JSX.createElement(JSX.Fragment, null,
                JSX.createElement("span", { class: getKindClass(item) }, item.name),
                ": ",
                context.type(item.type)))),
            JSX.createElement("span", { class: "tsd-signature-symbol" }, "]:"),
            " ",
            context.type(index.type)),
        context.commentSummary(index),
        context.commentTags(index),
        context.typeDeclaration(index, index.type)));
}
function renderingChildIsUseful(refl) {
    // Object types directly under a variable/type alias will always be considered useful.
    // This probably isn't ideal, but it is an easy thing to check when assigning URLs
    // in the default theme, so we'll make the assumption that those properties ought to always
    // be rendered.
    // This should be kept in sync with the DefaultTheme.applyAnchorUrl function.
    if (refl.kindOf(ReflectionKind.TypeLiteral) &&
        refl.parent?.kindOf(ReflectionKind.SomeExport) &&
        refl.parent.type?.type === "reflection") {
        return true;
    }
    if (renderingThisChildIsUseful(refl)) {
        return true;
    }
    return refl.getProperties().some(renderingThisChildIsUseful);
}
function renderingThisChildIsUseful(refl) {
    if (refl.hasComment())
        return true;
    const declaration = refl.type?.type === "reflection" ? refl.type.declaration : refl;
    if (declaration.hasComment())
        return true;
    return declaration.getAllSignatures().some((sig) => {
        return sig.hasComment() || sig.parameters?.some((p) => p.hasComment());
    });
}
