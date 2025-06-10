import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { type Product, type MedicationType } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import Sidebar from './Sidebar';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const productsPerPage = 20;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Filter state
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    medicationTypes: [] as string[],
    requiresPrescription: null as boolean | null
  });
  
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Handle filter changes from Sidebar
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  // Apply filters to products
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Apply price filter
      if (filters.maxPrice < 100) {
        filtered = filtered.filter(product => 
          product.price >= filters.minPrice && product.price <= filters.maxPrice
        );
      }
      
      // Apply medication type filter
      if (filters.medicationTypes.length > 0) {
        filtered = filtered.filter(product => 
          product.medicationType && filters.medicationTypes.includes(product.medicationType)
        );
      }
      
      // Apply prescription filter
      if (filters.requiresPrescription !== null) {
        filtered = filtered.filter(product => 
          product.requiresPrescription === filters.requiresPrescription
        );
      }
      
      setFilteredProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
    }
  }, [filters, products, productsPerPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        // Filter products by category if needed
        const categoryFiltered = categoryId 
          ? data.filter(product => product.category === categoryId) 
          : data;
        
        // If no products found or API fails, use mock data
        const finalProducts = categoryFiltered.length > 0 ? categoryFiltered : generateMockProducts(100, categoryId || '');
        
        setProducts(finalProducts);
        // Initial filtered products are the same as all products
        setFilteredProducts(finalProducts);
        setTotalPages(Math.ceil(finalProducts.length / productsPerPage));
      } catch (error) {
        console.error('Error fetching products:', error);
        // Generate mock products if API fails
        const mockProducts = generateMockProducts(100, categoryId || '');
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setTotalPages(Math.ceil(mockProducts.length / productsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, productsPerPage]);

  // Generate mock products for demonstration
  const generateMockProducts = (count: number, category: string): Product[] => {
    const medicationTypes: MedicationType[] = ['tablets', 'capsules', 'liquid', 'topical', 'inhalers', 'injections', 'drops', 'suppositories', 'patches', 'powders'];
    const mockProducts: Product[] = [];
    const categoryName = getCategoryName(category);
    
    for (let i = 1; i <= count; i++) {
      const product: Product = {
        id: `mock-${i}`,
        name: `Product ${i}${category ? ` (${category})` : ''}`,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        imageUrl: `https://placehold.co/200x200?text=Product+${i}`,
        category: category || 'general',
        description: `This is a sample product description for product ${i}.`,
        inStock: Math.random() > 0.2, // 80% chance of being in stock
        requiresPrescription: Math.random() > 0.7, // 30% chance of requiring prescription
        dosage: Math.random() > 0.5 ? `${Math.floor(Math.random() * 1000) + 100}mg` : null,
        manufacturer: `Manufacturer ${Math.floor(Math.random() * 10) + 1}`,
        medicationType: medicationTypes[Math.floor(Math.random() * medicationTypes.length)]
      };
      mockProducts.push(product);
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
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{getCategoryName(categoryId || '')} Products</h1>
        <p>Browse our selection of high-quality {getCategoryName(categoryId || '').toLowerCase()} products.</p>
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="category-content">
          <div className="category-sidebar">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>
          <div className="category-main">
            <div className="filter-summary">
              <p>Showing {filteredProducts.length} products</p>
              {filters.maxPrice < 100 && (
                <span className="filter-tag">Price: €0 - €{filters.maxPrice}</span>
              )}
              {filters.requiresPrescription !== null && (
                <span className="filter-tag">
                  {filters.requiresPrescription ? 'Prescription Required' : 'No Prescription'}
                </span>
              )}
            </div>
            
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                getCurrentPageProducts().map(product => (
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
                ))
              ) : (
                <div className="no-products">
                  <p>No products match your filter criteria.</p>
                  <p>Try adjusting your filters or browse all products.</p>
                </div>
              )}
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
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
