import { Settings, Ruler, Layers, Grid } from "lucide-react";
import { RIPA_ALTURA, RIPA_LARGURA } from "./App";
import { useEffect, useState } from "react";

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 inset-shadow-sm border border-gray-300 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="text-amber-600" size={24} />
        <h2 className="text-xs font-semibold text-gray-800">
          Customização da Prateleira
        </h2>
      </div>

      <div className="space-y-6">
        {/* Height Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="text-amber-600 rotate-45" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Altura
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={spacePerShelf}
                max={maxHeight}
                value={height}
                step={spacePerShelf}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setHeight,
                    spacePerShelf,
                    maxHeight
                  )
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min={spacePerShelf}
            max={maxHeight}
            value={height}
            step={spacePerShelf}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Width Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="text-amber-600 rotate-[-45deg]" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Largura
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minWidth}
                max={maxWidth}
                value={width}
                step={10}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setWidth,
                    minWidth,
                    maxWidth
                  )
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min={minWidth}
            max={maxWidth}
            value={width}
            step={10}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Depth Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="text-amber-600" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Profundidade
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minDepth}
                max={maxDepth}
                value={depth}
                step={5}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setDepth,
                    minDepth,
                    maxDepth
                  )
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min={minDepth}
            max={maxDepth}
            value={depth}
            step={5}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Shelves Control */}
        {/* <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="text-amber-600" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Prateleiras
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={spacePerShelf}
                max={maxShelvesState}
                value={shelves}
                onChange={(e) =>
                  handleInputChange(
                    e.target.value,
                    setShelves,
                    spacePerShelf,
                    maxShelvesState
                  )
                }
                className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="range"
            min={spacePerShelf}
            max={maxShelvesState}
            value={shelves}
            onChange={(e) => setShelves(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div> */}

        {/* Slats per Shelf Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="text-amber-600" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Ripas por Prateleira
              </label>
            </div>
            <div className="flex items-center gap-2">
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
                className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="range"
            min={minSlatsPerShelf}
            max={maxSlatsPerShelf}
            value={slatsPerShelf}
            onChange={(e) => setSlatsPerShelf(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Space per Shelf Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <Grid className="text-amber-600" size={18} /> */}
              <Layers className="text-amber-600" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Espaço entre Prateleiras
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={minSpacePerShelf}
                max={maxSpacePerShelf}
                value={spacePerShelf}
                step={10}
                onChange={(e) => {
                  handleInputChange(
                    e.target.value,
                    setSpacePerShelf,
                    minSpacePerShelf,
                    maxSpacePerShelf
                  );

                  handleInputChange(
                    shelves * Number(e.target.value),
                    setHeight,
                    spacePerShelf,
                    maxHeight
                  );
                }}
                className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="range"
            min={minSpacePerShelf}
            max={maxSpacePerShelf}
            value={spacePerShelf}
            step={10}
            onChange={(e) => {
              setSpacePerShelf(Number(e.target.value));

              setHeight(shelves * Number(e.target.value));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 text-center">
        <a
          href={`https://api.whatsapp.com/send?phone=5585992820404&text=${encodeURIComponent(
            "Olá, gostaria de fazer o pedido de uma estante de pinus com as medidas: " +
              `Largura: ${width}px, Altura: ${height}px, Profundidade: ${depth}px, ` +
              `Prateleiras: ${shelves}, Ripas por Prateleira: ${slatsPerShelf}, ` +
              `Espaço entre Prateleiras: ${spacePerShelf}px. ` +
              `Preço: R$ ${price * 2}`
          )}`}
          target="_blank"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Preço: R$ {price * 2}
        </a>
      </div>
      <div className="pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-bold text-amber-600">
            • Podem haver variações de 1~2cm nas dimensões
          </p>
          <p>• Use os sliders ou digite valores diretamente nos campos</p>
          <p>• Preços enviados estarão sujeitos a revisão</p>
          <p>
            • Tamanhos aproximados das ripas: {RIPA_LARGURA}cm (largura) × {RIPA_ALTURA}cm (altura)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
