import React, { useState } from 'react';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { VehicleModel } from '../../types';
import { Button } from '../ui/Button';
import { ArrowLeft, Plus, X, ArrowRight, Gauge, Zap, Fuel, DollarSign, Sliders, Calendar } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface VehicleComparisonProps {
  compareIds: string[];
  onRemoveFromCompare: (modelId: string) => void;
  onAddToCompare: (modelId: string) => void;
  onBack: () => void;
  onConfigure: (slug: string) => void;
  onBookTestDrive: (modelId: string) => void;
}

export const VehicleComparison: React.FC<VehicleComparisonProps> = ({
  compareIds,
  onRemoveFromCompare,
  onAddToCompare,
  onBack,
  onConfigure,
  onBookTestDrive,
}) => {
  const { showToast } = useToast();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Selected models (fallback to first two if empty)
  const models: VehicleModel[] = (
    compareIds.length > 0
      ? compareIds.map((id) => VEHICLE_MODELS.find((m) => m.id === id)!).filter(Boolean)
      : [VEHICLE_MODELS[0], VEHICLE_MODELS[1]]
  ).slice(0, 3);

  const availableToAdd = VEHICLE_MODELS.filter((m) => !models.some((curr) => curr.id === m.id));

  return (
    <div className="pt-24 pb-20 bg-[#080a0c] text-white min-h-screen">
      <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
        {/* Header Bar */}
        <div className="py-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1.5 text-gray-400 hover:text-white rounded transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4]">
                Side-by-Side Analysis
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Vehicle Comparison
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded bg-white/10 border-white/20 text-[#1c69d4] focus:ring-0"
              />
              <span>Highlight Differences</span>
            </label>

            {models.length < 3 && availableToAdd.length > 0 && (
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      onAddToCompare(e.target.value);
                      showToast('Vehicle added to comparison.');
                    }
                  }}
                  value=""
                  className="bg-[#1c69d4] hover:bg-[#0053b8] text-white text-xs font-semibold py-2 px-3 rounded cursor-pointer appearance-none pr-8"
                >
                  <option value="" disabled>+ Add Another Model</option>
                  {availableToAdd.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0f141c]">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="mt-8 overflow-x-auto custom-scroll">
          <div className="min-w-[700px] border border-white/10 rounded-lg overflow-hidden bg-[#0f141c]">
            {/* Model Headers Row */}
            <div
              className="grid divide-x divide-white/10 border-b border-white/10 bg-[#080a0c]"
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="p-6 flex items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Specification Metric
                </span>
              </div>

              {models.map((model) => (
                <div key={model.id} className="p-6 relative group flex flex-col justify-between">
                  {models.length > 1 && (
                    <button
                      onClick={() => onRemoveFromCompare(model.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-400 p-1 rounded hover:bg-white/5 transition"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div className="space-y-3">
                    <img
                      src={model.imageUrl}
                      alt={model.name}
                      className="w-full h-32 object-cover rounded bg-neutral-900"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#1c69d4] tracking-wider block">
                        {model.category}
                      </span>
                      <h3 className="text-base font-bold text-white font-display">{model.name}</h3>
                      <div className="text-sm font-black text-white tabular-nums mt-1">
                        ${model.basePrice.toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onConfigure(model.slug)}
                      leftIcon={<Sliders className="w-3.5 h-3.5" />}
                    >
                      Build
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onBookTestDrive(model.id)}
                      leftIcon={<Calendar className="w-3.5 h-3.5" />}
                    >
                      Test Drive
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Row: Horsepower */}
            <div
              className={`grid divide-x divide-white/10 border-b border-white/5 p-4 text-xs ${
                highlightDifferences ? 'bg-blue-950/20' : ''
              }`}
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#1c69d4]" />
                <span>Horsepower</span>
              </div>
              {models.map((m) => (
                <div key={m.id} className="font-bold text-white tabular-nums">
                  {m.horsepower} hp
                </div>
              ))}
            </div>

            {/* Spec Row: Acceleration */}
            <div
              className={`grid divide-x divide-white/10 border-b border-white/5 p-4 text-xs ${
                highlightDifferences ? 'bg-blue-950/20' : ''
              }`}
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#1c69d4]" />
                <span>0–100 km/h (0–60 mph)</span>
              </div>
              {models.map((m) => (
                <div key={m.id} className="font-bold text-white tabular-nums">
                  {m.acceleration} seconds
                </div>
              ))}
            </div>

            {/* Spec Row: Drivetrain / Fuel */}
            <div
              className="grid divide-x divide-white/10 border-b border-white/5 p-4 text-xs"
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-[#1c69d4]" />
                <span>Powertrain Type</span>
              </div>
              {models.map((m) => (
                <div key={m.id} className="text-white font-medium">
                  {m.fuelType}
                </div>
              ))}
            </div>

            {/* Spec Row: Electric Range */}
            <div
              className={`grid divide-x divide-white/10 border-b border-white/5 p-4 text-xs ${
                highlightDifferences ? 'bg-blue-950/20' : ''
              }`}
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300">Electric Range</div>
              {models.map((m) => (
                <div key={m.id} className="text-white">
                  {m.electricRange ? `${m.electricRange} miles` : 'N/A (Combustion/Mild)'}
                </div>
              ))}
            </div>

            {/* Spec Row: Top Track Speed */}
            <div
              className="grid divide-x divide-white/10 border-b border-white/5 p-4 text-xs"
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300">Top Track Speed</div>
              {models.map((m) => (
                <div key={m.id} className="text-white tabular-nums">
                  {m.topSpeed} km/h (155 mph)
                </div>
              ))}
            </div>

            {/* Spec Row: Standard Features Highlights */}
            <div
              className="grid divide-x divide-white/10 p-4 text-xs"
              style={{ gridTemplateColumns: `200px repeat(${models.length}, 1fr)` }}
            >
              <div className="font-semibold text-gray-300">Signature Technologies</div>
              {models.map((m) => (
                <div key={m.id} className="space-y-1 text-gray-300">
                  {m.features.slice(0, 3).map((f) => (
                    <div key={f.id} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1c69d4] shrink-0 mt-1.5" />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
