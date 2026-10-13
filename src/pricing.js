// Funções e constantes de preço/lista de materiais PURAS (sem React/three/DOM),
// importadas tanto pelo cliente (Vite) quanto pelas funções /api (Node).
import { ESPESSURA, getSupportComprimento } from "./ripa.js";

export const FRETE_FIXO_CAMINHAO = 90;
export const FRETE_FIXO_CARRO = 50;
export const FRETE_FIXO_MOTO = 20;
export const CUSTO_FIXO_MONTAGEM_ESTANTE = 10;

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

export const SPAN_MAXIMO = 150;

// Na reforçada a primeira prateleira fica rente ao chão (a viga de baixo fica
// só esse vão acima do piso), o que deixa a estante mais estável.
const VAO_CHAO_REFORCADA = 2;

// Distância do chão (pé da perna) até a primeira prateleira.
export const getAlturaPrimeiraPrateleira = (spacePerShelf, reforcada) =>
  reforcada ? VAO_CHAO_REFORCADA + RIPA_ALTURA * 1.5 + RIPA_LARGURA : spacePerShelf;

// Quantas prateleiras cabem: a primeira na altura acima e as demais a cada
// espaçamento, sem passar do topo das pernas.
export const getNumPrateleiras = ({ height, spacePerShelf, reforcada }) =>
  Math.max(
    Math.floor((height - getAlturaPrimeiraPrateleira(spacePerShelf, reforcada)) / spacePerShelf) + 1,
    1
  );

export const getNumApoiosCentrais = (width) =>
  Math.max(Math.ceil(width / SPAN_MAXIMO) - 1, 0);

const MATERIAL_RATE = 10 / 300; // mesma taxa usada no preço base: R$10 a cada 300cm de material

export const calculateShelfBasePrice = ({ width, height, shelves, slatsPerShelf }) => {
  const totalSlatLength = shelves * slatsPerShelf * (width - RIPA_LARGURA);
  const totalLegLength = height * 4;
  const totalLength = totalSlatLength + totalLegLength;

  return Math.round(totalLength / 300) * 10 + 10;
};

export const calculateApoiosCentraisPrice = ({ width, height, depth, shelves }) => {
  const numApoiosCentrais = getNumApoiosCentrais(width);

  if (numApoiosCentrais === 0) return 0;

  const legsLength = height * numApoiosCentrais * 2;
  const runnersLength = depth * numApoiosCentrais * shelves;

  return Math.round((legsLength + runnersLength) * MATERIAL_RATE);
};

export const calculateBillOfMaterials = ({
  width,
  height,
  depth,
  shelves,
  slatsPerShelf,
  reforcada = false,
}) => {
  const numApoiosCentrais = getNumApoiosCentrais(width);

  const items = [
    { nome: "Pernas", comprimento: height, quantidade: 4 + numApoiosCentrais * 2 },
  ];

  items.push({
    nome: "Ripas das prateleiras",
    comprimento: width - RIPA_LARGURA,
    quantidade: shelves * slatsPerShelf,
  });

  items.push({
    nome: "Travessas da base",
    comprimento: depth,
    quantidade: shelves * (2 + numApoiosCentrais),
  });

  if (reforcada) {
    items.push({
      nome: "Vigas frente/fundo",
      comprimento: width - RIPA_LARGURA,
      quantidade: shelves * 2,
    });
    items.push({
      nome: "Travessas do meio",
      comprimento: depth,
      quantidade: shelves * (numApoiosCentrais + 1),
    });
  }

  return items;
};

// Reforço = vigas frente/fundo + travessa no meio de cada vão (apoiada nas
// vigas, sem perna), cobrados na mesma taxa de material do preço base.
export const calculateReforcoPrice = ({ width, depth, shelves }) => {
  const vigas = shelves * 2 * (width - RIPA_LARGURA);
  const travessasDoMeio = shelves * (getNumApoiosCentrais(width) + 1) * depth;
  return Math.round((vigas + travessasDoMeio) * MATERIAL_RATE);
};

// ---- Mão francesa ----
const MAO_FRANCESA_MARKUP = 1.2;
const PRECO_POR_METRO = 12;

export const calculateMaoFrancesaBillOfMaterials = ({ height, depth, quantity = 1 }) => [
  // O top apoia sobre o wall, então a altura total desconta a espessura da ripa.
  { nome: "Wall", comprimento: height - ESPESSURA, quantidade: quantity },
  { nome: "Top", comprimento: depth, quantidade: quantity },
  {
    nome: "Suporte",
    comprimento: getSupportComprimento(height, depth),
    quantidade: quantity,
  },
];

export const calculateMaoFrancesaPrice = ({ height, depth, quantity }) => {
  const totalLength = calculateMaoFrancesaBillOfMaterials({
    height,
    depth,
    quantity,
  }).reduce((sum, item) => sum + item.comprimento * item.quantidade, 0);
  const material = (totalLength / 100) * PRECO_POR_METRO;

  return Math.round(material * 2 * MAO_FRANCESA_MARKUP);
};

// ---- Prateleira com mão francesa ----
const QUANTIDADE_MAOS_FRANCESAS = 2;
const PRATELEIRA_MARKUP = 1.25;

export const calculatePrateleiraMaoFrancesaBillOfMaterials = ({
  width,
  height,
  depth,
  slatsPerShelf,
}) => [
  {
    nome: "Ripas da prateleira",
    comprimento: width - RIPA_LARGURA,
    quantidade: slatsPerShelf,
  },
  { nome: "Wall", comprimento: height - ESPESSURA, quantidade: QUANTIDADE_MAOS_FRANCESAS },
  { nome: "Top", comprimento: depth, quantidade: QUANTIDADE_MAOS_FRANCESAS },
  {
    nome: "Suporte",
    comprimento: getSupportComprimento(height, depth),
    quantidade: QUANTIDADE_MAOS_FRANCESAS,
  },
];

export const calculatePrateleiraMaoFrancesaPrice = ({ width, height, depth, slatsPerShelf }) => {
  const totalLength = calculatePrateleiraMaoFrancesaBillOfMaterials({
    width,
    height,
    depth,
    slatsPerShelf,
  }).reduce((sum, item) => sum + item.comprimento * item.quantidade, 0);
  const material = (totalLength / 100) * PRECO_POR_METRO;

  return Math.round(material * 2 * PRATELEIRA_MARKUP);
};
