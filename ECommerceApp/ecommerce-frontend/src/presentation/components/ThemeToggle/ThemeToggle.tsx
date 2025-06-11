import React from 'react';
import { useThemeContext } from '../../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeContext();

  console.log('🎨 ThemeToggle render - Current theme:', theme);

  const handleToggle = () => {
    console.log('🎨 ThemeToggle - Button clicked!');
    console.log('🎨 ThemeToggle - About to toggle from:', theme);
    toggleTheme();
    
    // Optional: Announce theme change for screen readers
    const announcement = `Theme changed to ${theme === 'light' ? 'dark' : 'light'} mode`;
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.style.position = 'absolute';
    ariaLive.style.left = '-10000px';
    ariaLive.textContent = announcement;
    document.body.appendChild(ariaLive);
    setTimeout(() => {
      if (document.body.contains(ariaLive)) {
        document.body.removeChild(ariaLive);
      }
    }, 1000);
  };

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <i className="fas fa-sun" aria-hidden="true"></i>
      <i className="fas fa-moon" aria-hidden="true"></i>
    </button>
  );
};

export default ThemeToggle;
