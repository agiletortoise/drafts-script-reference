import { i18n, JSX } from "#utils";
import { hasTypeParameters } from "../../lib.js";
export function memberSignatureBody(context, props, { hideSources = false } = {}) {
    const returnsTag = props.comment?.getTag("@returns");
    return (JSX.createElement(JSX.Fragment, null,
        context.reflectionFlags(props),
        context.commentSummary(props),
        hasTypeParameters(props) && context.typeParameters(props.typeParameters),
        props.parameters && props.parameters.length > 0 && (JSX.createElement("div", { class: "tsd-parameters" },
            JSX.createElement("h4", { class: "tsd-parameters-title" }, i18n.kind_plural_parameter()),
            JSX.createElement("ul", { class: "tsd-parameter-list" }, props.parameters.map((item) => (JSX.createElement("li", null,
                JSX.createElement("span", null,
                    context.reflectionFlags(item),
                    !!item.flags.isRest && JSX.createElement("span", { class: "tsd-signature-symbol" }, "..."),
                    JSX.createElement("span", { class: "tsd-kind-parameter" }, item.name),
                    ": ",
                    context.type(item.type),
                    item.defaultValue != null && (JSX.createElement("span", { class: "tsd-signature-symbol" },
                        " = ",
                        item.defaultValue))),
                context.commentSummary(item),
                context.commentTags(item),
                context.typeDetailsIfUseful(item, item.type))))))),
        props.type && (JSX.createElement(JSX.Fragment, null,
            JSX.createElement("h4", { class: "tsd-returns-title" },
                i18n.theme_returns(),
                " ",
                context.type(props.type)),
            returnsTag && JSX.createElement(JSX.Raw, { html: context.markdown(returnsTag.content) }),
            context.typeDetailsIfUseful(props, props.type))),
        context.commentTags(props),
        !hideSources && context.memberSources(props)));
}
