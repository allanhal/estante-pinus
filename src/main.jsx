import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Luminaria from "./Luminaria";
import MaoFrancesa from "./MaoFrancesa";
import PrateleiraMaoFrancesa from "./PrateleiraMaoFrancesa";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/luminaria" element={<Luminaria />} />
        <Route path="/mao-francesa" element={<MaoFrancesa />} />
        <Route path="/prateleira" element={<PrateleiraMaoFrancesa />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
