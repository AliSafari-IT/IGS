import axios from 'axios';
import { Product } from '../../domain/models/Product';
import { API_BASE_URL } from './ApiConfig';

// Configure axios to handle CORS and SSL issues
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Use the API_BASE_URL from ApiConfig.ts
const API_URL = API_BASE_URL;

// Define the API response interface to match the backend format
interface PagedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ProductService {
  async getAll(category?: string, page: number = 1, limit: number = 20): Promise<Product[]> {
    try {
      // Build the URL with query parameters
      let url = `${API_URL}/products?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      // Make the API call
      const response = await axios.get<PagedResponse<Product>>(url);
      
      // Check if the request was successful
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('API returned error:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error; // Throw the error instead of returning empty array
    }
  }
  
  async getById(id: string): Promise<Product | null> {
    try {
      const response = await axios.get<ApiResponse<Product>>(`${API_URL}/products/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('API returned error:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
  
  async searchProducts(query: string, page: number = 1, limit: number = 20): Promise<Product[]> {
    try {
      const response = await axios.get<PagedResponse<Product>>(
        `${API_URL}/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('API returned error:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}
