import React from 'react';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { ArrowRight, Fuel, Gauge, Zap } from 'lucide-react';

interface ExploreModelsLineupProps {
  onSelectModel: (slug: string) => void;
  onViewAllModels: () => void;
}

export const ExploreModelsLineup: React.FC<ExploreModelsLineupProps> = ({
  onSelectModel,
  onViewAllModels,
}) => {
  return (
    <section className="py-20 bg-white text-neutral-900 border-t border-gray-200" id="models">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#1c69d4] block mb-2">
              Our Lineup
            </span>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 font-display">
              Explore Our Models
            </h2>
            <p className="text-sm text-neutral-500 mt-1.5">
              Find the perfect BMW for your lifestyle.
            </p>
          </div>

          <button
            onClick={onViewAllModels}
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1c69d4] hover:text-[#0053b8] group transition cursor-pointer"
          >
            <span>View All Models</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Models Grid: 6 Distinct Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {VEHICLE_MODELS.slice(0, 6).map((model) => (
            <article
              key={model.id}
              className="bg-gray-50 border border-gray-200 rounded-sm flex flex-col justify-between overflow-hidden card-zoom group hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <div className="h-44 overflow-hidden bg-gray-100 relative">
                  <img
                    alt={model.name}
                    className="w-full h-full object-cover car-img"
                    src={model.imageUrl}
                  />
                  {model.badge && (
                    <span className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      {model.badge}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-neutral-900 font-display">{model.name}</h3>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{model.tagline}</p>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-xs">
                    <span className="text-neutral-500 block text-[11px]">
                      From{' '}
                      <strong className="text-neutral-900 font-bold tabular-nums">
                        ${model.basePrice.toLocaleString()}
                      </strong>
                    </span>

                    <div className="mt-2.5 space-y-1 text-[11px] text-neutral-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{model.fuelType}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>0–100 km/h: {model.acceleration}s</span>
                      </div>

                      {model.electricRange && (
                        <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                          <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Range: up to {model.electricRange} mi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 mt-3">
                <button
                  onClick={() => onSelectModel(model.slug)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1c69d4] hover:text-[#0053b8] cursor-pointer"
                >
                  <span>Explore Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
