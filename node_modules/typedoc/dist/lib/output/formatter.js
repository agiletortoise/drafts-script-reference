// Heavily based on https://yorickpeterse.com/articles/how-to-write-a-code-formatter/
// Implements roughly the same algorithm as Prettier
import { ok } from "assert";
import { LiteralType, ReferenceType, TypeContext } from "../models/types.js";
import { aggregate, assertNever, JSX } from "#utils";
import { getKindClass, getUniquePath, stringify } from "./themes/lib.js";
import { ReflectionKind, } from "../models/index.js";
// Non breaking space
const INDENT = "\u00A0\u00A0\u00A0\u00A0";
const emptyNode = textNode("");
function space() {
    return textNode(" ");
}
function textNode(content) {
    return { type: "text", content };
}
function simpleElement(element) {
    ok(element.children.length === 1);
    ok(typeof element.children[0] === "string");
    return {
        type: "element",
        content: element,
        length: element.children[0].length,
    };
}
function line() {
    return { type: "line" };
}
function spaceOrLine() {
    return { type: "space_or_line" };
}
function indent(content) {
    return { type: "indent", content };
}
function group(id, content) {
    return { type: "group", id, content };
}
function nodes(...content) {
    return { type: "nodes", content };
}
function ifWrap(id, trueBranch, falseBranch = emptyNode) {
    return { type: "if_wrap", id, true: trueBranch, false: falseBranch };
}
function join(joiner, list, cb) {
    const content = [];
    for (const item of list) {
        if (content.length > 0) {
            content.push(joiner);
        }
        content.push(cb(item));
    }
    return { type: "nodes", content };
}
function nodeWidth(node, wrapped) {
    switch (node.type) {
        case "text":
            return node.content.length;
        case "element":
            return node.length;
        case "line":
            return 0;
        case "space_or_line":
            return 1;
        case "indent":
        case "group":
        case "nodes":
            return aggregate(node.content, (n) => nodeWidth(n, wrapped));
        case "if_wrap":
            return wrapped.has(node.id)
                ? nodeWidth(node.true, wrapped)
                : nodeWidth(node.false, wrapped);
    }
}
export var Wrap;
(function (Wrap) {
    Wrap[Wrap["Detect"] = 0] = "Detect";
    Wrap[Wrap["Enable"] = 1] = "Enable";
})(Wrap || (Wrap = {}));
/**
 * Responsible for rendering nodes
 */
