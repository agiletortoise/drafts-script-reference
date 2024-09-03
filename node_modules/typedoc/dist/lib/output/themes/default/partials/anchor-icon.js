"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchorIcon = anchorIcon;
const utils_1 = require("../../../../utils");
function anchorIcon(context, anchor) {
    if (!anchor)
        return utils_1.JSX.createElement(utils_1.JSX.Fragment, null);
    return (utils_1.JSX.createElement("a", { href: `#${anchor}`, "aria-label": context.i18n.theme_permalink(), class: "tsd-anchor-icon" }, context.icons.anchor()));
}
