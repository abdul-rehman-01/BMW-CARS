import React, { useState } from 'react';
import { VehicleModel, VehicleVariant } from '../../types';
import { ArrowLeft, ArrowRight, Gauge, Zap, Fuel, Shield, Sliders, Calendar, Check, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { storageService } from '../../services/storageService';
import { useToast } from '../ui/ToastContext';

interface ModelDetailPageProps {
  model: VehicleModel;
  onBack: () => void;
  onConfigure: (modelSlug: string, variantId?: string) => void;
  onBookTestDrive: (modelId: string) => void;
  onToggleCompare: (modelId: string) => void;
  isCompared: boolean;
}

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({
  model,
  onBack,
  onConfigure,
  onBookTestDrive,
  onToggleCompare,
  isCompared,
}) => {
  const { showToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<VehicleVariant>(model.variants[0] || {
    id: 'default',
    modelId: model.id,
    name: model.name,
    sku: model.slug,
    basePrice: model.basePrice,
    horsepower: model.horsepower,
    torqueNm: 400,
    accelerationSeconds: model.acceleration,
    topSpeedKmh: model.topSpeed,
    status: 'active'
  });

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(() => {
    return storageService.getFavourites().includes(model.id);
  });

  const mediaList = model.gallery && model.gallery.length > 0 ? model.gallery : [
    {
      id: 'default',
      modelId: model.id,
      type: 'image' as const,
      url: model.imageUrl,
      altText: model.name,
      sortOrder: 1
    }
  ];

  const handleFavoriteToggle = () => {
    storageService.toggleFavourite(model.id);
    setIsFavorited(!isFavorited);
    showToast(!isFavorited ? `Added ${model.name} to favourites` : `Removed ${model.name} from favourites`);
  };

  return (
    <div className="pt-20 bg-[#080a0c] text-white min-h-screen">
      {/* Back & Breadcrumb Bar */}
      <div className="border-b border-white/10 bg-[#0b0f16]">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lineup</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isFavorited
                  ? 'border-red-500 bg-red-950/60 text-red-400'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={isFavorited ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onToggleCompare(model.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-[#1c69d4] border-white text-white'
                  : 'border-white/20 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {isCompared && <Check className="w-3.5 h-3.5" />}
              <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0d14] to-[#080a0c] py-12 lg:py-16">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text / Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#1c69d4] block mb-2">
                {model.category} · {model.series}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
                {model.name}
              </h1>
              <p className="text-base text-gray-300 mt-3 leading-relaxed">
                {model.description}
              </p>
            </div>

            {/* Price & Variant Selection Box */}
            <div className="bg-[#0f141c] border border-white/10 rounded-lg p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-400 uppercase font-semibold">
                  Starting MSRP
                </span>
                <span className="text-2xl font-black text-white tabular-nums">
                  ${selectedVariant.basePrice.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-gray-400">USD</span>
                </span>
              </div>

              {/* Variant Pills */}
              {model.variants && model.variants.length > 1 && (
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-400 block mb-2">
                    Available Powertrain Trims
                  </label>
                  <div className="flex flex-col gap-2">
                    {model.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          selectedVariant.id === v.id
                            ? 'bg-[#1c69d4]/20 border border-[#1c69d4] text-white'
                            : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="font-bold block">{v.name}</span>
                          <span className="text-[10px] text-gray-400">
                            {v.horsepower} hp · 0–100 in {v.accelerationSeconds}s
                          </span>
                        </div>
                        <span className="font-semibold tabular-nums">
                          ${v.basePrice.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => onConfigure(model.slug, selectedVariant.id)}
                  leftIcon={<Sliders className="w-4 h-4" />}
                >
                  Configure This Build
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => onBookTestDrive(model.id)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Book Test Drive
                </Button>
              </div>
            </div>
          </div>

          {/* Right Vehicle Gallery & Angle Switcher */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-[#0d1219] border border-white/10 aspect-video flex items-center justify-center">
              <img
                src={mediaList[activeMediaIndex]?.url || model.imageUrl}
                alt={mediaList[activeMediaIndex]?.altText || model.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] font-semibold text-gray-200">
                {mediaList[activeMediaIndex]?.angle ? `${mediaList[activeMediaIndex].angle?.toUpperCase()} VIEW` : 'EXTERIOR VIEW'}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mediaList.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`w-24 h-16 rounded overflow-hidden border transition shrink-0 cursor-pointer ${
                      activeMediaIndex === idx
                        ? 'border-[#1c69d4] ring-2 ring-[#1c69d4]/30'
                        : 'border-white/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Specifications Ribbon */}
      <section className="bg-[#0f141c] border-y border-white/10 py-6">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs uppercase font-bold">
              <Zap className="w-4 h-4 text-[#1c69d4]" />
              <span>Horsepower</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {selectedVariant.horsepower} <span className="text-xs font-normal text-gray-400">hp</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs uppercase font-bold">
              <Gauge className="w-4 h-4 text-[#1c69d4]" />
              <span>0–100 km/h</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {selectedVariant.accelerationSeconds} <span className="text-xs font-normal text-gray-400">sec</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs uppercase font-bold">
              <Fuel className="w-4 h-4 text-[#1c69d4]" />
              <span>Drivetrain</span>
            </div>
            <div className="text-2xl font-black text-white truncate px-2">
              {model.fuelType}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs uppercase font-bold">
              <Shield className="w-4 h-4 text-[#1c69d4]" />
              <span>Top Track Speed</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums">
              {selectedVariant.topSpeedKmh} <span className="text-xs font-normal text-gray-400">km/h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 max-w-[1536px] mx-auto px-6 lg:px-12">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-2">
            Engineering & Technology
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Signature Highlights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {model.features.map((feat) => (
            <div
              key={feat.id}
              className="bg-[#0f141c] border border-white/10 rounded-lg p-6 space-y-3 hover:border-white/20 transition"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c69d4] block">
                {feat.category}
              </span>
              <h3 className="text-lg font-bold text-white">{feat.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Full Technical Specifications Table */}
      <section className="py-16 bg-[#0b0f16] border-t border-white/10">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-black text-white tracking-tight mb-8 font-display">
            Technical Specifications: {selectedVariant.name}
          </h2>

          <div className="bg-[#080a0c] border border-white/10 rounded-lg overflow-hidden divide-y divide-white/5">
            {model.specifications.map((spec) => (
              <div
                key={spec.id}
                className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs hover:bg-white/[0.02] transition"
              >
                <div className="font-semibold text-gray-300 sm:col-span-1">{spec.label}</div>
                <div className="text-white font-medium sm:col-span-2 mt-1 sm:mt-0 tabular-nums">
                  {spec.value} {spec.unit || ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 z-30 bg-[#080a0c]/95 backdrop-blur-md border-t border-white/10 py-4 px-6 lg:px-12">
        <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-gray-400 block">Configured Starting MSRP</span>
            <span className="text-xl font-bold text-white tabular-nums">
              ${selectedVariant.basePrice.toLocaleString()} USD
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="flex-1 sm:flex-initial"
              onClick={() => onBookTestDrive(model.id)}
            >
              Book Test Drive
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 sm:flex-initial"
              onClick={() => onConfigure(model.slug, selectedVariant.id)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Configure Model
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
