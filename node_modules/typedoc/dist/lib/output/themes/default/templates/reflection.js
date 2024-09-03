"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reflectionTemplate = reflectionTemplate;
const lib_1 = require("../../lib");
const models_1 = require("../../../../models");
const utils_1 = require("../../../../utils");
function reflectionTemplate(context, props) {
    if (props.model.kindOf(models_1.ReflectionKind.TypeAlias | models_1.ReflectionKind.Variable) &&
        props.model instanceof models_1.DeclarationReflection) {
        return context.memberDeclaration(props.model);
    }
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        props.model.hasComment() && (utils_1.JSX.createElement("section", { class: "tsd-panel tsd-comment" },
            context.commentSummary(props.model),
            context.commentTags(props.model))),
        props.model instanceof models_1.DeclarationReflection &&
            props.model.kind === models_1.ReflectionKind.Module &&
            props.model.readme?.length && (utils_1.JSX.createElement("section", { class: "tsd-panel tsd-typography" },
            utils_1.JSX.createElement(utils_1.Raw, { html: context.markdown(props.model.readme) }))),
        context.reflectionPreview(props.model),
        (0, lib_1.hasTypeParameters)(props.model) && utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            " ",
            context.typeParameters(props.model.typeParameters),
            " "),
        props.model instanceof models_1.DeclarationReflection && (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            context.hierarchy(props.model.typeHierarchy),
            !!props.model.implementedTypes && (utils_1.JSX.createElement("section", { class: "tsd-panel" },
                utils_1.JSX.createElement("h4", null, context.i18n.theme_implements()),
                utils_1.JSX.createElement("ul", { class: "tsd-hierarchy" }, props.model.implementedTypes.map((item) => (utils_1.JSX.createElement("li", null, context.type(item))))))),
            !!props.model.implementedBy && (utils_1.JSX.createElement("section", { class: "tsd-panel" },
                utils_1.JSX.createElement("h4", null, context.i18n.theme_implemented_by()),
                utils_1.JSX.createElement("ul", { class: "tsd-hierarchy" }, props.model.implementedBy.map((item) => (utils_1.JSX.createElement("li", null, context.type(item))))))),
            !!props.model.signatures?.length && (utils_1.JSX.createElement("section", { class: "tsd-panel" }, context.memberSignatures(props.model))),
            !!props.model.indexSignatures?.length && (utils_1.JSX.createElement("section", { class: (0, lib_1.classNames)({ "tsd-panel": true }, context.getReflectionClasses(props.model)) },
                utils_1.JSX.createElement("h4", { class: "tsd-before-signature" }, context.i18n.theme_indexable()),
                utils_1.JSX.createElement("ul", { class: "tsd-signatures" }, props.model.indexSignatures.map((index) => renderIndexSignature(context, index))))),
            !props.model.signatures && context.memberSources(props.model))),
        !!props.model.children?.length && context.index(props.model),
        context.members(props.model)));
}
function renderIndexSignature(context, index) {
    return (utils_1.JSX.createElement("li", { class: "tsd-index-signature" },
        utils_1.JSX.createElement("div", { class: "tsd-signature" },
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "["),
            index.parameters.map((item) => (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
                utils_1.JSX.createElement("span", { class: (0, lib_1.getKindClass)(item) }, item.name),
                ": ",
                context.type(item.type)))),
            utils_1.JSX.createElement("span", { class: "tsd-signature-symbol" }, "]: "),
            context.type(index.type)),
        context.commentSummary(index),
        context.commentTags(index),
        index.type instanceof models_1.ReflectionType && context.parameter(index.type.declaration)));
}
