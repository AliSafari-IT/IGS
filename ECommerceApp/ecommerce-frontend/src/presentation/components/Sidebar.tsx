import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  onFilterChange?: (filters: {
    minPrice?: number;
    maxPrice?: number;
    medicationType?: string[];
    requiresPrescription?: boolean | null;
  }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<number>(100);
  const [medicationTypes, setMedicationTypes] = useState<string[]>([]);
  const [requiresPrescription, setRequiresPrescription] = useState<boolean | null>(null);
  
  // Initialize filters from URL params on component mount
  useEffect(() => {
    const maxPriceParam = searchParams.get('maxPrice');
    if (maxPriceParam) {
      const maxPrice = parseInt(maxPriceParam);
      if (!isNaN(maxPrice) && maxPrice >= 0 && maxPrice <= 100) {
        setPriceRange(maxPrice);
      }
    }
    
    // Call onFilterChange with initial values
    if (onFilterChange) {
      onFilterChange({
        minPrice: 0,
        maxPrice: priceRange,
        medicationType: medicationTypes,
        requiresPrescription
      });
    }
  }, []);
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
        <button 
          className="reset-filters-btn"
          onClick={() => {
            // Reset all filters
            setPriceRange(100);
            setMedicationTypes([]);
            setRequiresPrescription(null);
            
            // Clear URL params
            setSearchParams({});
            
            if (onFilterChange) {
              onFilterChange({
                minPrice: 0,
                maxPrice: 100,
                medicationType: [],
                requiresPrescription: null
              });
            }
          }}
        >
          Reset Filters
        </button>
      </div>
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
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={priceRange}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setPriceRange(value);
              // Update URL params
              searchParams.set('maxPrice', value.toString());
              setSearchParams(searchParams);
              
              if (onFilterChange) {
                onFilterChange({
                  minPrice: 0,
                  maxPrice: value,
                  medicationType: medicationTypes,
                  requiresPrescription
                });
              }
            }}
            className="price-slider" 
          />
          <div className="price-range-values">
            <span>€0</span>
            <span className="current-price">€{priceRange}</span>
            <span>€100</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Medication Type</h3>
        <div className="filter-options">
          <label>
            <input 
              type="checkbox" 
              checked={medicationTypes.includes('tablets')}
              onChange={(e) => {
                const newTypes = e.target.checked 
                  ? [...medicationTypes, 'tablets']
                  : medicationTypes.filter(type => type !== 'tablets');
                setMedicationTypes(newTypes);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: newTypes,
                    requiresPrescription
                  });
                }
              }}
            /> Tablets
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={medicationTypes.includes('capsules')}
              onChange={(e) => {
                const newTypes = e.target.checked 
                  ? [...medicationTypes, 'capsules']
                  : medicationTypes.filter(type => type !== 'capsules');
                setMedicationTypes(newTypes);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: newTypes,
                    requiresPrescription
                  });
                }
              }}
            /> Capsules
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={medicationTypes.includes('liquid')}
              onChange={(e) => {
                const newTypes = e.target.checked 
                  ? [...medicationTypes, 'liquid']
                  : medicationTypes.filter(type => type !== 'liquid');
                setMedicationTypes(newTypes);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: newTypes,
                    requiresPrescription
                  });
                }
              }}
            /> Liquid
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={medicationTypes.includes('topical')}
              onChange={(e) => {
                const newTypes = e.target.checked 
                  ? [...medicationTypes, 'topical']
                  : medicationTypes.filter(type => type !== 'topical');
                setMedicationTypes(newTypes);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: newTypes,
                    requiresPrescription
                  });
                }
              }}
            /> Topical
          </label>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3>Prescription Required</h3>
        <div className="filter-options">
          <label>
            <input 
              type="radio" 
              name="prescription" 
              checked={requiresPrescription === true}
              onChange={() => {
                setRequiresPrescription(true);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: medicationTypes,
                    requiresPrescription: true
                  });
                }
              }}
            /> Yes
          </label>
          <label>
            <input 
              type="radio" 
              name="prescription" 
              checked={requiresPrescription === false}
              onChange={() => {
                setRequiresPrescription(false);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: medicationTypes,
                    requiresPrescription: false
                  });
                }
              }}
            /> No
          </label>
          <label>
            <input 
              type="radio" 
              name="prescription" 
              checked={requiresPrescription === null}
              onChange={() => {
                setRequiresPrescription(null);
                
                if (onFilterChange) {
                  onFilterChange({
                    minPrice: 0,
                    maxPrice: priceRange,
                    medicationType: medicationTypes,
                    requiresPrescription: null
                  });
                }
              }}
            /> All
          </label>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
