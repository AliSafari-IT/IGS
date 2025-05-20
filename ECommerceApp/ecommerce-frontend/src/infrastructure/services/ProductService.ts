import axios from 'axios';
import { Product } from '../../domain/models/Product';

const API_URL = `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT || 5001}/api`;

export class ProductService {
  async getAll(): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
}
