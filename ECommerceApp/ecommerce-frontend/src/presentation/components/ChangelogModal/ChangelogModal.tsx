import React, { useState, useEffect, lazy, Suspense } from 'react';
import './ChangelogModal.css';

// Lazy load the MarkdownDisplay component
const MarkdownDisplay = lazy(() => import('../MarkdownDisplay/MarkdownDisplay'));

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChangelogFile {
  id: string;
  name: string;
  path: string;
  date: string;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const [changelogFiles, setChangelogFiles] = useState<ChangelogFile[]>([
    { 
      id: 'changelog-main', 
      name: 'Main Changelog', 
      path: '/change-logs/CHANGELOG.md',
      date: 'May 26, 2025'
    },
    { 
      id: 'changelog-v2-0', 
      name: 'Version 2.0', 
      path: '/change-logs/v2.0.md',
      date: 'April 15, 2025'
    },
    { 
      id: 'changelog-v1-5', 
      name: 'Version 1.5', 
      path: '/change-logs/v1.5.md',
      date: 'March 3, 2025'
    },
    { 
      id: 'changelog-v1-0', 
      name: 'Version 1.0', 
      path: '/change-logs/v1.0.md',
      date: 'January 10, 2025'
    }
  ]);
  
  const [selectedChangelog, setSelectedChangelog] = useState<ChangelogFile>(changelogFiles[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
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
                    className={`changelog-file-item ${selectedChangelog.id === file.id ? 'active' : ''}`}
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
            <div className="changelog-selected-title">{selectedChangelog.name}</div>
            <Suspense fallback={<div className="changelog-loading">Loading changelog...</div>}>
              <MarkdownDisplay 
                url={selectedChangelog.path} 
                loadingMessage="Loading changelog..." 
                errorMessage="Failed to load changelog. Please try again later."
                className="changelog-markdown"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangelogModal;