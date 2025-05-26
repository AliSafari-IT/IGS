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
              <input 
                type="text" 
                placeholder="Zoeken..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="changelog-search-input"
              />
            </div>
            <button 
              className="changelog-sort-button" 
              onClick={toggleSortOrder}
              title={sortOrder === 'desc' ? 'Sorteer oplopend' : 'Sorteer aflopend'}
            >
              <i className={`fas fa-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
            </button>
            <button className="changelog-close-btn" onClick={onClose}>×</button>
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
                  <i className="fas fa-arrow-left"></i> Terug naar lijst
                </button>
                <h3>{selectedFile.name} <span className="changelog-version-badge">{selectedFile.version}</span></h3>
                <div className="changelog-file-info">
                  <span><i className="fas fa-calendar"></i> {selectedFile.date}</span>
                  <span><i className="fas fa-file"></i> {selectedFile.size}</span>
                </div>
              </div>
              <div className="changelog-file-content">
                <Suspense fallback={<div className="changelog-loading"><i className="fas fa-spinner fa-spin"></i> Loading changelog...</div>}>
                  <MarkdownDisplay 
                    url={selectedFile.path} 
                    loadingMessage="Loading changelog..." 
                    errorMessage="Failed to load changelog. Please try again later."
                    className="changelog-markdown"
                  />
                </Suspense>
              </div>
            </div>
          ) : changelogFiles.length === 0 ? (
            <div className="changelog-empty-container">
              <div className="changelog-empty">
                <i className="fas fa-file-alt"></i>
                <h3>No Changelog Files Found</h3>
                <p>There are no changelog files available. Create your first changelog file to get started.</p>
                <button className="changelog-create-button">
                  <i className="fas fa-plus-circle"></i> Create Changelog File
                </button>
              </div>
            </div>
          ) : (
            <div className="changelog-files-list-container">
              <table className="changelog-files-table">
                <thead>
                  <tr>
                    <th className="changelog-files-th-index">#</th>
                    <th className="changelog-files-th-name">Bestandsnaam</th>
                    <th className="changelog-files-th-version">Versie</th>
                    <th className="changelog-files-th-date">
                      Datum
                      <button 
                        className="changelog-sort-button-inline" 
                        onClick={toggleSortOrder}
                      >
                        <i className={`fas fa-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
                      </button>
                    </th>
                    <th className="changelog-files-th-size">Grootte</th>
                    <th className="changelog-files-th-actions">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedFiles.map((file, index) => (
                    <tr key={file.id} className="changelog-files-tr">
                      <td className="changelog-files-td-index">{index + 1}</td>
                      <td className="changelog-files-td-name">
                        <button 
                          className="changelog-file-name-button"
                          onClick={() => setSelectedFile(file)}
                        >
                          {file.name}
                        </button>
                      </td>
                      <td className="changelog-files-td-version">{file.version}</td>
                      <td className="changelog-files-td-date">{file.date}</td>
                      <td className="changelog-files-td-size">{file.size}</td>
                      <td className="changelog-files-td-actions">
                        <button 
                          className="changelog-file-action-button view"
                          onClick={() => setSelectedFile(file)}
                          title="Bekijken"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <a 
                          href={file.path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="changelog-file-action-button download"
                          title="Downloaden"
                        >
                          <i className="fas fa-download"></i>
                        </a>
                        <button 
                          className="changelog-file-action-button edit"
                          title="Bewerken"
                          onClick={() => handleEditFile(file)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="changelog-file-action-button delete"
                          title="Verwijderen"
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="changelog-files-info">
                <h3>Changelog Bestanden Beheer</h3>
                <p>
                  Changelog bestanden worden opgeslagen in de <code>/public/change-logs/</code> map en zijn geschreven in Markdown formaat.
                  Wijzigingen in deze bestanden worden direct weergegeven in de changelog modal die toegankelijk is via de header van de website.
                </p>
                <p>
                  <strong>Bestandsconventies:</strong>
                </p>
                <ul>
                  <li><code>CHANGELOG.md</code> - Hoofdbestand met alle wijzigingen</li>
                  <li><code>vX.Y.md</code> - Specifieke versie changelog (bijv. v2.0.md)</li>
                </ul>
              </div>
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