import React, { useState, useRef, useEffect, memo, useCallback, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import { CartButton } from "./Cart";
import { SearchButton } from "./Search";
import { useMediaQuery, useDebounce, usePerformanceMonitor } from "../../utils/performanceHooks";
import "./HeaderNew.css";

// Lazy load heavy components
const ChangelogModal = lazy(() => import("./ChangelogModal/ChangelogModal"));

const Header: React.FC = memo(() => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Performance monitoring
  usePerformanceMonitor('Header');
  
  // Responsive design
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Debounce menu interactions for better performance
  const debouncedMenuOpen = useDebounce(menuOpen, 100);
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    // Add passive listener for better performance
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleUserButtonClick = useCallback(() => {
    if (user) {
      setMenuOpen(!menuOpen);
    }
  }, [user, menuOpen]);

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (logout) {
      setMenuOpen(false);
      logout();
      
      // Use requestAnimationFrame for smoother navigation
      requestAnimationFrame(() => {
        window.location.href = "/";
      });
    }
  }, [logout]);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleChangelogOpen = useCallback(() => {
    setChangelogOpen(true);
  }, []);

  const handleChangelogClose = useCallback(() => {
    setChangelogOpen(false);
  }, []);  const renderHeader = () => (
    <header className="header" role="banner">
      <div className="header-container">
        <div className="logo">
          <Link to="/" aria-label="IGS-Pharma Homepage">
            <img
              src="/images/logo.webp"
              alt="IGS-Pharma Logo"
              className="logo-image"
              width="120"
              height="40"
              loading="eager"
              decoding="async"
            />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        {isMobile && (
          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        )}
        
        <nav 
          className={`main-nav ${isMobile ? 'mobile-nav' : ''} ${menuOpen && isMobile ? 'nav-open' : ''}`}
          role="navigation"
          id="main-navigation"
          aria-label="Main navigation"
        >
          <ul>
            <li>
              <Link to="/" onClick={handleMenuClose} aria-current={location.pathname === '/' ? 'page' : undefined}>
                <i className="fa fa-home" aria-hidden="true"></i>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/categories" onClick={handleMenuClose} aria-current={location.pathname === '/categories' ? 'page' : undefined}>
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <span>Categories</span>
              </Link>
            </li>
            <li>
              <Link to="/medications" onClick={handleMenuClose} aria-current={location.pathname === '/medications' ? 'page' : undefined}>
                <i className="fa fa-pills" aria-hidden="true"></i>
                <span>Medications</span>
              </Link>
            </li>
            <li>
              <Link to="/prescriptions" onClick={handleMenuClose} aria-current={location.pathname === '/prescriptions' ? 'page' : undefined}>
                <i className="fa fa-prescription" aria-hidden="true"></i>
                <span>Prescriptions</span>
              </Link>
            </li>
            <li>
              <Link to="/health-advice" onClick={handleMenuClose} aria-current={location.pathname === '/health-advice' ? 'page' : undefined}>
                <i className="fa fa-heartbeat" aria-hidden="true"></i>
                <span>Health Advice</span>
              </Link>
            </li>
            <li>
              <Link to="/about-us" onClick={handleMenuClose} aria-current={location.pathname === '/about-us' ? 'page' : undefined}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link to="/contact-us" onClick={handleMenuClose} aria-current={location.pathname === '/contact-us' ? 'page' : undefined}>
                <i className="fa fa-envelope" aria-hidden="true"></i>
                <span>Contact</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <SearchButton />
          <CartButton />
          <button 
            className="changelog-btn" 
            onClick={handleChangelogOpen} 
            aria-label="View application changelog"
            type="button"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            {!isMobile && <span className="btn-text">Changelog</span>}
          </button>
          
          <div className="user-menu" ref={menuRef}>
            <button 
              className="user-btn" 
              onClick={handleUserButtonClick}
              aria-expanded={debouncedMenuOpen}
              aria-haspopup="menu"
              aria-label={user ? `User menu for ${user.firstName} ${user.lastName}` : 'Login to your account'}
              type="button"
            >
              {user ? (
                <div className="user-avatar-small" role="img" aria-label={`${user.firstName} ${user.lastName}`}>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              ) : (
                <Link to="/login" className="login-link">
                  <i className="fa fa-user-circle" aria-hidden="true"></i>
                  {!isMobile && <span className="login-text">Login</span>}
                </Link>
              )}
            </button>
            
            {user && (
              <div 
                className={`user-dropdown ${debouncedMenuOpen ? "active" : ""}`}
                role="menu"
                aria-label="User account menu"
              >
                <div className="dropdown-user-info" role="presentation">
                  <div className="dropdown-user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="dropdown-user-email">{user.email}</div>
                </div>
                <ul className="dropdown-menu" role="none">
                  <li role="none">
                    <Link
                      to="/account#profile"
                      onClick={handleMenuClose}
                      role="menuitem"
                      aria-label="Go to my account profile"
                    >
                      <i className="fa fa-user" aria-hidden="true"></i>
                      <span>Mijn account</span>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/account#orders"
                      onClick={handleMenuClose}
                      role="menuitem"
                      aria-label="View my orders"
                    >
                      <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                      <span>Mijn bestellingen</span>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/account#recipes"
                      onClick={handleMenuClose}
                      role="menuitem"
                      aria-label="View my prescriptions"
                    >
                      <i className="fa fa-prescription-bottle" aria-hidden="true"></i>
                      <span>Mijn recepten</span>
                    </Link>
                  </li>
                  {user && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'superadmin' || user.role.toLowerCase() === 'beheerder') && (
                    <li role="none">
                      <Link
                        to="/admin"
                        onClick={handleMenuClose}
                        className="admin-link"
                        role="menuitem"
                        aria-label="Go to admin panel"
                      >
                        <i className="fa fa-cog" aria-hidden="true"></i>
                        <span>Admin Beheer</span>
                      </Link>
                    </li>
                  )}
                  <li role="none">
                    <button 
                      onClick={handleLogout}
                      role="menuitem"
                      aria-label="Logout from your account"
                      type="button"
                    >
                      <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
                      <span>Uitloggen</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && menuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={handleMenuClose}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );  return (
    <>
      {renderHeader()}
      <Suspense fallback={<div className="modal-loading">Loading...</div>}>
        <ChangelogModal isOpen={changelogOpen} onClose={handleChangelogClose} />
      </Suspense>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
