// Todas as peças da luminária e da mão-francesa saem da mesma ripa 2 × 5cm;
// só o comprimento do corte muda.
export const ESPESSURA = 2;
export const LARGURA_PECA = 5;
export const PRECO_POR_METRO = 12;

// Regra única para o support nos produtos derivados da luminária.
const FOLGA_LAMPADA = 8;
const FOLGA_WALL = 2;

export const getSupportRun = (height, depth) =>
  Math.max(
    Math.floor(
      Math.min(depth - ESPESSURA - FOLGA_LAMPADA, height - ESPESSURA - FOLGA_WALL)
    ),
    3
  );

// Comprimento de corte medido na ponta longa (as duas pontas saem em esquadria).
export const getSupportComprimento = (height, depth) =>
  Math.round(getSupportRun(height, depth) * Math.SQRT2 + ESPESSURA);

// Ripas vendidas em barras de 280cm; cada corte perde a espessura da serra.
export const COMPRIMENTO_BARRA = 280;
export const ESPESSURA_SERRA = 0.3;

// First-fit decreasing: encaixa cada peça (da maior para a menor) na primeira
// barra com sobra suficiente. Retorna quantas barras inteiras são necessárias.
export const calculateBarrasNecessarias = (items) => {
  const pecas = items
    .flatMap((item) => Array(item.quantidade).fill(item.comprimento))
    .sort((a, b) => b - a);
  const sobras = [];

  for (const peca of pecas) {
    const index = sobras.findIndex((sobra) => sobra >= peca);
    if (index === -1) sobras.push(COMPRIMENTO_BARRA - peca - ESPESSURA_SERRA);
    else sobras[index] -= peca + ESPESSURA_SERRA;
  }

  return sobras.length;
};
