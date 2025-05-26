import React from 'react';
import MarkdownDisplay from '../../components/MarkdownDisplay';

export const PrivacyPolicy: React.FC = () => {
  return (
    <MarkdownDisplay
      url="/legalDocs/privacy-policy.md"
      loadingMessage="Loading privacy policy..."
      errorMessage="Failed to load privacy policy. Please try again later."
    />
  );
};

export default PrivacyPolicy; // Add default export