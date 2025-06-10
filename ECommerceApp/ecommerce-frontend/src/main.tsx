import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Create service worker registration utility
const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('SW registered: ', registration);
  } catch (registrationError) {
    console.log('SW registration failed: ', registrationError);
  }
};

// Import performance monitoring for development
if (import.meta.env.DEV) {
  import('./utils/performanceMonitoring').then(() => {
    console.log('🚀 IGS-Pharma Performance Monitoring Enabled');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for performance and offline capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerServiceWorker()
}
