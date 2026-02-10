import { ArrayType, ReferenceType, SignatureReflection } from "#models";
import { JSX } from "#utils";
export const typeAndParent = (context, props) => {
    if (props instanceof ArrayType) {
        return (JSX.createElement(JSX.Fragment, null,
            context.typeAndParent(props.elementType),
            "[]"));
    }
    if (props instanceof ReferenceType) {
        if (props.reflection) {
            const refl = props.reflection instanceof SignatureReflection ? props.reflection.parent : props.reflection;
            const parent = refl.parent;
            return (JSX.createElement(JSX.Fragment, null,
                JSX.createElement("a", { href: context.urlTo(parent) }, parent.name),
                ".",
                JSX.createElement("a", { href: context.urlTo(refl) }, refl.name)));
        }
        else if (props.externalUrl) {
            if (props.externalUrl === "#") {
                return JSX.createElement(JSX.Fragment, null, props.toString());
            }
            else {
                return JSX.createElement("a", { href: props.externalUrl, class: "external", target: "_blank" }, props.name);
            }
        }
    }
    return JSX.createElement(JSX.Fragment, null, props.toString());
};
