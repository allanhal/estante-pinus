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
