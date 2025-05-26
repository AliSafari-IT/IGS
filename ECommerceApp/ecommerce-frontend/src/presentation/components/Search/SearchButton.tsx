import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchButton.css';

const SearchButton: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus the input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      // Show validation message if query is empty
      if (searchInputRef.current) {
        searchInputRef.current.setCustomValidity('Please enter a search term');
        searchInputRef.current.reportValidity();
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.setCustomValidity('');
          }
        }, 2000);
      }
      return;
    }
    
    // Navigate to search results page with query parameter
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Handle escape key to close search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <button 
        className="search-icon-btn" 
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      
      {isSearchOpen && (
        <div className="search-overlay">
          <form onSubmit={handleSearch} className="search-form">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search medications..."
              className="search-input"
              aria-label="Search medications"
            />
            <button type="submit" className="search-submit-btn" aria-label="Submit search">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button 
              type="button" 
              className="search-close-btn"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              ×
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchButton;
