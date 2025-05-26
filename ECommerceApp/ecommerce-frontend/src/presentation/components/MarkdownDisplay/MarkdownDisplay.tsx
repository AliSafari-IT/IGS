import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './MarkdownDisplay.module.css';

interface MarkdownDisplayProps {
  /**
   * URL to fetch markdown content from (optional)
   */
  url?: string;
  
  /**
   * Direct markdown content string (optional)
   */
  content?: string;
  
  /**
   * Custom className for the container
   */
  className?: string;
  
  /**
   * Custom styles for the container
   */
  style?: React.CSSProperties;
  
  /**
   * Loading message to display while fetching content
   */
  loadingMessage?: string;
  
  /**
   * Error message to display if content fails to load
   */
  errorMessage?: string;
}

/**
 * A reusable component for displaying markdown content
 * Can load content from a URL or directly from a string
 */
export const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({
  url,
  content: initialContent,
  className = '',
  style = {},
  loadingMessage = 'Loading content...',
  errorMessage = 'Failed to load content. Please try again later.'
}) => {
  const [markdownContent, setMarkdownContent] = useState<string>(initialContent || '');
  const [isLoading, setIsLoading] = useState<boolean>(!initialContent && !!url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If direct content is provided, use it
    if (initialContent) {
      setMarkdownContent(initialContent);
      setIsLoading(false);
      setError(null);
      return;
    }

    // If URL is provided, fetch content
    if (url) {
      const fetchContent = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch content from ${url}`);
          }
          const text = await response.text();
          setMarkdownContent(text);
          setError(null);
        } catch (err) {
          console.error('Error loading markdown content:', err);
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchContent();
    }
  }, [url, initialContent, errorMessage]);

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${className}`} style={style}>
        {loadingMessage}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.errorContainer} ${className}`} style={style}>
        {error}
      </div>
    );
  }

  return (
    <div className={`${styles.markdownContainer} ${className}`} style={style}>
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
