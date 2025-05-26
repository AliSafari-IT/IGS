# MarkdownDisplay Component

A reusable React component for displaying Markdown content in your application.

## Features

- Load Markdown content from a URL or directly as a string
- Customizable loading and error states
- Responsive styling with CSS modules
- TypeScript support with full type definitions

## Usage Examples

### Loading from a URL

```tsx
import MarkdownDisplay from 'presentation/components/MarkdownDisplay';

const TermsOfService = () => {
  return (
    <MarkdownDisplay 
      url="/terms-of-service.md" 
      loadingMessage="Loading terms of service..." 
      errorMessage="Failed to load terms of service. Please try again later."
    />
  );
};
```

### Using Direct Content

```tsx
import MarkdownDisplay from 'presentation/components/MarkdownDisplay';

const WelcomeMessage = () => {
  const markdownContent = `
# Welcome to IGS PHARMA

Thank you for visiting our online pharmacy.

## Our Services

- Prescription medications
- Over-the-counter products
- Health consultations
- Home delivery

[Contact us](mailto:contact@igs-pharma.com) for more information.
  `;

  return (
    <MarkdownDisplay 
      content={markdownContent} 
      className="welcome-message"
      style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
    />
  );
};
```

### Customizing Styles

The component accepts both `className` and `style` props for custom styling:

```tsx
<MarkdownDisplay
  url="/privacy-policy.md"
  className="custom-markdown-container"
  style={{ 
    maxWidth: '1000px',
    backgroundColor: '#fafafa',
    border: '1px solid #eee',
    borderRadius: '8px'
  }}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `url` | string | URL to fetch markdown content from |
| `content` | string | Direct markdown content string |
| `className` | string | Custom CSS class for the container |
| `style` | React.CSSProperties | Inline styles for the container |
| `loadingMessage` | string | Message to display while loading content |
| `errorMessage` | string | Message to display if content fails to load |

Note: You must provide either `url` or `content` prop. If both are provided, `content` takes precedence.
