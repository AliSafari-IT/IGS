import React from 'react';
import './ResponsiveGrid.css';

interface ResponsiveGridProps {
  children: React.ReactNode;
  minItemWidth?: string;
  gap?: string;
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  minItemWidth = '300px',
  gap = '1rem',
  className = ''
}) => {
  const gridStyle = {
    '--min-item-width': minItemWidth,
    '--grid-gap': gap,
  } as React.CSSProperties;

  return (
    <div 
      className={`responsive-grid ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
