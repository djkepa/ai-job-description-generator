import { useCallback } from 'react';
import { XCircle, Loader2 } from 'lucide-react';

import { QueryProvider } from './providers/QueryProvider.js';
import { ErrorBoundary } from './providers/ErrorBoundary.js';
import { JobForm } from './components/JobForm.js';
import { Result } from './components/Result.js';
import { useJobGenerator } from './hooks/useJobGenerator.js';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor.js';
import type { GenerateJobRequest } from './types/api.js';

const AppContent = () => {
  const { mutate, data, isPending, error, reset } = useJobGenerator();
  const performance = usePerformanceMonitor('App');

  const handleSubmit = useCallback(
    (request: GenerateJobRequest): void => {
      mutate(request);
    },
    [mutate],
  );

  const handleReset = useCallback((): void => {
    reset();
  }, [reset]);

  if (import.meta.env.DEV && performance.lastRenderTime > 16) {
    console.warn(`App slow render: ${performance.lastRenderTime.toFixed(2)}ms`);
  }

  return (
    <div className="appContainer">
      <div className="contentWrapper">
        <header className="header">
          <h1 className="mainTitle">AI Job Description Generator</h1>
          <p className="subtitle">Create professional job descriptions in seconds</p>
        </header>

        <main className="mainContent">
          {data ? (
            <Result result={data} onReset={handleReset} />
          ) : (
            <>
              <JobForm onSubmit={handleSubmit} isLoading={isPending} />

              {error && (
                <div className="errorMessage" role="alert">
                  <XCircle className="errorIcon" />
                  <div className="errorContent">
                    <span className="errorTitle">
                      {error.message.includes('429') || error.message.includes('quota')
                        ? 'API Quota Exceeded'
                        : error.message.includes('401')
                          ? 'Invalid API Key'
                          : error.message.includes('500')
                            ? 'Server Error'
                            : 'Generation Failed'}
                    </span>
                    <span className="errorDetails">
                      {error.message.includes('429') || error.message.includes('quota')
                        ? 'Your OpenAI API quota has been exceeded. Please check your billing details or try again later. Demo mode will be used for now.'
                        : error.message.includes('401')
                          ? 'Please check your OpenAI API key configuration.'
                          : error.message.includes('500')
                            ? 'OpenAI servers are experiencing issues. Please try again in a moment.'
                            : error.message}
                    </span>
                  </div>
                </div>
              )}

              {isPending && (
                <div className="loadingMessage">
                  <Loader2 className="spinner" />
                  <span>Generating your job description...</span>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="footer">
          <p>Built with React, TypeScript, and OpenAI API</p>
          {import.meta.env.DEV && (
            <p className="performanceInfo">
              Renders: {performance.renderCount} | Avg: {performance.averageRenderTime.toFixed(2)}ms
            </p>
          )}
        </footer>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppContent />
      </QueryProvider>
    </ErrorBoundary>
  );
};
