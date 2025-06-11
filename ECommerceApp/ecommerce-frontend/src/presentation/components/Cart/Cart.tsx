import React, { useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';
import './Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartState, removeFromCart, updateQuantity, clearCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  // Format price with Euro symbol
  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };
  
  // Handle ESC key to close cart
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus trap inside cart when open
    if (isOpen && cartRef.current) {
      cartRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="cart-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Shopping Cart"
      onClick={(e) => {
        // Close cart when clicking the overlay background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="cart-container" 
        ref={cartRef}
        tabIndex={-1} // Make focusable but not in tab order
      >
        <div className="cart-header">
          <h2>Your Cart {cartState.items.length > 0 && `(${cartState.items.length})`}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {cartState.items.length === 0 ? (
          <div className="empty-cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Your cart is empty. Start adding products to your cart!</p>
            <button className="continue-shopping" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartState.items.map((item, index) => (
                <div key={item.product.id} className="cart-item" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="cart-item-top">
                    <div className="item-image">
                      <img src={item.product.imageUrl || 'https://placehold.co/100x100?text=No+Image'} alt={item.product.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.product.name}</h3>
                      <p className="item-price">{formatPrice(item.product.price)}</p>
                      <div className="item-badges">
                        {item.product.dosage && (
                          <span className="item-dosage">{item.product.dosage}</span>
                        )}
                        {item.product.requiresPrescription && (
                          <span className="prescription-required">Prescription Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-bottom">
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        title="Decrease quantity"
                      >
                        <span aria-hidden="true">−</span>
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                        title="Increase quantity"
                      >
                        <span aria-hidden="true">+</span>
                      </button>
                    </div>
                    <div className="item-total" aria-label={`Total: ${formatPrice(item.product.price * item.quantity)}`}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <button 
                      className="remove-item" 
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      title="Remove from cart"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-totals">
                <div className="total-items">
                  <span>Total Items:</span>
                  <span>{cartState.totalItems}</span>
                </div>
                <div className="total-price" aria-live="polite">
                  <span>Total:</span>
                  <span>{formatPrice(cartState.totalPrice)}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart" 
                  onClick={clearCart}
                  disabled={cartState.items.length === 0}
                  aria-label="Clear all items from cart"
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-button"
                  disabled={cartState.items.length === 0}
                  aria-label={`Proceed to checkout with ${cartState.totalItems} items for ${formatPrice(cartState.totalPrice)}`}
                >
                  <span>Proceed to Checkout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="checkout-icon">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
