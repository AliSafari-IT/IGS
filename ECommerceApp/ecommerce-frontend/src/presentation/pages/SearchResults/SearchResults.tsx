import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product } from '../../../domain/models/Product';
import axios from 'axios';
import './SearchResults.css';

/**
 * Local product database for search functionality
 * This allows the search to work without depending on the API
 */
const productDatabase: Product[] = [
  {
    id: 'otc-1',
    name: 'Ibuprofen 200mg',
    price: 18.0,
    imageUrl: 'https://placehold.co/300x300?text=Ibuprofen',
    category: 'otc',
    description: 'Ibuprofen 200mg is an over-the-counter medication for temporary relief of minor aches and pains.',
    inStock: true,
    requiresPrescription: false,
    manufacturer: 'PharmaCo',
    medicationType: 'tablets',
    dosage: '200mg'
  },
  {
    id: 'otc-2',
    name: 'Acetaminophen 300mg',
    price: 47.73,
    imageUrl: 'https://placehold.co/300x300?text=Acetaminophen',
    category: 'otc',
    description: 'Acetaminophen 300mg is an over-the-counter medication for temporary relief of minor aches and pains.',
    inStock: true,
    requiresPrescription: false,
    manufacturer: 'ComfortPharm',
    medicationType: 'tablets',
    dosage: '300mg'
  },
  {
    id: 'otc-3',
    name: 'Aspirin 400mg',
    price: 36.05,
    imageUrl: 'https://placehold.co/300x300?text=Aspirin',
    category: 'otc',
    description: 'Aspirin 400mg is an over-the-counter medication for temporary relief of minor aches and pains.',
    inStock: true,
    requiresPrescription: false,
    manufacturer: 'HealthPlus',
    medicationType: 'tablets',
    dosage: '400mg'
  },
  {
    id: 'prescription-1',
    name: 'Levothyroxine 50mcg',
    price: 19.74,
    imageUrl: 'https://placehold.co/300x300?text=Levothyroxine',
    category: 'prescription',
    description: 'Levothyroxine is a prescription medication used to treat hypothyroidism.',
    inStock: true,
    requiresPrescription: true,
    dosage: '50mcg',
    manufacturer: 'MediPharm',
    medicationType: 'tablets'
  },
  {
    id: 'vitamins-1',
    name: 'Vitamin D3 1000IU',
    price: 12.99,
    imageUrl: 'https://placehold.co/300x300?text=Vitamin+D3',
    category: 'vitamins',
    description: 'Vitamin D3 supplements help maintain bone health and immune function.',
    inStock: true,
    requiresPrescription: false,
    manufacturer: 'NutriHealth',
    medicationType: 'tablets',
    dosage: '1000IU'
  },
  {
    id: 'prescription-2',
    name: 'Atorvastatin 20mg',
    price: 25.50,
    imageUrl: 'https://placehold.co/300x300?text=Atorvastatin',
    category: 'prescription',
    description: 'Atorvastatin is used to lower cholesterol and reduce the risk of heart disease.',
    inStock: true,
    requiresPrescription: true,
    dosage: '20mg',
    manufacturer: 'CardioHealth',
    medicationType: 'tablets'
  },
  {
    id: 'otc-4',
    name: 'Loratadine 10mg',
    price: 15.25,
    imageUrl: 'https://placehold.co/300x300?text=Loratadine',
    category: 'otc',
    description: 'Loratadine is an antihistamine used to relieve allergy symptoms such as runny nose, sneezing, and itchy eyes.',
    inStock: true,
    requiresPrescription: false,
    dosage: '10mg',
    manufacturer: 'AllergyRelief',
    medicationType: 'tablets'
  },
  {
    id: 'vitamins-2',
    name: 'Vitamin C 500mg',
    price: 9.99,
    imageUrl: 'https://placehold.co/300x300?text=Vitamin+C',
    category: 'vitamins',
    description: 'Vitamin C supports immune health and antioxidant protection.',
    inStock: true,
    requiresPrescription: false,
    dosage: '500mg',
    manufacturer: 'NutriHealth',
    medicationType: 'tablets'
  }
];

/**
 * Search for products based on a query string
 * @param query The search query
 * @returns Array of products matching the search query
 */
