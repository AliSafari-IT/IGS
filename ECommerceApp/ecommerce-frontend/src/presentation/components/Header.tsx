import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import { CartButton } from "./Cart";
import "./Header.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserButtonClick = () => {
    if (user) {
      setMenuOpen(!menuOpen);
    }
  };

  // No longer using navigate directly to avoid DataCloneError

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Prevent event bubbling

    if (logout) {
      // First close the menu
      setMenuOpen(false);

      // Then logout (which resets the user state)
      logout();

      // Use window.location for navigation instead of React Router
      // This avoids the DataCloneError completely
      setTimeout(() => {
        window.location.href = "/";
      }, 50);
    }
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img
              src="/images/logo.webp"
              alt="IGS-Pharma Logo"
              className="logo-image"
            />
          </Link>
        </div>
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/medications">Medications</Link>
            </li>
            <li>
              <Link to="/prescriptions">Prescriptions</Link>
            </li>
            <li>
              <Link to="/health-advice">Health Advice</Link>
            </li>
            <li>
              <Link to="/about-us">About</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="search-btn">
            <i className="fa fa-search"></i>
          </button>
          <CartButton />
          <div className="user-menu" ref={menuRef}>
            <button className="user-btn" onClick={handleUserButtonClick}>
              {user ? (
                <div className="user-avatar-small">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              ) : (
                <Link to="/login">
                  <i className="fa fa-user-circle"></i>
                </Link>
              )}
            </button>
            {user && (
              <div className={`user-dropdown ${menuOpen ? "active" : ""}`}>
                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="dropdown-user-email">{user.email}</div>
                </div>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/account#profile"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mijn account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account#orders"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mijn bestellingen
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account#recipes"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mijn recepten
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Uitloggen</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
