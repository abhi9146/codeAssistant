import { useState } from 'react';

/**
 * Custom hook for the complexity analysis API call.
 * Mirrors the same pattern as useReview.js — completely standalone.
 */
export function useComplexity() {
  const [result, setResult]     = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const analyze = async (code) => {
    if (!code || !code.trim()) {
      setError('Please paste some code before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || 'Complexity analysis failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); };

  return { result, isLoading, error, analyze, reset };
}