export type ProductCategory = 
  | 'functional' 
  | 'decor' 
  | 'cosplay' 
  | 'organizer' 
  | 'mechanical' 
  | 'geek' 
  | 'tools';

export interface CustomMaterial {
  id: string;
  name: string; // Ex: PLA, PETG, ABS, TPU, Resina, PETG-CF, Nylon, ASA
  priceMultiplier: number; // Ex: 1.0, 1.15, 1.4
  description?: string;
}

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
  availableMaterials: string[]; // Lista de nomes de materiais (ex: ['PLA', 'PETG', 'Nylon'])
  availableColors: ProductColor[];
  stlUrl?: string; // URL web ou Data URL base64 do modelo 3D (.stl / .3mf)
  imageUrl: string;
  featured?: boolean;
  inStock: boolean;
  tags: string[];
}

export interface QuoteCustomization {
  productId: string;
  material: string;
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
  customMaterials: CustomMaterial[]; // Materiais e filamentos dinâmicos
  githubRepo?: string;
  githubToken?: string;
}
