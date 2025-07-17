import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
// import "./App.css";

// import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import STLImporter from "./STLIMPORTER";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <STLImporter />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
