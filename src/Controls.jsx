import { Settings, Ruler, Layers, Grid, ShoppingCart } from "lucide-react";
import { RIPA_ALTURA, RIPA_LARGURA } from "./App";
import { useEffect, useState } from "react";

const convertPixelsToMeters = (pixels) => pixels;

const convertMetersToPixels = (meters) => meters;

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
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    { width: 50, height: 50, depth: 30, shelves: 2, slatsPerShelf: 4, spacePerShelf: 15 },
    { width: 60, height: 60, depth: 35, shelves: 3, slatsPerShelf: 4, spacePerShelf: 20 },
    { width: 70, height: 70, depth: 40, shelves: 4, slatsPerShelf: 4, spacePerShelf: 25 },
    { width: 80, height: 80, depth: 45, shelves: 5, slatsPerShelf: 4, spacePerShelf: 30 },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8 inset-shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Settings className="text-amber-600" size={24} />
          <h2 className="text-lg font-bold text-gray-700">
            Customização da Prateleira
          </h2>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="border border-gray-600 py-2 px-3 text-gray-600 font-bold text-sm rounded-lg transition duration-300 flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0"
        >
          <img src="/src/assets/pinus-icon2.png" alt="Prateleira Icon" className="w-6 h-6" />
          {isCollapsed ? "Sugestões de Prateleiras" : "Esconder Sugestões"}
        </button>
      </div>

      {!isCollapsed && (
        <div className={`flex flex-col md:flex-row justify-around mt-2 transition-all duration-500 ease-in-out bg-gray-50 p-4 rounded-lg gap-4 ${isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-screen'}`}>
          {buttonConfigs.map((config, index) => (
            <button
              key={index}
              onClick={() => {
                setWidth(config.width);
                setHeight(config.height);
                setDepth(config.depth);
                setShelves(config.shelves);
                setSlatsPerShelf(config.slatsPerShelf);
                setSpacePerShelf(config.spacePerShelf);
              }}
              className="border border-amber-600 text-gray-600 font-bold text-sm py-1 px-3 rounded-md flex items-center gap-2 transition duration-300 transform hover:scale-105"
            >
              <img src="/src/assets/orange-pinus.png" alt="Prateleira Icon" className="w-10 h-10" />
              {`${config.width} x ${config.height} x ${config.depth}`}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b pb-2">
            Dimensões
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="text-amber-600 rotate-45" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Altura (m)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={convertPixelsToMeters(spacePerShelf)}
                  max={convertPixelsToMeters(maxHeight)}
                  value={convertPixelsToMeters(height)}
                  step={convertPixelsToMeters(spacePerShelf)}
                  onChange={(e) =>
                    handleInputChange(
                      convertMetersToPixels(e.target.value),
                      setHeight,
                      spacePerShelf,
                      maxHeight
                    )
                  }
                  className="w-20 px-3 py-2 text-md rounded-lg text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
                <span className="text-sm text-gray-500">cm</span>
              </div>
            </div>
            <input
              type="range"
              min={convertPixelsToMeters(spacePerShelf)}
              max={convertPixelsToMeters(maxHeight)}
              value={convertPixelsToMeters(height)}
              step={convertPixelsToMeters(spacePerShelf)}
              onChange={(e) =>
                setHeight(convertMetersToPixels(Number(e.target.value)))
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="text-amber-600 rotate-[-45deg]" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Largura (m)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={convertPixelsToMeters(minWidth)}
                  max={convertPixelsToMeters(maxWidth)}
                  value={convertPixelsToMeters(width)}
                  step={10}
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
              step={10}
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
                  Profundidade (m)
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

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-md space-y-4">
          <h3 className="text-md font-medium text-gray-700 border-b pb-2">
            Configurações de Prateleira
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Grid className="text-amber-600" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Ripas por Prateleira
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={minSlatsPerShelf}
                  max={maxSlatsPerShelfState}
                  value={slatsPerShelf}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.value,
                      setSlatsPerShelf,
                      minSlatsPerShelf,
                      maxSlatsPerShelfState
                    )
                  }
                  className="w-20 px-3 py-2 text-md rounded-lg text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
              </div>
            </div>
            <input
              type="range"
              min={minSlatsPerShelf}
              max={maxSlatsPerShelf}
              value={slatsPerShelf}
              onChange={(e) => setSlatsPerShelf(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="text-amber-600" size={20} />
                <label className="text-sm font-medium text-gray-700">
                  Espaço entre Prateleiras (m)
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={convertPixelsToMeters(minSpacePerShelf)}
                  max={convertPixelsToMeters(maxSpacePerShelf)}
                  value={convertPixelsToMeters(spacePerShelf)}
                  step={10}
                  onChange={(e) => {
                    handleInputChange(
                      convertMetersToPixels(e.target.value),
                      setSpacePerShelf,
                      minSpacePerShelf,
                      maxSpacePerShelf
                    );

                    handleInputChange(
                      shelves * convertMetersToPixels(e.target.value),
                      setHeight,
                      spacePerShelf,
                      maxHeight
                    );
                  }}
                  className="w-20 px-3 py-2 text-md rounded-lg text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold"
                />
              </div>
            </div>
            <input
              type="range"
              min={convertPixelsToMeters(minSpacePerShelf)}
              max={convertPixelsToMeters(maxSpacePerShelf)}
              value={convertPixelsToMeters(spacePerShelf)}
              step={10}
              onChange={(e) => {
                setSpacePerShelf(convertMetersToPixels(Number(e.target.value)));

                setHeight(
                  shelves * convertMetersToPixels(Number(e.target.value))
                );
              }}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      <div className="text-center ">
        <div className="flex items-center gap-4 mb-6">
          <ShoppingCart className="text-amber-600" size={24} />
          <h4 className="text-lg font-bold text-gray-700">Resumo da Compra</h4>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-lg inline-block w-full flex flex-col md:flex-row justify-between items-center">
          <div className="text-left mb-6 md:mb-0 md:mr-10">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Ruler className="text-amber-600 rotate-45" size={16} />
                <span className="font-normal">{width}cm</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Ruler className="text-amber-600 rotate-[-45deg]" size={16} />
                <span className="font-normal">{height}cm</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Ruler className="text-amber-600" size={16} />
                <span className="font-normal">{depth}cm</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Layers className="text-amber-600" size={16} />
                <span className="font-normal">{shelves}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Grid className="text-amber-600" size={16} />
                <span className="font-normal">{slatsPerShelf}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-md">
                <Layers className="text-amber-600" size={16} />
                <span className="font-normal">
                  {convertPixelsToMeters(spacePerShelf)}cm
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start bg-gray-50 p-4 rounded-2xl">
            <div className="flex flex-col items-start mb-3">
              <div className="flex items-center">
                <img
                  src="/pinus-icon1.svg"
                  alt="Estante Icon"
                  className="mr-2"
                  style={{ width: "24px", height: "24px" }}
                />
                <span className="text-md font-bold text-gray-600">
                  Valor total:
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-700">
                {(price * 2).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
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
                  `Preço: R$ ${price * 2}. ` +
                  `Link para entrar na página: ${window.location.origin}/?altura=${height}&largura=${width}&profundidade=${depth}&ripas_por_prateleira=${slatsPerShelf}&espaco_entre_prateleiras=${spacePerShelf}`
              )}`}
              target="_blank"
              className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-medium py-2 px-6 rounded-full shadow-md text-base transition duration-300 ease-in-out transform hover:scale-105 mt-3 flex items-center gap-2"
            >
              <ShoppingCart className="text-white" size={20} />
              Comprar Agora
            </a>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 space-y-2">
          <p className="font-bold text-amber-600">
            • Podem haver variações de 1~2cm nas dimensões
          </p>
          <p>• Use os sliders ou digite valores diretamente nos campos</p>
          <p>• Preços enviados estarão sujeitos a revisão</p>
          <p>
            • Tamanhos aproximados das ripas: {RIPA_LARGURA}cm (largura) ×{" "}
            {RIPA_ALTURA}cm (altura)
          </p>
          <button
            id="button"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            Exportar para STL
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
