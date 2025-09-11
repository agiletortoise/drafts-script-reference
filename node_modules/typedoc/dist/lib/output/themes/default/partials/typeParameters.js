import { i18n, JSX } from "#utils";
import { anchorTargetIfPresent } from "./anchor-icon.js";
export function typeParameters(context, typeParameters) {
    return (JSX.createElement(JSX.Fragment, null,
        JSX.createElement("section", { class: "tsd-panel" },
            JSX.createElement("h4", null, i18n.kind_plural_type_parameter()),
            JSX.createElement("ul", { class: "tsd-type-parameter-list" }, typeParameters.map((item) => (JSX.createElement("li", null,
                JSX.createElement("span", { id: anchorTargetIfPresent(context, item) },
                    item.flags.isConst && (JSX.createElement(JSX.Fragment, null,
                        JSX.createElement("span", { class: "tsd-signature-keyword" }, "const"),
                        " ")),
                    item.varianceModifier && (JSX.createElement(JSX.Fragment, null,
                        JSX.createElement("span", { class: "tsd-signature-keyword" }, item.varianceModifier),
                        " ")),
                    JSX.createElement("span", { class: "tsd-kind-type-parameter" }, item.name),
                    !!item.type && (JSX.createElement(JSX.Fragment, null,
                        " ",
                        JSX.createElement("span", { class: "tsd-signature-keyword" }, "extends"),
                        " ",
                        context.type(item.type))),
                    !!item.default && (JSX.createElement(JSX.Fragment, null,
                        " = ",
                        context.type(item.default)))),
                context.commentSummary(item),
                context.commentTags(item))))))));
}
