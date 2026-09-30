import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Search, ArrowRight, Zap, Gauge } from 'lucide-react';
import { VEHICLE_MODELS } from '../../data/vehicles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (slug: string) => void;
  onOpenConfigurator: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
  onOpenConfigurator,
}) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return VEHICLE_MODELS.slice(0, 4);
    const q = query.toLowerCase().trim();
    return VEHICLE_MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.series.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.fuelType.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.features.some((f) => f.name.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search BMW Showroom" maxWidth="2xl">
      <div className="space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model, series, SUV, electric, performance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-[#080a0c] border border-white/20 rounded-lg pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#1c69d4]"
          />
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500 py-1">Quick:</span>
          {['Electric', 'SUV', 'M Performance', 'Sedan', '5 Series', 'X5'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300 transition text-[11px]"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-3 pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            {query.trim() ? `Matching Vehicles (${filtered.length})` : 'Popular Models'}
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No vehicles matched "{query}". Try searching "Electric" or "SUV".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((model) => (
                <div
                  key={model.id}
                  className="bg-[#080a0c] border border-white/10 rounded-lg p-3 hover:border-[#1c69d4] transition flex flex-col justify-between group"
                >
                  <div className="flex gap-3">
                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      className="w-20 h-14 object-cover rounded bg-neutral-900 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#1c69d4] transition">
                        {model.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        From ${model.basePrice.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                        <span className="flex items-center gap-0.5">
                          <Gauge className="w-3 h-3 text-gray-500" /> {model.acceleration}s
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-gray-500" /> {model.horsepower} hp
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => {
                        onSelectModel(model.slug);
                        onClose();
                      }}
                      className="text-[#1c69d4] hover:underline font-semibold flex items-center gap-1"
                    >
                      View Details <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        onOpenConfigurator(model.slug);
                        onClose();
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
