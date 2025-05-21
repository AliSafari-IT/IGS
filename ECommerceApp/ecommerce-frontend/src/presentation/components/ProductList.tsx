import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import './ProductList.css';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data = await getProducts();
        
        // Filter by category if provided
        if (category) {
          data = data.filter(product => 
            product.category?.toLowerCase() === category.toLowerCase()
          );
        }
        
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // Mock products if API returns empty array or fails
          setProducts([
            {
              id: '1',
              name: 'Ibuprofen 400mg',
              price: 9.99,
              description: 'Pain reliever and fever reducer for adults and children.',
              category: 'pain-relief',
              imageUrl: 'https://placehold.co/200x200?text=Ibuprofen'
            },
            {
              id: '2',
              name: 'Vitamin D3 1000 IU',
              price: 12.99,
              description: 'Supports bone health and immune function.',
              category: 'vitamins',
              imageUrl: 'https://placehold.co/200x200?text=VitaminD'
            },
            {
              id: '3',
              name: 'Digital Thermometer',
              price: 19.99,
              description: 'Fast and accurate temperature readings in seconds.',
              category: 'medical-devices',
              imageUrl: 'https://placehold.co/200x200?text=Thermometer'
            },
            {
              id: '4',
              name: 'Blood Pressure Monitor',
              price: 49.99,
              description: 'Easy to use home blood pressure monitoring device.',
              category: 'medical-devices',
              imageUrl: 'https://placehold.co/200x200?text=BPMonitor'
            },
            {
              id: '5',
              name: 'Allergy Relief Tablets',
              price: 14.99,
              description: '24-hour non-drowsy allergy symptom relief.',
              category: 'allergy',
              imageUrl: 'https://placehold.co/200x200?text=AllergyRelief'
            },
            {
              id: '6',
              name: 'First Aid Kit',
              price: 24.99,
              description: 'Comprehensive kit for treating minor injuries at home.',
              category: 'first-aid',
              imageUrl: 'https://placehold.co/200x200?text=FirstAid'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Add mock products in case of error
        setProducts([
          {
            id: '1',
            name: 'Paracetamol 500mg',
            price: 7.99,
            description: 'Effective pain and fever reducer.',
            category: 'pain-relief',
            imageUrl: 'https://placehold.co/200x200?text=Paracetamol'
          },
          {
            id: '2',
            name: 'Multivitamin Complex',
            price: 15.99,
            description: 'Complete daily vitamin and mineral supplement.',
            category: 'vitamins',
            imageUrl: 'https://placehold.co/200x200?text=Multivitamin'
          },
          {
            id: '3',
            name: 'Hand Sanitizer 250ml',
            price: 4.99,
            description: 'Kills 99.9% of germs without water.',
            category: 'hygiene',
            imageUrl: 'https://placehold.co/200x200?text=Sanitizer'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
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
                <img src={product.imageUrl} alt={product.name} />
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
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
