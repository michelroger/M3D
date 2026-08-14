export type ProductCategory = 
  | 'functional' 
  | 'decor' 
  | 'cosplay' 
  | 'organizer' 
  | 'mechanical' 
  | 'geek' 
  | 'tools';

export type FilamentMaterial = 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'Resina';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductDimensions {
  x: number; // mm
  y: number; // mm
  z: number; // mm
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  basePrice: number; // Preço inicial de venda ao público em R$
  dimensions: ProductDimensions;
  weightGrams: number;
  printTimeHours: number;
  availableMaterials: FilamentMaterial[];
  availableColors: ProductColor[];
  stlUrl?: string; // URL do modelo 3D estático ou customizado
  imageUrl: string;
  featured?: boolean;
  inStock: boolean;
  tags: string[];
}

export interface QuoteCustomization {
  productId: string;
  material: FilamentMaterial;
  color: ProductColor;
  scaleMultiplier: number; // Ex: 1 = 100%, 1.5 = 150%
  infillPercent: number; // Ex: 15%, 20%, 50%, 100%
  quantity: number;
  customNotes: string;
  calculatedPrice: number;
}

export interface CostCalculationParams {
  filamentWeightGrams: number;
  filamentCostPerKg: number; // Ex: R$ 120,00 por kg
  printTimeHours: number;
  printTimeMinutes: number;
  powerWatts: number; // Ex: 150W para impressoras FDM comuns
  kwhCost: number; // Ex: R$ 0,95 por kWh
  depreciationCostPerHour: number; // Ex: R$ 1,50 por hora de uso da máquina
  failureRiskRatePercent: number; // Ex: 10% de taxa de perda
  postProcessingLaborCost: number; // Ex: R$ 15,00 acabamento manual
  desiredProfitMarginPercent: number; // Ex: 100% de margem sobre custo
}

export interface CostCalculationResult {
  filamentCost: number;
  electricityCost: number;
  depreciationCost: number;
  riskBufferCost: number;
  laborCost: number;
  totalProductionCost: number;
  profitAmount: number;
  suggestedPrice: number;
}

export interface StoreSettings {
  whatsappNumber: string; // Ex: 5511999999999
  storeName: string;
  customMessageTemplate: string;
  adminPinHash: string; // SHA-256 hash da senha
  adminSalt: string;
  currencySymbol: string;
  githubRepo?: string; // Ex: "usuario/m3d"
  githubToken?: string; // Token encriptado localmente
}
