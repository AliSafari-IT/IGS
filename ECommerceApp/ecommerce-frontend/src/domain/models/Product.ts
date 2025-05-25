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
