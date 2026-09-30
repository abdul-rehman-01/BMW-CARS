import React, { useState, useMemo } from 'react';
import { VehicleModel, ConfiguratorSelections, SavedConfiguration } from '../../types';
import { configuratorService } from '../../services/configuratorService';
import { VEHICLE_MODELS } from '../../data/vehicles';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Share2,
  Bookmark,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Copy,
  CheckCheck
} from 'lucide-react';
import { useToast } from '../ui/ToastContext';

interface VehicleConfiguratorProps {
  initialModelSlug?: string;
  initialVariantId?: string;
  loadedConfig?: SavedConfiguration | null;
  onBack: () => void;
  onBookTestDriveWithBuild: (modelId: string, buildSummary: string) => void;
  currentUserId?: string;
}

const STEP_TITLES = [
  '1. Model & Variant',
  '2. Exterior Color',
  '3. Wheels',
  '4. Interior & Trim',
  '5. Packages & Summary',
];

export const VehicleConfigurator: React.FC<VehicleConfiguratorProps> = ({
  initialModelSlug = '5-series',
  initialVariantId,
  loadedConfig,
  onBack,
  onBookTestDriveWithBuild,
  currentUserId,
}) => {
  const { showToast } = useToast();

  // Find active vehicle
  const [selectedModel, setSelectedModel] = useState<VehicleModel>(() => {
    if (loadedConfig) {
      const found = VEHICLE_MODELS.find((m) => m.id === loadedConfig.modelId);
      if (found) return found;
    }
    const found = VEHICLE_MODELS.find((m) => m.slug === initialModelSlug);
    return found || VEHICLE_MODELS[1]; // default 5 series
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [activeAngle, setActiveAngle] = useState<'front' | 'side' | 'rear' | 'interior'>('front');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [generatedShareToken, setGeneratedShareToken] = useState('');
  const [copied, setCopied] = useState(false);

  // Selections state
  const [selections, setSelections] = useState<ConfiguratorSelections>(() => {
    if (loadedConfig) return loadedConfig.selections;
    const defaults = configuratorService.getDefaultSelections(selectedModel);
    if (initialVariantId) {
      defaults.variantId = initialVariantId;
    }
    return defaults;
  });

  // Calculate pricing
  const calculation = useMemo(() => {
    return configuratorService.calculate(selectedModel, selections);
  }, [selectedModel, selections]);

  // Handle Model switch
  const handleModelChange = (modelId: string) => {
    const newModel = VEHICLE_MODELS.find((m) => m.id === modelId);
    if (!newModel) return;
    setSelectedModel(newModel);
    const defaults = configuratorService.getDefaultSelections(newModel);
    setSelections(defaults);
    setCurrentStep(1);
    showToast(`Switched configuration to ${newModel.name}`);
  };

  const handleVariantSelect = (variantId: string) => {
    setSelections((prev) => ({ ...prev, variantId }));
  };

  const handleExteriorSelect = (optionId: string) => {
    setSelections((prev) => ({ ...prev, exteriorColorId: optionId }));
  };

  const handleWheelSelect = (optionId: string) => {
    setSelections((prev) => ({ ...prev, wheelId: optionId }));
  };

  const handleInteriorSelect = (optionId: string) => {
    setSelections((prev) => ({ ...prev, interiorId: optionId }));
  };

  const handleTogglePackage = (optionId: string) => {
    setSelections((prev) => {
      const exists = prev.packageIds.includes(optionId);
      const updated = exists
        ? prev.packageIds.filter((id) => id !== optionId)
        : [...prev.packageIds, optionId];
      return { ...prev, packageIds: updated };
    });
  };

  const handleReset = () => {
    const defaults = configuratorService.getDefaultSelections(selectedModel);
    setSelections(defaults);
    showToast('Configuration reset to base selections.');
  };

  const handleSaveToAccount = () => {
    const saved = configuratorService.save(selectedModel, selections, currentUserId);
    showToast(`Saved ${selectedModel.name} build to account!`);
    setGeneratedShareToken(saved.shareToken);
  };

  const handleOpenShare = () => {
    if (!generatedShareToken) {
      const saved = configuratorService.save(selectedModel, selections, currentUserId);
      setGeneratedShareToken(saved.shareToken);
    }
    setShareModalOpen(true);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(
      `Check out my custom ${selectedModel.name} build (Code: ${generatedShareToken}) at BMW Digital Showroom!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    showToast('Share link & configuration code copied to clipboard!');
  };

  // Preview Image by angle
  const previewImage = useMemo(() => {
    const found = selectedModel.gallery.find((m) => m.angle === activeAngle);
    if (found) return found.url;
    return selectedModel.imageUrl;
  }, [selectedModel, activeAngle]);

  const exteriorOptions = selectedModel.availableOptions.filter((o) => o.category === 'exterior');
  const wheelOptions = selectedModel.availableOptions.filter((o) => o.category === 'wheels');
  const interiorOptions = selectedModel.availableOptions.filter((o) => o.category === 'interior');
  const packageOptions = selectedModel.availableOptions.filter((o) => o.category === 'package');

  return (
    <div className="pt-20 bg-[#080a0c] text-white min-h-screen flex flex-col justify-between">
      {/* Top Header / Progress Strip */}
      <div className="border-b border-white/10 bg-[#0b0f16] sticky top-20 z-30">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1.5 text-gray-400 hover:text-white rounded transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c69d4]">
                BMW Visual Studio
              </span>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedModel.name}</span>
                <span className="text-gray-500 font-normal">·</span>
                <span className="text-gray-400 text-xs">{calculation.variant.name}</span>
              </h1>
            </div>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="hidden md:flex items-center gap-1.5 text-xs">
            {STEP_TITLES.map((title, idx) => {
              const stepNumber = idx + 1;
              const isActive = currentStep === stepNumber;
              const isPast = currentStep > stepNumber;
              return (
                <button
                  key={title}
                  onClick={() => setCurrentStep(stepNumber)}
                  className={`px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1c69d4] text-white font-semibold'
                      : isPast
                      ? 'bg-white/10 text-gray-300 hover:text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {isPast ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-white rounded transition"
              title="Reset Build"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenShare}
              className="p-2 text-gray-400 hover:text-white rounded transition"
              title="Share Configuration"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToAccount}
              leftIcon={<Bookmark className="w-3.5 h-3.5" />}
            >
              Save Build
            </Button>
          </div>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="max-w-[1536px] mx-auto w-full px-6 lg:px-12 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 360° Visualizer Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-4 sticky top-36">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-[#131822] to-[#0a0d12] border border-white/10 aspect-[16/10] flex items-center justify-center shadow-2xl group">
            {/* Visualizer Image with Color Reflection Effect */}
            <img
              src={previewImage}
              alt="BMW Configured Preview"
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Color Tint Reflection Overlay for Exterior Swatch */}
            {activeAngle !== 'interior' && calculation.selectedExterior?.colorHex && (
              <div
                className="absolute inset-0 mix-blend-color opacity-25 pointer-events-none transition-all duration-700"
                style={{ backgroundColor: calculation.selectedExterior.colorHex }}
              />
            )}

            {/* Live Model Badge */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/15 text-xs font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1c69d4] animate-pulse" />
              <span>{calculation.variant.name}</span>
            </div>

            {/* Selected Spec Tag Floating */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-white/15 text-[11px] text-gray-300">
              {calculation.variant.horsepower} hp · 0–100 km/h: {calculation.variant.accelerationSeconds}s
            </div>

            {/* Angle Switcher Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/15 rounded-full p-1 flex items-center gap-1 shadow-lg">
              {(['front', 'side', 'rear', 'interior'] as const).map((angle) => (
                <button
                  key={angle}
                  onClick={() => setActiveAngle(angle)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                    activeAngle === angle
                      ? 'bg-[#1c69d4] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {angle}
                </button>
              ))}
            </div>
          </div>

          {/* Current Options Summary Bar under canvas */}
          <div className="bg-[#0f141c] border border-white/10 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Paintwork</span>
              <span className="font-semibold text-white truncate block">
                {calculation.selectedExterior?.name || 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Wheels</span>
              <span className="font-semibold text-white truncate block">
                {calculation.selectedWheel?.name || 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Upholstery</span>
              <span className="font-semibold text-white truncate block">
                {calculation.selectedInterior?.name || 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Packages</span>
              <span className="font-semibold text-[#1c69d4] block">
                {calculation.selectedPackages.length} selected
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive 5-Step Option Picker */}
        <div className="lg:col-span-5 bg-[#0f141c] border border-white/10 rounded-lg p-6 space-y-6">
          {/* Step 1: Model & Variant */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-1">
                  Step 1 of 5
                </span>
                <h3 className="text-xl font-bold text-white">Select Vehicle & Powertrain</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Switch model or choose your preferred powertrain output.
                </p>
              </div>

              {/* Model Switcher Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                  Change Model
                </label>
                <select
                  value={selectedModel.id}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-[#080a0c] border border-white/20 rounded p-3 text-xs text-white focus:outline-none focus:border-[#1c69d4] cursor-pointer"
                >
                  {VEHICLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category}) — From ${m.basePrice.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant Selector List */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-300 block">
                  Select Powertrain Trim
                </label>
                {selectedModel.variants.map((variant) => {
                  const isSelected = selections.variantId === variant.id;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant.id)}
                      className={`w-full p-4 rounded-lg text-left transition cursor-pointer border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1c69d4]/15 border-[#1c69d4] text-white shadow-sm'
                          : 'bg-[#080a0c] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{variant.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#1c69d4]" />}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {variant.horsepower} hp · {variant.torqueNm} Nm · 0–100 in {variant.accelerationSeconds}s
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white tabular-nums block">
                          ${variant.basePrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500">Base MSRP</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Exterior Color */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-1">
                  Step 2 of 5
                </span>
                <h3 className="text-xl font-bold text-white">Select Exterior Color</h3>
                <p className="text-xs text-gray-400 mt-1">
                  High-gloss metallic and BMW Individual custom paint finishes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exteriorOptions.map((opt) => {
                  const isSelected = selections.exteriorColorId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleExteriorSelect(opt.id)}
                      className={`p-3.5 rounded-lg border text-left transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-[#1c69d4]/15 border-[#1c69d4] text-white ring-1 ring-[#1c69d4]'
                          : 'bg-[#080a0c] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-white/20 shrink-0 shadow-inner"
                        style={{ backgroundColor: opt.colorHex || '#ffffff' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{opt.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {opt.priceDelta === 0 ? 'Standard Included' : `+$${opt.priceDelta.toLocaleString()}`}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1c69d4] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Wheels */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-1">
                  Step 3 of 5
                </span>
                <h3 className="text-xl font-bold text-white">Select Alloy Wheels</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Precision aerodynamically optimized light-alloy styles.
                </p>
              </div>

              <div className="space-y-3">
                {wheelOptions.map((opt) => {
                  const isSelected = selections.wheelId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleWheelSelect(opt.id)}
                      className={`w-full p-4 rounded-lg border text-left transition cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1c69d4]/15 border-[#1c69d4] text-white ring-1 ring-[#1c69d4]'
                          : 'bg-[#080a0c] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-white">{opt.name}</div>
                        <div className="text-[11px] text-gray-400">
                          Code: {opt.code} · Performance Run-Flat Tires
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-white tabular-nums block">
                          {opt.priceDelta === 0 ? 'Included' : `+$${opt.priceDelta.toLocaleString()}`}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-[#1c69d4] font-semibold">Active Selection</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Interior & Trim */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-1">
                  Step 4 of 5
                </span>
                <h3 className="text-xl font-bold text-white">Select Interior Upholstery</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Hand-crafted Veganza and premium Extended Merino leathers.
                </p>
              </div>

              <div className="space-y-3">
                {interiorOptions.map((opt) => {
                  const isSelected = selections.interiorId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        handleInteriorSelect(opt.id);
                        setActiveAngle('interior');
                      }}
                      className={`w-full p-3.5 rounded-lg border text-left transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-[#1c69d4]/15 border-[#1c69d4] text-white ring-1 ring-[#1c69d4]'
                          : 'bg-[#080a0c] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-white/20 shrink-0 shadow-inner"
                        style={{ backgroundColor: opt.colorHex || '#333333' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-white truncate">{opt.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {opt.priceDelta === 0 ? 'Standard Included' : `+$${opt.priceDelta.toLocaleString()}`}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1c69d4] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Packages & Summary */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c69d4] block mb-1">
                  Step 5 of 5
                </span>
                <h3 className="text-xl font-bold text-white">Add Packages & Finalize</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Enhance your build with driver assistance, executive luxury, and audio systems.
                </p>
              </div>

              <div className="space-y-3">
                {packageOptions.map((pkg) => {
                  const isChecked = selections.packageIds.includes(pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleTogglePackage(pkg.id)}
                      className={`p-4 rounded-lg border text-left transition cursor-pointer flex items-start justify-between gap-4 ${
                        isChecked
                          ? 'bg-[#1c69d4]/15 border-[#1c69d4] text-white'
                          : 'bg-[#080a0c] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isChecked ? 'bg-[#1c69d4] border-[#1c69d4] text-white' : 'border-gray-500'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="font-bold text-xs text-white">{pkg.name}</span>
                        </div>
                        {pkg.description && (
                          <p className="text-[11px] text-gray-400 pl-6 leading-relaxed">
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-white tabular-nums">
                          +${pkg.priceDelta.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="bg-[#080a0c] border border-white/10 rounded-lg p-4 space-y-2 text-xs">
                <div className="font-bold text-white uppercase text-[11px] pb-1 border-b border-white/10">
                  Itemized Price Summary
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Base Vehicle ({calculation.variant.name})</span>
                  <span className="text-white tabular-nums">
                    ${calculation.basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Exterior & Wheels</span>
                  <span className="text-white tabular-nums">
                    +$
                    {(
                      (calculation.selectedExterior?.priceDelta || 0) +
                      (calculation.selectedWheel?.priceDelta || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Interior Upholstery</span>
                  <span className="text-white tabular-nums">
                    +${(calculation.selectedInterior?.priceDelta || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Added Packages ({calculation.selectedPackages.length})</span>
                  <span className="text-white tabular-nums">
                    +$
                    {calculation.selectedPackages
                      .reduce((sum, p) => sum + p.priceDelta, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Total Configured MSRP</span>
                  <span className="text-[#1c69d4] tabular-nums">
                    ${calculation.totalPrice.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  onBookTestDriveWithBuild(
                    selectedModel.id,
                    `${selectedModel.name} ${calculation.variant.name} ($${calculation.totalPrice.toLocaleString()})`
                  )
                }
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                Book Test Drive With This Build
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setShareModalOpen(false)}
          title="Share Your Custom BMW Build"
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-300">
              Your configuration has been saved with a unique share token. You can share this code with an authorized BMW dealer or friend.
            </p>

            <div className="bg-[#080a0c] border border-white/20 rounded p-3 flex items-center justify-between">
              <span className="font-mono text-sm text-[#1c69d4] font-bold">
                {generatedShareToken}
              </span>
              <button
                onClick={handleCopyShare}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="primary" onClick={() => setShareModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
