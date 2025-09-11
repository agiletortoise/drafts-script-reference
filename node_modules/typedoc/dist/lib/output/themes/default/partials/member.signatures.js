import { JSX } from "#utils";
import { anchorIcon } from "./anchor-icon.js";
import { classNames } from "../../lib.js";
export const memberSignatures = (context, props) => (JSX.createElement(JSX.Fragment, null,
    JSX.createElement("ul", { class: classNames({ "tsd-signatures": true }, context.getReflectionClasses(props)) }, props.signatures?.map((item) => (JSX.createElement("li", { class: context.getReflectionClasses(item) },
        JSX.createElement("div", { class: "tsd-signature tsd-anchor-link", id: context.getAnchor(item) },
            context.memberSignatureTitle(item),
            anchorIcon(context, context.getAnchor(item))),
        JSX.createElement("div", { class: "tsd-description" }, context.memberSignatureBody(item))))))));
