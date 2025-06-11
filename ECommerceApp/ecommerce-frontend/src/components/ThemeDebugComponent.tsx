import React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

const ThemeDebugComponent: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  const handleClick = () => {
    console.log('🔄 Debug: Theme before toggle:', theme);
    console.log('🔄 Debug: Document data-theme before:', document.documentElement.getAttribute('data-theme'));
    
    toggleTheme();
    
    setTimeout(() => {
      console.log('🔄 Debug: Theme after toggle:', theme);
      console.log('🔄 Debug: Document data-theme after:', document.documentElement.getAttribute('data-theme'));
    }, 100);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      padding: '20px',
      backgroundColor: 'var(--color-surface)',
      border: '2px solid var(--color-border)',
      borderRadius: '8px',
      color: 'var(--color-text-primary)',
      zIndex: 9999
    }}>
      <h3>Theme Debug</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>Data attribute: <strong>{document.documentElement.getAttribute('data-theme')}</strong></p>
      <button onClick={handleClick} style={{
        padding: '10px 20px',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-inverse)',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Toggle Theme (Debug)
      </button>
    </div>
  );
};

export default ThemeDebugComponent;
