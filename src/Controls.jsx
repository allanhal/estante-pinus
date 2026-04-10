import {
  Settings,
  Ruler,
  Layers,
  Grid,
  DollarSign,
  Bike,
  Car,
  Truck,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  CUSTO_FIXO_MONTAGEM_ESTANTE,
  FRETE_FIXO_CAMINHAO,
  FRETE_FIXO_CARRO,
  FRETE_FIXO_MOTO,
  RIPA_ALTURA,
  RIPA_LARGURA,
} from "./App";
import { useEffect, useState } from "react";

const convertPixelsToMeters = (pixels) => pixels;
const convertMetersToPixels = (meters) => meters;

const montagem = (shelves) => shelves * CUSTO_FIXO_MONTAGEM_ESTANTE;
const frete = (shelves, width) => {
  if (shelves >= 10) return FRETE_FIXO_CAMINHAO;
  if (shelves > 3 || width >= 60) return FRETE_FIXO_CARRO;
  return FRETE_FIXO_MOTO;
};

const Controls = ({
  width,
  height,
  depth,
  shelves,
  slatsPerShelf,
  spacePerShelf,

  setWidth,
  setHeight,
  setDepth,
  setShelves,
  setSlatsPerShelf,
  setSpacePerShelf,

  minWidth,
  maxWidth,
  maxHeight,
  minDepth,
  maxDepth,

  minSlatsPerShelf = 3,
  minSpacePerShelf,
  maxSpacePerShelf,

  price,
}) => {
  const [maxSlatsPerShelfState, setMaxSlatsPerShelfState] = useState(
    Math.floor(depth / RIPA_LARGURA)
  );
  const [includeMontagem, setIncludeMontagem] = useState(false);
  const [includeFrete, setIncludeFrete] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const newMaxShelves = Math.floor(height / spacePerShelf);
    setShelves(newMaxShelves);
  }, [height, spacePerShelf, setShelves]);

  useEffect(() => {
    const newMaxSlats = Math.floor(depth / RIPA_LARGURA);
    setMaxSlatsPerShelfState(newMaxSlats);

    if (slatsPerShelf >= newMaxSlats) {
      setSlatsPerShelf(newMaxSlats - 1);
    }
  }, [depth, slatsPerShelf, setSlatsPerShelf]);

  const handleInputChange = (value, onChange, min, max) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue < min) onChange(min);
      else if (numValue > max) onChange(max);
      else onChange(numValue);
    }
  };

  const buttonConfigs = [
    { label: "P", h: 40, w: 40, d: 20, s: 2, sp: 20 },
    { label: "M", h: 80, w: 60, d: 30, s: 4, sp: 20 },
    { label: "G", h: 120, w: 80, d: 40, s: 6, sp: 20 },
  ];

  const totalValue =
    price * 2 +
    (includeMontagem ? montagem(shelves) : 0) +
    (includeFrete ? frete(shelves, width) : 0);

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      {/* Suggestions Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-amber-800 dark:text-amber-500" size={20} />
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">Sugestões</h2>
        </div>
        <div className="flex gap-2 w-full">
          {buttonConfigs.map((config, index) => (
            <button
              key={index}
              onClick={() => {
                setWidth(config.w);
                setHeight(config.h);
                setDepth(config.d);
                setShelves(config.s);
                setSpacePerShelf(config.sp);
              }}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 glass-card rounded-xl border border-white dark:border-stone-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-md transition-all active:scale-95 group text-center min-w-0"
            >
              <span className="text-[10px] font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors truncate w-full px-1">
                {config.label}
              </span>
              <span className="text-[9px] font-medium text-amber-900/40 dark:text-amber-500/40 leading-none mt-0.5 whitespace-nowrap">
                {config.h}×{config.w}×{config.d}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Dimensions Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <Ruler className="text-amber-800 dark:text-amber-500" size={20} />
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-400 tracking-tight">Dimensões da Estante</h2>
        </div>

        {/* Height Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">Altura</span>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={height}
                onChange={(e) => handleInputChange(e.target.value, setHeight, spacePerShelf, maxHeight)}
                className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
              />
              <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
            </div>
          </div>
          <input
            type="range"
            min={spacePerShelf}
            max={maxHeight}
            value={height}
            step={5}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Width Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">Largura</span>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={width}
                onChange={(e) => handleInputChange(e.target.value, setWidth, minWidth, maxWidth)}
                className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
              />
              <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
            </div>
          </div>
          <input
            type="range"
            min={minWidth}
            max={maxWidth}
            value={width}
            step={5}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Depth Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">Profundidade</span>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={depth}
                onChange={(e) => handleInputChange(e.target.value, setDepth, minDepth, maxDepth)}
                className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
              />
              <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
            </div>
          </div>
          <input
            type="range"
            min={minDepth}
            max={maxDepth}
            value={depth}
            step={5}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Slats Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">Ripas por prateleira</span>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={slatsPerShelf}
                onChange={(e) => handleInputChange(e.target.value, setSlatsPerShelf, minSlatsPerShelf, maxSlatsPerShelfState)}
                className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
              />
            </div>
          </div>
          <input
            type="range"
            min={minSlatsPerShelf}
            max={maxSlatsPerShelfState}
            value={slatsPerShelf}
            step={1}
            onChange={(e) => setSlatsPerShelf(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Space Per Shelf Control */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-amber-900/50 dark:text-amber-500/50 uppercase tracking-widest italic leading-none pb-1">Espaçamento</span>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={spacePerShelf}
                onChange={(e) => handleInputChange(e.target.value, setSpacePerShelf, minSpacePerShelf, maxSpacePerShelf)}
                className="w-16 text-right bg-transparent border-0 focus:ring-0 text-3xl font-black text-amber-900 dark:text-amber-400 p-0 leading-none"
              />
              <span className="text-sm font-medium text-amber-900/40 dark:text-amber-500/40">cm</span>
            </div>
          </div>
          <input
            type="range"
            min={minSpacePerShelf}
            max={maxSpacePerShelf}
            value={spacePerShelf}
            step={5}
            onChange={(e) => setSpacePerShelf(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </section>

      {/* Purchase Card */}
      <section className="mt-12 bg-amber-900 dark:bg-stone-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight italic">Resumo do Pedido</h3>
            </div>
            <button
               onClick={() => setIsSummarizing(!isSummarizing)}
               className="text-amber-300/60 hover:text-amber-200 transition-colors"
            >
              <Info size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeMontagem}
                  onChange={(e) => setIncludeMontagem(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/20 bg-white/10 accent-amber-500 focus:ring-0 h-4 w-4"
                />
                <span className="text-sm font-medium text-amber-100">Serviço de Montagem</span>
              </div>
              <span className="text-sm font-bold">
                {montagem(shelves).toLocaleString("pt-BR", {
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
                    {frete(shelves, width) === FRETE_FIXO_CAMINHAO ? "Caminhão" : frete(shelves, width) === FRETE_FIXO_CARRO ? "Carro" : "Moto"}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold">
                {frete(shelves, width).toLocaleString("pt-BR", {
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
                  "Olá, gostaria de fazer o pedido de uma estante de pinus personalizada:\n\n" +
                    `📐 Dimensões: ${width} x ${height} x ${depth} cm (Largura x Altura x Profundidade)\n` +
                    `📦 Prateleiras: ${shelves} unid.\n` +
                    `🪵 Ripas por prateleira: ${slatsPerShelf}\n` +
                    `📏 Espaço entre prateleiras: ${spacePerShelf}cm\n\n` +
                    `💰 Total: ${totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n` +
                    `🛠 Montagem: ${includeMontagem ? "Sim" : "Não"}\n` +
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

      {/* Footer / STL Button Hidden in Premium UX */}
      <button
        id="button"
        className="opacity-10 hover:opacity-100 transition-opacity text-[10px] fixed bottom-2 right-2 uppercase font-black tracking-widest text-amber-900 dark:text-amber-400"
      >
        Exportar STL
      </button>
    </div>
  );
};

export default Controls;
