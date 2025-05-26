import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { ChangelogFile } from '../../../utils/changelogUtils';
import './ChangelogModal.css';

// Lazy load the MarkdownDisplay component
const MarkdownDisplay = lazy(() => import('../MarkdownDisplay/MarkdownDisplay'));

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Using the ChangelogFile type from changelogUtils

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const [changelogFiles, setChangelogFiles] = useState<ChangelogFile[]>([]);
  const [selectedChangelog, setSelectedChangelog] = useState<ChangelogFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch changelog files from the database
  useEffect(() => {
    if (isOpen) {
      fetchChangelogFiles();
    }
  }, [isOpen]);

  const fetchChangelogFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/changelog');
      // Check for different possible response formats
      let files = [];
      
      if (response.data && Array.isArray(response.data)) {
        files = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        files = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object with changelog files as properties
        files = Object.values(response.data);
      }
      
      if (files.length > 0) {
        setChangelogFiles(files);
        
        // Set the first file as selected if there are files and no file is currently selected
        if (!selectedChangelog) {
          setSelectedChangelog(files[0]);
        }
      } else {
        console.warn('No changelog files found in response:', response.data);
        setError('No changelog files found.');
      }
    } catch (err) {
      console.error('Error fetching changelog files:', err);
      setError('Failed to load changelog files. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter changelog files based on search term
  const filteredChangelogFiles = changelogFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="changelog-overlay" onClick={onClose}></div>
      <div className="changelog-modal changelog-modal-with-sidebar">
        <div className="changelog-header">
          <h2>Changelog</h2>
          <button className="changelog-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="changelog-body">
          <div className="changelog-sidebar">
            <div className="changelog-search">
              <input 
                type="text" 
                placeholder="Search changelogs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="changelog-search-input"
              />
            </div>
            <div className="changelog-file-list">
              {filteredChangelogFiles.length > 0 ? (
                filteredChangelogFiles.map(file => (
                  <div 
                    key={file.id} 
                    className={`changelog-file-item ${selectedChangelog && selectedChangelog.id === file.id ? 'active' : ''}`}
                    onClick={() => setSelectedChangelog(file)}
                  >
                    <div className="changelog-file-name">{file.name}</div>
                    <div className="changelog-file-date">{file.date}</div>
                  </div>
                ))
              ) : (
                <div className="changelog-no-results">No changelogs found</div>
              )}
            </div>
          </div>
          <div className="changelog-content">
            {isLoading ? (
              <div className="changelog-loading">Loading changelogs...</div>
            ) : error ? (
              <div className="changelog-error">{error}</div>
            ) : selectedChangelog ? (
              <>
                <div className="changelog-selected-title">{selectedChangelog.name}</div>
                <Suspense fallback={<div className="changelog-loading">Loading changelog...</div>}>
                  {selectedChangelog.content ? (
                    <MarkdownDisplay 
                      content={selectedChangelog.content}
                      loadingMessage="Loading changelog..." 
                      errorMessage="Failed to load changelog. Please try again later."
                      className="changelog-markdown"
                    />
                  ) : (
                    <div className="changelog-content-wrapper">
                      <p>Loading changelog content...</p>
                      <button 
                        className="changelog-retry-button"
                        onClick={() => fetchChangelogFiles()}
                      >
                        Retry
                      </button>
                    </div>
                  )}  
                </Suspense>
              </>
            ) : (
              <div className="changelog-no-selection">No changelog selected</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangelogModal;