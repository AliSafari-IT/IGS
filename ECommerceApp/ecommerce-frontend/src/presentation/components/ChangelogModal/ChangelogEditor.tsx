import React, { useState, useEffect } from 'react';
import './ChangelogEditor.css';
import { ChangelogFile } from '../../../utils/changelogUtils';

interface ChangelogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  file: ChangelogFile | null;
  onSave: (updatedFile: ChangelogFile) => void;
  isSaving?: boolean;
}

const ChangelogEditor: React.FC<ChangelogEditorProps> = ({ isOpen, onClose, file, onSave, isSaving: externalIsSaving }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // If file is in read-only mode, automatically set preview mode to true
  const [previewMode, setPreviewMode] = useState(file?.readOnly || false);
  
  // Fetch file content when the editor is opened
  useEffect(() => {
    if (isOpen && file) {
      console.log('Editor opened for file:', file.name, file.readOnly ? '(read-only)' : '');
      
      // If the file is in read-only mode, force preview mode
      if (file.readOnly) {
        setPreviewMode(true);
      }
      
      // If the file already has content, use it directly
      if (file.content) {
        console.log('Using existing content from file object');
        setContent(file.content);
      } else if (file.id && file.id !== 'new') {
        // For existing files without content, we would need to fetch it
        // But in our case, the content should already be loaded by the parent component
        console.log('File should have content loaded by parent');
        setContent('# ' + file.name + '\n\nEnter changelog content here...');
      } else {
        // For new files, set a template
        console.log('Setting template for new file');
        setContent('# ' + file.name + '\n\nEnter changelog content here...');
      }
    }
  }, [isOpen, file]);
  
  // Save changes
  const handleSave = async () => {
    if (!file) return;
    
    // Use external isSaving state if provided, otherwise use local state
    if (!externalIsSaving) {
      setIsSaving(true);
    }
    setError(null);
    
    try {
      // Calculate new file size based on content length
      // This is a simple approximation - in a real app, the server would calculate the actual size
      const contentSizeKB = Math.round((content.length * 2) / 1024 * 10) / 10;
      
      // Create updated file object
      const updatedFile = {
        ...file,
        content: content,
        // Update the date to current date
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        // Update file size based on content length
        size: `${contentSizeKB} KB`
      };
      
      console.log('Saving file:', updatedFile);
      // The parent component will handle the actual API call
      onSave(updatedFile);
      onClose();
    } catch (err: any) {
      console.error('Error preparing file for save:', err);
      // Display a more specific error message if available
      setError(err.message || 'Failed to prepare changes. Please try again.');
      
      // Show error for 5 seconds, then allow retry
      setTimeout(() => {
        if (error === err.message || error === 'Failed to prepare changes. Please try again.') {
          setError(null);
        }
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [content, file]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="changelog-overlay" onClick={onClose}></div>
      <div className="changelog-editor">
        <div className="changelog-editor-header">
          <h2>{file?.readOnly ? 'View' : 'Edit'} Changelog: {file?.name}</h2>
          <div className="changelog-editor-actions">
            {!file?.readOnly && (
              <>
                <button 
                  className={`changelog-editor-mode-button ${!previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(false)}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  className={`changelog-editor-mode-button ${previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(true)}
                >
                  <i className="fas fa-eye"></i> Preview
                </button>
                <button 
                  className="changelog-editor-save-button"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i> Save Changes
                    </>
                  )}
                </button>
              </>
            )}
            <button className="changelog-editor-close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        {error && (
          <div className="changelog-editor-error">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}
        
        <div className="changelog-editor-content">
          {isLoading ? (
            <div className="changelog-editor-loading">
              <i className="fas fa-spinner fa-spin"></i> Loading content...
            </div>
          ) : previewMode ? (
            <div className="changelog-editor-preview markdown-content">
              {/* This would be better with a markdown renderer component */}
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
            </div>
          ) : (
            <textarea
              className="changelog-editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Changelog\n\nEnter your markdown content here..."
              spellCheck="false"
              autoFocus
            />
          )}
        </div>
        
        <div className="changelog-editor-footer">
          <div className="changelog-editor-info">
            <span><i className="fas fa-info-circle"></i> Markdown formatting is supported</span>
          </div>
          <div className="changelog-editor-actions">
            <button 
              className="changelog-editor-cancel-button"
              onClick={onClose}
              disabled={isSaving}
            >
              {file?.readOnly ? 'Close' : 'Cancel'}
            </button>
            {!file?.readOnly && (
              <button 
                className="changelog-editor-save-button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Enhanced markdown renderer (in a real app, use a proper markdown library like marked.js)
function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  try {
    // Process the markdown in multiple passes for better results
    
    // First, handle code blocks and preserve them
    const codeBlocks: string[] = [];
    let processedMarkdown = markdown.replace(/```([\s\S]*?)```/g, (match) => {
      const id = `CODE_BLOCK_${codeBlocks.length}`;
      codeBlocks.push(match);
      return id;
    });
    
    // Process lists - wrap in ul tags
    processedMarkdown = processedMarkdown.replace(/((?:^- .+$\n?)+)/gm, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    // Process the main elements
    let html = processedMarkdown
      // Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Horizontal rule
      .replace(/^---+$/gm, '<hr>')
      // Paragraphs - wrap text blocks in p tags
      .replace(/^([^<\n].+)$/gm, '<p>$1</p>')
      // Line breaks - preserve them but don't add extra ones
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
    
    // Restore code blocks with proper formatting
    codeBlocks.forEach((block, index) => {
      const codeContent = block.replace(/```(?:\w+)?\n?([\s\S]*?)```/g, '$1');
      const formattedCode = `<pre><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      html = html.replace(`CODE_BLOCK_${index}`, formattedCode);
    });
    
    // Clean up any artifacts from the processing
    html = html
      .replace(/<\/ul><br><ul>/g, '</ul><ul>')
      .replace(/<p><br><\/p>/g, '<br>')
      .replace(/<p><\/p>/g, '');
    
    return html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p>Error rendering markdown. Please check your syntax.</p><pre>${markdown}</pre>`;
  }
}

export default ChangelogEditor;