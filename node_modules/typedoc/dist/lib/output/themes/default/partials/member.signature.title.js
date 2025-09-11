import {} from "../../../../models/index.js";
import { FormattedCodeBuilder, FormattedCodeGenerator, Wrap } from "../../../formatter.js";
export function memberSignatureTitle(context, props, options = {}) {
    const builder = new FormattedCodeBuilder(context.router, context.model);
    const tree = builder.signature(props, options);
    const generator = new FormattedCodeGenerator(context.options.getValue("typePrintWidth"));
    generator.node(tree, Wrap.Detect);
    return generator.toElement();
}
