import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About IGS Pharma</h1>
        <p className="tagline">Your trusted partner in health and wellness since 2010</p>
      </div>

      <div className="about-us-content">
        <div className="about-us-section">
          <h2>Our Mission</h2>
          <p>
            At IGS Pharma, our mission is to provide personalized pharmaceutical care that improves the quality of life 
            for our customers. We believe in a patient-centered approach where your health and well-being are our top priorities.
          </p>
          <p>
            We strive to be more than just a pharmacy - we aim to be a health partner that you can rely on for expert advice, 
            quality products, and compassionate service.
          </p>
        </div>

        <div className="about-us-section team-section">
          <h2>Meet Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <div className="team-member-image placeholder-image"></div>
              <h3>Dr. Ikram Laarussi</h3>
              <p className="team-role">Head Pharmacist</p>
              <p>
                With over 15 years of experience, Dr. Laarussi leads our team with expertise in medication management and patient care.
              </p>
            </div>
            <div className="team-member">
              <div className="team-member-image placeholder-image"></div>
              <h3>Mr. Mohammed Djavad Salehi</h3>
              <p className="team-role">Chief Executive Officer</p>
              <p>
                Salehi has over 15 years of experience in the pharmaceutical industry and is committed to delivering exceptional service to our customers.
              </p>
            </div>
            <div className="team-member">
              <div className="team-member-image placeholder-image"></div>
              <h3>PhD. Ali Safari</h3>
              <p className="team-role">Chief Technology Officer</p>
              <p>
                Dr. Safari leads our digital transformation initiatives, implementing cutting-edge technology solutions that enhance medication safety, streamline operations, and improve the overall customer experience.
              </p>
            </div>
          </div>
        </div>

        <div className="about-us-section">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">💊</div>
              <h3>Prescription Filling</h3>
              <p>Fast and accurate prescription services with personalized counseling.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">🩺</div>
              <h3>Medication Reviews</h3>
              <p>Comprehensive reviews to optimize your medication regimen.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">💉</div>
              <h3>Vaccinations</h3>
              <p>Convenient immunization services provided by certified pharmacists.</p>
            </div>
            <div className="service-item">
              <div className="service-icon">📋</div>
              <h3>Health Consultations</h3>
              <p>Private consultations for personalized health advice.</p>
            </div>
          </div>
        </div>

        <div className="about-us-section">
          <h2>Our Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h3>Excellence</h3>
              <p>We are committed to providing the highest quality of pharmaceutical care.</p>
            </div>
            <div className="value-item">
              <h3>Integrity</h3>
              <p>We operate with honesty, transparency, and ethical standards in all we do.</p>
            </div>
            <div className="value-item">
              <h3>Compassion</h3>
              <p>We treat each customer with empathy, respect, and understanding.</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>We continuously seek better ways to serve our community's health needs.</p>
            </div>
          </div>
        </div>

        <div className="about-us-section">
          <h2>Visit Us</h2>
          <div className="location-info">
            <div className="address-info">
              <h3>Address</h3>
              <div className="contact-item">
                <img src="/images/svgs/map-pin.svg" alt="Address" className="contact-icon" />
                <div>
                  <p>Rue de Bosnie 104</p>
                  <p>1060 Sint-Gillis</p>
                  <p>Belgium</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-container">
                  <img src="/images/svgs/phone-icon.svg" alt="Phone" className="contact-icon" />
                  <img src="/images/svgs/whatsapp-icon.svg" alt="WhatsApp" className="contact-icon whatsapp-icon" />
                </div>
                <p>Phone & WhatsApp: +32 2 537 27 40</p>
              </div>
              <div className="contact-item">
                <img src="/images/svgs/mail-icon.svg" alt="Email" className="contact-icon" />
                <p>Email: contact@igs-pharma.com</p>
              </div>
              <div className="contact-item">
                <img src="/images/svgs/website-icon.svg" alt="Website" className="contact-icon" />
                <p>Website: <a href="https://igs-pharma.com" target="_blank" rel="noopener noreferrer">igs-pharma.com</a></p>
              </div>
            </div>
            <div className="hours-info">
              <h3>Opening Hours</h3>
              <table className="hours-table">
                <tbody>
                  <tr>
                    <td>Monday - Friday:</td>
                    <td>8:30 AM - 7:00 PM</td>
                  </tr>
                  <tr>
                    <td>Saturday:</td>
                    <td>9:00 AM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td>Sunday:</td>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
