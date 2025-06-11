import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../infrastructure/auth/AuthContext";
import { CartButton } from "./Cart";
import { SearchButton } from "./Search";
import ChangelogModal from "./ChangelogModal/ChangelogModal";
import "./Header.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
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
  const renderHeader = () => (
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
              <Link to="/" data-discover="true">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" data-discover="true">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/medications" data-discover="true">
                Medications
              </Link>
            </li>
            <li>
              <Link to="/prescriptions" data-discover="true">
                Prescriptions
              </Link>
            </li>
            <li>
              <Link to="/health-advice" data-discover="true">
                Health Advice
              </Link>
            </li>
            <li>
              <Link to="/about-us" data-discover="true">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact-us" data-discover="true">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <SearchButton />
          <CartButton />
          <button
            className="changelog-btn"
            onClick={() => setChangelogOpen(true)}
            title="View Changelog"
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
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </button>
          <div className="user-menu" ref={menuRef}>
            <button className="user-btn" onClick={handleUserButtonClick}>
              {user ? (
                <div className="user-avatar-small">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
              ) : (
                <Link to="/login" title="Login">
                  <i className="fa fa-user-circle"></i>
                  <span className="login-text"> Login</span>
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
                  {/* Only show Admin Beheer if user has admin role */}
                  {user &&
                    (user.role.toLocaleLowerCase() === "admin" ||
                      user.role.toLocaleLowerCase() === "superadmin" ||
                      user.role.toLocaleLowerCase() === "beheerder") && (
                      <li>
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="admin-link"
                        >
                          Admin Beheer
                        </Link>
                      </li>
                    )}
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

  // We no longer need the renderChangelogModal function as we're using the ChangelogModal component

  return (
    <>
      {renderHeader()}
      <ChangelogModal
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
      />
    </>
  );
};

export default Header;
