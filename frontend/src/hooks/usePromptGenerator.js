import { useState } from 'react';

/**
 * Custom hook for the Prompt Generator API call.
 * Completely standalone — no dependency on useReview or useComplexity.
 */
export function usePromptGenerator() {
  const [result, setResult]     = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const generate = async (userInput) => {
    if (!userInput || !userInput.trim()) {
      setError('Please enter some text before generating.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || 'Prompt generation failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); };

  return { result, isLoading, error, generate, reset };
}