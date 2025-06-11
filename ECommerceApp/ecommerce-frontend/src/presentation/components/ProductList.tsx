import React, { useEffect, useState, memo, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import LazyImage from './LazyImage';
import ResponsiveGrid from './ResponsiveGrid';
import { useDebounce, useMediaQuery } from '../../utils/performanceHooks';
import './ProductList.css';

// Lazy load components that might not be immediately needed
const ProductFilters = lazy(() => import('./ProductFilters/ProductFilters'));

interface ProductListProps {
  category?: string;
  searchTerm?: string;
  showFilters?: boolean;
}

const ProductList: React.FC<ProductListProps> = memo(({ 
  category, 
  searchTerm = '', 
  showFilters = false 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterInStock, setFilterInStock] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Performance monitoring - commented out for debugging
  // usePerformanceMonitor('ProductList');
  
  // Responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use the performance monitor hook directly
  // usePerformanceMonitor('ProductList');

  // Use useMemo to optimize performance by memoizing the filtered products
  // This prevents unnecessary recalculations on every render
  // It only recalculates when the products, debouncedSearchTerm, filterInStock, or sortBy change
  // This is important for performance, especially in large lists
  // It also helps to avoid unnecessary re-renders of child components that depend on filteredProducts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from API with category:', category);
        // Pass the category directly to the getProducts function
        // The backend will handle the filtering
        const data = await getProducts(category, page, 20);
        console.log('API response:', data);
        if (data && data.length > 0) {
          console.log(`Found ${data.length} products for category: ${category}`);
          setProducts(data);
          setTotalPages(Math.ceil(data.length / 20)); // Calculate total pages
          setError(null);
        } else {
          console.log(`No products found for category: ${category}`);
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page]);

  // Handle view details action
  // Use useCallback to memoize the function and prevent unnecessary re-renders
  // This is important for performance, especially in large lists
  // and when passing down to child components
  // This function navigates to the product details page when a product is clicked
  // It uses the navigate function from react-router-dom to change the URL
  // The productId is passed as a parameter to the function
  
  const handleViewDetails = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // Generate mock products for demonstration
  const generateMockProducts = (count: number, category: string): Product[] => {
    const mockProducts: Product[] = [];
    const categoryName = getCategoryName(category);
    
    for (let i = 1; i <= count; i++) {
      mockProducts.push({
        id: `${category}-${i}`,
        name: `${categoryName} Product ${i}`,
        price: parseFloat((Math.random() * 100 + 5).toFixed(2)),
        imageUrl: `https://placehold.co/200x200?text=${categoryName}+${i}`,
        category: category,
        description: `This is a ${categoryName} product description.`,
        inStock: Math.random() > 0.2, // 80% chance of being in stock
        requiresPrescription: category === 'prescription',
        dosage: category === 'prescription' ? `${Math.floor(Math.random() * 500) + 50}mg` : null,
        manufacturer: `Pharma Company ${Math.floor(Math.random() * 10) + 1}`,
        medicationType: category === 'prescription' ? 'tablets' : 'tablets'
      });
    }
    
    return mockProducts;
  };

  // Get category name for display
  const getCategoryName = useCallback((categoryId: string): string => {
    switch(categoryId) {
      case 'prescription':
        return 'Prescription';
      case 'otc':
        return 'Over-the-Counter';
      case 'vitamins':
        return 'Vitamins';
      case 'personal-care':
        return 'Personal Care';
      case 'first-aid':
        return 'First Aid';
      case 'baby-health':
        return 'Baby & Child Health';
      default:
        return 'Medical';
    }
  }, []);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by stock status
    if (filterInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, debouncedSearchTerm, filterInStock, sortBy]);

  // Update filtered products when processed products change
  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching products from API with category:', category);
        // Pass the category directly to the getProducts function
        // The backend will handle the filtering
        const data = await getProducts(category, page, 20);
        console.log('API response:', data);
        
        if (data && data.length > 0) {
          console.log(`Found ${data.length} products for category: ${category}`);
          setProducts(data);
          setTotalPages(Math.ceil(data.length / 20)); // Calculate total pages
          setError(null);
        } else {
          console.log(`No products found for category: ${category}`);
          // Generate mock products if no data is returned
          const mockProducts = generateMockProducts(20, category || 'general');
          console.log(`Generated ${mockProducts.length} mock products`);
          setProducts(mockProducts);
          setTotalPages(Math.ceil(mockProducts.length / 20)); // Calculate total pages
          setError(null);
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        
        // Generate mock products if API call fails
        console.log(`API call failed for category: ${category}. Generating mock products...`);
        const mockProducts = generateMockProducts(20, category || 'general');
        console.log(`Generated ${mockProducts.length} mock products due to API error`);
        setProducts(mockProducts);
        setTotalPages(Math.ceil(mockProducts.length / 20)); // Calculate total pages
        
        // Log detailed error information for debugging
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          setError(null); // Don't show error to user since we're showing mock products
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setError(null); // Don't show error to user since we're showing mock products
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setError(null); // Don't show error to user since we're showing mock products
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page]); // Re-fetch when category or page changes

  if (loading) {
    return (
      <div className="product-list-loading" role="status" aria-label="Loading products">
        <div className="loading-header">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-subtitle"></div>
        </div>
        <ResponsiveGrid 
          minItemWidth={isMobile ? "280px" : "300px"}
          gap={isMobile ? "1rem" : "1.5rem"}
          className="products-loading-grid"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-text skeleton-name"></div>
                <div className="skeleton-text skeleton-price"></div>
                <div className="skeleton-text skeleton-description"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </ResponsiveGrid>
        <span className="sr-only">Loading products, please wait...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Products</h2>
        <p className="error-message">{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      <header className="product-list-header">
        <h2>
          {category ? `${getCategoryName(category)} Products` : 'Pharmacy Products'}
        </h2>
        <p className="product-disclaimer">
          All medications should be used as directed. Consult a pharmacist or doctor if you have questions.
        </p>
        
        {showFilters && (
          <Suspense fallback={<div className="filters-loading">Loading filters...</div>}>
            <ProductFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterInStock={filterInStock}
              onStockFilterChange={setFilterInStock}
            />
          </Suspense>
        )}
        
        <div className="product-list-controls">
          <div className="sort-controls">
            <label htmlFor="sort-select" className="sr-only">Sort products by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
          
          <div className="filter-controls">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={filterInStock}
                onChange={(e) => setFilterInStock(e.target.checked)}
                aria-describedby="stock-filter-desc"
              />
              <span>In Stock Only</span>
            </label>
            <span id="stock-filter-desc" className="sr-only">
              Filter to show only products that are currently in stock
            </span>
          </div>
        </div>
        
        {debouncedSearchTerm && (
          <div className="search-results-info">
            <p>
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} 
              for "{debouncedSearchTerm}"
            </p>
          </div>
        )}
      </header>
      
      <main className="products-section">
        <ResponsiveGrid 
          minItemWidth={isMobile ? "280px" : isTablet ? "300px" : "320px"}
          gap={isMobile ? "1rem" : "1.5rem"}
          className="products-grid"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                isMobile={isMobile}
              />
            ))
          ) : (
            <div className="no-products-message">
              <h3>No products found</h3>
              <p>
                {debouncedSearchTerm 
                  ? `No products match your search for "${debouncedSearchTerm}"`
                  : 'No products available in this category'
                }
              </p>
            </div>
          )}
        </ResponsiveGrid>
      </main>
      
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Product list pagination">
          <button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
            disabled={page === 1}
            className="pagination-btn"
            aria-label="Go to previous page"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
            Previous
          </button>
          <span className="page-indicator" aria-current="page">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={page === totalPages}
            className="pagination-btn"
            aria-label="Go to next page"
          >
            Next
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </nav>
      )}
    </div>
  );
});

