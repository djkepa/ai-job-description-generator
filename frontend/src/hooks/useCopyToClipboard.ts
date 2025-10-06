import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

export const useCopyToClipboard = (resetDelay: number = 2000): UseCopyToClipboardReturn => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setCopied(false);
      }
    },
    [resetDelay],
  );

  const reset = useCallback((): void => {
    setCopied(false);
  }, []);

  return { copied, copy, reset };
};
