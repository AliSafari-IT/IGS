import { Link } from "react-router-dom";
import HomeHeroSection from "./HomeHeroSection";
import "./HomePage.css";

// HomePage.tsx
// This component serves as the main landing page for the pharmacy application
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <HomeHeroSection />

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
