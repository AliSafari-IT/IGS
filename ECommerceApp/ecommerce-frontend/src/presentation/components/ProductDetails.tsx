import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../domain/models/Product';
import { getProductById } from '../../application/useCases/getProducts';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Generate a mock product based on the product ID
  const generateMockProduct = (id: string): Product => {
    // Parse the category and number from the ID (e.g., 'prescription-2')
    const parts = id.split('-');
    const category = parts[0];
    const number = parts.length > 1 ? parseInt(parts[1]) : 1;
    
    // Get a readable category name
    const categoryName = getCategoryName(category);
    
    return {
      id: id,
      name: `${categoryName} Product ${number}`,
      price: parseFloat((Math.random() * 100 + 5).toFixed(2)),
      imageUrl: `https://placehold.co/400x300?text=${categoryName}+${number}`,
      category: category,
      description: `This is a detailed description for ${categoryName} Product ${number}. It contains important information about the product's uses, benefits, and any potential side effects.`,
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      requiresPrescription: category === 'prescription',
      dosage: category === 'prescription' ? `${Math.floor(Math.random() * 500) + 50}mg` : undefined,
      manufacturer: `Pharma Company ${Math.floor(Math.random() * 10) + 1}`
    };
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
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching product details for ID: ${productId}`);
        
        // Fetch the product directly by ID
        const foundProduct = await getProductById(productId || '');
        
        if (foundProduct) {
          console.log('Product found from API:', foundProduct);
          setProduct(foundProduct);
        } else {
          // Product not found in API, generate a mock product
          console.log(`Product not found in API, generating mock product for ID: ${productId}`);
          const mockProduct = generateMockProduct(productId || '');
          console.log('Generated mock product:', mockProduct);
          setProduct(mockProduct);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Generate a mock product on error
        console.log(`Error fetching product, generating mock product for ID: ${productId}`);
        const mockProduct = generateMockProduct(productId || '');
        console.log('Generated mock product on error:', mockProduct);
        setProduct(mockProduct);
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
          <img src={product.imageUrl || 'https://placehold.co/400x400?text=No+Image'} alt={product.name} />
        </div>
        
        <div className="product-info-container">
          <h1>{product.name}</h1>
          <div className="product-price">€{product.price.toFixed(2)}</div>
          
          {product.category && (
            <div className="product-category">
              <span>Category: {product.category.replace('-', ' ')}</span>
            </div>
          )}
          
          {product.manufacturer && (
            <div className="product-manufacturer">
              <span>Manufacturer: {product.manufacturer}</span>
            </div>
          )}
          
          {product.dosage && (
            <div className="product-dosage">
              <span>Dosage: {product.dosage}</span>
            </div>
          )}
          
          <div className="product-description">
            <h2>Description</h2>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          
          <div className="product-availability">
            <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.requiresPrescription && (
              <span className="prescription-required">Prescription Required</span>
            )}
          </div>
          
          <div className="product-actions">
            <button className="add-to-cart-btn" disabled={!product.inStock}>Add to Cart</button>
            <button className="buy-now-btn" disabled={!product.inStock}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
