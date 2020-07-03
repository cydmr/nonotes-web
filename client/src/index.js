import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import * as serviceWorker from "./serviceWorker";

// import i18n (needs to be bundled ;))
//import './locales';

const render = (Component) => {
  ReactDOM.render(<Component />, document.getElementById("root"));
};

// serviceWorker.register();
render(App);

// if (module.hot) {
//   console.debug("hot module");
//   module.hot.accept("./App", () => {
//     render(App);
//   });
// }
