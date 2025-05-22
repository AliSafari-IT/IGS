import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-header">
        <h1>Contact Us</h1>
        <p className="tagline">We're here to help with all your health and wellness needs</p>
      </div>

      <div className="contact-us-content">
        <div className="contact-info">
          <div className="info-section">
            <h2>Address</h2>
            <address>
              <p><strong>IGS PHARMA (Pharmacie Laaroussi)</strong></p>
              <p>Rue de Bosnie 104</p>
              <p>1060 Sint-Gillis</p>
              <p>Belgium</p>
            </address>
          </div>

          <div className="info-section">
            <h2>Hours</h2>
            <ul className="hours-list">
              <li><span>Monday–Friday:</span> <span>9:00AM–12:30PM — 2:00PM – 7:00PM</span></li>
              <li><span>Saturday:</span> <span>9:00AM–12:30PM</span></li>
              <li><span>Sunday:</span> <span>Closed</span></li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Get in Touch</h2>
            <ul className="contact-list">
              <li>
                <div className="icon-container">
                  <img src="/images/svgs/phone-icon.svg" alt="Phone" className="contact-icon" />
                  <img src="/images/svgs/whatsapp-icon.svg" alt="WhatsApp" className="contact-icon whatsapp-icon" />
                </div>
                <div><strong>Phone & WhatsApp:</strong> +32 2 537 27 40</div>
              </li>
              <li>
                <img src="/images/svgs/mail-icon.svg" alt="Email" className="contact-icon" />
                <div><strong>Email:</strong> contact@igs-pharma.com</div>
              </li>
              <li>
                <img src="/images/svgs/website-icon.svg" alt="Website" className="contact-icon" />
                <div><strong>Website:</strong> <a href="https://igs-pharma.com" target="_blank" rel="noopener noreferrer">igs-pharma.com</a></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <h3>Thank you for your message!</h3>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Prescription">Prescription Question</option>
                  <option value="Product Availability">Product Availability</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows={5}
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <div className="form-group privacy-policy">
                <input type="checkbox" id="privacy" required />
                <label htmlFor="privacy">
                  I agree to the processing of my personal data in accordance with the <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="submit-button">Send Message</button>
            </form>
          )}
        </div>
      </div>

      <div className="map-container">
        <h2>Find Us</h2>
        <div className="map-placeholder">
          <p>Map integration would be displayed here in a production environment.</p>
          <p>For this demo, imagine an embedded Google Maps showing the pharmacy location.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
