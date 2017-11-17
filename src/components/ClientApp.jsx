import "normalize.css";

import React from "react";
import { render } from "react-dom";
import App from "./App";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  require("../../public/style.css");
}

const renderApp = () => {
  render(<App />, document.getElementById("app"));
};
renderApp();

if (module.hot) {
  module.hot.accept("./App", () => {
    renderApp();
  });
}
