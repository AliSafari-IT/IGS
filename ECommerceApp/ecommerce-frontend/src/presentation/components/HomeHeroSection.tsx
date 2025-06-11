import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomeHeroSection.css";

function HomeHeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Add interactive parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const heroRect = heroRef.current.getBoundingClientRect();
      const centerX = heroRect.width / 2;
      const centerY = heroRect.height / 2;
      const mouseX = e.clientX - heroRect.left;
      const mouseY = e.clientY - heroRect.top;
      
      const moveX = (mouseX - centerX) / 40;
      const moveY = (mouseY - centerY) / 40;
      
      // Find and apply parallax to elements
      const pills = heroRef.current.querySelectorAll('.floating-pill, .floating-cross');
      pills.forEach(pill => {
        const element = pill as HTMLElement;
        const speed = parseFloat(element.getAttribute('data-speed') || '1');
        element.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
      
      // Apply subtle movement to image and cards
      const image = heroRef.current.querySelector('.main-image') as HTMLElement;
      if (image) {
        image.style.transform = `translate(${moveX * -1.5}px, ${moveY * -1.5}px)`;
      }
      
      const cards = heroRef.current.querySelectorAll('.info-card');
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        const multiplier = (index + 1) * 0.8;
        element.style.transform = `translate(${moveX * multiplier}px, ${moveY * multiplier}px)`;
      });
    };
    
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-background">
        <div className="floating-elements">
          <div className="floating-pill pill-1" data-speed="1.5"></div>
          <div className="floating-pill pill-2" data-speed="2"></div>
          <div className="floating-cross cross-1" data-speed="1.2"></div>
          <div className="floating-cross cross-2" data-speed="1.8"></div>
          
          {/* Additional animated elements */}
          <div className="dna-helix">
            <div className="dna-strand"></div>
            <div className="dna-strand"></div>
          </div>
          <div className="molecules">
            <div className="molecule molecule-1"></div>
            <div className="molecule molecule-2"></div>
            <div className="molecule molecule-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="brand-badge">
              <span className="pulse-dot"></span>
              <span className="badge-text">Trusted Since 2020</span>
            </div>
            
            <h1 className="hero-title">
              <span className="highlight">IGS</span>-Pharma
              <span className="title-accent">+</span>
            </h1>
            
            <h2 className="hero-subtitle">
              Medical Supplies & Equipment
              <span className="subtitle-accent">For Modern Healthcare</span>
            </h2>
            
            <p className="hero-description">
              Empowering healthcare professionals and patients with premium
              medical supplies, cutting-edge equipment, and expert
              pharmaceutical care. Our commitment to quality and innovation
              sets new standards in healthcare solutions.
            </p>

            <div className="hero-stats">
              <div className="stat-item" data-animate="fade-up" data-delay="200">
                <span className="stat-number count-up">10K+</span>
                <span className="stat-label">Happy Customers</span>
                <div className="stat-progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
              
              <div className="stat-item" data-animate="fade-up" data-delay="400">
                <span className="stat-number count-up">500+</span>
                <span className="stat-label">Products</span>
                <div className="stat-progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
              
              <div className="stat-item" data-animate="fade-up" data-delay="600">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
                <div className="stat-progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>

            <div className="hero-buttons">
              <Link
                to="/medications"
                className="cta-button primary pulse-effect"
              >
                <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M3,6 L21,6 L21,18 L3,18 L3,6 Z M3,10 L21,10 M9,6 L9,18" />
                </svg>
                Explore Products
                <span className="button-arrow">→</span>
              </Link>
              
              <button className="cta-button secondary video-btn">
                <div className="play-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item fade-in">
                <div className="trust-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" />
                  </svg>
                </div>
                <span>FDA Approved</span>
              </div>
              
              <div className="trust-item fade-in">
                <div className="trust-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                  </svg>
                </div>
                <span>ISO Certified</span>
              </div>
              
              <div className="trust-item fade-in">
                <div className="trust-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5M19.5,9.5L21.46,12H17V9.5M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M20,8L23,12V17H21A3,3 0 0,1 18,20A3,3 0 0,1 15,17H9A3,3 0 0,1 6,20A3,3 0 0,1 3,17H1V6C1,4.89 1.89,4 3,4H17V8H20Z" />
                  </svg>
                </div>
                <span>Fast Delivery</span>
              </div>
              
              <div className="trust-item fade-in">
                <div className="trust-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                  </svg>
                </div>
                <span>100% Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <div className="image-glow"></div>
              <img
                src="https://placehold.co/600x400?text=Medical+Equipment"
                alt="Advanced Medical Equipment"
                className="main-image"
              />
              
              <div className="floating-cards">
                <div className="info-card card-1">
                  <div className="card-icon pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.09,10.5 2.22,11H6.3L7.57,7.63C7.87,6.83 9.05,6.75 9.43,7.63L11.5,13L12.09,11.58C12.22,11.25 12.57,11 13,11H21.78C21.91,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4C14.64,4 13,4.93 12,6.34C11,4.93 9.36,4 7.5,4V4M3,12.5A1,1 0 0,0 2,13.5A1,1 0 0,0 3,14.5H5.44L11,20C12,20.9 12,20.9 13,20L18.56,14.5H21A1,1 0 0,0 22,13.5A1,1 0 0,0 21,12.5H13.4L12.47,14.8C12.07,15.81 10.92,15.67 10.55,14.83L8.5,9.5L7.54,11.83C7.39,12.21 7.05,12.5 6.6,12.5H3Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-title">Health Monitoring</span>
                    <span className="card-subtitle">Real-time data</span>
                  </div>
                </div>
                
                <div className="info-card card-2">
                  <div className="card-icon pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-title">Smart Dispensing</span>
                    <span className="card-subtitle">Precision dosage</span>
                  </div>
                </div>
                
                <div className="info-card card-3">
                  <div className="card-icon pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M12,3A4,4 0 0,0 8,7H16A4,4 0 0,0 12,3M19,7C19,4.79 16.21,3 13,3V1H11V3C7.79,3 5,4.79 5,7V10H7V8H17V10H19V7M5,16H7V20H17V16H19V22H5V16M7,12H17V14H7V12Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-title">Professional Grade</span>
                    <span className="card-subtitle">Hospital quality</span>
                  </div>
                </div>
                
                <div className="info-card card-4">
                  <div className="card-icon pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor" d="M10,3L8,5V7H5C3.85,7 3.12,8 3,9L2,19C1.88,20 2.54,21 4,21H20C21.46,21 22.12,20 22,19L21,9C20.88,8 20.06,7 19,7H16V5L14,3H10M10,5H14V7H10V5M11,10H13V13H16V15H13V18H11V15H8V13H11V10Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-title">Emergency Ready</span>
                    <span className="card-subtitle">Quick response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="scroll-text">Scroll to discover</div>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSection;
