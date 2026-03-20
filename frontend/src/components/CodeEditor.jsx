import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';          // ← Step 1: import C++ language
import { oneDark } from '@codemirror/theme-one-dark';

// Step 2: Add cpp to the languages array
const LANGUAGES = [
  { label: 'Java',       value: 'java',       ext: java() },
  { label: 'JavaScript', value: 'javascript',  ext: javascript() },
  { label: 'Python',     value: 'python',      ext: python() },
  { label: 'C++',        value: 'cpp',         ext: cpp() },   // ← added
  { label: 'Plain Text', value: 'text',        ext: [] },
];

export default function CodeEditor({ value, onChange, isLoading, onAnalyze, showAnalyzeButton = true }) {
  const [selectedLang, setSelectedLang] = useState('java');
  const currentLang = LANGUAGES.find(l => l.value === selectedLang);

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
            Input
          </span>
        </div>

        <select
          value={selectedLang}
          onChange={e => setSelectedLang(e.target.value)}
          style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--tx-secondary)',
            fontFamily: 'var(--font-code)',
            fontSize: '11px',
            padding: '3px 8px',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <CodeMirror
          value={value}
          height="100%"
          theme={oneDark}
          extensions={currentLang.ext ? [currentLang.ext] : []}
          onChange={onChange}
          editable={!isLoading}
          placeholder="// Paste your code here for AI review..."
          style={{ height: '100%', fontFamily: 'var(--font-code)', fontSize: '13px' }}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: false,
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-dim)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '11px', color: 'var(--tx-muted)', fontFamily: 'var(--font-code)' }}>
          {value.length > 0
            ? `${value.length.toLocaleString()} chars · ${value.split('\n').length} lines`
            : 'No code yet'}
        </span>

        {/* Only show Analyze button on the Review tab, not Complexity tab */}
        {showAnalyzeButton && (
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: isLoading ? 'var(--bg-hover)' : 'var(--accent)',
              color: isLoading ? 'var(--tx-secondary)' : '#0d1117',
              border: isLoading ? '1px solid var(--border)' : 'none',
              borderRadius: 'var(--r-md)',
              padding: '8px 18px',
              fontFamily: 'var(--font-ui)',
              fontSize: '13px', fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isLoading ? <><Spinner /> Analyzing...</> : <>▶ Analyze Code</>}
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 13, height: 13,
      border: '2px solid var(--border)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.65s linear infinite',
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}