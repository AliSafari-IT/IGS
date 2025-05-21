import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const productsPerPage = 20;
  const navigate = useNavigate();
  
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Filter products by category if needed
        const filteredProducts = categoryId 
          ? data.filter(product => product.category === categoryId) 
          : data;
        
        // If no products found or API fails, use mock data
        const finalProducts = filteredProducts.length > 0 ? filteredProducts : generateMockProducts(100, categoryId || '');
        
        setProducts(finalProducts);
        setTotalPages(Math.ceil(finalProducts.length / productsPerPage));
      } catch (error) {
        console.error('Error fetching products:', error);
        // Generate mock products if API fails
        const mockProducts = generateMockProducts(100, categoryId || '');
        setProducts(mockProducts);
        setTotalPages(Math.ceil(mockProducts.length / productsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
        category: category
      });
    }
    
    return mockProducts;
  };

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
      default:
        return 'Medical';
    }
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{getCategoryName(categoryId || '')} Products</h1>
        <p>Showing {getCurrentPageProducts().length} of {products.length} products</p>
      </div>

      <div className="products-grid">
        {getCurrentPageProducts().map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">€{product.price.toFixed(2)}</p>
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(product.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-number ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
