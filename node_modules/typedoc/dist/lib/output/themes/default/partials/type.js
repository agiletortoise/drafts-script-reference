import { FormattedCodeBuilder, FormattedCodeGenerator, Wrap } from "../../../formatter.js";
import { TypeContext } from "../../../../models/types.js";
export function type(context, type, options = { topLevelLinks: false }) {
    const builder = new FormattedCodeBuilder(context.router, context.model);
    const tree = builder.type(type, TypeContext.none, options);
    const generator = new FormattedCodeGenerator(context.options.getValue("typePrintWidth"));
    generator.node(tree, Wrap.Detect);
    return generator.toElement();
}
