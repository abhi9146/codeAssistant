import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import ComplexityAnalyzer from './components/ComplexityAnalyzer';
import PromptGeneratorPage from './pages/PromptGeneratorPage';
import { useReview } from './hooks/useReview';
import { useTheme } from './hooks/useTheme';
import { usePromptGenerator } from './hooks/usePromptGenerator';

export default function App() {
  const [activePage, setActivePage] = useState('assistant');
  const [activeTab,  setActiveTab]  = useState('review');
  const [code, setCode] = useState('');

  const { review, isLoading, error, handleReview } = useReview();
  const { isDark, toggleTheme } = useTheme();
  const promptState = usePromptGenerator();

  // Also persist the prompt input text across page switches
  const [promptInput, setPromptInput] = useState('');

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-app)' }}>

      {/* ── Top nav bar ── */}
      <header style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-dim)',
        padding: '0 1.5rem',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        {/* Left: Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ fontFamily:'var(--font-code)', fontSize:'13px', fontWeight:700, color:'var(--accent)', background:'var(--accent-dim)', border:'1px solid var(--accent-glow)', padding:'4px 10px', borderRadius:'var(--r-sm)' }}>
            {'</>'}
          </div>
          <div>
            <div style={{ fontSize:'14px', fontWeight:600, color:'var(--tx-primary)', letterSpacing:'-0.2px' }}>AI Dev Tools</div>
            <div style={{ fontSize:'11px', color:'var(--tx-muted)', fontFamily:'var(--font-code)' }}>Spring Boot + Gemini</div>
          </div>
        </div>

        {/* Center: Page switcher */}
        <div style={{ display:'flex', background:'var(--bg-hover)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'3px', gap:'2px' }}>
          {[
            { key:'assistant', label:'⎆ Code Assistant' },
            { key:'prompt',    label:'✦ Prompt Generator' },
          ].map(page => (
            <button key={page.key} onClick={() => setActivePage(page.key)} style={{
              padding:'6px 16px',
              background: activePage === page.key ? 'var(--bg-surface)' : 'transparent',
              border: activePage === page.key ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--r-sm)',
              color: activePage === page.key ? 'var(--tx-primary)' : 'var(--tx-muted)',
              fontSize:'12px', fontWeight: activePage === page.key ? 600 : 400,
              cursor:'pointer', fontFamily:'var(--font-ui)', transition:'all 0.15s', whiteSpace:'nowrap',
            }}>
              {page.label}
            </button>
          ))}
        </div>

        {/* Right: Status + Theme toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'11px', fontFamily:'var(--font-code)', color:'var(--green)', background:'var(--green-dim)', border:'1px solid rgba(63,185,80,0.2)', padding:'3px 10px', borderRadius:'100px', display:'flex', alignItems:'center', gap:'5px' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px var(--green)', display:'inline-block', animation:'hbPulse 2s ease-in-out infinite' }} />
            live
          </span>
          <button onClick={toggleTheme} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--toggle-bg)', border:'1px solid var(--toggle-border)', borderRadius:'var(--r-md)', cursor:'pointer', fontSize:'16px', transition:'all 0.2s', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--toggle-border)'}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <style>{`@keyframes hbPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      </header>

      {/* ── PAGE: Code Assistant ── */}
      {activePage === 'assistant' && (
        <>
          <div style={{ display:'flex', gap:'4px', padding:'8px 1.5rem 0', background:'var(--bg-surface)', borderBottom:'1px solid var(--border-dim)', flexShrink:0 }}>
            {[
              { key:'review',     label:'⎆ Code Review' },
              { key:'complexity', label:'⟳ Complexity'  },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding:'7px 16px', background:'transparent', border:'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--tx-primary)' : 'var(--tx-muted)',
                fontFamily:'var(--font-ui)', fontSize:'12px',
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor:'pointer', transition:'all 0.15s', marginBottom:'-1px',
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          <main style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', padding:'1rem 1.5rem', minHeight:0 }}>
            <CodeEditor
              value={code}
              onChange={setCode}
              isLoading={isLoading}
              onAnalyze={() => handleReview(code)}
              showAnalyzeButton={activeTab === 'review'}
            />
            {activeTab === 'review' ? (
              <ReviewPanel review={review} isLoading={isLoading} error={error} />
            ) : (
              <ComplexityAnalyzer code={code} />
            )}
          </main>
        </>
      )}

      {/* ── PAGE: Prompt Generator ── */}
      {activePage === 'prompt' && (
        <div style={{ flex:1, display:'flex', overflow:'auto' }}>
          {/*
           * FIX 1: Pass promptState and promptInput down as props
           * FIX 2: Pass onBack so PromptGeneratorPage can show a back button
           */}
          <PromptGeneratorPage
            promptState={promptState}
            promptInput={promptInput}
            setPromptInput={setPromptInput}
          />
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding:'8px 1.5rem', background:'var(--bg-surface)', borderTop:'1px solid var(--border-dim)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontSize:'11px', color:'var(--tx-muted)', fontFamily:'var(--font-code)' }}>
          AI Dev Tools · Code Assistant + Prompt Generator
        </span>
        <span style={{ fontSize:'11px', color:'var(--tx-muted)', fontFamily:'var(--font-code)' }}>
          {activePage === 'assistant' ? 'Ctrl+Enter to analyze' : 'Ctrl+Enter to generate'} · {isDark ? '🌙 Dark' : '☀️ Light'} Mode
        </span>
      </footer>
    </div>
  );
}
