import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="errorFallback">
      <div className="errorContent">
        <div className="errorIcon">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="errorTitle">Something went wrong</h2>
        <p className="errorMessage">
          {import.meta.env.DEV ? error.message : 'An unexpected error occurred. Please try again.'}
        </p>
        <button onClick={resetErrorBoundary} className="errorButton">
          Try again
        </button>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // In production, send to error tracking service
        if (!import.meta.env.DEV) {
          // sendErrorToService(error, errorInfo);
        }
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};
