import { JSX } from "#utils";
import { classNames } from "../../lib.js";
export const memberGetterSetter = (context, props) => (JSX.createElement(JSX.Fragment, null,
    JSX.createElement("ul", { class: classNames({
            "tsd-signatures": true,
        }, context.getReflectionClasses(props)) },
        !!props.getSignature && (JSX.createElement("li", null,
            JSX.createElement("div", { class: "tsd-signature", id: context.getAnchor(props.getSignature) }, context.memberSignatureTitle(props.getSignature)),
            JSX.createElement("div", { class: "tsd-description" }, context.memberSignatureBody(props.getSignature)))),
        !!props.setSignature && (JSX.createElement("li", null,
            JSX.createElement("div", { class: "tsd-signature", id: context.getAnchor(props.setSignature) }, context.memberSignatureTitle(props.setSignature)),
            JSX.createElement("div", { class: "tsd-description" }, context.memberSignatureBody(props.setSignature)))))));
