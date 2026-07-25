import { useState } from "react";
import {
  Settings,
  Ruler,
  Layers,
  Grid,
  Truck,
  ArrowRight,
  Info,
  Scissors,
  Lightbulb,
} from "lucide-react";
import { FRETE_FIXO_MOTO } from "./App";
import {
  ESPESSURA,
  KIT_ELETRICO,
  LARGURA_PECA,
  calculateLuminariaBillOfMaterials,
  getSupportComprimento,
} from "./Luminaria";

const CUSTO_INSTALACAO = 25;

const LuminariaControls = ({
  height,
  depth,
  showBom,

  setHeight,
  setDepth,

  minHeight,
  maxHeight,
  minDepth,
  maxDepth,

  price,
}) => {
  const [includeInstalacao, setIncludeInstalacao] = useState(false);
  const [includeFrete, setIncludeFrete] = useState(false);

  const handleInputChange = (value, onChange, min, max) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue < min) onChange(min);
      else if (numValue > max) onChange(max);
      else onChange(numValue);
    }
  };

  const buttonConfigs = [
    { label: "P", h: 20, d: 14 },
    { label: "M", h: 25, d: 20 },
    { label: "G", h: 30, d: 28 },
  ];

  const totalValue =
    price +
    (includeInstalacao ? CUSTO_INSTALACAO : 0) +
    (includeFrete ? FRETE_FIXO_MOTO : 0);

  const billOfMaterials = calculateLuminariaBillOfMaterials({ height, depth });
  const totalLinearMeters = billOfMaterials.reduce(
    (sum, item) => sum + (item.comprimento * item.quantidade) / 100,
    0
  );

  const dimensionControls = [
    {
      label: "Altura",
      value: height,
      setValue: setHeight,
      min: minHeight,
      max: maxHeight,
      hint: "Altura total: wall + top",
    },
    {
      label: "Profundidade",
      value: depth,
      setValue: setDepth,
      min: minDepth,
      max: maxDepth,
      hint: "Avanço da peça top a partir da parede",
    },
  ];

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      {/* Suggestions Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-amber-800 dark:text-amber-500" size={20} />
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">Sugestões</h2>
        </div>
        <div className="flex gap-2 w-full">
          {buttonConfigs.map((config) => (
            <button
              key={config.label}
              onClick={() => {
                setHeight(config.h);
                setDepth(config.d);
              }}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 glass-card rounded-xl border border-white dark:border-stone-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-md transition-all active:scale-95 group text-center min-w-0"
            >
              <span className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors truncate w-full px-1">
                {config.label}
              </span>
              <span className="text-[9px] font-medium text-amber-900/40 dark:text-amber-500/40 leading-none mt-0.5 whitespace-nowrap">
                {config.h}×{config.d}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Dimensions Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="text-amber-800 dark:text-amber-500" size={20} />
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">Dimensões da Luminária</h2>
        </div>

        {dimensionControls.map(({ label, value, setValue, min, max, hint }) => (
          <div key={label} className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">
                  {label}
                </span>
                <span className="text-[10px] font-medium text-amber-900/30 dark:text-amber-500/30">
                  {hint}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value, setValue, min, max)}
                  className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
                />
                <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
              </div>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              step={1}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}

        {/* Comprimento do suporte: derivado de altura e profundidade, só leitura. */}
        <div className="flex justify-between items-end opacity-70">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">
              Suporte
            </span>
            <span className="text-[10px] font-medium text-amber-900/30 dark:text-amber-500/30">
              Calculado: mão-francesa 45°
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-900 dark:text-amber-400 leading-none">
              {getSupportComprimento(height, depth)}
            </span>
            <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
          </div>
        </div>
      </section>

      {/* Electric kit */}
      <section className="flex items-start gap-3 rounded-2xl border border-amber-900/10 dark:border-stone-700/30 p-4">
        <Lightbulb className="text-amber-800 dark:text-amber-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs font-medium text-amber-900/60 dark:text-amber-400/60 leading-relaxed">
          Acompanha kit elétrico montado: soquete E27, lâmpada redonda, cabo com plugue e
          interruptor de fio.
        </p>
      </section>

      {/* Bill of Materials */}
      {showBom && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Scissors className="text-amber-800 dark:text-amber-500" size={20} />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">Lista de Corte</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-amber-900/10 dark:border-stone-700/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-amber-900/50 dark:text-amber-500/50 uppercase text-xs tracking-widest">
                  <th className="py-2 px-3 font-bold">Peça</th>
                  <th className="py-2 px-3 font-bold text-right">Comp. (cm)</th>
                  <th className="py-2 px-3 font-bold text-right">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {billOfMaterials.map((item) => (
                  <tr key={item.nome} className="border-t border-amber-900/5 dark:border-stone-700/30">
                    <td className="py-2 px-3 text-amber-900 dark:text-amber-400 font-medium">{item.nome}</td>
                    <td className="py-2 px-3 text-right text-amber-900/70 dark:text-amber-400/70">{item.comprimento}</td>
                    <td className="py-2 px-3 text-right text-amber-900/70 dark:text-amber-400/70">{item.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs font-medium text-amber-900/40 dark:text-amber-500/40 mt-2">
            Total: {totalLinearMeters.toFixed(1)}m lineares em ripa {LARGURA_PECA}×{ESPESSURA}cm + kit elétrico
            ({KIT_ELETRICO.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
          </p>
        </section>
      )}

      {/* Purchase Card */}
      <section className="mt-12 bg-amber-900 dark:bg-stone-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black tracking-tight italic">Resumo do Pedido</h3>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeInstalacao}
                  onChange={(e) => setIncludeInstalacao(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/20 bg-white/10 accent-amber-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-sm font-medium text-amber-100">Instalação na parede</span>
              </div>
              <span className="text-sm font-bold">
                {CUSTO_INSTALACAO.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeFrete}
                  onChange={(e) => setIncludeFrete(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/20 bg-white/10 accent-amber-500 focus:ring-0 h-4 w-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-amber-100">Entrega Especial</span>
                  <span className="text-[10px] text-amber-300/50 uppercase tracking-widest font-black italic">
                    Moto
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold">
                {FRETE_FIXO_MOTO.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-amber-400">Valor Total</p>
                <p className="text-4xl font-black text-white leading-none">
                  {totalValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=5585992820404&text=${encodeURIComponent(
                  "Olá, gostaria de fazer o pedido de uma luminária de pinus personalizada:\n\n" +
                    `📐 Dimensões: ${height} x ${depth} cm (Altura x Profundidade) em ripa ${LARGURA_PECA}cm\n` +
                    `💡 Kit elétrico: soquete E27 + lâmpada redonda + interruptor de fio\n\n` +
                    `💰 Total: ${totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n` +
                    `🛠 Instalação: ${includeInstalacao ? "Sim" : "Não"}\n` +
                    `🚚 Frete: ${includeFrete ? "Sim" : "Não"}`
                )}`}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full bg-amber-400 text-amber-950 font-black py-4 px-8 rounded-2xl hover:bg-amber-300 active:scale-95 transition-all shadow-xl shadow-amber-950/20"
              >
                Pedir agora <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Production Info */}
      <div className="pt-8 border-t border-amber-900/5 dark:border-stone-700/30 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { text: "Produção Expressa (24h)", icon: <Truck size={14} className="text-amber-800 dark:text-amber-500" /> },
          { text: "Entrega em Fortaleza-CE", icon: <Info size={14} className="text-amber-800 dark:text-amber-500" /> },
          { text: "Design Personalizável", icon: <Layers size={14} className="text-amber-800 dark:text-amber-500" /> },
          { text: "Artesanal em Pinus", icon: <Grid size={14} className="text-amber-800 dark:text-amber-500" /> },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs font-bold text-amber-800/40 dark:text-amber-500/40 uppercase tracking-widest italic">
            <span className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-stone-800 flex items-center justify-center">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      <button
        id="button-luminaria"
        className="opacity-10 hover:opacity-100 transition-opacity text-[10px] fixed bottom-2 right-2 uppercase font-black tracking-widest text-amber-900 dark:text-amber-400"
      >
        Exportar STL
      </button>
    </div>
  );
};

export default LuminariaControls;
