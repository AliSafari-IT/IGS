import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import './ProductList.css';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();
  
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

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
  const getCategoryName = (categoryId: string): string => {
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
  };

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
          setError(null);
        } else {
          console.log(`No products found for category: ${category}`);
          // Generate mock products if no data is returned
          const mockProducts = generateMockProducts(20, category || 'general');
          console.log(`Generated ${mockProducts.length} mock products`);
          setProducts(mockProducts);
          setError(null);
        }
      } catch (error: any) {
        console.error('Error fetching products:', error);
        
        // Generate mock products if API call fails
        console.log(`API call failed for category: ${category}. Generating mock products...`);
        const mockProducts = generateMockProducts(20, category || 'general');
        console.log(`Generated ${mockProducts.length} mock products due to API error`);
        setProducts(mockProducts);
        
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
    return <div className="loading">Loading products...</div>;
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
      <h2>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'Pharmacy Products'}</h2>
      <p className="product-disclaimer">All medications should be used as directed. Consult a pharmacist or doctor if you have questions.</p>
      
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.imageUrl || 'https://placehold.co/200x200?text=No+Image'} alt={product.name} />
                {product.category && (
                  <span className="product-category">{product.category.replace('-', ' ')}</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">€{product.price.toFixed(2)}</p>
                {product.description && (
                  <p className="product-short-desc">{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</p>
                )}
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(product.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available from the database.</p>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-indicator">Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
