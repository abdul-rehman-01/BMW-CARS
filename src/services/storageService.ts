import { SavedConfiguration, TestDriveRequest, Enquiry, AuditLog, User, VehicleModel } from '../types';
import { VEHICLE_MODELS } from '../data/vehicles';

const STORAGE_KEYS = {
  CONFIGURATIONS: 'bmw_saved_configurations',
  FAVOURITES: 'bmw_user_favourites',
  TEST_DRIVES: 'bmw_test_drive_requests',
  ENQUIRIES: 'bmw_enquiries',
  AUDIT_LOGS: 'bmw_audit_logs',
  MODELS: 'bmw_vehicle_models',
  CURRENT_USER: 'bmw_current_user',
  ALL_USERS: 'bmw_registered_users',
};

// Safe JSON parser
function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write to localStorage for key ${key}:`, error);
  }
}

export const storageService = {
  // Models
  getModels(): VehicleModel[] {
    const stored = getStorageItem<VehicleModel[]>(STORAGE_KEYS.MODELS, []);
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.MODELS, VEHICLE_MODELS);
      return VEHICLE_MODELS;
    }
    return stored;
  },

  saveModels(models: VehicleModel[]): void {
    setStorageItem(STORAGE_KEYS.MODELS, models);
  },

  resetModels(): VehicleModel[] {
    setStorageItem(STORAGE_KEYS.MODELS, VEHICLE_MODELS);
    return VEHICLE_MODELS;
  },

  // Saved Configurations
  getConfigurations(userId?: string): SavedConfiguration[] {
    const all = getStorageItem<SavedConfiguration[]>(STORAGE_KEYS.CONFIGURATIONS, []);
    if (userId) {
      return all.filter((cfg) => cfg.userId === userId);
    }
    return all;
  },

  saveConfiguration(config: SavedConfiguration): void {
    const all = getStorageItem<SavedConfiguration[]>(STORAGE_KEYS.CONFIGURATIONS, []);
    const existingIndex = all.findIndex((c) => c.id === config.id);
    if (existingIndex >= 0) {
      all[existingIndex] = config;
    } else {
      all.unshift(config);
    }
    setStorageItem(STORAGE_KEYS.CONFIGURATIONS, all);
  },

  deleteConfiguration(id: string): void {
    const all = getStorageItem<SavedConfiguration[]>(STORAGE_KEYS.CONFIGURATIONS, []);
    setStorageItem(STORAGE_KEYS.CONFIGURATIONS, all.filter((c) => c.id !== id));
  },

  // Favourites
  getFavourites(userId?: string): string[] {
    const key = userId ? `${STORAGE_KEYS.FAVOURITES}_${userId}` : STORAGE_KEYS.FAVOURITES;
    return getStorageItem<string[]>(key, ['bmw-3-series', 'bmw-x5']);
  },

  toggleFavourite(modelId: string, userId?: string): string[] {
    const key = userId ? `${STORAGE_KEYS.FAVOURITES}_${userId}` : STORAGE_KEYS.FAVOURITES;
    const current = getStorageItem<string[]>(key, []);
    const updated = current.includes(modelId)
      ? current.filter((id) => id !== modelId)
      : [...current, modelId];
    setStorageItem(key, updated);
    return updated;
  },

  // Test Drives
  getTestDrives(): TestDriveRequest[] {
    return getStorageItem<TestDriveRequest[]>(STORAGE_KEYS.TEST_DRIVES, [
      {
        id: 'td-init-1',
        name: 'Alexander Wright',
        email: 'alex.wright@example.com',
        phone: '(555) 234-5678',
        modelId: 'bmw-x5',
        dealerId: 'dealer-manhattan',
        preferredDate: '2026-10-15',
        preferredTime: '11:00 AM',
        notes: 'Interested in comparing the PHEV xDrive50e with the M60i.',
        consent: true,
        status: 'scheduled',
        createdAt: '2026-09-28T14:30:00.000Z',
        referenceNumber: 'TD-2026-84912'
      }
    ]);
  },

  saveTestDrive(req: TestDriveRequest): void {
    const all = this.getTestDrives();
    all.unshift(req);
    setStorageItem(STORAGE_KEYS.TEST_DRIVES, all);
  },

  updateTestDriveStatus(id: string, status: TestDriveRequest['status']): void {
    const all = this.getTestDrives();
    const item = all.find((td) => td.id === id);
    if (item) {
      item.status = status;
      setStorageItem(STORAGE_KEYS.TEST_DRIVES, all);
    }
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    return getStorageItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, [
      {
        id: 'eq-init-1',
        name: 'Sophia Martinez',
        email: 'sophia.m@example.com',
        phone: '(555) 876-5432',
        modelId: 'bmw-i5-ix',
        message: 'Looking for corporate lease financing terms on two i5 eDrive40 units.',
        type: 'financing',
        consent: true,
        status: 'new',
        createdAt: '2026-09-29T10:15:00.000Z',
        referenceNumber: 'EQ-2026-30291'
      }
    ]);
  },

  saveEnquiry(enquiry: Enquiry): void {
    const all = this.getEnquiries();
    all.unshift(enquiry);
    setStorageItem(STORAGE_KEYS.ENQUIRIES, all);
  },

  updateEnquiryStatus(id: string, status: Enquiry['status']): void {
    const all = this.getEnquiries();
    const item = all.find((eq) => eq.id === id);
    if (item) {
      item.status = status;
      setStorageItem(STORAGE_KEYS.ENQUIRIES, all);
    }
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStorageItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        actorEmail: 'system@bmw-demo.com',
        action: 'SYSTEM_BOOTSTRAP',
        entityType: 'System',
        metadata: { version: '2026.1', region: 'NA' },
        createdAt: '2026-09-29T08:00:00.000Z'
      }
    ]);
  },

  addAuditLog(action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>, actorEmail?: string): void {
    const all = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      entityType,
      entityId,
      metadata,
      actorEmail: actorEmail || 'guest@user.bmw',
      createdAt: new Date().toISOString()
    };
    all.unshift(newLog);
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, all.slice(0, 100)); // keep last 100 logs
  },

  // Current User
  getCurrentUser(): User | null {
    return getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  }
};
