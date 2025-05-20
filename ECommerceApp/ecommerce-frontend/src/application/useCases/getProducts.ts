import { Product } from '../../domain/models/Product';
import { ProductService } from '../../infrastructure/services/ProductService';

export const getProducts = async (): Promise<Product[]> => {
  const productService = new ProductService();
  return await productService.getAll();
};
