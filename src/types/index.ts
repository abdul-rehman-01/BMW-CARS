export type VehicleCategory = 'Sedan' | 'SUV' | 'Coupe' | 'Electric' | 'M Performance';

export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Plug-in Hybrid' | 'All-Electric';

export interface VehicleVariant {
  id: string;
  modelId: string;
  name: string;
  sku: string;
  basePrice: number;
  horsepower: number;
  torqueNm: number;
  accelerationSeconds: number;
  topSpeedKmh: number;
  rangeKm?: number;
  status: 'active' | 'inactive';
}

export interface SpecificationItem {
  id: string;
  variantId?: string;
  key: string;
  label: string;
  value: string;
  unit?: string;
  sortOrder: number;
}

export interface VehicleFeature {
  id: string;
  modelId: string;
  name: string;
  description: string;
  category: 'Performance' | 'Technology' | 'Design' | 'Safety' | 'Comfort';
  sortOrder: number;
}

export interface VehicleMedia {
  id: string;
  modelId: string;
  variantId?: string;
  type: 'image' | 'video';
  url: string;
  altText: string;
  angle?: 'front' | 'side' | 'rear' | 'interior';
  width?: number;
  height?: number;
  sortOrder: number;
}

export interface ConfigOption {
  id: string;
  modelId: string;
  category: 'exterior' | 'wheels' | 'interior' | 'package' | 'accessory';
  name: string;
  code: string;
  priceDelta: number;
  imageUrl?: string;
  colorHex?: string;
  description?: string;
  active: boolean;
}

export interface VehicleModel {
  id: string;
  slug: string;
  name: string;
  series: string;
  category: VehicleCategory;
  tagline: string;
  description: string;
  basePrice: number;
  currency: string;
  status: 'published' | 'draft' | 'archived';
  fuelType: FuelType;
  acceleration: number; // 0-100 km/h in s
  horsepower: number;
  topSpeed: number; // km/h
  electricRange?: number; // km or miles
  imageUrl: string;
  gallery: VehicleMedia[];
  variants: VehicleVariant[];
  specifications: SpecificationItem[];
  features: VehicleFeature[];
  availableOptions: ConfigOption[];
  badge?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface ConfiguratorSelections {
  modelId: string;
  variantId: string;
  exteriorColorId: string;
  wheelId: string;
  interiorId: string;
  packageIds: string[];
}

export interface SavedConfiguration {
  id: string;
  userId?: string;
  shareToken: string;
  modelId: string;
  variantId: string;
  selections: ConfiguratorSelections;
  calculatedPrice: number;
  currency: string;
  createdAt: string;
  title: string;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  rating: number;
  hours: string;
  active: boolean;
}

export interface TestDriveRequest {
  id: string;
  userId?: string;
  modelId: string;
  dealerId: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  consent: boolean;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  referenceNumber: string;
}

export interface Enquiry {
  id: string;
  userId?: string;
  modelId?: string;
  configurationId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  type: 'quote' | 'general' | 'financing';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  referenceNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorUserId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
