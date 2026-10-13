import bg from "../assets/bg-pinus.png";
import orange from "../assets/orange-pinus.png";

// Imagens 3D geradas por `pnpm thumbs` (scripts/gen-thumbs.mjs), uma por slug.
const gen = import.meta.glob("../assets/products/*.png", { eager: true, import: "default" });
const bySlug = Object.fromEntries(
  Object.entries(gen).map(([path, url]) => [path.split("/").pop().replace(/\.png$/, ""), url])
);

// Resolve por slug do produto; cai no placeholder laranja se não houver imagem.
export const productImage = (slugOrKey) => bySlug[slugOrKey] ?? (slugOrKey === "bg" ? bg : orange);
export const heroImages = { bg, orange };
