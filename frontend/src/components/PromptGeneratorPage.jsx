import React from 'react';

export default function PromptGeneratorPage({ promptState, promptInput, setPromptInput }) {
  const { result, isLoading, error, generate, reset } = promptState;
  const [copiedKey, setCopiedKey] = React.useState(null);

  const handleGenerate = () => generate(promptInput);
  const handleKeyDown  = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleGenerate();
  };

  const handleBack = () => {
    reset();
  };

  const handleClear = () => {
    reset();
    setPromptInput('');
  };

  const copyText = async (text, key) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const EXAMPLES = [
    'make website fast',
    'doctor appointment app',
    'marketing email for shoes',
    'मुझे chatbot बनाना है',
    'résumé for data scientist',
    'legal contract review',
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'1.5rem', gap:'1.25rem', overflow:'auto', maxWidth:'900px', margin:'0 auto', width:'100%' }}>

      {/* ── Title + Back button ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontSize:'20px', fontWeight:800, color:'var(--tx-primary)', letterSpacing:'-0.4px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ background:'linear-gradient(135deg, #bc8cff, #58a6ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>✦</span>
            Universal Prompt Generator
          </h2>
          <p style={{ fontSize:'13px', color:'var(--tx-secondary)', marginTop:'4px' }}>
            Describe your idea in any language, any field — get a clear, professional AI prompt instantly.
          </p>
        </div>

        {/* FIX 2 — Back button: only visible when result is showing */}
        {result && !isLoading && (
          <button
            onClick={handleBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              color: 'var(--tx-secondary)',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--tx-secondary)';
            }}
          >
            ← New Prompt
          </button>
        )}
      </div>

      {/* ── Show input area only when no result yet ── */}
      {!result && !isLoading && (
        <>
          {/* Example chips */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => { setPromptInput(ex); reset(); }}
                style={{ fontSize:'11px', padding:'5px 12px', background:'var(--bg-hover)', border:'1px solid var(--border)', borderRadius:'100px', color:'var(--tx-secondary)', cursor:'pointer', fontFamily:'var(--font-ui)', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--tx-secondary)'; }}>
                {ex}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
            <div style={{ padding:'10px 14px', background:'var(--bg-surface)', borderBottom:'1px solid var(--border-dim)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'11px', fontWeight:600, color:'var(--tx-secondary)', textTransform:'uppercase', letterSpacing:'0.6px' }}>Your Idea</span>
              <span style={{ fontSize:'10px', color:'var(--tx-muted)', fontFamily:'var(--font-code)' }}>Any language · Any field · Ctrl+Enter</span>
            </div>
            <textarea
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"Type your vague idea here...\nExamples:\n• make website fast\n• मुझे chatbot बनाना है\n• marketing email for shoes"}
              rows={5}
              style={{ width:'100%', background:'transparent', border:'none', outline:'none', resize:'vertical', color:'var(--tx-primary)', fontFamily:'var(--font-ui)', fontSize:'14px', lineHeight:1.7, padding:'16px 18px' }}
            />
            <div style={{ padding:'10px 14px', background:'var(--bg-surface)', borderTop:'1px solid var(--border-dim)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'11px', color:'var(--tx-muted)', fontFamily:'var(--font-code)' }}>
                {promptInput.length > 0 ? `${promptInput.length} characters` : 'No input yet'}
              </span>
              <div style={{ display:'flex', gap:'8px' }}>
                {promptInput && (
                  <button onClick={handleClear} style={{ padding:'7px 14px', background:'transparent', border:'1px solid var(--border)', borderRadius:'var(--r-md)', color:'var(--tx-muted)', fontSize:'12px', cursor:'pointer', fontFamily:'var(--font-ui)' }}>
                    Clear
                  </button>
                )}
                <button onClick={handleGenerate} disabled={isLoading || !promptInput.trim()}
                  style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 18px', background: isLoading || !promptInput.trim() ? 'var(--bg-hover)' : 'linear-gradient(135deg, #bc8cff, #58a6ff)', border:'none', borderRadius:'var(--r-md)', color: isLoading || !promptInput.trim() ? 'var(--tx-secondary)' : '#0d1117', fontSize:'13px', fontWeight:700, cursor: isLoading || !promptInput.trim() ? 'not-allowed' : 'pointer', fontFamily:'var(--font-ui)', transition:'all 0.2s' }}>
                  {isLoading ? <><MiniSpinner /> Generating...</> : '✦ Generate Prompt'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{ background:'rgba(248,81,73,0.08)', border:'1px solid rgba(248,81,73,0.25)', borderRadius:'var(--r-md)', padding:'12px 16px', fontSize:'13px', color:'var(--red)' }}>
          ⚠️ {error}
          <button onClick={handleBack} style={{ marginLeft:'12px', fontSize:'12px', color:'var(--accent)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'32px', display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' }}>
          <div style={{ fontSize:'28px', background:'linear-gradient(135deg, #bc8cff, #58a6ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'pgSpin 2s linear infinite' }}>✦</div>
          <div style={{ fontSize:'13px', color:'var(--tx-secondary)' }}>Generating your professional prompt...</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', width:'60%' }}>
            {[80,60,90,50].map((w,i) => (
              <div key={i} style={{ height:9, borderRadius:5, width:`${w}%`, background:'linear-gradient(90deg, var(--bg-hover) 25%, var(--border) 50%, var(--bg-hover) 75%)', backgroundSize:'200% 100%', animation:`pgShimmer 1.4s infinite ${i*0.1}s` }} />
            ))}
          </div>
          <style>{`@keyframes pgSpin{to{transform:rotate(360deg)}} @keyframes pgShimmer{to{background-position:-200% 0}}`}</style>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
            <Badge label="Field"    value={result.detectedField}    color="#58a6ff" />
            <Badge label="Language" value={result.detectedLanguage} color="#3fb950" />
            {/* Show the original input as a badge so user remembers what they typed */}
            {promptInput && (
              <Badge label="Input" value={`"${promptInput.slice(0, 40)}${promptInput.length > 40 ? '...' : ''}"`} color="#e3b341" />
            )}
          </div>

          <PromptCard
            title="✦ Generated Prompt"
            subtitle="Main prompt — ready to use"
            content={result.generatedPrompt}
            accentColor="#bc8cff"
            onCopy={() => copyText(result.generatedPrompt, 'main')}
            copied={copiedKey === 'main'}
          />
          <PromptCard
            title="⟳ Prompt Variants"
            subtitle="Alternative versions — different angles"
            content={result.promptVariants}
            accentColor="#58a6ff"
            onCopy={() => copyText(result.promptVariants, 'variants')}
            copied={copiedKey === 'variants'}
          />
          <PromptCard
            title="💡 Tips to Improve"
            subtitle="Make your prompt even better"
            content={result.tips}
            accentColor="#e3b341"
            onCopy={() => copyText(result.tips, 'tips')}
            copied={copiedKey === 'tips'}
          />
        </div>
      )}
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 12px', background:`${color}18`, border:`1px solid ${color}40`, borderRadius:'100px', fontSize:'11px' }}>
      <span style={{ color:'var(--tx-muted)' }}>{label}:</span>
      <span style={{ color, fontWeight:600 }}>{value}</span>
    </div>
  );
}

function PromptCard({ title, subtitle, content, accentColor, onCopy, copied }) {
  return (
    <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden', borderLeft:`3px solid ${accentColor}` }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:'var(--bg-surface)', borderBottom:'1px solid var(--border-dim)' }}>
        <div>
          <div style={{ fontSize:'13px', fontWeight:600, color:'var(--tx-primary)' }}>{title}</div>
          <div style={{ fontSize:'11px', color:'var(--tx-muted)', marginTop:'1px' }}>{subtitle}</div>
        </div>
        <button onClick={onCopy} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', background: copied ? `${accentColor}18` : 'var(--bg-hover)', border:`1px solid ${copied ? accentColor+'50' : 'var(--border)'}`, borderRadius:'var(--r-sm)', color: copied ? accentColor : 'var(--tx-secondary)', fontSize:'11px', fontFamily:'var(--font-code)', cursor:'pointer', transition:'all 0.2s' }}>
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>
      <div style={{ padding:'16px 18px', fontSize:'13px', color:'var(--tx-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap', fontFamily:'var(--font-ui)' }}>
        {content}
      </div>
    </div>
  );
}

function MiniSpinner() {
  return (
    <div style={{ width:12, height:12, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#0d1117', borderRadius:'50%', animation:'pgSpin 0.65s linear infinite', flexShrink:0 }} />
  );
}