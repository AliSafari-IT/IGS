// Service Worker Registration and Management
// Handles service worker lifecycle and provides utilities for offline functionality

interface ServiceWorkerInfo {
  isSupported: boolean;
  isRegistered: boolean;
  isControlling: boolean;
  registration?: ServiceWorkerRegistration;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private onUpdateCallback?: (registration: ServiceWorkerRegistration) => void;

  constructor() {
    this.init();
  }

  private async init() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        await this.register();
        this.setupUpdateDetection();
        this.setupMessageHandling();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', this.registration.scope);

      // Handle different registration states
      if (this.registration.installing) {
        console.log('Service Worker installing...');
        this.trackInstalling(this.registration.installing);
      } else if (this.registration.waiting) {
        console.log('Service Worker waiting to activate...');
        this.updateAvailable = true;
      } else if (this.registration.active) {
        console.log('Service Worker is active');
      }

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  private trackInstalling(worker: ServiceWorker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New worker is waiting to activate
          console.log('New Service Worker is waiting to activate');
          this.updateAvailable = true;
          this.onUpdateCallback?.(this.registration!);
        } else {
          // First time installation
          console.log('Service Worker installed for the first time');
          this.showInstallMessage();
        }
      } else if (worker.state === 'activated') {
        console.log('Service Worker activated');
        this.showActivationMessage();
      }
    });
  }

  private setupUpdateDetection() {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      if (newWorker) {
        this.trackInstalling(newWorker);
      }
    });
  }

  private setupMessageHandling() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'CACHE_UPDATED':
          console.log('Cache updated:', data);
          break;
        case 'OFFLINE_READY':
          this.showOfflineReadyMessage();
          break;
        case 'UPDATE_AVAILABLE':
          this.updateAvailable = true;
          this.onUpdateCallback?.(this.registration!);
          break;
      }
    });

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed - reloading page');
      window.location.reload();
    });
  }

  async update(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('Service Worker update check completed');
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  }

  async skipWaiting(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  onUpdate(callback: (registration: ServiceWorkerRegistration) => void) {
    this.onUpdateCallback = callback;
    
    // If update is already available, call immediately
    if (this.updateAvailable && this.registration) {
      callback(this.registration);
    }
  }

  async getCacheInfo(): Promise<any> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve({});
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  }

  async clearCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    }
  }

  getInfo(): ServiceWorkerInfo {
    return {
      isSupported: 'serviceWorker' in navigator,
      isRegistered: !!this.registration,
      isControlling: !!navigator.serviceWorker.controller,
      registration: this.registration || undefined,
    };
  }

  private showInstallMessage() {
    if (this.shouldShowNotifications()) {
      this.showNotification('App installed successfully!', 'You can now use this app offline.', 'success');
    }
  }

  private showActivationMessage() {
    if (this.shouldShowNotifications()) {
      this.showNotification('App activated!', 'The app is now ready for offline use.', 'info');
    }
  }

  private showOfflineReadyMessage() {
    if (this.shouldShowNotifications()) {
      this.showNotification('Offline ready!', 'The app is cached and ready for offline use.', 'success');
    }
  }

  private shouldShowNotifications(): boolean {
    // Don't show notifications if user has disabled them or we're in dev mode
    return process.env.NODE_ENV === 'production' && 
           !localStorage.getItem('sw-notifications-disabled');
  }

  private showNotification(title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.className = `sw-notification sw-notification-${type}`;
    notification.innerHTML = `
      <div class="sw-notification-content">
        <strong>${title}</strong>
        <p>${message}</p>
        <button class="sw-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles if not already present
    this.addNotificationStyles();

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  private addNotificationStyles() {
    if (document.getElementById('sw-notification-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'sw-notification-styles';
    styles.textContent = `
      .sw-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
      }
      
      .sw-notification-content {
        padding: 16px;
        position: relative;
      }
      
      .sw-notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
      }
      
      .sw-notification-success { border-left: 4px solid #4caf50; }
      .sw-notification-info { border-left: 4px solid #2196f3; }
      .sw-notification-warning { border-left: 4px solid #ff9800; }
      .sw-notification-error { border-left: 4px solid #f44336; }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      .sw-notification strong {
        display: block;
        margin-bottom: 4px;
        color: #333;
      }
      
      .sw-notification p {
        margin: 0;
        color: #666;
        font-size: 14px;
        line-height: 1.4;
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Create singleton instance
const serviceWorkerManager = new ServiceWorkerManager();

// Export utilities
export const registerServiceWorker = () => serviceWorkerManager.register();
export const updateServiceWorker = () => serviceWorkerManager.update();
export const skipWaiting = () => serviceWorkerManager.skipWaiting();
export const onServiceWorkerUpdate = (callback: (registration: ServiceWorkerRegistration) => void) => 
  serviceWorkerManager.onUpdate(callback);
export const getServiceWorkerInfo = () => serviceWorkerManager.getInfo();
export const getCacheInfo = () => serviceWorkerManager.getCacheInfo();
export const clearCaches = () => serviceWorkerManager.clearCaches();

export default serviceWorkerManager;
