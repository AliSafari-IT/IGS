import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: this.generateErrorId()
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.prototype.generateErrorId()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for monitoring
    this.logError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetOnPropsChange !== resetOnPropsChange) {
      this.resetErrorBoundary();
    }

    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logError(error: Error, errorInfo: ErrorInfo) {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(errorReport);
    }
  }

  resetErrorBoundary = () => {
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        errorId: this.generateErrorId()
      });
    }, 100);
  };

  reloadPage = () => {
    window.location.reload();
  };

  goHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            
            <div className="error-boundary-content">
              <h1 className="error-boundary-title">
                Oops! Something went wrong
              </h1>
              
              <p className="error-boundary-description">
                We're sorry, but an unexpected error occurred. Our team has been notified and is working to fix this issue.
              </p>

              <div className="error-boundary-actions">
                <button 
                  onClick={this.resetErrorBoundary}
                  className="error-boundary-btn error-boundary-btn-primary"
                  type="button"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                  Try Again
                </button>
                
                <button 
                  onClick={this.goHome}
                  className="error-boundary-btn error-boundary-btn-secondary"
                  type="button"
                >
                  <i className="fa fa-home" aria-hidden="true"></i>
                  Go Home
                </button>
                
                <button 
                  onClick={this.reloadPage}
                  className="error-boundary-btn error-boundary-btn-secondary"
                  type="button"
                >
                  <i className="fa fa-sync-alt" aria-hidden="true"></i>
                  Reload Page
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="error-boundary-details">
                  <summary className="error-boundary-summary">
                    Technical Details (Development Mode)
                  </summary>
                  
                  <div className="error-boundary-technical">
                    <div className="error-info-section">
                      <h3>Error ID</h3>
                      <code>{errorId}</code>
                    </div>
                    
                    {error && (
                      <div className="error-info-section">
                        <h3>Error Message</h3>
                        <code>{error.message}</code>
                      </div>
                    )}
                    
                    {error?.stack && (
                      <div className="error-info-section">
                        <h3>Stack Trace</h3>
                        <pre className="error-stack">{error.stack}</pre>
                      </div>
                    )}
                    
                    {errorInfo?.componentStack && (
                      <div className="error-info-section">
                        <h3>Component Stack</h3>
                        <pre className="error-stack">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;
