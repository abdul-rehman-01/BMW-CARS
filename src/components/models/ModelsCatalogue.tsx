import React, { useState, useMemo } from 'react';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { VehicleCategory } from '../../types';
import { Search, SlidersHorizontal, ArrowRight, Gauge, Fuel, Zap, Check, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface ModelsCatalogueProps {
  onSelectModel: (slug: string) => void;
  onConfigureModel: (slug: string) => void;
  compareList: string[];
  onToggleCompare: (modelId: string) => void;
  onOpenCompare: () => void;
}

export const ModelsCatalogue: React.FC<ModelsCatalogueProps> = ({
  onSelectModel,
  onConfigureModel,
  compareList,
  onToggleCompare,
  onOpenCompare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'All'>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'power-desc' | 'name-asc'>('price-asc');

  const categories: Array<VehicleCategory | 'All'> = ['All', 'Sedan', 'SUV', 'Electric', 'M Performance'];

  const filteredModels = useMemo(() => {
    return VEHICLE_MODELS.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedFuel !== 'All' && !m.fuelType.toLowerCase().includes(selectedFuel.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          m.name.toLowerCase().includes(q) ||
          m.series.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'power-desc':
          return b.horsepower - a.horsepower;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [selectedCategory, selectedFuel, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-[#080a0c] text-white min-h-screen">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        {/* Page Header */}
        <div className="py-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-2">
              BMW Digital Showroom
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display">
              All BMW Models
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Explore the entire range of sedans, Sports Activity Vehicles, electrified innovations, and high-performance M models.
            </p>
          </div>

          {/* Compare Toolbar Float */}
          {compareList.length > 0 && (
            <div className="bg-[#121924] border border-[#1c69d4]/50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-200">
                {compareList.length} of 3 vehicles selected
              </span>
              <Button size="sm" variant="primary" onClick={onOpenCompare}>
                Compare Now ({compareList.length})
              </Button>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="py-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Segmented Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 custom-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1c69d4] text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Tools: Search & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Fuel Type Selector */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-gray-300">
                <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-[#0f141c]">All Fuel Types</option>
                  <option value="Gasoline" className="bg-[#0f141c]">Gasoline</option>
                  <option value="Hybrid" className="bg-[#0f141c]">Mild & Plug-in Hybrid</option>
                  <option value="Electric" className="bg-[#0f141c]">All-Electric</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-gray-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="price-asc" className="bg-[#0f141c]">Price: Low to High</option>
                  <option value="price-desc" className="bg-[#0f141c]">Price: High to Low</option>
                  <option value="power-desc" className="bg-[#0f141c]">Highest Horsepower</option>
                  <option value="name-asc" className="bg-[#0f141c]">Model Name A–Z</option>
                </select>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#1c69d4]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <span>Showing {filteredModels.length} models</span>
            {(selectedCategory !== 'All' || selectedFuel !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedFuel('All');
                  setSearchQuery('');
                }}
                className="text-[#1c69d4] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#0f141c] rounded-lg border border-white/10">
            <SlidersHorizontal className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Vehicles Match Your Filter</h3>
            <p className="text-xs text-gray-400">
              Try adjusting your category, fuel choice, or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredModels.map((model) => {
              const isCompared = compareList.includes(model.id);

              return (
                <div
                  key={model.id}
                  className="bg-[#0f141c] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between group hover:border-[#1c69d4]/60 transition duration-300 shadow-lg"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="h-56 overflow-hidden relative bg-[#080a0c]">
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-black/70 backdrop-blur-sm text-gray-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-white/10">
                          {model.category}
                        </span>
                        {model.badge && (
                          <span className="bg-[#1c69d4] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            {model.badge}
                          </span>
                        )}
                      </div>

                      {/* Compare Checkbox Trigger */}
                      <button
                        onClick={() => onToggleCompare(model.id)}
                        className={`absolute top-3 right-3 p-1.5 rounded backdrop-blur-md border text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                          isCompared
                            ? 'bg-[#1c69d4] border-white text-white'
                            : 'bg-black/60 border-white/20 text-gray-300 hover:text-white hover:bg-black/80'
                        }`}
                        title={isCompared ? 'Remove from compare' : 'Add to compare'}
                      >
                        {isCompared ? <Check className="w-3.5 h-3.5" /> : null}
                        <span className="text-[10px] uppercase">Compare</span>
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#1c69d4] transition font-display">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {model.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-white/10 text-center">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Power</span>
                          <span className="text-xs font-bold text-white tabular-nums">
                            {model.horsepower} hp
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">0–100 km/h</span>
                          <span className="text-xs font-bold text-white tabular-nums">
                            {model.acceleration}s
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase">Drivetrain</span>
                          <span className="text-xs font-bold text-white truncate block">
                            {model.fuelType === 'All-Electric' ? 'eDrive' : model.fuelType.replace('Gasoline', 'Petrol')}
                          </span>
                        </div>
                      </div>

                      {/* Price Tag */}
                      <div className="mt-4 flex items-baseline justify-between">
                        <span className="text-xs text-gray-400">Starting MSRP</span>
                        <span className="text-lg font-black text-white tabular-nums">
                          ${model.basePrice.toLocaleString()}{' '}
                          <span className="text-[11px] font-normal text-gray-400">USD</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onSelectModel(model.slug)}
                      className="py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded text-xs font-bold uppercase tracking-wider transition text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onConfigureModel(model.slug)}
                      className="py-2.5 px-3 bg-[#1c69d4] hover:bg-[#0053b8] text-white rounded text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer shadow-sm"
                    >
                      Build & Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
