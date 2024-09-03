"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTemplate = void 0;
const utils_1 = require("../../../../utils");
const documentTemplate = ({ markdown }, props) => (utils_1.JSX.createElement("div", { class: "tsd-panel tsd-typography" },
    utils_1.JSX.createElement(utils_1.Raw, { html: markdown(props.model.content) })));
exports.documentTemplate = documentTemplate;