export class FormattedCodeGenerator {
    buffer = [];
    /** Indentation level, not number of chars */
    indent = 0;
    /** The number of characters on the current line */
    size;
    /** Maximum number of characters allowed per line */
    max;
    /** Groups which need to be wrapped */
    wrapped = new Set();
    constructor(maxWidth = 80, startWidth = 0) {
        this.max = maxWidth;
        this.size = startWidth;
    }
    forceWrap(wrapped) {
        for (const id of wrapped) {
            this.wrapped.add(id);
        }
    }
    toElement() {
        return JSX.createElement(JSX.Fragment, null, this.buffer);
    }
    node(node, wrap) {
        switch (node.type) {
            case "nodes": {
                for (const n of node.content) {
                    this.node(n, wrap);
                }
                break;
            }
            case "group": {
                const width = aggregate(node.content, (n) => nodeWidth(n, this.wrapped));
                let wrap;
                if (this.size + width > this.max || this.wrapped.has(node.id)) {
                    this.wrapped.add(node.id);
                    wrap = Wrap.Enable;
                }
                else {
                    wrap = Wrap.Detect;
                }
                for (const n of node.content) {
                    this.node(n, wrap);
                }
                break;
            }
            case "if_wrap": {
                if (this.wrapped.has(node.id)) {
                    this.node(node.true, Wrap.Enable);
                }
                else {
                    this.node(node.false, wrap);
                }
                break;
            }
            case "text": {
                this.text(node.content, node.content.length);
                break;
            }
            case "element": {
                this.text(node.content, node.length);
                break;
            }
            case "line": {
                if (wrap == Wrap.Enable) {
                    this.newLine();
                }
                break;
            }
            case "space_or_line": {
                if (wrap === Wrap.Enable) {
                    this.newLine();
                }
                else {
                    this.text(" ", 1);
                }
                break;
            }
            case "indent": {
                if (wrap === Wrap.Enable) {
                    this.size += INDENT.length;
                    this.indent += 1;
                    this.buffer.push(INDENT);
                    for (const n of node.content) {
                        this.node(n, wrap);
                    }
                    this.indent -= 1;
                }
                else {
                    for (const n of node.content) {
                        this.node(n, wrap);
                    }
                }
                break;
            }
            default:
                assertNever(node);
        }
    }
    text(value, chars) {
        this.size += chars;
        this.buffer.push(value);
    }
    newLine() {
        this.size = INDENT.length + this.indent;
        const last = this.buffer[this.buffer.length - 1];
        if (typeof last === "string") {
            this.buffer[this.buffer.length - 1] = last.trimEnd();
        }
        this.buffer.push(JSX.createElement("br", null));
        this.buffer.push(INDENT.repeat(this.indent));
    }
}
const typeBuilder = {
    array(type, builder) {
        return nodes(builder.type(type.elementType, TypeContext.arrayElement), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "[]")));
    },
    conditional(type, builder) {
        const id = builder.newId();
        return group(id, [
            builder.type(type.checkType, TypeContext.conditionalCheck),
            space(),
            simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "extends")),
            space(),
            builder.type(type.extendsType, TypeContext.conditionalExtends),
            spaceOrLine(),
            indent([
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "?")),
                space(),
                builder.type(type.trueType, TypeContext.conditionalTrue),
                spaceOrLine(),
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ":")),
                space(),
                builder.type(type.falseType, TypeContext.conditionalFalse),
            ]),
        ]);
    },
    indexedAccess(type, builder) {
        let indexType = builder.type(type.indexType, TypeContext.indexedIndex);
        if (type.objectType instanceof ReferenceType &&
            type.objectType.reflection &&
            type.indexType instanceof LiteralType &&
            typeof type.indexType.value === "string") {
            const childReflection = type.objectType.reflection.getChildByName([
                type.indexType.value,
            ]);
            if (childReflection) {
                const displayed = stringify(type.indexType.value);
                if (builder.router.hasUrl(childReflection)) {
                    indexType = {
                        type: "element",
                        content: (JSX.createElement("a", { href: builder.urlTo(childReflection) },
                            JSX.createElement("span", { class: "tsd-signature-type" }, displayed))),
                        length: displayed.length,
                    };
                }
                else {
                    indexType = {
                        type: "element",
                        content: JSX.createElement("span", { class: "tsd-signature-type" }, displayed),
                        length: displayed.length,
                    };
                }
            }
        }
        return nodes(builder.type(type.objectType, TypeContext.indexedObject), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "[")), indexType, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "]")));
    },
    inferred(type, builder) {
        const simple = nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "infer")), space(), simpleElement(JSX.createElement("span", { class: "tsd-kind-type-parameter" }, type.name)));
        if (type.constraint) {
            const id = builder.newId();
            return group(id, [
                simple,
                space(),
                simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "extends")),
                spaceOrLine(),
                indent([
                    builder.type(type.constraint, TypeContext.inferredConstraint),
                ]),
            ]);
        }
        return simple;
    },
    intersection(type, builder) {
        // Prettier doesn't do smart wrapping here like we do with unions
        // so... TypeDoc won't either, at least for now.
        return join(nodes(space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "&")), space()), type.types, (type) => builder.type(type, TypeContext.intersectionElement));
    },
    intrinsic(type) {
        return simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, type.name));
    },
    literal(type) {
        return simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, stringify(type.value)));
    },
    mapped(type, builder) {
        const parts = [];
        switch (type.readonlyModifier) {
            case "+":
                parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "readonly")), space());
                break;
            case "-":
                parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "-")), simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "readonly")), space());
                break;
        }
        parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "[")), simpleElement(JSX.createElement("span", { class: "tsd-kind-type-parameter" }, type.parameter)), space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "in")), space(), builder.type(type.parameterType, TypeContext.mappedParameter));
        if (type.nameType) {
            parts.push(space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "as")), space(), builder.type(type.nameType, TypeContext.mappedName));
        }
        parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "]")));
        switch (type.optionalModifier) {
            case "+":
                parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "?:")));
                break;
            case "-":
                parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "-?:")));
                break;
            default:
                parts.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ":")));
        }
        parts.push(space(), builder.type(type.templateType, TypeContext.mappedTemplate));
        return group(builder.newId(), [
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "{")),
            spaceOrLine(),
            indent(parts),
            spaceOrLine(),
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "}")),
        ]);
    },
    namedTupleMember(type, builder) {
        return nodes(textNode(type.name), type.isOptional
            ? simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "?:"))
            : simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ":")), space(), builder.type(type.element, TypeContext.none));
    },
    optional(type, builder) {
        return nodes(builder.type(type.elementType, TypeContext.optionalElement), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "?")));
    },
    predicate(type, builder) {
        const content = [];
        if (type.asserts) {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "asserts")), space());
        }
        content.push(simpleElement(JSX.createElement("span", { class: "tsd-kind-parameter" }, type.name)));
        if (type.targetType) {
            content.push(space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "is")), space(), builder.type(type.targetType, TypeContext.predicateTarget));
        }
        return nodes(...content);
    },
    query(type, builder) {
        return nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "typeof")), space(), builder.type(type.queryType, TypeContext.queryTypeTarget));
    },
    reference(type, builder) {
        const reflection = type.reflection;
        let name;
        if (reflection) {
            if (reflection.kindOf(ReflectionKind.TypeParameter)) {
                if (builder.router.hasUrl(reflection)) {
                    name = simpleElement(JSX.createElement("a", { class: "tsd-signature-type tsd-kind-type-parameter", href: builder.urlTo(reflection) }, reflection.name));
                }
                else {
                    name = simpleElement(JSX.createElement("span", { class: "tsd-signature-type tsd-kind-type-parameter" }, reflection.name));
                }
            }
            else {
                name = join(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ".")), getUniquePath(reflection), (item) => {
                    if (builder.router.hasUrl(item)) {
                        return simpleElement(JSX.createElement("a", { href: builder.urlTo(item), class: "tsd-signature-type " +
                                getKindClass(item) }, item.name));
                    }
                    return simpleElement(JSX.createElement("span", { class: "tsd-signature-type " + getKindClass(item) }, item.name));
                });
            }
        }
        else if (type.externalUrl) {
            if (type.externalUrl === "#") {
                name = simpleElement(JSX.createElement("span", { class: "tsd-signature-type external" }, type.name));
            }
            else {
                name = simpleElement(JSX.createElement("a", { href: type.externalUrl, class: "tsd-signature-type external", target: "_blank" }, type.name));
            }
        }
        else if (type.refersToTypeParameter) {
            name = simpleElement(JSX.createElement("span", { class: "tsd-signature-type tsd-kind-type-parameter" }, type.name));
        }
        else {
            name = simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, type.name));
        }
        if (type.typeArguments?.length) {
            const id = builder.newId();
            return group(id, [
                name,
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "<")),
                line(),
                indent([
                    join(nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ",")), spaceOrLine()), type.typeArguments, (item) => builder.type(item, TypeContext.referenceTypeArgument)),
                    ifWrap(id, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ","))),
                ]),
                line(),
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ">")),
            ]);
        }
        return name;
    },
    reflection(type, builder, options) {
        return builder.reflection(type.declaration, options);
    },
    rest(type, builder) {
        return nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "...")), builder.type(type.elementType, TypeContext.restElement));
    },
    templateLiteral(type, builder) {
        const content = [];
        content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "`")));
        if (type.head) {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, type.head)));
        }
        for (const item of type.tail) {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "${")), builder.type(item[0], TypeContext.templateLiteralElement), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "}")));
            if (item[1]) {
                content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, item[1])));
            }
        }
        content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "`")));
        return nodes(...content);
    },
    tuple(type, builder) {
        const id = builder.newId();
        return group(id, [
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "[")),
            line(),
            indent([
                join(nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ",")), spaceOrLine()), type.elements, (item) => builder.type(item, TypeContext.tupleElement)),
            ]),
            ifWrap(id, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ","))),
            line(),
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "]")),
        ]);
    },
    typeOperator(type, builder) {
        return nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, type.operator)), space(), builder.type(type.target, TypeContext.typeOperatorTarget));
    },
    union(type, builder) {
        const parentId = builder.id;
        const id = builder.newId();
        const pipe = simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "|"));
        const elements = type.types.flatMap((type, i) => [
            i == 0 ? ifWrap(id, nodes(pipe, space())) : space(),
            builder.type(type, TypeContext.unionElement),
            spaceOrLine(),
            pipe,
        ]);
        elements.pop(); // Remove last pipe
        elements.pop(); // Remove last spaceOrLine
        return group(id, [
            ifWrap(parentId, emptyNode, line()),
            ifWrap(parentId, nodes(...elements), indent(elements)),
        ]);
    },
    unknown(type) {
        return textNode(type.name);
    },
};
/**
 * Responsible for generating Nodes from a type tree.
 */
