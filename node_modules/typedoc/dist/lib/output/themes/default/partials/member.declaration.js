import { JSX } from "#utils";
import { FormattedCodeBuilder, FormattedCodeGenerator, Wrap } from "../../../formatter.js";
import { hasTypeParameters } from "../../lib.js";
export function memberDeclaration(context, props) {
    const builder = new FormattedCodeBuilder(context.router, context.model);
    const content = [];
    builder.member(content, props, { topLevelLinks: false });
    const generator = new FormattedCodeGenerator(context.options.getValue("typePrintWidth"));
    generator.node({ type: "nodes", content }, Wrap.Detect);
    /** Fix for #2717. If type is the same as value the default value is omitted */
    function shouldRenderDefaultValue() {
        if (props.type && props.type.type === "literal") {
            const reflectionTypeString = props.type.toString();
            const defaultValue = props.defaultValue;
            if (defaultValue === undefined || reflectionTypeString === defaultValue.toString()) {
                return false;
            }
        }
        return true;
    }
    return (JSX.createElement(JSX.Fragment, null,
        JSX.createElement("div", { class: "tsd-signature" },
            generator.toElement(),
            !!props.defaultValue && shouldRenderDefaultValue() && (JSX.createElement(JSX.Fragment, null,
                JSX.createElement("span", { class: "tsd-signature-symbol" },
                    " = ",
                    props.defaultValue)))),
        context.commentSummary(props),
        hasTypeParameters(props) && context.typeParameters(props.typeParameters),
        props.type && context.typeDeclaration(props, props.type),
        context.commentTags(props),
        context.memberSources(props)));
}
