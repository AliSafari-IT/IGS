import React, { useState, useEffect } from 'react';
import './ChangelogFilesViewer.css';
import './ChangelogEditor.css';
import { 
  ChangelogFile, 
  fetchChangelogFiles, 
  createChangelogFile, 
  updateChangelogFile, 
  deleteChangelogFile 
} from '../../../utils/changelogUtils';
import ChangelogEditor from './ChangelogEditor';

interface ChangelogManagerProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileId?: string | null;
  initialReadOnly?: boolean;
}

const ChangelogManager: React.FC<ChangelogManagerProps> = ({ isOpen, onClose, initialFileId, initialReadOnly = false }) => {
  const [changelogFiles, setChangelogFiles] = useState<ChangelogFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Maximum 4 items per page
  
  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<ChangelogFile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to refresh the changelog files list
  const refreshChangelogFiles = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Fetch changelog files when the component mounts or refreshTrigger changes
  useEffect(() => {
    if (isOpen) {
      const loadChangelogFiles = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const files = await fetchChangelogFiles();
          setChangelogFiles(files);
          
          // If initialFileId is provided, open the editor for that file
          if (initialFileId) {
            const fileToOpen = files.find(file => file.id === initialFileId);
            if (fileToOpen) {
              // If initialReadOnly is true, mark the file as read-only
              if (initialReadOnly) {
                handleEditFile({...fileToOpen, readOnly: true});
              } else {
                handleEditFile(fileToOpen);
              }
            } else if (initialFileId.startsWith('new-')) {
              // Handle new file creation
              // Create a timestamp for unique identification
              const timestamp = Date.now();
              const formattedDate = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
              
              // Create a default file name based on the date and time to ensure uniqueness
              const hours = new Date().getHours().toString().padStart(2, '0');
              const minutes = new Date().getMinutes().toString().padStart(2, '0');
              const defaultName = `Changelog ${formattedDate} ${hours}:${minutes}`;
              const fileName = `changelog-${timestamp}.md`;
              
              // Create the new file with YAML frontmatter
              const newFile: ChangelogFile = {
                id: initialFileId,
                name: defaultName,
                path: `/change-logs/${fileName}`,
                version: 'v1.0.0',
                date: formattedDate,
                size: '0 KB',
                content: `---\nname: ${defaultName}\nversion: v1.0.0\ndate: ${formattedDate}\n---\n\n# ${defaultName}\n\nEnter changelog content here...`
              };
              
              setFileToEdit(newFile);
              setIsCreatingNew(true);
              setIsEditorOpen(true);
            }
          }
        } catch (err: any) {
          console.error('Error fetching changelog files:', err);
          setError('Failed to load changelog files. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadChangelogFiles();
    }
  }, [isOpen, initialFileId, refreshTrigger]);
  
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
  
  // Handle file creation
  const handleCreateFile = () => {
    // Create a timestamp for unique identification
    const timestamp = Date.now();
    const formattedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Create a default file name based on the date and time to ensure uniqueness
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const defaultName = `Changelog ${formattedDate} ${hours}:${minutes}`;
    const fileName = `changelog-${timestamp}.md`;
    
    // Create the new file with YAML frontmatter
    const newFile: ChangelogFile = {
      id: 'new', // Temporary ID, will be replaced by the server
      name: defaultName,
      path: `/change-logs/${fileName}`,
      version: 'v1.0.0',
      date: formattedDate,
      size: '0 KB',
      content: `---
name: ${defaultName}
version: v1.0.0
date: ${formattedDate}
---

# ${defaultName}

Enter changelog content here...`
    };
    
    setFileToEdit(newFile);
    setIsCreatingNew(true);
    setIsEditorOpen(true);
  };
  
  // Handle file deletion
  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this changelog file? This action cannot be undone.')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await deleteChangelogFile(id);
        refreshChangelogFiles();
      } catch (err: any) {
        console.error('Error deleting changelog file:', err);
        setError('Failed to delete changelog file. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle file edit
  const handleEditFile = (file: ChangelogFile) => {
    setFileToEdit(file);
    setIsCreatingNew(false);
    setIsEditorOpen(true);
  };
  
  // Handle edit request from read-only mode
  const handleEditRequest = (fileId: string) => {
    // Find the file by ID
    const fileToEdit = changelogFiles.find(file => file.id === fileId);
    if (fileToEdit) {
      // Open the file in edit mode (not read-only)
      setFileToEdit({...fileToEdit, readOnly: false});
      setIsCreatingNew(false);
      setIsEditorOpen(true);
    }
  };
  
  // Handle file save after editing
  const handleSaveFile = async (updatedFile: ChangelogFile) => {
    setIsSaving(true);
    setError(null);
    
    try {
      if (isCreatingNew) {
        // Create new file
        const createdFile = await createChangelogFile(updatedFile);
        setChangelogFiles(prev => [...prev, createdFile]);
        setIsCreatingNew(false);
      } else {
        // Update existing file
        const savedFile = await updateChangelogFile(updatedFile.id, updatedFile);
        setChangelogFiles(prev => 
          prev.map(file => file.id === savedFile.id ? savedFile : file)
        );
      }
      
      setIsEditorOpen(false);
      setFileToEdit(null);
    } catch (err: any) {
      console.error('Error saving changelog file:', err);
      setError('Failed to save changelog file. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="changelog-overlay" onClick={onClose}></div>
      <div className="changelog-files-viewer">
        <div className="changelog-files-header">
          <h2>Changelog Files</h2>
          <div className="changelog-files-actions">
            <div className="changelog-search-container">
              <input
                type="text"
                className="changelog-search-input"
                placeholder="Search changelog files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="changelog-sort-button"
                onClick={toggleSortOrder}
                title={sortOrder === 'desc' ? 'Sort Oldest First' : 'Sort Newest First'}
              >
                <i className={`fas fa-sort-${sortOrder === 'desc' ? 'down' : 'up'}`}></i>
              </button>
            </div>
            <button 
              className="changelog-create-button"
              onClick={handleCreateFile}
              disabled={isLoading}
            >
              <i className="fas fa-plus"></i> New Changelog
            </button>
          </div>
        </div>
        
        {error && (
          <div className="changelog-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
        
        <div className="changelog-files-list">
          {isLoading && filteredAndSortedFiles.length === 0 ? (
            <div className="changelog-loading">
              <div className="changelog-loading-spinner"></div>
              <p>Loading changelog files...</p>
            </div>
          ) : filteredAndSortedFiles.length === 0 ? (
            <div className="changelog-empty">
              <i className="fas fa-file-alt changelog-empty-icon"></i>
              <p>No changelog files found.</p>
              <button 
                className="changelog-create-button"
                onClick={handleCreateFile}
              >
                Create First Changelog
              </button>
            </div>
          ) : (
            <>
              <div className="changelog-files-grid">
                {currentItems.map((file) => (
                  <div 
                    key={file.id} 
                    className="changelog-file-item"
                    onClick={() => handleEditFile(file)}
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
                          // Instead of navigating to the file path, open it in the editor in read-only mode
                          handleEditFile({...file, readOnly: true});
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
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="changelog-pagination">
                  <button 
                    className="changelog-pagination-button"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button 
                    className="changelog-pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                  
                  <div className="changelog-pagination-info">
                    <span>Page {currentPage} of {totalPages}</span>
                    <span className="changelog-pagination-total">{filteredAndSortedFiles.length} items</span>
                  </div>
                  
                  <button 
                    className="changelog-pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button 
                    className="changelog-pagination-button"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Changelog Editor Modal */}
      <ChangelogEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        file={fileToEdit}
        onSave={handleSaveFile}
        isSaving={isSaving}
        onEditRequest={handleEditRequest}
      />
    </>
  );
};

export default ChangelogManager;