import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import Cart from './Cart';
import './CartButton.css';

const CartButton: React.FC = () => {
  const { cartState } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Animate when cart count changes
  useEffect(() => {
    if (cartState.totalItems > prevCount && prevCount > 0) {
      setIsAnimating(true);
      setShowNotification(true);
      
      // Reset animation after it completes
      const animTimer = setTimeout(() => setIsAnimating(false), 500);
      
      // Hide notification after a delay
      const notifTimer = setTimeout(() => setShowNotification(false), 3000);
      
      return () => {
        clearTimeout(animTimer);
        clearTimeout(notifTimer);
      };
    }
    setPrevCount(cartState.totalItems);
  }, [cartState.totalItems, prevCount]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setShowNotification(false); // Hide notification when cart opens
  };

  return (
    <>
      <button 
        className={`cart-button ${isAnimating ? 'animate-bump' : ''}`} 
        onClick={toggleCart}
        aria-label={`Shopping cart with ${cartState.totalItems} items`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {cartState.totalItems > 0 && (
          <span className="cart-count">{cartState.totalItems}</span>
        )}
        {showNotification && !isCartOpen && (
          <div className="cart-notification">
            Item added to cart!
          </div>
        )}
      </button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;
