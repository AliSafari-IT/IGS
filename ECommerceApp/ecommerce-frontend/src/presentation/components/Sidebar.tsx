import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const categories = [
    { id: 'prescription', name: 'Prescription Medications' },
    { id: 'otc', name: 'Over-the-Counter' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'personal-care', name: 'Personal Care' },
    { id: 'first-aid', name: 'First Aid' },
    { id: 'baby-health', name: 'Baby & Child Health' },
    { id: 'mobility', name: 'Mobility & Daily Living Aids' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h3>Price Range</h3>
        <div className="price-filter">
          <input type="range" min="0" max="100" className="price-slider" />
          <div className="price-range-values">
            <span>€0</span>
            <span>€100</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Medication Type</h3>
        <div className="filter-options">
          <label>
            <input type="checkbox" /> Tablets
          </label>
          <label>
            <input type="checkbox" /> Capsules
          </label>
          <label>
            <input type="checkbox" /> Liquid
          </label>
          <label>
            <input type="checkbox" /> Topical
          </label>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Prescription Required</h3>
        <div className="filter-options">
          <label>
            <input type="radio" name="prescription" /> Yes
          </label>
          <label>
            <input type="radio" name="prescription" /> No
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
