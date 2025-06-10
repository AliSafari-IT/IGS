import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './utils/serviceWorkerRegistration'
import { performanceMonitor } from './utils/performanceMonitoring'

// Initialize performance monitoring
if (import.meta.env.DEV) {
  console.log('🚀 IGS-Pharma Performance Monitoring Enabled');
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
)

// Register service worker for performance and offline capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerServiceWorker()
}
