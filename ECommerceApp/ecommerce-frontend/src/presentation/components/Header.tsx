import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.webp" alt="IGS-Pharma Logo" className="logo-image" />
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/medications">Medications</Link></li>
            <li><Link to="/prescriptions">Prescriptions</Link></li>
            <li><Link to="/health-advice">Health Advice</Link></li>
            <li><Link to="/about-us">About</Link></li>
            <li><Link to="/contact-us">Contact</Link></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn">
            <i className="fa fa-search"></i>
          </button>
          <button className="cart-btn">
            <i className="fa fa-prescription-bottle-alt"></i>
            <span className="cart-count">0</span>
          </button>
          <button className="user-btn">
            <i className="fa fa-user-circle"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