const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Validate query
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }
    
    const trimmedQuery = query.trim().toLowerCase();
    console.log(`Searching for products with query: ${trimmedQuery}`);
    
    // Simulate network delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Search the local product database
    const results = productDatabase.filter(product => {
      return (
        product.name.toLowerCase().includes(trimmedQuery) ||
        product.description.toLowerCase().includes(trimmedQuery) ||
        product.category.toLowerCase().includes(trimmedQuery) ||
        (product.manufacturer && product.manufacturer.toLowerCase().includes(trimmedQuery)) ||
        (product.dosage && product.dosage.toLowerCase().includes(trimmedQuery))
      );
    });
    
    console.log(`Found ${results.length} products matching "${trimmedQuery}"`);
    return results;
  } catch (error: any) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error.message || 'Unknown error'}`);
  }
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({min: 0, max: 1000});
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState<boolean>(false);
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);

  // Apply filters to products
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply prescription filter
    if (showPrescriptionOnly) {
      filtered = filtered.filter(product => product.requiresPrescription);
    }

    // Apply in-stock filter
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    setFilteredProducts(filtered);
  }, [products, categoryFilter, priceRange, showPrescriptionOnly, showInStockOnly]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        setError('Please enter a search term to find products.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Call the search function
        const results = await searchProducts(query);
        setProducts(results);
        setFilteredProducts(results);
      } catch (err: any) {
        console.error('Error searching products:', err);
        
        // Set a user-friendly error message
        setError(`${err.message || 'An error occurred while searching'}. Please try again.`);
        
        // Reset products when there's an error
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // No mock data generation needed - using local product database instead

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h1>Search Results for "{query}"</h1>
        <p>{filteredProducts.length} products found</p>
      </div>

      <div className="search-filters">
        <div className="filter-section">
          <h3>Filters</h3>
          
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="otc">Over the Counter</option>
              <option value="prescription">Prescription</option>
              <option value="vitamins">Vitamins & Supplements</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Price Range:</label>
            <div className="price-range-inputs">
              <input 
                type="number" 
                min="0" 
                max={priceRange.max} 
                value={priceRange.min} 
                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} 
                className="price-input"
              />
              <span>to</span>
              <input 
                type="number" 
                min={priceRange.min} 
                value={priceRange.max} 
                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} 
                className="price-input"
              />
            </div>
          </div>
          
          <div className="filter-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={showInStockOnly} 
                onChange={(e) => setShowInStockOnly(e.target.checked)} 
              />
              In Stock Only
            </label>
          </div>
          
          <div className="filter-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={showPrescriptionOnly} 
                onChange={(e) => setShowPrescriptionOnly(e.target.checked)} 
              />
              Prescription Only
            </label>
          </div>
          
          <button 
            className="reset-filters-btn" 
            onClick={() => {
              setCategoryFilter('all');
              setPriceRange({min: 0, max: 1000});
              setShowInStockOnly(false);
              setShowPrescriptionOnly(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching for products...</p>
        </div>
      ) : error ? (
        <div className="search-error">
          <p>{error}</p>
        </div>
      ) : filteredProducts.length === 0 && products.length === 0 ? (
        <div className="no-results">
          <h2>No products found</h2>
          <p>We couldn't find any products matching "{query}"</p>
          <div className="suggestions">
            <h3>Suggestions:</h3>
            <ul>
              <li>Check the spelling of your search term</li>
              <li>Try using more general keywords</li>
              <li>Browse our categories to find similar products</li>
            </ul>
          </div>
          <Link to="/categories" className="browse-categories-btn">
            Browse Categories
          </Link>
        </div>
      ) : filteredProducts.length === 0 && products.length > 0 ? (
        <div className="no-filtered-results">
          <h2>No products match your filters</h2>
          <p>Try adjusting your filter criteria to see more results.</p>
          <button 
            className="reset-filters-btn" 
            onClick={() => {
              setCategoryFilter('all');
              setPriceRange({min: 0, max: 1000});
              setShowInStockOnly(false);
              setShowPrescriptionOnly(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-link">
                <div className="product-image">
                  <img 
                    src={product.imageUrl || 'https://placehold.co/300x300?text=No+Image'} 
                    alt={product.name} 
                  />
                </div>
                <div className="product-info">
                  <h2 className="product-name">{product.name}</h2>
                  <p className="product-price">€{product.price.toFixed(2)}</p>
                  
                  <div className="product-tags">
                    {product.requiresPrescription && (
                      <span className="prescription-tag">Prescription Required</span>
                    )}
                    {product.inStock ? (
                      <span className="in-stock-tag">In Stock</span>
                    ) : (
                      <span className="out-of-stock-tag">Out of Stock</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
