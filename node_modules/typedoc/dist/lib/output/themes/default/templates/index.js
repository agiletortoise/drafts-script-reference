import { JSX } from "#utils";
export const indexTemplate = ({ markdown }, props) => (JSX.createElement("div", { class: "tsd-panel tsd-typography" },
    JSX.createElement(JSX.Raw, { html: markdown(props.model.readme || []) })));
