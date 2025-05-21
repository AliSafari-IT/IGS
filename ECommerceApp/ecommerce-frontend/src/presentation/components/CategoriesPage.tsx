import React from 'react';
import { Link } from 'react-router-dom';
import './CategoriesPage.css';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const CategoriesPage: React.FC = () => {
  // Define the available product categories
  const categories: Category[] = [
    {
      id: 'prescription',
      name: 'Prescription Medications',
      description: 'Medications that require a prescription from a healthcare provider.',
      imageUrl: 'https://placehold.co/300x200?text=Prescription+Medications'
    },
    {
      id: 'otc',
      name: 'Over-the-Counter',
      description: 'Medications available without a prescription.',
      imageUrl: 'https://placehold.co/300x200?text=Over-the-Counter'
    },
    {
      id: 'vitamins',
      name: 'Vitamins & Supplements',
      description: 'Nutritional supplements to support your health.',
      imageUrl: 'https://placehold.co/300x200?text=Vitamins+Supplements'
    },
    {
      id: 'personal-care',
      name: 'Personal Care',
      description: 'Products for personal hygiene and wellness.',
      imageUrl: 'https://placehold.co/300x200?text=Personal+Care'
    },
    {
      id: 'first-aid',
      name: 'First Aid',
      description: 'Essential supplies for treating minor injuries.',
      imageUrl: 'https://placehold.co/300x200?text=First+Aid'
    },
    {
      id: 'baby-health',
      name: 'Baby & Child Health',
      description: 'Products designed for infants and children.',
      imageUrl: 'https://placehold.co/300x200?text=Baby+Child+Health'
    }
  ];

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Product Categories</h1>
        <p>Browse our product categories to find what you need</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <Link to={`/category/${category.id}`} className="category-link">
              <div className="category-image">
                <img src={category.imageUrl} alt={category.name} />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <button className="browse-category-btn">Browse Products</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
