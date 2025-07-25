import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // This would integrate with services like Sentry, LogRocket, etc.
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount
    };

    // For now, just log to console
    console.error('Error logged:', errorData);
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      // Use custom fallback if provided
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            retry={this.handleRetry}
            goHome={this.handleGoHome}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              شيء ما خطأ
            </h1>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Something went wrong
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              حدثت مشكلة غير متوقعة. نعتذر عن الإزعاج.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              An unexpected error occurred. We apologize for the inconvenience.
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-xs">
                  <p className="font-medium text-red-800 dark:text-red-300 mb-1">
                    {this.state.error.message}
                  </p>
                  <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                المحاولة مرة أخرى
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                Retry attempts: {this.state.retryCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, errorInfo) => {
    console.error('Error caught by hook:', error);

    // Log to error service
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.error('Error logged:', errorData);
  }, []);

  return handleError;
};

// Simple error fallback component
export const SimpleErrorFallback = ({ error, retry, goHome }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
      حدث خطأ
    </h3>
    <p className="text-red-600 dark:text-red-400 text-center mb-4">
      {error?.message || 'حدثت مشكلة غير متوقعة'}
    </p>
    <button
      onClick={retry}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
    >
      المحاولة مرة أخرى
    </button>
  </div>
);

export default ErrorBoundary;
