import { memo, useCallback } from 'react';
import { Copy, Check, RotateCcw, Zap, Bot } from 'lucide-react';

import { useCopyToClipboard } from '../hooks/useCopyToClipboard.js';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor.js';
import { formatTimeAgo } from '../utils/formatting.js';
import type { GenerateJobResponse } from '../types/api.js';

interface ResultProps {
  readonly result: GenerateJobResponse;
  readonly onReset: () => void;
}

export const Result = memo<ResultProps>(({ result, onReset }) => {
  const { copied, copy } = useCopyToClipboard();
  const performance = usePerformanceMonitor('Result');

  const handleCopy = useCallback(async (): Promise<void> => {
    await copy(result.description);
  }, [copy, result.description]);

  if (import.meta.env.DEV && performance.lastRenderTime > 16) {
    console.warn(`Result slow render: ${performance.lastRenderTime.toFixed(2)}ms`);
  }

  return (
    <div className="resultContainer">
      <div className="resultHeader">
        <div>
          <h2 className="resultTitle">Generated Description</h2>
          <div className="resultMeta">
            <span className="metaItem">
              {result.metadata.cache_hit ? (
                <>
                  <Zap className="w-3 h-3 inline mr-1" />
                  Cached
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 inline mr-1" />
                  AI Generated
                </>
              )}
            </span>
            <span className="metaItem">{formatTimeAgo(result.metadata.generated_at)}</span>
            <span className="metaItem">Model: {result.metadata.model_used}</span>
          </div>
        </div>

        <div className="resultActions">
          <button
            onClick={handleCopy}
            className={`copyButton ${copied ? 'copied' : ''}`}
            disabled={copied}
            aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          >
            {copied ? (
              <>
                <Check className="buttonIcon" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="buttonIcon" />
                Copy
              </>
            )}
          </button>

          <button onClick={onReset} className="resetButton">
            <RotateCcw className="buttonIcon" />
            New Description
          </button>
        </div>
      </div>

      <div className="resultContent">
        <div className="resultText">{result.description}</div>

        <div className="resultStats">
          <span>{result.description.length} characters</span>
          <span>~{Math.ceil(result.description.split(' ').length / 200)} min read</span>
        </div>
      </div>
    </div>
  );
});

Result.displayName = 'Result';
