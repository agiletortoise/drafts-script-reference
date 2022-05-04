"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = void 0;
const models_1 = require("../../../../models");
const utils_1 = require("../../../../utils");
const lib_1 = require("../../lib");
const EXPORTABLE = models_1.ReflectionKind.Class |
    models_1.ReflectionKind.Interface |
    models_1.ReflectionKind.Enum |
    models_1.ReflectionKind.TypeAlias |
    models_1.ReflectionKind.Function |
    models_1.ReflectionKind.Variable;
const nameCollisionCache = new WeakMap();
function getNameCollisionCount(project, name) {
    var _a, _b;
    let collisions = nameCollisionCache.get(project);
    if (collisions === undefined) {
        collisions = {};
        for (const reflection of project.getReflectionsByKind(EXPORTABLE)) {
            collisions[reflection.name] = ((_a = collisions[reflection.name]) !== null && _a !== void 0 ? _a : 0) + 1;
        }
        nameCollisionCache.set(project, collisions);
    }
    return (_b = collisions[name]) !== null && _b !== void 0 ? _b : 0;
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
function getUniquePath(reflection) {
    if (reflection.kindOf(EXPORTABLE)) {
        if (getNameCollisionCount(reflection.project, reflection.name) >= 2) {
            return getNamespacedPath(reflection);
        }
    }
    return [reflection];
}
function getNamespacedPath(reflection) {
    const path = [reflection];
    let parent = reflection.parent;
    while (parent && parent.kindOf(models_1.ReflectionKind.Namespace)) {
        path.unshift(parent);
        parent = parent.parent;
    }
    return path;
}
function renderUniquePath(context, reflection) {
    return (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "."), getUniquePath(reflection), (item) => (utils_1.JSX.createElement("a", { href: context.urlTo(item), class: "tsd-signature-type", "data-tsd-kind": item.kindString }, item.name)));
}
// The type helper accepts an optional needsParens parameter that is checked
// if an inner type may result in invalid output without them. For example:
// 1 | 2[] !== (1 | 2)[]
// () => 1 | 2 !== (() => 1) | 2
const typeRenderers = {
    array(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            renderType(context, type.elementType, { needsParens: true }),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "[]")));
    },
    conditional(context, type, { needsParens }) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "("),
            renderType(context, type.checkType, { needsParens: true }),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " extends "),
            renderType(context, type.extendsType),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " ? "),
            renderType(context, type.trueType),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " : "),
            renderType(context, type.falseType),
            needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")));
    },
    indexedAccess(context, type) {
        let indexType = renderType(context, type.indexType);
        if (type.objectType instanceof models_1.ReferenceType &&
            type.objectType.reflection &&
            type.indexType instanceof models_1.LiteralType &&
            typeof type.indexType.value === "string") {
            const childReflection = type.objectType.reflection.getChildByName([type.indexType.value]);
            if (childReflection) {
                indexType = utils_1.JSX.createElement("a", { href: context.urlTo(childReflection) }, indexType);
            }
        }
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            renderType(context, type.objectType),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "["),
            indexType,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "]")));
    },
    inferred(_context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "infer "),
            " ",
            type.name));
    },
    intersection(context, type, { needsParens }) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "("),
            (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " & "), type.types, (item) => renderType(context, item, { needsParens: true })),
            needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")));
    },
    intrinsic(_context, type) {
        return utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, type.name);
    },
    literal(_context, type) {
        return utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, (0, lib_1.stringify)(type.value));
    },
    mapped(context, type) {
        const children = [];
        switch (type.readonlyModifier) {
            case "+":
                children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "readonly "));
                break;
            case "-":
                children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "-readonly "));
                break;
        }
        children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "[ "), utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, type.parameter), utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " in "), renderType(context, type.parameterType));
        if (type.nameType) {
            children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " as "), renderType(context, type.nameType));
        }
        children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "]"));
        switch (type.optionalModifier) {
            case "+":
                children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "?: "));
                break;
            case "-":
                children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "-?: "));
                break;
            default:
                children.push(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ": "));
        }
        children.push(renderType(context, type.templateType));
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "{"),
            " ",
            children,
            " ",
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "}")));
    },
    "named-tuple-member"(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            type.name,
            type.isOptional ? (utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "?: ")) : (utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ": ")),
            renderType(context, type.element)));
    },
    optional(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            renderType(context, type.elementType),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "?")));
    },
    predicate(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            !!type.asserts && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "asserts "),
            utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, type.name),
            !!type.targetType && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " is "),
                renderType(context, type.targetType)))));
    },
    query(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "typeof "),
            renderType(context, type.queryType)));
    },
    reference(context, type) {
        var _a;
        const reflection = type.reflection;
        let name;
        if (reflection) {
            if (reflection.kindOf(models_1.ReflectionKind.TypeParameter)) {
                // Don't generate a link will always point to this page, but do set the kind.
                name = (utils_1.JSX.createElement("span", { class: "tsd-signature-type", "data-tsd-kind": reflection.kindString }, reflection.name));
            }
            else {
                name = renderUniquePath(context, reflection);
            }
        }
        else {
            const externalUrl = context.attemptExternalResolution(type);
            if (externalUrl) {
                name = (utils_1.JSX.createElement("a", { href: externalUrl, class: "tsd-signature-type external", target: "_blank" }, type.name));
            }
            else {
                name = utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, type.name);
            }
        }
        if ((_a = type.typeArguments) === null || _a === void 0 ? void 0 : _a.length) {
            return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                name,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "<"),
                (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ", "), type.typeArguments, (item) => renderType(context, item)),
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ">")));
        }
        return name;
    },
    reflection(context, type, { needsParens }) {
        var _a;
        if (type.declaration.children) {
            // Object literal
            return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "{ "),
                (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "; "), type.declaration.children, (item) => {
                    var _a;
                    if (item.getSignature && item.setSignature) {
                        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                            item.name,
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ": "),
                            renderType(context, item.getSignature.type)));
                    }
                    if (item.getSignature) {
                        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "get "),
                            item.name,
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "(): "),
                            renderType(context, item.getSignature.type)));
                    }
                    if (item.setSignature) {
                        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "set "),
                            item.name,
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "("), (_a = item.setSignature.parameters) === null || _a === void 0 ? void 0 :
                            _a.map((item) => (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                                item.name,
                                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ": "),
                                renderType(context, item.type)))),
                            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")));
                    }
                    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                        item.name,
                        utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, item.flags.isOptional ? "?: " : ": "),
                        renderType(context, item.type)));
                }),
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " }")));
        }
        if (((_a = type.declaration.signatures) === null || _a === void 0 ? void 0 : _a.length) === 1) {
            return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "("),
                context.memberSignatureTitle(type.declaration.signatures[0], {
                    hideName: true,
                    arrowStyle: true,
                }),
                needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")));
        }
        if (type.declaration.signatures) {
            return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" },
                    "{",
                    " "),
                (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "; "), type.declaration.signatures, (item) => context.memberSignatureTitle(item, { hideName: true })),
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " }")));
        }
        return utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "{}");
    },
    rest(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "..."),
            renderType(context, type.elementType)));
    },
    "template-literal"(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "`"),
            type.head && utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, type.head),
            type.tail.map((item) => (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "${"),
                renderType(context, item[0]),
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "}"),
                item[1] && utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, item[1])))),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "`")));
    },
    tuple(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "["),
            (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ", "), type.elements, (item) => renderType(context, item)),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "]")));
    },
    typeOperator(context, type) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" },
                type.operator,
                " "),
            renderType(context, type.target)));
    },
    union(context, type, { needsParens }) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            !!needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "("),
            (0, lib_1.join)(utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, " | "), type.types, (item) => renderType(context, item, { needsParens: true })),
            !!needsParens && utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")));
    },
    unknown(_context, type) {
        return utils_1.JSX.createElement(utils_1.JSX.Fragment, null, type.name);
    },
};
function renderType(context, type, options) {
    if (!type) {
        return utils_1.JSX.createElement("span", { class: "tsd-signature-type" }, "any");
    }
    const renderFn = typeRenderers[type.type];
    return renderFn(context, type, options !== null && options !== void 0 ? options : {});
}
function type(context, type) {
    return renderType(context, type, {});
}
exports.type = type;
