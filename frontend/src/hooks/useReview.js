import { useState } from 'react';

/**
 * Custom hook that encapsulates all API call logic.
 * Keeps App.jsx clean — it just calls handleReview() and reads state.
 */
export function useReview() {
  const [review, setReview]     = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState(null);

  const handleReview = async (code) => {
    if (!code || !code.trim()) {
      setError('Please paste some code before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || 'Analysis failed.');
      }

      setReview(data.review);
    } catch (err) {
      setError(err.message || 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setReview(null);
    setError(null);
  };

  return { review, isLoading, error, handleReview, reset };
}