import { ConfigOption, ConfiguratorSelections, SavedConfiguration, VehicleModel, VehicleVariant } from '../types';
import { storageService } from './storageService';

export interface CalculationResult {
  basePrice: number;
  optionsTotal: number;
  totalPrice: number;
  variant: VehicleVariant;
  selectedExterior?: ConfigOption;
  selectedWheel?: ConfigOption;
  selectedInterior?: ConfigOption;
  selectedPackages: ConfigOption[];
}

export const configuratorService = {
  getDefaultSelections(model: VehicleModel): ConfiguratorSelections {
    const defaultVariant = model.variants[0];
    const defaultExterior = model.availableOptions.find((o) => o.category === 'exterior' && o.priceDelta === 0) || model.availableOptions.find((o) => o.category === 'exterior');
    const defaultWheel = model.availableOptions.find((o) => o.category === 'wheels' && o.priceDelta === 0) || model.availableOptions.find((o) => o.category === 'wheels');
    const defaultInterior = model.availableOptions.find((o) => o.category === 'interior' && o.priceDelta === 0) || model.availableOptions.find((o) => o.category === 'interior');

    return {
      modelId: model.id,
      variantId: defaultVariant ? defaultVariant.id : '',
      exteriorColorId: defaultExterior ? defaultExterior.id : '',
      wheelId: defaultWheel ? defaultWheel.id : '',
      interiorId: defaultInterior ? defaultInterior.id : '',
      packageIds: []
    };
  },

  calculate(model: VehicleModel, selections: ConfiguratorSelections): CalculationResult {
    const variant = model.variants.find((v) => v.id === selections.variantId) || model.variants[0];
    const basePrice = variant ? variant.basePrice : model.basePrice;

    const selectedExterior = model.availableOptions.find((o) => o.id === selections.exteriorColorId);
    const selectedWheel = model.availableOptions.find((o) => o.id === selections.wheelId);
    const selectedInterior = model.availableOptions.find((o) => o.id === selections.interiorId);
    const selectedPackages = model.availableOptions.filter((o) => selections.packageIds.includes(o.id));

    let optionsTotal = 0;
    if (selectedExterior) optionsTotal += selectedExterior.priceDelta;
    if (selectedWheel) optionsTotal += selectedWheel.priceDelta;
    if (selectedInterior) optionsTotal += selectedInterior.priceDelta;
    selectedPackages.forEach((pkg) => {
      optionsTotal += pkg.priceDelta;
    });

    return {
      basePrice,
      optionsTotal,
      totalPrice: basePrice + optionsTotal,
      variant,
      selectedExterior,
      selectedWheel,
      selectedInterior,
      selectedPackages
    };
  },

  save(model: VehicleModel, selections: ConfiguratorSelections, userId?: string): SavedConfiguration {
    const calc = this.calculate(model, selections);
    const shareToken = `CFG-${model.slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const saved: SavedConfiguration = {
      id: `cfg-${Date.now()}`,
      userId,
      shareToken,
      modelId: model.id,
      variantId: calc.variant.id,
      selections,
      calculatedPrice: calc.totalPrice,
      currency: model.currency,
      createdAt: new Date().toISOString(),
      title: `${model.name} (${calc.variant.name})`
    };

    storageService.saveConfiguration(saved);
    storageService.addAuditLog('CONFIGURATION_SAVED', 'Configuration', saved.id, {
      modelId: model.id,
      variantName: calc.variant.name,
      totalPrice: calc.totalPrice,
      shareToken
    });

    return saved;
  },

  getByShareToken(token: string): SavedConfiguration | undefined {
    const all = storageService.getConfigurations();
    return all.find((c) => c.shareToken.toLowerCase() === token.toLowerCase().trim());
  },

  getById(id: string): SavedConfiguration | undefined {
    const all = storageService.getConfigurations();
    return all.find((c) => c.id === id);
  }
};