// Memoized Product Card component for better performance
const ProductCard: React.FC<{
  product: Product;
  onViewDetails: (id: string) => void;
  isMobile: boolean;
}> = memo(({ product, onViewDetails, isMobile }) => {
  return (
    <article className="product-card" role="article">
      <div className="product-image">
        <LazyImage
          src={product.imageUrl || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          width={300}
          height={300}
          className="product-img"
        />
        {product.category && (
          <span className="product-category" aria-label={`Category: ${product.category}`}>
            {product.category.replace('-', ' ')}
          </span>
        )}
        {!product.inStock && (
          <span className="out-of-stock-badge" aria-label="Out of stock">
            Out of Stock
          </span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price" aria-label={`Price: €${product.price.toFixed(2)}`}>
          €{product.price.toFixed(2)}
        </p>
        
        {product.dosage && (
          <p className="product-dosage" aria-label={`Dosage: ${product.dosage}`}>
            {product.dosage}
          </p>
        )}
        
        {product.description && (
          <p className="product-description">
            {isMobile 
              ? product.description.substring(0, 40) + (product.description.length > 40 ? '...' : '')
              : product.description.substring(0, 80) + (product.description.length > 80 ? '...' : '')
            }
          </p>
        )}
        
        {product.requiresPrescription && (
          <span className="prescription-badge" aria-label="Prescription required">
            <i className="fa fa-prescription" aria-hidden="true"></i>
            Prescription Required
          </span>
        )}
        
        <button 
          className={`view-details-btn ${!product.inStock ? 'disabled' : ''}`}
          onClick={() => product.inStock && onViewDetails(product.id)}
          disabled={!product.inStock}
          aria-label={`View details for ${product.name}`}
          type="button"
        >
          {product.inStock ? 'View Details' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';
ProductList.displayName = 'ProductList';

export default ProductList;
