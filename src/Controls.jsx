import {
  Settings,
  Ruler,
  Layers,
  Grid,
  ShoppingCart,
  DollarSign,
  Bike,
  Car,
  Truck,
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

const montagem = (shelves) => {
  return shelves * CUSTO_FIXO_MONTAGEM_ESTANTE;
};
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
  maxSlatsPerShelf = Math.floor(depth / RIPA_LARGURA),

  minSpacePerShelf,
  maxSpacePerShelf,

  price,
}) => {
  // const [maxShelvesState, setMaxShelvesState] = useState();
  const [maxSlatsPerShelfState, setMaxSlatsPerShelfState] = useState();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
  const [includeMontagem, setIncludeMontagem] = useState(false);
  const [includeFrete, setIncludeFrete] = useState(false);
  const [shelfQuantity, setShelfQuantity] = useState(1);

  useEffect(() => {
    const newMaxShelves = Math.floor(height / spacePerShelf);
    // setMaxShelvesState(newMaxShelves);

    // if (shelves > newMaxShelves) {
    setShelves(newMaxShelves);
    // }
  }, [height, spacePerShelf]);

  useEffect(() => {
    setMaxSlatsPerShelfState(Math.floor(depth / RIPA_LARGURA));

    if (slatsPerShelf >= Math.floor(depth / RIPA_LARGURA)) {
      setSlatsPerShelf(Math.floor(depth / RIPA_LARGURA) - 1);
    }
  }, [depth, RIPA_LARGURA]);

  const handleInputChange = (value, onChange, min, max) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const buttonConfigs = [
    {
      height: 30,
      width: 30,
      depth: 20,
      shelves: 2,
      slatsPerShelf: 4,
      spacePerShelf: 10,
    },
    {
      height: 40,
      width: 40,
      depth: 30,
      shelves: 2,
      slatsPerShelf: 4,
      spacePerShelf: 20,
    },
    {
      height: 60,
      width: 40,
      depth: 30,
      shelves: 3,
      slatsPerShelf: 4,
      spacePerShelf: 20,
    },
    {
      height: 80,
      width: 60,
      depth: 40,
      shelves: 4,
      slatsPerShelf: 5,
      spacePerShelf: 20,
    },
    {
      height: 120,
      width: 60,
      depth: 40,
      shelves: 5,
      slatsPerShelf: 5,
      spacePerShelf: 20,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-4 space-y-4 inset-shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b pb-2">
            Dimensões
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="text-amber-600 rotate-[-45deg]" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Largura
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={convertPixelsToMeters(minWidth)}
                  max={convertPixelsToMeters(maxWidth)}
                  value={convertPixelsToMeters(width)}
                  step={5}
                  onChange={(e) =>
                    handleInputChange(
                      convertMetersToPixels(e.target.value),
                      setWidth,
                      minWidth,
                      maxWidth
                    )
                  }
                  className="w-20 px-3 py-2 text-md rounded-lg text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
                <span className="text-sm text-gray-500">cm</span>
              </div>
            </div>
            <input
              type="range"
              min={convertPixelsToMeters(minWidth)}
              max={convertPixelsToMeters(maxWidth)}
              value={convertPixelsToMeters(width)}
              step={5}
              onChange={(e) =>
                setWidth(convertMetersToPixels(Number(e.target.value)))
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="text-amber-600" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Profundidade
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={convertPixelsToMeters(minDepth)}
                  max={convertPixelsToMeters(maxDepth)}
                  value={convertPixelsToMeters(depth)}
                  step={5}
                  onChange={(e) =>
                    handleInputChange(
                      convertMetersToPixels(e.target.value),
                      setDepth,
                      minDepth,
                      maxDepth
                    )
                  }
                  className="w-20 px-3 py-2 text-md rounded-lg text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
                <span className="text-sm text-gray-500">cm</span>
              </div>
            </div>
            <input
              type="range"
              min={convertPixelsToMeters(minDepth)}
              max={convertPixelsToMeters(maxDepth)}
              value={convertPixelsToMeters(depth)}
              step={5}
              onChange={(e) =>
                setDepth(convertMetersToPixels(Number(e.target.value)))
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start bg-gray-50 p-4 rounded-2xl">
          <div className="flex flex-col items-start mb-3">
            <div className="flex items-center">
              <DollarSign className="text-amber-600" size={24} />
              <label className="text-md font-bold text-gray-600 text-left flex items-center gap-2">
                Valor prateleira
              </label>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-sm text-gray-600 font-semibold">Qtd.</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={shelfQuantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) setShelfQuantity(v);
                  }}
                  className="w-16 px-2 py-1 text-sm rounded-md text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
              </div>
            </div>
            <span className="pl-1 text-2xl font-bold text-gray-700">
              {(price * 2).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span className="pl-1 text-lg font-bold text-gray-800 mt-1">
              Total: {((price * 2) * shelfQuantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
          <a
            href={`https://api.whatsapp.com/send?phone=5585992820404&text=${encodeURIComponent(
              "Olá, gostaria de fazer o pedido de uma estante de pinus com as medidas: " +
                `Largura: ${width}cm, Altura: ${height}cm, Profundidade: ${depth}cm, ` +
                `Prateleiras: ${shelves}, Ripas por Prateleira: ${slatsPerShelf}, ` +
                `Espaço entre Prateleiras: ${convertPixelsToMeters(
                  spacePerShelf
                )}cm. ` +
                `Preço unitário: R$ ${price * 2}. ` +
                `Quantidade: ${shelfQuantity}. ` +
                `Total: R$ ${(price * 2) * shelfQuantity}. ` +
                `Montagem: R$ ${montagem(shelves)}. ` +
                `Com Montagem: ${includeMontagem ? "Sim" : "Não"} ` +
                `Frete: R$ ${frete(shelves, width)}. ` +
                `Com Frete: ${includeFrete ? "Sim" : "Não"} ` +
                `-- Link para entrar na página: ${window.location.origin}/?altura=${height}&largura=${width}&profundidade=${depth}&ripas_por_prateleira=${slatsPerShelf}&espaco_entre_prateleiras=${spacePerShelf}`
            )}`}
            target="_blank"
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-medium py-2 px-6 rounded-full shadow-md text-base transition duration-300 ease-in-out transform hover:scale-105 mt-3 flex items-center gap-2"
          >
            <ShoppingCart className="text-white" size={20} />
            Comprar Agora
          </a>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 space-y-2">
          <p className="font-bold text-amber-600">
            • Tempo de produção e entrega: até 24 horas
          </p>
          {/* <p className="font-bold text-amber-600">
            • Entrega: até 2 dias úteis
          </p> */}
          <p className="font-bold text-amber-600">
            • Frete para todas regiões de Fortaleza-CE
          </p>
          <p>• Podem haver variações de 1~2cm nas dimensões</p>
          <p>• Use os sliders ou digite valores diretamente nos campos</p>
          <p>• Preços enviados estarão sujeitos a revisão</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
