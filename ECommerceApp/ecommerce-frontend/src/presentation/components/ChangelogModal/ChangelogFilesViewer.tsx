import React, { useState, useEffect, lazy, Suspense } from 'react';
import './ChangelogFilesViewer.css';
import { ChangelogFile, fetchChangelogFiles, fetchChangelogFileContent, deleteChangelogFile } from '../../../utils/changelogUtils';
import ChangelogEditor from './ChangelogEditor';

// Lazy load the MarkdownDisplay component
const MarkdownDisplay = lazy(() => import('../MarkdownDisplay/MarkdownDisplay'));

interface ChangelogFilesViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangelogFilesViewer: React.FC<ChangelogFilesViewerProps> = ({ isOpen, onClose }) => {
  const [changelogFiles, setChangelogFiles] = useState<ChangelogFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileToEdit, setFileToEdit] = useState<ChangelogFile | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<ChangelogFile | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Maximum 3 items per page
  
  // Fetch changelog files when the modal is opened
  useEffect(() => {
    if (isOpen) {
      loadChangelogFiles();
    }
  }, [isOpen]);

  // Function to load changelog files
  const loadChangelogFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const files = await fetchChangelogFiles();
      setChangelogFiles(files);
    } catch (err) {
      setError('Failed to load changelog files. Please try again later.');
      console.error('Error loading changelog files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this changelog file? This action cannot be undone.')) {
      try {
        const success = await deleteChangelogFile(id);
        if (success) {
          // Remove the file from the local state
          setChangelogFiles(prev => prev.filter(file => file.id !== id));
        } else {
          alert('Failed to delete the changelog file. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting changelog file:', err);
        alert('An error occurred while deleting the file.');
      }
    }
  };
  
  // Handle file edit
  const handleEditFile = (file: ChangelogFile) => {
    setFileToEdit(file);
    setIsEditorOpen(true);
  };
  
  // Handle file save after editing
  const handleSaveFile = (updatedFile: ChangelogFile) => {
    // Update the file in the local state
    setChangelogFiles(prev => 
      prev.map(file => 
        file.id === updatedFile.id ? updatedFile : file
      )
    );
    
    // Close the editor
    setIsEditorOpen(false);
    setFileToEdit(null);
  };

  // Filter and sort changelog files
  const filteredAndSortedFiles = changelogFiles
    .filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.version.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Convert dates to timestamps for comparison
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedFiles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedFiles.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Handle ESC key to close modal
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
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc');
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="changelog-overlay" onClick={onClose}></div>
      <div className="changelog-files-viewer">
        <div className="changelog-files-header">
          <h2>Changelog Bestanden</h2>
          <div className="changelog-files-actions">
            <div className="changelog-search-container">
              <i className="fas fa-search changelog-search-icon"></i>
              <input 
                type="text" 
                placeholder="Zoeken op naam of versie..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="changelog-search-input"
              />
              {searchTerm && (
                <button 
                  className="changelog-search-clear" 
                  onClick={() => setSearchTerm('')}
                  title="Zoekopdracht wissen"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <button 
              className="changelog-sort-button" 
              onClick={toggleSortOrder}
              title={sortOrder === 'desc' ? 'Sorteer oplopend' : 'Sorteer aflopend'}
            >
              <i className={`fas fa-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
              <span className="changelog-sort-label">Datum</span>
            </button>
            <button className="changelog-close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="changelog-files-content">
          {isLoading ? (
            <div className="changelog-loading-container">
              <div className="changelog-loading">
                <i className="fas fa-spinner fa-spin"></i> Loading changelog files...
              </div>
            </div>
          ) : error ? (
            <div className="changelog-error-container">
              <div className="changelog-error">
                <i className="fas fa-exclamation-triangle"></i> {error}
                <button 
                  className="changelog-retry-button"
                  onClick={loadChangelogFiles}
                >
                  <i className="fas fa-redo"></i> Try Again
                </button>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="changelog-file-viewer">
              <div className="changelog-file-viewer-header">
                <button 
                  className="changelog-back-button"
                  onClick={() => setSelectedFile(null)}
                >
                  <i className="fas fa-arrow-left"></i> Terug naar overzicht
                </button>
                <h3>{selectedFile.name}</h3>
                <div className="changelog-file-viewer-meta">
                  <span className="changelog-version-tag">{selectedFile.version}</span>
                  <span className="changelog-date">{selectedFile.date}</span>
                </div>
              </div>
              <div className="changelog-file-viewer-content">
                <Suspense fallback={<div className="loading">Loading content...</div>}>
                  <MarkdownDisplay content={selectedFile.content || 'No content available'} />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="changelog-files-container">
              <div className="changelog-files-header-row">
                <div className="changelog-files-count">
                  {filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'bestand' : 'bestanden'} gevonden
                  {searchTerm && <span> voor "{searchTerm}"</span>}
                </div>
                {filteredAndSortedFiles.length > 0 && (
                  <button 
                    className="changelog-view-latest-button"
                    onClick={() => setSelectedFile(filteredAndSortedFiles[0])}
                    title="Bekijk meest recente changelog"
                  >
                    <i className="fas fa-clock"></i> Meest recente bekijken
                  </button>
                )}
              </div>
              
              {filteredAndSortedFiles.length === 0 ? (
                <div className="changelog-empty-message">
                  <i className="fas fa-search"></i>
                  <p>Geen bestanden gevonden{searchTerm && ` voor "${searchTerm}"`}</p>
                </div>
              ) : (
                <>
                  <div className="changelog-files-grid">
                    {currentItems.map((file) => (
                      <div 
                        key={file.id} 
                        className="changelog-file-item"
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="changelog-file-icon">
                          <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="changelog-file-info">
                          <div className="changelog-file-name">{file.name}</div>
                          <div className="changelog-file-meta">
                            <span className="changelog-file-version">{file.version}</span>
                            <span className="changelog-file-date">{file.date}</span>
                            <span className="changelog-file-size">{file.size}</span>
                          </div>
                        </div>
                        <div className="changelog-file-actions">
                          <button 
                            className="changelog-file-action view"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(file);
                            }}
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="changelog-file-action edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFile(file);
                            }}
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="changelog-file-action delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file.id);
                            }}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls - Always visible */}
                  {(
                    <div className="changelog-pagination">
                      <button 
                        className="changelog-pagination-button first"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                      <button 
                        className="changelog-pagination-button prev"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous Page"
                      >
                        <i className="fas fa-angle-left"></i>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`changelog-pagination-page ${page === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                          disabled={page === currentPage}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button 
                        className="changelog-pagination-button next"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Next Page"
                      >
                        <i className="fas fa-angle-right"></i>
                      </button>
                      <button 
                        className="changelog-pagination-button last"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last Page"
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </button>
                      
                      <span className="changelog-pagination-info">
                        Page {currentPage} of {totalPages} ({filteredAndSortedFiles.length} items)
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Changelog Editor Modal */}
      <ChangelogEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        file={fileToEdit}
        onSave={handleSaveFile}
      />
    </>
  );
};

export default ChangelogFilesViewer;