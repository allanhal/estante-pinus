// TODO(owner): replace with real SKUs/photos/descriptions. Prices are computed
// from the SAME formulas the configurators use (src/pricing.js), so they stay
// in sync. Dimensions are in cm.
//
// Plain JS, no React / asset imports: this file is also imported by the Node
// /api functions, which ALWAYS recompute order totals from here (the client
// never sends prices). `image` is a key resolved to a bundled asset on the
// client (see src/loja/images.js).
import {
  calculateShelfBasePrice,
  calculateApoiosCentraisPrice,
  calculateReforcoPrice,
  calculateMaoFrancesaPrice,
  calculatePrateleiraMaoFrancesaPrice,
  getNumPrateleiras,
} from "../pricing.js";

export const CATEGORY_LABELS = {
  estante: "Estantes",
  "estante-reforcada": "Estantes reforçadas",
  "mao-francesa": "Mãos francesas",
  prateleira: "Prateleiras",
};

const q = (path, params) =>
  `${path}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}`;

// Estante (e reforçada): largura x altura x profundidade, 4 ripas por prateleira.
const estante = ({ slug, name, description, image, width, height, depth, space, reforcada = false, featured }) => {
  const slats = 4;
  const shelves = getNumPrateleiras({ height, spacePerShelf: space, reforcada });
  const price =
    calculateShelfBasePrice({ width, height, shelves, slatsPerShelf: slats }) +
    calculateApoiosCentraisPrice({ width, height, depth, shelves }) +
    (reforcada ? calculateReforcoPrice({ width, depth, shelves }) : 0);
  const path = reforcada ? "/estante-reforcada" : "/";
  return {
    slug,
    category: reforcada ? "estante-reforcada" : "estante",
    name,
    price,
    dimensions: { largura: width, altura: height, profundidade: depth, prateleiras: shelves },
    dimensionsLabel: `${width} × ${height} × ${depth} cm · ${shelves} prateleiras`,
    description,
    image,
    customizeHref: q(path, {
      largura: width,
      altura: height,
      profundidade: depth,
      ripas_por_prateleira: slats,
      espaco_entre_prateleiras: space,
    }),
    featured,
  };
};

const mao = ({ slug, name, description, image, height, depth, quantity }) => ({
  slug,
  category: "mao-francesa",
  name,
  price: calculateMaoFrancesaPrice({ height, depth, quantity }),
  dimensions: { altura: height, profundidade: depth, quantidade: quantity },
  dimensionsLabel: `${height} × ${depth} cm · ${quantity} unidades`,
  description,
  image,
  customizeHref: q("/mao-francesa", { altura: height, profundidade: depth, quantidade: quantity }),
});

const prateleira = ({ slug, name, description, image, width, height, depth, slats, featured }) => ({
  slug,
  category: "prateleira",
  name,
  price: calculatePrateleiraMaoFrancesaPrice({ width, height, depth, slatsPerShelf: slats }),
  dimensions: { largura: width, altura: height, profundidade: depth, ripas: slats },
  dimensionsLabel: `${width} × ${depth} cm · ${slats} ripas`,
  description,
  image,
  customizeHref: q("/prateleira", { largura: width, altura: height, profundidade: depth, ripas_por_prateleira: slats }),
  featured,
});

export const products = [
  estante({ slug: "estante-pequena-60x120", name: "Estante Pinus Pequena", image: "orange", width: 60, height: 120, depth: 30, space: 30,
    description: "Estante compacta de pinus, ideal para cantos e espaços pequenos. Feita de ripas 2×4 aparentes." }),
  estante({ slug: "estante-media-120x180", name: "Estante Pinus Média", image: "orange", width: 120, height: 180, depth: 30, space: 40, featured: true,
    description: "A estante clássica para sala ou escritório, com bastante espaço para livros e objetos." }),
  estante({ slug: "estante-grande-180x200", name: "Estante Pinus Grande", image: "orange", width: 180, height: 200, depth: 35, space: 40,
    description: "Estante ampla com apoio central, para grandes coleções." }),
  estante({ slug: "estante-reforcada-compacta-80x150", name: "Estante Reforçada Compacta", image: "orange", width: 80, height: 150, depth: 30, space: 30, reforcada: true,
    description: "Versão reforçada com vigas frente e fundo: aguenta mais peso e fica rente ao chão." }),
  estante({ slug: "estante-reforcada-media-120x180", name: "Estante Reforçada Média", image: "orange", width: 120, height: 180, depth: 35, space: 40, reforcada: true, featured: true,
    description: "Reforçada para cargas pesadas: livros, ferramentas, eletrodomésticos." }),
  estante({ slug: "estante-reforcada-grande-180x200", name: "Estante Reforçada Grande", image: "orange", width: 180, height: 200, depth: 40, space: 40, reforcada: true,
    description: "A mais robusta da linha, com apoio central e vigas de reforço." }),
  mao({ slug: "mao-francesa-par-20x15", name: "Mão Francesa Pinus (par pequeno)", image: "orange", height: 20, depth: 15, quantity: 2,
    description: "Par de mãos francesas de pinus para pequenas prateleiras." }),
  mao({ slug: "mao-francesa-par-30x20", name: "Mão Francesa Pinus (par médio)", image: "orange", height: 30, depth: 20, quantity: 2,
    description: "Par de mãos francesas médias, o tamanho mais versátil." }),
  mao({ slug: "mao-francesa-kit-30x30", name: "Kit 4 Mãos Francesas Grandes", image: "orange", height: 30, depth: 30, quantity: 4,
    description: "Kit com quatro mãos francesas grandes para prateleiras longas." }),
  prateleira({ slug: "prateleira-pequena-60x15", name: "Prateleira Pinus Pequena", image: "orange", width: 60, height: 20, depth: 15, slats: 3,
    description: "Prateleira de parede com duas mãos francesas incluídas." }),
  prateleira({ slug: "prateleira-media-80x20", name: "Prateleira Pinus Média", image: "orange", width: 80, height: 25, depth: 20, slats: 4, featured: true,
    description: "A prateleira mais pedida: 80 cm de largura com duas mãos francesas incluídas." }),
  prateleira({ slug: "prateleira-grande-120x25", name: "Prateleira Pinus Grande", image: "orange", width: 120, height: 25, depth: 25, slats: 4,
    description: "Prateleira longa de 120 cm para livros e decoração." }),
];

export const getProduct = (slug) => products.find((p) => p.slug === slug);
export const featuredProducts = () => products.filter((p) => p.featured);

// TODO(owner): real shipping rules. For now shipping is free / combined offline.
export const SHIPPING_FLAT = 0;
