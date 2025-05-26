import { Product } from '../../domain/models/Product';
import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Search for products based on a query string
 * @param query The search query
 * @returns Array of products matching the search query
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Fetch products from the API
    const response = await axios.get(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    
    // Ensure the response data is in the correct format
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.items && Array.isArray(response.data.items)) {
      return response.data.items;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected API response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products. Please try again later.');
  }
};

/**
 * Get product details by ID
 * @param id The product ID
 * @returns Product details or null if not found
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

/**
 * Get products by category
 * @param category The category name
 * @returns Array of products in the specified category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/category/${category}`);
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.items && Array.isArray(response.data.items)) {
      return response.data.items;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected API response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};
