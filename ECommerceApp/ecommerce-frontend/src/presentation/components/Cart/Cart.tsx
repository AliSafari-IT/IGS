import React from 'react';
import { useCart } from '../../../context/CartContext';
import './Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartState, removeFromCart, updateQuantity, clearCart } = useCart();

  if (!isOpen) return null;

  // Format price with Euro symbol
  const formatPrice = (price: number): string => {
    return `€${price.toFixed(2)}`;
  };

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {cartState.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="continue-shopping" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartState.items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-top">
                    <div className="item-image">
                      <img src={item.product.imageUrl || 'https://placehold.co/100x100?text=No+Image'} alt={item.product.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.product.name}</h3>
                      <p className="item-price">{formatPrice(item.product.price)}</p>
                      <div>
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
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <button 
                      className="remove-item" 
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
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
                <div className="total-price">
                  <span>Total:</span>
                  <span>{formatPrice(cartState.totalPrice)}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart" 
                  onClick={clearCart}
                  disabled={cartState.items.length === 0}
                >
                  Clear Cart
                </button>
                <button 
                  className="checkout-button"
                  disabled={cartState.items.length === 0}
                >
                  Proceed to Checkout
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
