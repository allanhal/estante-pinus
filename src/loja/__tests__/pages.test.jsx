import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { products } from "../catalog.js";
import { formatBRL } from "../money";
import Home from "../Home";
import Product from "../Product";
import Cart from "../Cart";
import Checkout from "../Checkout";
import Order from "../Order";
import Admin from "../Admin";
import ProductCard from "../ProductCard";
import PixPayment from "../PixPayment";
import StoreLayout from "../StoreLayout";

// Intl usa espaco nao-quebravel: compara normalizando
const brl = (v) => (_c, el) => el?.textContent.replace(/\s/g, " ") === formatBRL(v).replace(/\s/g, " ") && !el.children.length;
const at = (ui, path = "/") => render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);

// Mesmas rotas de src/main.jsx para /loja
const StoreRoutes = ({ path }) =>
  at(
    <Routes>
      <Route path="/loja" element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="produto/:slug" element={<Product />} />
        <Route path="carrinho" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido/:code" element={<Order />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>,
    path
  );

describe("paginas da loja carregam", () => {
  it("Home", () => {
    at(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText(products[0].name).length).toBeGreaterThan(0);
  });

  it.each(products.map((p) => [p.slug, p]))("Product %s", (_slug, p) => {
    at(
      <Routes><Route path="/loja/produto/:slug" element={<Product />} /></Routes>,
      `/loja/produto/${p.slug}`
    );
    expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
    expect(screen.getByText(brl(p.price))).toBeInTheDocument();
    expect(screen.getByText(p.dimensionsLabel)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /adicionar ao carrinho/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /personalizar/i })).toHaveAttribute("href", p.customizeHref.startsWith("/") ? p.customizeHref : `/${p.customizeHref}`);
  });

  it("Product inexistente mostra aviso", () => {
    at(<Routes><Route path="/loja/produto/:slug" element={<Product />} /></Routes>, "/loja/produto/nada");
    expect(screen.getByText(/não encontrado/i)).toBeInTheDocument();
  });

  it("Cart vazio", () => {
    at(<Cart />);
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it("Checkout", () => {
    at(<Checkout />);
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it("Order (pedido inexistente)", async () => {
    at(<Routes><Route path="/loja/pedido/:code" element={<Order />} /></Routes>, "/loja/pedido/ABC");
    expect(await screen.findByText(/não encontrado/i)).toBeInTheDocument();
  });

  it("Admin (deslogado)", async () => {
    at(<Admin />);
    expect(await screen.findByRole("heading", { name: "Admin" })).toBeInTheDocument();
  });
});

describe("componentes", () => {
  it("ProductCard", () => {
    const p = products[0];
    at(<ProductCard p={p} />);
    expect(screen.getByText(p.name)).toBeInTheDocument();
    expect(screen.getByText(brl(p.price))).toBeInTheDocument();
  });

  it("PixPayment", () => {
    at(<PixPayment pix={{ code: "X1", total: 100, pixCopyPaste: "000201abc", qrCodeBase64: "AAAA" }} />);
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it("StoreLayout com Outlet", () => {
    at(
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<p>conteudo-filho</p>} />
        </Route>
      </Routes>
    );
    expect(screen.getByText("conteudo-filho")).toBeInTheDocument();
    expect(screen.getByText("Estante Pinus Fortaleza")).toBeInTheDocument();
  });
});

describe("roteamento /loja", () => {
  it.each(products.map((p) => [p.slug, p]))("deep link %s", (_s, p) => {
    StoreRoutes({ path: `/loja/produto/${p.slug}` });
    expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
  });

  it("navegar do grid para o produto e adicionar ao carrinho (client-side)", async () => {
    const user = userEvent.setup();
    StoreRoutes({ path: "/loja" });
    const p = products[0];
    await user.click(screen.getAllByRole("link", { name: p.name })[0]);
    expect(await screen.findByRole("heading", { name: p.name })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /adicionar ao carrinho/i }));
    expect(await screen.findByText(/adicionado/i)).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: /todos os produtos/i }));
    await waitFor(() => expect(screen.getByRole("heading", { level: 1, name: /pinus, prontos/i })).toBeInTheDocument());
  });
});
