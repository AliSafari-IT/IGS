import React, { memo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';
import ResponsiveGrid from './ResponsiveGrid';
import { useWindowSize, useMediaQuery } from '../../utils/performanceHooks';
import './HomePage.css';

// Lazy load heavy components
const HeroVideo = lazy(() => import('./HeroVideo/HeroVideo'));

const HomePage: React.FC = memo(() => {
  const { width } = useWindowSize();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const categories = [
    {
      id: 'prescription',
      title: 'Prescription Medications',
      link: '/category/prescription',
      image: 'https://placehold.co/300x200?text=Prescription+Medications',
      alt: 'Prescription Medications'
    },
    {
      id: 'otc',
      title: 'Over-the-Counter',
      link: '/category/otc',
      image: 'https://placehold.co/300x200?text=Over-the-Counter',
      alt: 'Over-the-Counter Medications'
    },
    {
      id: 'vitamins',
      title: 'Vitamins & Supplements',
      link: '/category/vitamins',
      image: 'https://placehold.co/300x200?text=Vitamins+and+Supplements',
      alt: 'Vitamins and Supplements'
    },
    {
      id: 'personal-care',
      title: 'Personal Care',
      link: '/category/personal-care',
      image: 'https://placehold.co/300x200?text=Personal+Care',
      alt: 'Personal Care Products'
    }
  ];

  const infoItems = [
    {
      icon: 'fa-prescription',
      title: 'Prescription Refills',
      description: 'Quick and easy prescription refills online or in-store'
    },
    {
      icon: 'fa-truck',
      title: 'Free Delivery',
      description: 'Free home delivery on orders over €30'
    },
    {
      icon: 'fa-user-md',
      title: 'Expert Advice',
      description: 'Consult with our experienced pharmacists'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>IGS-Pharma</h1>
          <h2>Medical Supplies And Equipment</h2>
          <p>Trusted by healthcare professionals and patients alike, IGS-Pharma offers a comprehensive range of medical supplies and equipment</p>
          <div className="hero-buttons">
            <Link 
              to="/medications" 
              className="cta-button"
              aria-label="Shop for medications and medical supplies"
            >
              Shop Now
            </Link>
            <Suspense fallback={<div className="video-btn-placeholder" />}>
              {!isMobile && <HeroVideo />}
            </Suspense>
          </div>
        </div>
      </section>
      
      <section className="featured-categories" aria-labelledby="featured-heading">
        <h2 id="featured-heading">Featured Categories</h2>
        <ResponsiveGrid 
          minItemWidth={isMobile ? "280px" : "300px"}
          gap={isMobile ? "1rem" : "1.5rem"}
          className="category-cards"
        >
          {categories.map((category) => (
            <article key={category.id} className="category-card">
              <LazyImage
                src={category.image}
                alt={category.alt}
                className="category-image"
                width={300}
                height={200}
              />
              <div className="category-content">
                <h3>{category.title}</h3>
                <Link 
                  to={category.link}
                  aria-label={`View ${category.title.toLowerCase()}`}
                >
                  {category.id === 'prescription' || category.id === 'otc' 
                    ? 'View Medications' 
                    : 'View Products'
                  }
                </Link>
              </div>
            </article>
          ))}
        </ResponsiveGrid>
      </section>
      
      <section className="promotion-section" aria-labelledby="services-heading">
        <div className="promotion-content">
          <h2 id="services-heading">Health Services</h2>
          <p>Schedule a consultation with our pharmacists for personalized advice</p>
          <Link 
            to="/services" 
            className="promo-button"
            aria-label="Book a consultation appointment"
          >
            Book Appointment
          </Link>
        </div>
      </section>
      
      <section className="info-section" aria-labelledby="info-heading">
        <h2 id="info-heading" className="sr-only">Our Services</h2>
        <ResponsiveGrid 
          minItemWidth="250px"
          gap="2rem"
          className="info-columns"
        >
          {infoItems.map((item, index) => (
            <div key={index} className="info-column">
              <i className={`fa ${item.icon}`} aria-hidden="true"></i>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </ResponsiveGrid>
      </section>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
