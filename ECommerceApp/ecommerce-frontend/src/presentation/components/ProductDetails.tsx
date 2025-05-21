import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../domain/models/Product';
import { getProducts } from '../../application/useCases/getProducts';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Fetch all products and find the one with matching ID
        const products = await getProducts();
        const foundProduct = products.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // If product not found, use mock data
          setProduct({
            id: productId || '0',
            name: 'Sample Product',
            price: 99.99,
            description: 'This is a detailed description of the product. It includes information about features, benefits, and usage instructions.',
            imageUrl: 'https://placehold.co/400x400?text=Tablets',
            category: 'sample'
          });
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Set mock product in case of error
        setProduct({
          id: productId || '0',
          name: 'Sample Product',
          price: 99.99,
          description: 'This is a detailed description of the product. It includes information about features, benefits, and usage instructions.',
          imageUrl: 'https://placehold.co/400x400?text=Tablets',
          category: 'sample'
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-details">
      <button className="back-button" onClick={handleGoBack}>
        &larr; Back
      </button>
      
      <div className="product-details-container">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        
        <div className="product-info-container">
          <h1>{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          
          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
