import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useComplexity } from '../hooks/useComplexity';

/**
 * ComplexityAnalyzer — standalone component for Big-O analysis.
 *
 * HOW TO ADD TO YOUR APP (only 3 lines in App.jsx):
 *   1. import ComplexityAnalyzer from './components/ComplexityAnalyzer';
 *   2. Add a tab button to switch between "Review" and "Complexity"
 *   3. Render <ComplexityAnalyzer code={code} /> in the right panel
 *
 * @param {string} code - The current code from the editor
 */
export default function ComplexityAnalyzer({ code }) {
  const { result, isLoading, error, analyze } = useComplexity();

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

      {/* ── Title bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
            fontSize: '11px', fontWeight: 600, color: 'var(--tx-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.6px', marginLeft: '6px',
          }}>
            Complexity Analyzer
          </span>
        </div>

        {/* Analyze button */}
        <button
          onClick={() => analyze(code)}
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: isLoading ? 'var(--bg-hover)' : 'var(--purple)',
            color: isLoading ? 'var(--tx-secondary)' : '#0d1117',
            border: isLoading ? '1px solid var(--border)' : 'none',
            borderRadius: 'var(--r-md)',
            padding: '6px 14px',
            fontFamily: 'var(--font-ui)',
            fontSize: '12px', fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? <><MiniSpinner /> Analyzing...</> : '⟳ Analyze Complexity'}
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px' }}>
        {!result && !isLoading && !error && <EmptyState />}
        {isLoading && <LoadingState />}
        {error && !isLoading && <ErrorState message={error} />}
        {result && !isLoading && <ResultState result={result} />}
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '14px', textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 'var(--r-lg)',
        background: 'rgba(188,140,255,0.1)',
        border: '1px solid rgba(188,140,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px',
        animation: 'float 3s ease-in-out infinite',
      }}>
        Ω
      </div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--tx-primary)' }}>
        Big-O Analyzer
      </div>
      <div style={{ fontSize: '12px', color: 'var(--tx-secondary)', maxWidth: 240, lineHeight: 1.7 }}>
        Paste your code in the editor and click <strong style={{ color: 'var(--purple)' }}>Analyze Complexity</strong> to get time and space complexity with a full breakdown.
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['⏱ Time Complexity', '💾 Space Complexity', '📊 Loop Analysis'].map(tag => (
          <span key={tag} style={{
            fontSize: '11px', padding: '4px 12px',
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: '100px', color: 'var(--tx-secondary)',
          }}>{tag}</span>
        ))}
      </div>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

/* ── Loading state ── */
function LoadingState() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
    }}>
      <div style={{
        fontSize: '28px',
        animation: 'spin 2s linear infinite',
        color: 'var(--purple)',
      }}>Ω</div>
      <div style={{ fontSize: '13px', color: 'var(--tx-secondary)', fontFamily: 'var(--font-code)' }}>
        Calculating complexity...
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '72%' }}>
        {[70, 50, 85, 55].map((w, i) => (
          <div key={i} style={{
            height: 10, borderRadius: 5, width: `${w}%`,
            background: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--border) 50%, var(--bg-hover) 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.4s infinite ${i * 0.1}s`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}</style>
    </div>
  );
}

/* ── Error state ── */
function ErrorState({ message }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '10px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px' }}>⚠️</div>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--red)' }}>Analysis Failed</div>
      <div style={{ fontSize: '12px', color: 'var(--tx-secondary)', maxWidth: 280 }}>{message}</div>
    </div>
  );
}

/* ── Result state ── */
function ResultState({ result }) {
  const badges = [
    { label: 'Time',      value: result.timeComplexity,      color: '#f85149', bg: 'rgba(248,81,73,0.1)',   border: 'rgba(248,81,73,0.25)' },
    { label: 'Space',     value: result.spaceComplexity,     color: '#3fb950', bg: 'rgba(63,185,80,0.1)',   border: 'rgba(63,185,80,0.25)' },
    { label: 'Optimized', value: result.optimizedComplexity, color: '#bc8cff', bg: 'rgba(188,140,255,0.1)', border: 'rgba(188,140,255,0.25)' },
  ];

  return (
    <div>
      {/* Big-O badge cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {badges.map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 'var(--r-lg)',
            padding: '14px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--tx-muted)', fontFamily: 'var(--font-code)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color, fontFamily: 'var(--font-code)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* One-line explanation */}
      {result.explanation && result.explanation !== 'N/A' && (
        <div style={{
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '12px 14px',
          marginBottom: '18px',
          fontSize: '13px',
          color: 'var(--tx-secondary)',
          lineHeight: 1.65,
          borderLeft: '3px solid var(--accent)',
        }}>
          {result.explanation}
        </div>
      )}

      {/* Detailed markdown breakdown */}
      {result.details && (
        <div className="complexity-markdown">
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>
            Full Breakdown
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.details}
          </ReactMarkdown>
        </div>
      )}

      <style>{`
        .complexity-markdown h2, .complexity-markdown h3 {
          font-size: 13px; font-weight: 600;
          color: var(--purple);
          margin: 16px 0 8px;
          font-family: var(--font-ui);
        }
        .complexity-markdown p {
          font-size: 13px; color: var(--tx-secondary);
          margin-bottom: 8px; line-height: 1.7;
        }
        .complexity-markdown ul {
          list-style: none; margin: 4px 0 12px; padding: 0;
          display: flex; flex-direction: column; gap: 6px;
        }
        .complexity-markdown li {
          font-size: 13px; color: var(--tx-secondary);
          padding-left: 16px; position: relative; line-height: 1.7;
        }
        .complexity-markdown li::before {
          content: "›"; position: absolute; left: 2px;
          color: var(--purple); font-weight: 700;
        }
        .complexity-markdown pre {
          background: var(--bg-input) !important;
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 14px; overflow-x: auto;
          margin: 10px 0 14px;
          font-family: var(--font-code); font-size: 12px; line-height: 1.75;
        }
        .complexity-markdown code {
          font-family: var(--font-code); font-size: 12px;
          background: var(--bg-hover); border: 1px solid var(--border);
          padding: 1px 6px; border-radius: 4px; color: var(--purple);
        }
        .complexity-markdown pre code {
          background: transparent; border: none; padding: 0; color: var(--tx-primary);
        }
        .complexity-markdown strong { color: var(--tx-primary); font-weight: 600; }
      `}</style>
    </div>
  );
}

function MiniSpinner() {
  return (
    <div style={{
      width: 12, height: 12,
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#0d1117',
      borderRadius: '50%',
      animation: 'spin 0.65s linear infinite',
      flexShrink: 0,
    }} />
  );
}