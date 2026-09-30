import { VehicleCategory, VehicleModel } from '../types';
import { storageService } from './storageService';

export const modelService = {
  getAllModels(includeDrafts = false): VehicleModel[] {
    const all = storageService.getModels();
    if (includeDrafts) return all;
    return all.filter((m) => m.status === 'published');
  },

  getModelBySlug(slug: string): VehicleModel | undefined {
    const all = storageService.getModels();
    return all.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
  },

  getModelById(id: string): VehicleModel | undefined {
    const all = storageService.getModels();
    return all.find((m) => m.id === id);
  },

  filterModels(params: {
    category?: VehicleCategory | 'All';
    fuelType?: string;
    maxPrice?: number;
    searchQuery?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'power-desc' | 'name-asc';
  }): VehicleModel[] {
    let result = this.getAllModels();

    if (params.category && params.category !== 'All') {
      result = result.filter((m) => m.category === params.category);
    }

    if (params.fuelType && params.fuelType !== 'All') {
      result = result.filter((m) => m.fuelType.toLowerCase().includes(params.fuelType!.toLowerCase()));
    }

    if (params.maxPrice && params.maxPrice > 0) {
      result = result.filter((m) => m.basePrice <= params.maxPrice!);
    }

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    if (params.sortBy) {
      result = [...result].sort((a, b) => {
        switch (params.sortBy) {
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
    }

    return result;
  },

  updateModel(updated: VehicleModel): void {
    const all = storageService.getModels();
    const idx = all.findIndex((m) => m.id === updated.id);
    if (idx >= 0) {
      all[idx] = updated;
      storageService.saveModels(all);
      storageService.addAuditLog('MODEL_UPDATED', 'VehicleModel', updated.id, { name: updated.name, status: updated.status });
    }
  },

  togglePublishStatus(id: string): VehicleModel | undefined {
    const all = storageService.getModels();
    const target = all.find((m) => m.id === id);
    if (target) {
      target.status = target.status === 'published' ? 'draft' : 'published';
      storageService.saveModels(all);
      storageService.addAuditLog('MODEL_STATUS_CHANGED', 'VehicleModel', id, { newStatus: target.status });
      return target;
    }
    return undefined;
  },

  resetDefaults(): VehicleModel[] {
    const reset = storageService.resetModels();
    storageService.addAuditLog('MODELS_RESET_DEFAULTS', 'VehicleModel');
    return reset;
  }
};
