import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Luminaria from "./Luminaria";
import MaoFrancesa from "./MaoFrancesa";
import PrateleiraMaoFrancesa from "./PrateleiraMaoFrancesa";
import StoreLayout from "./loja/StoreLayout";
import Home from "./loja/Home";
import Product from "./loja/Product";
import Cart from "./loja/Cart";
import Checkout from "./loja/Checkout";
import Order from "./loja/Order";
import Admin from "./loja/Admin";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/estante-reforcada" element={<App key="reforcada" reforcada />} />
        <Route path="/luminaria" element={<Luminaria />} />
        <Route path="/mao-francesa" element={<MaoFrancesa />} />
        <Route path="/prateleira" element={<PrateleiraMaoFrancesa />} />
        <Route path="/loja" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="produto/:slug" element={<Product />} />
          <Route path="carrinho" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedido/:code" element={<Order />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
