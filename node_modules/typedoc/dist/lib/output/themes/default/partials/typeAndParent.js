import { ArrayType, ReferenceType, SignatureReflection } from "../../../../models/index.js";
import { JSX } from "#utils";
export const typeAndParent = (context, props) => {
    if (props instanceof ArrayType) {
        return (JSX.createElement(JSX.Fragment, null,
            context.typeAndParent(props.elementType),
            "[]"));
    }
    if (props instanceof ReferenceType && props.reflection) {
        const refl = props.reflection instanceof SignatureReflection ? props.reflection.parent : props.reflection;
        const parent = refl.parent;
        return (JSX.createElement(JSX.Fragment, null,
            JSX.createElement("a", { href: context.urlTo(parent) }, parent.name),
            ".",
            JSX.createElement("a", { href: context.urlTo(refl) }, refl.name)));
    }
    return JSX.createElement(JSX.Fragment, null, props.toString());
};
