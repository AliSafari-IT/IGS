export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  description?: string;
  inStock?: boolean;
  requiresPrescription?: boolean;
  dosage?: string | null;
  manufacturer?: string | null;
}
