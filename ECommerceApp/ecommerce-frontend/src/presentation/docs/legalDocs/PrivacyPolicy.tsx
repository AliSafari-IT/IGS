import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export const PrivacyPolicy: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        // Use the public folder to store the markdown file
        const response = await fetch('/privacy-policy.md');
        if (!response.ok) {
          throw new Error('Failed to load privacy policy');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Error loading privacy policy:', err);
        setError('Failed to load privacy policy. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading privacy policy...</div>;
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '2rem',
        color: 'red',
        textAlign: 'center'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      lineHeight: '1.6'
    }}>
      <div>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PrivacyPolicy; // Add default export