import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomeHeroSection.css";

function HomeHeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  
  // Hero slider data with more medical-focused imagery
  const heroSlides = [
    {
      title: "Advanced Healthcare Solutions",
      subtitle: "Precision Medicine for Tomorrow's Healthcare",
      description: "Access cutting-edge medical equipment designed for modern healthcare professionals.",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      ctaText: "Explore Equipment",
      ctaLink: "/equipment",
      color: "#3c91e6"
    },
    {
      title: "Premium Pharmaceuticals",
      subtitle: "Quality Medications, Better Outcomes",
      description: "Discover our range of high-quality medications with verified efficacy and safety profiles.",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      ctaText: "Browse Medications",
      ctaLink: "/medications",
      color: "#4caf50"
    },
    {
      title: "Patient Care Essentials",
      subtitle: "Comprehensive Support for Every Need",
      description: "Find essential supplies for optimal patient care, comfort and recovery.",
      image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      ctaText: "View Essentials",
      ctaLink: "/care-essentials",
      color: "#e91e63"
    }
  ];
    // Auto-advance slides with smoother transitions
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      if (!isAnimating) {
        const nextSlide = (activeSlide + 1) % heroSlides.length;
        goToSlide(nextSlide);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activeSlide, isAnimating, heroSlides.length]);
  // Handle slide navigation with animation lock
  const goToSlide = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveSlide(index);
    
    // Reset animation lock after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  // Handle parallax effect on mouse move
  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    if (!slidesRef.current) return;
    
    const cards = slidesRef.current.querySelectorAll('.parallax-element');
    const rect = slidesRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    cards.forEach(card => {
      const factor = parseFloat(card.getAttribute('data-depth') || '0.05');
      const x = mouseX * factor;
      const y = mouseY * factor;
      (card as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  return (
    <section className="hero-next-gen">
      {/* Animated background elements */}
      <div className="hero-bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-grid"></div>
        <div className="bg-pattern"></div>
      </div>
      
      <div className="hero-wrapper">
        {/* Top navigation bar */}
        <nav className="hero-nav">
          <div className="hero-brand">
            <span className="brand-text">IGS</span>
            <span className="brand-highlight">Pharma</span>
          </div>
          
          <div className="hero-nav-links">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/solutions" className="nav-link">Solutions</Link>
            <Link to="/research" className="nav-link">Research</Link>
            <Link to="/about-us" className="nav-link">About Us</Link>
          </div>
          
          <div className="hero-nav-actions">
            <div className="search-bar">
              <input type="text" placeholder="Search products..." />
              <button aria-label="Search">
                <svg viewBox="0 0 24 24" className="icon-search">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </button>
            </div>
            <Link to="/contact" className="action-button">
              Contact Us
              <svg viewBox="0 0 24 24" className="icon-arrow">
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
            </Link>
          </div>
        </nav>
        
        {/* Main content grid */}
        <div className="hero-content-grid">
          {/* Information sidebar */}
          <div className="hero-sidebar">
            <div className="company-block">
              <div className="company-logo">
                <svg viewBox="0 0 24 24" className="pulse-icon">
                  <path d="M8,16H4V4H8V16M10,16H14V4H10V16M16,4V16H20V4H16M2,22H22V19H2V22Z" />
                </svg>
              </div>
              <h3 className="company-title">
                <span>IGS</span>
                <span className="accent">Pharma</span>
              </h3>
              <p className="company-tagline">Advancing Healthcare Solutions</p>
            </div>
            
            <div className="company-stats">
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Years Experience</div>
                <div className="stat-bar"><div className="stat-fill" style={{width: '90%'}}></div></div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Products</div>
                <div className="stat-bar"><div className="stat-fill" style={{width: '75%'}}></div></div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries</div>
                <div className="stat-bar"><div className="stat-fill" style={{width: '60%'}}></div></div>
              </div>
            </div>
            
            <div className="certification-block">
              <div className="certification-title">Certifications</div>
              <div className="certification-badges">
                <div className="badge">
                  <svg viewBox="0 0 24 24" className="badge-icon">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
                  </svg>
                  <span>FDA Approved</span>
                </div>
                <div className="badge">
                  <svg viewBox="0 0 24 24" className="badge-icon">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,8H13V13.4L16.2,16.6L14.8,18L11,14.2V8Z" />
                  </svg>
                  <span>ISO Certified</span>
                </div>
                <div className="badge">
                  <svg viewBox="0 0 24 24" className="badge-icon">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <span>GMP Compliant</span>
                </div>
              </div>
            </div>
            
            <div className="quick-links">
              <Link to="/distribution" className="quick-link">Global Distribution</Link>
              <Link to="/research-papers" className="quick-link">Research Papers</Link>
              <Link to="/clinical-trials" className="quick-link">Clinical Trials</Link>
            </div>
          </div>
          
          {/* Main hero slider area */}
          <div 
            ref={slidesRef}
            className={`hero-slider-area ${isVisible ? 'visible' : ''}`}
            onMouseMove={handleMouseMove}
          >
            <div className="slides-container" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
              {heroSlides.map((slide, index) => (
                <div 
                  key={index}
                  className={`slide ${index === activeSlide ? 'active' : ''}`}
                  style={{'--accent-color': slide.color} as React.CSSProperties}
                >
                  <div className="slide-content">
                    <div className="slide-text-content">
                      <h1 className="slide-title">
                        {slide.title}
                        <div className="title-decoration"></div>
                      </h1>
                      <h2 className="slide-subtitle">{slide.subtitle}</h2>
                      <p className="slide-description">{slide.description}</p>
                      <Link to={slide.ctaLink} className="slide-cta">
                        <span>{slide.ctaText}</span>
                        <svg viewBox="0 0 24 24" className="cta-icon">
                          <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                        </svg>
                      </Link>
                    </div>
                    
                    <div className="floating-elements">
                      <div className="parallax-element floating-pill" data-depth="0.05"></div>
                      <div className="parallax-element floating-cross" data-depth="0.08"></div>
                      <div className="parallax-element floating-circle" data-depth="0.03"></div>
                    </div>
                  </div>
                  
                  <div className="slide-image-wrapper">
                    <div className="image-backdrop"></div>
                    <div className="image-container parallax-element" data-depth="0.02">
                      <img src={slide.image} alt={slide.title} className="slide-image" />
                    </div>
                    <div className="image-overlay"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider navigation */}
            <div className="slider-navigation">
              <div className="slider-dots">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span className="dot-inner"></span>
                  </button>
                ))}
              </div>
              
              <div className="slider-arrows">                <button
                  className="slider-arrow prev"
                  onClick={() => {
                    const prevSlide = (activeSlide - 1 + heroSlides.length) % heroSlides.length;
                    goToSlide(prevSlide);
                  }}
                  aria-label="Previous slide"
                  disabled={isAnimating}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                  </svg>
                </button>
                <button
                  className="slider-arrow next"
                  onClick={() => {
                    const nextSlide = (activeSlide + 1) % heroSlides.length;
                    goToSlide(nextSlide);
                  }}
                  aria-label="Next slide"
                  disabled={isAnimating}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="feature-blocks">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="feature-icon">
                <path d="M10.5,15.97L10.91,18.41C10.65,18.55 10.23,18.68 9.67,18.8C9.1,18.93 8.43,19 7.66,19C5.45,18.96 3.79,18.3 2.68,17.04C1.56,15.77 1,14.16 1,12.21C1.05,9.9 1.72,8.13 3,6.89C4.32,5.64 5.96,5 7.94,5C8.69,5 9.34,5.07 9.88,5.19C10.42,5.31 10.82,5.44 11.08,5.59L10.5,8.08L9.44,7.74C9.04,7.64 8.58,7.59 8.05,7.59C6.89,7.58 5.93,7.95 5.18,8.69C4.42,9.42 4.03,10.54 4,12.03C4,13.39 4.37,14.45 5.08,15.23C5.79,16 6.79,16.4 8.07,16.41L9.4,16.29C9.83,16.21 10.19,16.1 10.5,15.97M11,11H13V9H15V11H17V13H15V15H13V13H11V11M18,11H20V9H22V11H24V13H22V15H20V13H18V11Z" />
              </svg>
            </div>
            <h3>Medical Expertise</h3>
            <p>Industry-leading pharmaceutical products with proven efficacy</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="feature-icon">
                <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V6.5C10.55,5.4 8.45,5 6.5,5Z" />
              </svg>
            </div>
            <h3>Research Resources</h3>
            <p>Comprehensive database of clinical studies and research papers</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="feature-icon">
                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
              </svg>
            </div>
            <h3>Imaging Technology</h3>
            <p>Advanced diagnostic and imaging solutions for accurate results</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="feature-icon">
                <path d="M18,14H14V18H10V14H6V10H10V6H14V10H18M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z" />
              </svg>
            </div>
            <h3>Emergency Care</h3>
            <p>Fast response solutions for critical medical situations</p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-text">Scroll to explore</div>
        <div className="scroll-arrow">
          <svg viewBox="0 0 24 24">
            <path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default HomeHeroSection;
