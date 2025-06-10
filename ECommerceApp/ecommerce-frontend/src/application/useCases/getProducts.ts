import { type Product } from '../../domain/models/Product';
import { ProductService } from '../../infrastructure/services/ProductService';

export const getProducts = async (category?: string, page: number = 1, limit: number = 20): Promise<Product[]> => {
  const productService = new ProductService();
  try {
    return await productService.getAll(category, page, limit);
  } catch (error) {
    console.error('Error in getProducts use case:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const productService = new ProductService();
  try {
    console.log(`Fetching product with ID: ${id}`);
    const product = await productService.getById(id);
    console.log('Product details response:', product);
    return product;
  } catch (error) {
    console.error('Error in getProductById use case:', error);
    // Return null instead of throwing to avoid crashing the UI
    return null;
  }
};

export const searchProducts = async (query: string, page: number = 1, limit: number = 20): Promise<Product[]> => {
  const productService = new ProductService();
  try {
    return await productService.searchProducts(query, page, limit);
  } catch (error) {
    console.error('Error in searchProducts use case:', error);
    throw error;
  }
};
