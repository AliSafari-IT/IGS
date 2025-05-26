import React, { useState, useEffect } from 'react';
import ChangelogManager from '../ChangelogModal/ChangelogManager';
import { ChangelogFile, fetchChangelogFiles, deleteChangelogFile } from '../../../utils/changelogUtils';
import './AdminChangelogPanel.css';

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
  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Weet je zeker dat je dit changelog bestand wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      try {
        const success = await deleteChangelogFile(id);
        if (success) {
          // Refresh the list after successful deletion
          refreshChangelogFiles();
        } else {
          alert('Het verwijderen van het changelog bestand is mislukt. Probeer het opnieuw.');
        }
      } catch (err) {
        console.error('Error deleting changelog file:', err);
        alert('Er is een fout opgetreden bij het verwijderen van het bestand. Probeer het opnieuw.');
      }
    }
  };

  return (
    <div className="admin-changelog-panel">
      <div className="admin-changelog-header">
        <h2 className="admin-changelog-title">Changelog beheren</h2>
        <div className="admin-changelog-actions">
          <button 
            className="admin-changelog-button primary"
            onClick={() => {
              setSelectedChangelogId('new-' + Date.now());
              setIsReadOnly(false);
              setIsChangelogManagerOpen(true);
            }}
          >
            <i className="fas fa-plus"></i> Nieuwe changelog maken
          </button>
        </div>
      </div>
      
      <div>
        {isLoading ? (
          <div className="admin-changelog-loading">
            <i className="fas fa-spinner fa-spin"></i> Changelogs laden...
          </div>
        ) : error ? (
          <div className="admin-changelog-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        ) : changelogFiles.length === 0 ? (
          <div className="admin-changelog-empty">
            <i className="fas fa-file-alt"></i> Geen changelog bestanden gevonden.
          </div>
        ) : (
          <table className="admin-changelog-table">
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
              {changelogFiles.map(file => (
                <tr key={file.id}>
                  <td>{file.name}</td>
                  <td>{file.version}</td>
                  <td>{file.date}</td>
                  <td>{file.size}</td>
                  <td className="admin-changelog-actions-cell">
                    <button 
                      className="admin-changelog-action-button view" 
                      title="Bekijken"
                      onClick={() => {
                        setSelectedChangelogId(file.id);
                        setIsReadOnly(true);
                        setIsChangelogManagerOpen(true);
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="admin-changelog-action-button edit" 
                      title="Bewerken"
                      onClick={() => {
                        setSelectedChangelogId(file.id);
                        setIsReadOnly(false);
                        setIsChangelogManagerOpen(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="admin-changelog-action-button delete" 
                      title="Verwijderen"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
