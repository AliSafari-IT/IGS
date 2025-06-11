export type MedicationType = 'tablets' | 'capsules' | 'liquid' | 'topical' | 'inhalers' | 'injections' | 'drops' | 'suppositories' | 'patches' | 'powders';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  inStock: boolean;
  requiresPrescription: boolean;
  dosage: string | null;
  manufacturer: string | null;
  medicationType: MedicationType;
}

export interface ProductFilters {
  sortBy: 'name' | 'name-desc' | 'price-low' | 'price-high';
  filterInStock: boolean;
  priceRange?: [number, number];
  categories?: string[];
  selectedCategories?: string[];
}