import React, { useState, useEffect } from 'react';
import ChangelogManager from '../ChangelogModal/ChangelogManager';
import { ChangelogFile, fetchChangelogFiles, deleteChangelogFile } from '../../../utils/changelogUtils';

const AdminChangelogPanel: React.FC = () => {
  const [isChangelogManagerOpen, setIsChangelogManagerOpen] = useState(false);
  const [selectedChangelogId, setSelectedChangelogId] = useState<string | null>(null);
  const [changelogFiles, setChangelogFiles] = useState<ChangelogFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Fetch changelog files from the database
  useEffect(() => {
    const loadChangelogFiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const files = await fetchChangelogFiles();
        setChangelogFiles(files);
      } catch (err) {
        console.error('Error fetching changelog files:', err);
        setError('Failed to load changelog files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChangelogFiles();
  }, [refreshTrigger]); // Reload when refreshTrigger changes
  
  // Function to refresh the changelog files list
  const refreshChangelogFiles = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Function to handle file deletion
  const handleDeleteChangelog = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this changelog file? This action cannot be undone.')) {
      try {
        const success = await deleteChangelogFile(id);
        if (success) {
          // Refresh the list after successful deletion
          refreshChangelogFiles();
        } else {
          alert('Failed to delete the changelog file. Please try again.');
        }
      } catch (err) {
        console.error('Error deleting changelog file:', err);
        alert('An error occurred while deleting the file.');
      }
    }
  };
  
  // Open the changelog manager with a specific file
  const openChangelogEditor = (fileId: string, readOnly: boolean = false) => {
    console.log('AdminChangelogPanel: Opening editor for file ID:', fileId, readOnly ? '(read-only)' : '');
    // Store the file ID and read-only state in URL parameters to pass to the ChangelogManager
    setSelectedChangelogId(fileId);
    setIsReadOnly(readOnly);
    setIsChangelogManagerOpen(true);
  };
  
  // Open the changelog manager to view all files
  const openChangelogManager = () => {
    setSelectedChangelogId(null);
    setIsChangelogManagerOpen(true);
  };
  
  // Function to create a new changelog file
  const handleCreateFile = () => {
    // Create a new file and open the editor directly
    const timestamp = Date.now();
    const newFileId = `new-${timestamp}`;
    openChangelogEditor(newFileId);
  }

  return (
    <div className="account-section">
      <h2>Changelog beheren</h2>
      <div className="admin-dashboard">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{changelogFiles.length}</div>
            <div className="stat-label">Totaal changelog bestanden</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {changelogFiles.length > 0 
                ? new Date(Math.max(...changelogFiles.map(file => new Date(file.date).getTime())))
                    .toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'N/A'}
            </div>
            <div className="stat-label">Laatste update</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {changelogFiles.length > 0 
                ? changelogFiles.reduce((latest, file) => 
                    file.version > latest ? file.version : latest, '0.0.0')
                : 'N/A'}
            </div>
            <div className="stat-label">Huidige versie</div>
          </div>
        </div>
        
        <div className="admin-actions">
          <button 
            className="admin-action-button"
            onClick={handleCreateFile}
          >
            <i className="fas fa-plus-circle"></i> Nieuwe changelog maken
          </button>
          <button 
            className="admin-action-button"
            onClick={openChangelogManager}
          >
            <i className="fas fa-folder-open"></i> Changelog map openen
          </button>
          <button 
            className="admin-action-button"
            onClick={refreshChangelogFiles}
            disabled={isLoading}
          >
            <i className={`fas fa-sync ${isLoading ? 'fa-spin' : ''}`}></i> Vernieuwen
          </button>
        </div>
        
        {error && (
          <div className="admin-error-message">
            <i className="fas fa-exclamation-triangle"></i> {error}
            <button onClick={refreshChangelogFiles} className="retry-button">
              <i className="fas fa-redo"></i> Opnieuw proberen
            </button>
          </div>
        )}
        
        <div className="admin-table-container">
          {isLoading && changelogFiles.length === 0 ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
              <p>Changelog bestanden laden...</p>
            </div>
          ) : changelogFiles.length === 0 && !error ? (
            <div className="no-data-message">
              <i className="fas fa-file-alt"></i>
              <p>Geen changelog bestanden gevonden</p>
              <button 
                className="create-first-button"
                onClick={() => openChangelogEditor('new')}
              >
                Eerste changelog maken
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bestandsnaam</th>
                  <th>Versie</th>
                  <th>Laatste wijziging</th>
                  <th>Grootte</th>
                  <th>Acties</th>
                </tr>
              </thead>
              <tbody>
                {changelogFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.version}</td>
                    <td>{file.date}</td>
                    <td>{file.size}</td>
                    <td>
                      <button 
                        className="table-action-btn view"
                        title="Bekijken"
                        onClick={() => openChangelogEditor(file.id, true)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="table-action-btn edit" 
                        title="Bewerken"
                        onClick={() => openChangelogEditor(file.id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="table-action-btn delete" 
                        title="Verwijderen"
                        onClick={() => handleDeleteChangelog(file.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Changelog Manager Modal */}
      <ChangelogManager 
        isOpen={isChangelogManagerOpen} 
        onClose={() => {
          setIsChangelogManagerOpen(false);
          setSelectedChangelogId(null);
          setIsReadOnly(false);
        }} 
        initialFileId={selectedChangelogId}
        initialReadOnly={isReadOnly}
      />
    </div>
  );
};

export default AdminChangelogPanel;

