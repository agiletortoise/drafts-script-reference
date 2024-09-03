"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberDeclaration = memberDeclaration;
const utils_1 = require("../../../../utils");
const lib_1 = require("../../lib");
function renderingTypeDeclarationIsUseful(declaration) {
    if (declaration.hasComment())
        return true;
    if (declaration.children?.some(renderingTypeDeclarationIsUseful))
        return true;
    if (declaration.type?.type === "reflection" && renderingTypeDeclarationIsUseful(declaration.type.declaration)) {
        return true;
    }
    return declaration.getAllSignatures().some((sig) => {
        return sig.hasComment() || sig.parameters?.some((p) => p.hasComment());
    });
}
function memberDeclaration(context, props) {
    function renderTypeDeclaration(type) {
        if (renderingTypeDeclarationIsUseful(type.declaration)) {
            return (utils_1.JSX.createElement("div", { class: "tsd-type-declaration" },
                utils_1.JSX.createElement("h4", null, context.i18n.theme_type_declaration()),
                context.parameter(type.declaration)));
        }
    }
    const visitor = { reflection: renderTypeDeclaration };
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        utils_1.JSX.createElement("div", { class: "tsd-signature" },
            utils_1.JSX.createElement("span", { class: (0, lib_1.getKindClass)(props) }, (0, lib_1.wbr)(props.name)),
            (0, lib_1.renderTypeParametersSignature)(context, props.typeParameters),
            props.type && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" },
                    !!props.flags.isOptional && "?",
                    ":"),
                " ",
                context.type(props.type))),
            !!props.defaultValue && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" },
                    " = ",
                    props.defaultValue)))),
        context.commentSummary(props),
        (0, lib_1.hasTypeParameters)(props) && context.typeParameters(props.typeParameters),
        props.type?.visit({
            reflection: renderTypeDeclaration,
            array: (arr) => arr.elementType.visit(visitor),
            intersection: (int) => int.types.map((t) => t.visit(visitor)),
            union: (union) => {
                if (union.elementSummaries) {
                    const result = [];
                    for (let i = 0; i < union.types.length; ++i) {
                        result.push(utils_1.JSX.createElement("li", null,
                            context.type(union.types[i]),
                            utils_1.JSX.createElement(utils_1.Raw, { html: context.markdown(union.elementSummaries[i]) }),
                            union.types[i].visit(visitor)));
                    }
                    return utils_1.JSX.createElement("ul", null, result);
                }
                return union.types.map((t) => t.visit(visitor));
            },
            reference: (ref) => ref.typeArguments?.map((t) => t.visit(visitor)),
            tuple: (ref) => ref.elements.map((t) => t.visit(visitor)),
        }),
        context.commentTags(props),
        context.memberSources(props)));
}