export class FormattedCodeBuilder {
    router;
    relativeReflection;
    forceWrap = new Set();
    id = 0;
    constructor(router, relativeReflection) {
        this.router = router;
        this.relativeReflection = relativeReflection;
    }
    urlTo(refl) {
        return this.router.relativeUrl(this.relativeReflection, refl);
    }
    newId() {
        return ++this.id;
    }
    type(type, where, options = { topLevelLinks: false }) {
        if (!type) {
            return simpleElement(JSX.createElement("span", { class: "tsd-signature-type" }, "any"));
        }
        if (type.needsParenthesis(where)) {
            const id = this.newId();
            return group(id, [
                textNode("("),
                line(),
                indent([type.visit(typeBuilder, this, options)]),
                line(),
                textNode(")"),
            ]);
        }
        return type.visit(typeBuilder, this, options);
    }
    reflection(reflection, options) {
        const members = [];
        const children = reflection.getProperties();
        for (const item of children) {
            this.member(members, item, options);
        }
        if (reflection.indexSignatures) {
            for (const index of reflection.indexSignatures) {
                members.push(nodes(...(index.flags.isReadonly
                    ? [
                        simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "readonly")),
                        space(),
                    ]
                    : []), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "[")), simpleElement(JSX.createElement("span", { class: getKindClass(index) }, index.parameters[0].name)), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ":")), space(), this.type(index.parameters[0].type, TypeContext.none), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "]:")), space(), this.type(index.type, TypeContext.none)));
            }
        }
        if (!members.length && reflection.signatures?.length === 1) {
            return this.signature(reflection.signatures[0], {
                hideName: true,
                arrowStyle: true,
            });
        }
        for (const item of reflection.signatures || []) {
            members.push(this.signature(item, { hideName: true }));
        }
        if (members.length) {
            const id = this.newId();
            if (options.topLevelLinks) {
                this.forceWrap.add(id);
            }
            return group(id, [
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "{")),
                spaceOrLine(),
                indent([
                    join(nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ";")), spaceOrLine()), members, (node) => node),
                ]),
                ifWrap(id, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ";"))),
                spaceOrLine(),
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "}")),
            ]);
        }
        return simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "{}"));
    }
    typeAlias(item) {
        return nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "type")), space(), simpleElement(JSX.createElement("span", { class: getKindClass(item) }, item.name)), this.typeParameters(item), space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "=")), space(), this.reflection(item, { topLevelLinks: true }));
    }
    interface(item) {
        return nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "interface")), space(), simpleElement(JSX.createElement("span", { class: getKindClass(item) }, item.name)), this.typeParameters(item), space(), this.reflection(item, { topLevelLinks: true }));
    }
    member(members, item, options) {
        if (item.getSignature && item.setSignature) {
            members.push(this.signature(item.getSignature, options), this.signature(item.setSignature, options));
            return;
        }
        if (item.getSignature) {
            members.push(this.signature(item.getSignature, options));
            return;
        }
        if (item.setSignature) {
            members.push(this.signature(item.setSignature, options));
            return;
        }
        if (item.signatures) {
            members.push(...item.signatures.map((sig) => this.signature(sig, options)));
            return;
        }
        members.push(nodes(this.propertyName(item, options), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, item.flags.isOptional ? "?:" : ":")), space(), this.type(item.type, TypeContext.none)));
    }
    signature(sig, options) {
        let name = options.hideName
            ? emptyNode
            : this.propertyName(sig, options);
        switch (sig.kind) {
            case ReflectionKind.ConstructorSignature: {
                let label = emptyNode;
                if (sig.flags.isAbstract) {
                    label = nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "abstract")), space());
                }
                label = nodes(label, simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "new")), space());
                name = nodes(label, name);
                break;
            }
            case ReflectionKind.GetSignature: {
                name = nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "get")), space(), name);
                break;
            }
            case ReflectionKind.SetSignature: {
                name = nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "set")), space(), name);
                break;
            }
        }
        const id = this.newId();
        return group(id, [
            name,
            this.typeParameters(sig),
            ...this.parameters(sig, id),
            nodes(options.arrowStyle ? space() : emptyNode, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, options.arrowStyle ? "=>" : ":")), space(), this.type(sig.type, TypeContext.none)),
        ]);
    }
    typeParameters(sig) {
        if (!sig.typeParameters?.length) {
            return emptyNode;
        }
        const id = this.newId();
        return group(id, [
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "<")),
            line(),
            indent([
                join(nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ",")), spaceOrLine()), sig.typeParameters, (item) => this.typeParameter(item)),
            ]),
            ifWrap(id, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ","))),
            line(),
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ">")),
        ]);
    }
    typeParameter(param) {
        let prefix = emptyNode;
        if (param.flags.isConst) {
            prefix = nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "const")), space());
        }
        if (param.varianceModifier) {
            prefix = nodes(prefix, simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, param.varianceModifier)), space());
        }
        const content = [prefix];
        if (this.router.hasUrl(param)) {
            content.push(simpleElement(JSX.createElement("a", { class: "tsd-signature-type tsd-kind-type-parameter", href: this.urlTo(param) }, param.name)));
        }
        else {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-type tsd-kind-type-parameter" }, param.name)));
        }
        if (param.type) {
            content.push(space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-keyword" }, "extends")), spaceOrLine(), indent([this.type(param.type, TypeContext.none)]));
        }
        if (param.default) {
            content.push(space(), simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "=")), space(), this.type(param.default, TypeContext.none));
        }
        return group(this.newId(), content);
    }
    parameters(sig, id) {
        if (!sig.parameters?.length) {
            return [
                simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "()")),
            ];
        }
        return [
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "(")),
            line(),
            indent([
                join(nodes(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ",")), spaceOrLine()), sig.parameters, (item) => this.parameter(item)),
            ]),
            ifWrap(id, simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ","))),
            line(),
            simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ")")),
        ];
    }
    parameter(param) {
        const content = [];
        if (param.flags.isRest) {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "...")));
        }
        content.push(simpleElement(JSX.createElement("span", { class: "tsd-kind-parameter" }, param.name)));
        if (param.flags.isOptional || param.defaultValue) {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, "?:")));
        }
        else {
            content.push(simpleElement(JSX.createElement("span", { class: "tsd-signature-symbol" }, ":")));
        }
        // Tricky: We don't introduce a branch here via group()
        // the branch may be introduced by the union type if the parameter
        // value is a union.
        const id = this.newId();
        content.push(ifWrap(id, emptyNode, space()));
        content.push(this.type(param.type, TypeContext.none));
        return nodes(...content);
    }
    propertyName(reflection, options) {
        const entityName = /^[A-Z_$][\w$]*$/i.test(reflection.name)
            ? reflection.name
            : JSON.stringify(reflection.name);
        if (options.topLevelLinks) {
            return simpleElement(JSX.createElement("a", { class: getKindClass(reflection), href: this.urlTo(reflection) }, entityName));
        }
        return simpleElement(JSX.createElement("span", { class: getKindClass(reflection) }, entityName));
    }
}
