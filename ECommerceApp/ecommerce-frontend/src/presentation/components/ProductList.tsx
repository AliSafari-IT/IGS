import React, { useEffect, useState } from 'react';
import { Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import './ProductList.css';

interface ProductListProps {
  category?: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
              name: 'Smartphone XYZ',
              price: 599.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=Smartphone'
            },
            {
              id: '2',
              name: 'Laptop Pro',
              price: 1299.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=Laptop'
            },
            {
              id: '3',
              name: 'Wireless Headphones',
              price: 149.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=Headphones'
            },
            {
              id: '4',
              name: 'Smart Watch',
              price: 249.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=SmartWatch'
            },
            {
              id: '5',
              name: 'Bluetooth Speaker',
              price: 79.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=Speaker'
            },
            {
              id: '6',
              name: 'Tablet Mini',
              price: 349.99,
              imageUrl: 'https://via.placeholder.com/200x200?text=Tablet'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Add mock products in case of error
        setProducts([
          {
            id: '1',
            name: 'Smartphone XYZ',
            price: 599.99,
            imageUrl: 'https://via.placeholder.com/200x200?text=Smartphone'
          },
          {
            id: '2',
            name: 'Laptop Pro',
            price: 1299.99,
            imageUrl: 'https://via.placeholder.com/200x200?text=Laptop'
          },
          {
            id: '3',
            name: 'Wireless Headphones',
            price: 149.99,
            imageUrl: 'https://via.placeholder.com/200x200?text=Headphones'
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
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button className="view-details-btn">View Details</button>
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
