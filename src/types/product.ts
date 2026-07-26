export type CaffeineLevel = "low" | "medium" | "high";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type BrewingMethod = {
  name: string;
  vessel: string;
  volumeMl: number;
  teaGrams: number;
  temperatureC: number;
  steepTimes: string[];
  infusions: number;
  note: string;
};

export type ProductVariant = {
  id: string;
  label: string;
  weightGrams?: number;
  packaging: "tui-giay" | "hop-thiec" | "hop-qua";
  price: number;
  compareAtPrice?: number;
  stock: number;
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  collection?: string;
  region: string;
  teaGarden?: string;
  grade: string;
  harvestSeason: string;
  harvestDate?: string;
  pluckingStandard: string;
  cultivar?: string;
  dryLeaf: string;
  aroma: string[];
  liquorColor: string;
  taste: string[];
  aftertaste: string;
  caffeineLevel: CaffeineLevel;
  brewingMethods: BrewingMethod[];
  storageInstructions: string;
  shelfLife: string;
  certifications: string[];
  badges: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  featured: boolean;
  relatedProductIds: string[];
};
