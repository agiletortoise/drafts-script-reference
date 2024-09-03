"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberReference = void 0;
const utils_1 = require("../../../../utils");
const memberReference = ({ urlTo, i18n, commentSummary, commentTags }, props) => {
    const referenced = props.tryGetTargetReflectionDeep();
    if (!referenced) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            i18n.theme_re_exports(),
            " ",
            props.name,
            commentSummary(props),
            commentTags(props)));
    }
    if (props.name === referenced.name) {
        return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
            i18n.theme_re_exports(),
            " ",
            utils_1.JSX.createElement("a", { href: urlTo(referenced) }, referenced.name),
            commentSummary(props),
            commentTags(props)));
    }
    return (utils_1.JSX.createElement(utils_1.JSX.Fragment, null,
        i18n.theme_renames_and_re_exports(),
        " ",
        utils_1.JSX.createElement("a", { href: urlTo(referenced) }, referenced.name),
        commentSummary(props),
        commentTags(props)));
};
exports.memberReference = memberReference;
