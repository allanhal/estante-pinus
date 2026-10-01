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
export const ESPESSURA_SERRA = 0.5;

// Best-fit decreasing: encaixa cada peça (da maior para a menor) no recorte
// que sobrar mais justo, aproveitando as sobras antes de abrir barra nova.
// Peça que usa exatamente o que resta da barra não precisa de corte.
export const calculatePlanoDeCorte = (items) => {
  const pecas = items
    .flatMap((item) => Array(item.quantidade).fill(item.comprimento))
    .sort((a, b) => b - a);
  const barras = [];

  for (const peca of pecas) {
    let melhor = null;
    for (const barra of barras) {
      if (barra.sobra >= peca && (!melhor || barra.sobra < melhor.sobra)) melhor = barra;
    }
    if (!melhor) {
      melhor = { pecas: [], sobra: COMPRIMENTO_BARRA };
      barras.push(melhor);
    }
    melhor.pecas.push(peca);
    melhor.sobra = Math.max(melhor.sobra - peca - ESPESSURA_SERRA, 0);
  }

  // Agrupa barras com o mesmo padrão de corte.
  const padroes = new Map();
  for (const barra of barras) {
    const chave = barra.pecas.join("+");
    const padrao = padroes.get(chave) ?? { pecas: barra.pecas, sobra: barra.sobra, quantidade: 0 };
    padrao.quantidade += 1;
    padroes.set(chave, padrao);
  }

  return { barras: barras.length, padroes: [...padroes.values()] };
};
