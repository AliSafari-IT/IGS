import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import HomeHeroSection from "./HomeHeroSection";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      
      <HomeHeroSection />

      <section className="featured-categories">
        <h2>Featured Categories</h2>
        <div className="category-cards">
          <div className="category-card">
            <img
              src="https://placehold.co/300x200?text=Prescription+Medications"
              alt="Prescription Medications"
            />
            <h3>Prescription Medications</h3>
            <Link to="/category/prescription">View Medications</Link>
          </div>
          <div className="category-card">
            <img
              src="https://placehold.co/300x200?text=Over-the-Counter"
              alt="Over-the-Counter"
            />
            <h3>Over-the-Counter</h3>
            <Link to="/category/otc">View Medications</Link>
          </div>
          <div className="category-card">
            <img
              src="https://placehold.co/300x200?text=Vitamins+and+Supplements"
              alt="Vitamins and Supplements"
            />
            <h3>Vitamins & Supplements</h3>
            <Link to="/category/vitamins">View Products</Link>
          </div>
          <div className="category-card">
            <img
              src="https://placehold.co/300x200?text=Personal+Care"
              alt="Personal Care"
            />
            <h3>Personal Care</h3>
            <Link to="/category/personal-care">View Products</Link>
          </div>
        </div>
      </section>

      <section className="promotion-section">
        <div className="promotion-content">
          <h2>Health Services</h2>
          <p>
            Schedule a consultation with our pharmacists for personalized advice
          </p>
          <Link to="/services" className="promo-button">
            Book Appointment
          </Link>
        </div>
      </section>

      <section className="info-section">
        <div className="info-columns">
          <div className="info-column">
            <i className="fa fa-prescription"></i>
            <h3>Prescription Refills</h3>
            <p>Quick and easy prescription refills online or in-store</p>
          </div>
          <div className="info-column">
            <i className="fa fa-truck"></i>
            <h3>Free Delivery</h3>
            <p>Free home delivery on orders over €30</p>
          </div>
          <div className="info-column">
            <i className="fa fa-user-md"></i>
            <h3>Expert Advice</h3>
            <p>Consult with our experienced pharmacists</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
