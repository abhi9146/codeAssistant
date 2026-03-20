import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * ReviewPanel — displays the AI review output.
 * Handles 4 states: empty / loading / error / result.
 * Includes a "Copy to clipboard" button on the result.
 */
export default function ReviewPanel({ review, isLoading, error }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
    }}>

      {/* ── Panel title bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-dim)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#ff5f57','#ffbd2e','#28c840'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: 'var(--tx-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.6px',
            marginLeft: '6px',
          }}>
            AI Review
          </span>
        </div>

        {/* Status badge */}
        <span style={{
          fontSize: '10px',
          fontFamily: 'var(--font-code)',
          color: review ? 'var(--green)' : 'var(--tx-muted)',
          padding: '2px 8px',
          borderRadius: '100px',
          background: review ? 'var(--green-dim)' : 'transparent',
          border: `1px solid ${review ? 'rgba(63,185,80,0.2)' : 'transparent'}`,
        }}>
          {review ? '✓ Complete' : 'Waiting...'}
        </span>
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {isLoading && <LoadingState />}
        {error && !isLoading && <ErrorState message={error} />}
        {!review && !isLoading && !error && <EmptyState />}
        {review && !isLoading && <ResultState review={review} />}
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────── */
function EmptyState() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '14px', padding: '2rem', textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--accent-dim)',
        border: '1px solid var(--accent-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-code)', fontSize: '18px',
        color: 'var(--accent)', fontWeight: 600,
        animation: 'float 3s ease-in-out infinite',
      }}>AI</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--tx-primary)' }}>
        Ready to Review
      </div>
      <div style={{ fontSize: '12px', color: 'var(--tx-secondary)', maxWidth: 240, lineHeight: 1.7 }}>
        Paste your code on the left and click <strong style={{ color: 'var(--accent)' }}>Analyze Code</strong> to get expert AI feedback.
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
        {['🐛 Bug Detection', '⚡ Performance', '✨ Clean Code'].map(tag => (
          <span key={tag} style={{
            fontSize: '11px', padding: '4px 12px',
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: '100px', color: 'var(--tx-secondary)',
          }}>{tag}</span>
        ))}
      </div>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

/* ── Loading state ───────────────────────────── */
function LoadingState() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '18px',
    }}>
      <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', width: 56, height: 56,
          border: '2px solid var(--accent)',
          borderRadius: '50%',
          animation: 'ripple 1.4s ease-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-code)', fontSize: '14px',
          fontWeight: 600, color: 'var(--accent)',
          animation: 'float 2s ease-in-out infinite',
        }}>AI</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--tx-secondary)', fontFamily: 'var(--font-code)' }}>
        Reviewing your code...
      </div>
      {/* Skeleton lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '72%' }}>
        {[88, 70, 92, 60, 78].map((w, i) => (
          <div key={i} style={{
            height: 10, borderRadius: 5, width: `${w}%`,
            background: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--border) 50%, var(--bg-hover) 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.4s infinite ${i * 0.1}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes ripple { 0%{transform:scale(.75);opacity:.9} 100%{transform:scale(1.5);opacity:0} }
        @keyframes shimmer { to { background-position: -200% 0; } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

/* ── Error state ─────────────────────────────── */
function ErrorState({ message }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '10px', padding: '2rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px' }}>⚠️</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--red)' }}>Analysis Failed</div>
      <div style={{ fontSize: '12px', color: 'var(--tx-secondary)', maxWidth: 280, lineHeight: 1.6 }}>
        {message}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--tx-muted)', fontFamily: 'var(--font-code)' }}>
        Make sure Spring Boot is running on <span style={{ color: 'var(--accent)' }}>localhost:8080</span>
      </div>
    </div>
  );
}

/* ── Result state ────────────────────────────── */
function ResultState({ review }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea');
      el.value = review;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '20px 22px' }}>
      {/* Top bar: badge + copy button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-code)',
          color: 'var(--green)',
          background: 'var(--green-dim)',
          border: '1px solid rgba(63,185,80,0.25)',
          padding: '3px 10px', borderRadius: '100px',
          letterSpacing: '0.4px',
        }}>
          ✓ Review Complete
        </span>

        {/* Copy to clipboard button */}
        <button
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: copied ? 'var(--green-dim)' : 'var(--bg-hover)',
            border: `1px solid ${copied ? 'rgba(63,185,80,0.3)' : 'var(--border)'}`,
            borderRadius: 'var(--r-sm)',
            color: copied ? 'var(--green)' : 'var(--tx-secondary)',
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            padding: '5px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied!' : '⎘ Copy Review'}
        </button>
      </div>

      {/* Rendered markdown review */}
      <div className="review-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {review}
        </ReactMarkdown>
      </div>

      {/* Inline styles for markdown content */}
      <style>{`
        .review-markdown h2 {
          font-size: 14px;
          font-weight: 700;
          color: var(--accent);
          margin: 22px 0 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-dim);
          font-family: var(--font-ui);
        }
        .review-markdown h2:first-child { margin-top: 0; }
        .review-markdown h3 {
          font-size: 13px;
          font-weight: 600;
          color: var(--tx-primary);
          margin: 14px 0 6px;
        }
        .review-markdown p {
          font-size: 13px;
          color: var(--tx-secondary);
          margin-bottom: 10px;
          line-height: 1.75;
        }
        .review-markdown ul, .review-markdown ol {
          list-style: none;
          margin: 6px 0 14px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .review-markdown li {
          font-size: 13px;
          color: var(--tx-secondary);
          padding-left: 16px;
          position: relative;
          line-height: 1.7;
        }
        .review-markdown li::before {
          content: "›";
          position: absolute;
          left: 2px;
          color: var(--accent);
          font-weight: 700;
        }
        .review-markdown pre {
          background: var(--bg-input) !important;
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 16px 18px;
          overflow-x: auto;
          margin: 12px 0 16px;
          font-family: var(--font-code);
          font-size: 12px;
          line-height: 1.75;
        }
        .review-markdown code {
          font-family: var(--font-code);
          font-size: 12px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          padding: 1px 6px;
          border-radius: 4px;
          color: var(--purple);
        }
        .review-markdown pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: var(--tx-primary);
        }
        .review-markdown strong { color: var(--tx-primary); font-weight: 600; }
        .review-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 13px;
        }
        .review-markdown th, .review-markdown td {
          padding: 8px 12px;
          border: 1px solid var(--border);
          text-align: left;
        }
        .review-markdown th {
          background: var(--bg-hover);
          color: var(--tx-primary);
          font-weight: 600;
        }
        .review-markdown td { color: var(--tx-secondary); }
      `}</style>
    </div>
  );
}