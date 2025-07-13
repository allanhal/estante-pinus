import { Settings, Ruler, Layers, Grid } from "lucide-react";

const Controls = ({
  width,
  height,
  depth,
  shelves,
  slatsPerShelf,
  setWidth,
  setHeight,
  setDepth,
  setShelves,
  setSlatsPerShelf,
}) => {
  const handleInputChange = (value, onChange, min, max) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 inset-shadow-sm border border-gray-300 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="text-amber-600" size={24} />
        <h2 className="text-xs font-semibold text-gray-800">
          Customização da Prateleira
        </h2>
      </div>

      <div className="space-y-6">
        {/* Width Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="text-amber-600" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Largura
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="200"
                max="400"
                value={width}
                onChange={(e) =>
                  handleInputChange(e.target.value, setWidth, 200, 400)
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min="200"
            max="400"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Height Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="text-amber-600 rotate-90" size={18} />
              <label className="text-xs font-medium text-gray-700">
                Altura
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="150"
                max="350"
                value={height}
                onChange={(e) =>
                  handleInputChange(e.target.value, setHeight, 150, 350)
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min="150"
            max="350"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
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
                min="80"
                max="200"
                value={depth}
                onChange={(e) =>
                  handleInputChange(e.target.value, setDepth, 80, 200)
                }
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            min="80"
            max="200"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Shelves Control */}
        <div className="space-y-3">
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
                min="2"
                max="8"
                value={shelves}
                onChange={(e) =>
                  handleInputChange(e.target.value, setShelves, 2, 8)
                }
                className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            value={shelves}
            onChange={(e) => setShelves(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

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
                min="3"
                max="10"
                value={slatsPerShelf}
                onChange={(e) =>
                  handleInputChange(e.target.value, setSlatsPerShelf, 3, 10)
                }
                className="w-12 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <input
            type="range"
            min="3"
            max="10"
            value={slatsPerShelf}
            onChange={(e) => setSlatsPerShelf(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Use os sliders ou digite valores diretamente nos campos</p>
          <p>• Ripas: 2cm (largura) × 5cm (profundidade)</p>
          <p>• A estante rotaciona automaticamente para melhor visualização</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
