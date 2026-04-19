import React, { useState } from 'react';

export default function InsuranceAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const simulateAnalysis = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        status: 'APPROVED',
        coverage: '85%',
        coPay: '₹4,500',
        approvedAmount: '₹34,500',
        aiNote: 'Policy terms validated. Pre-existing conditions exclusions do not apply for this diagnosis code.'
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div style={{ padding: '80px 20px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🛡️</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '3rem', margin: 0 }}>INSURANCE AI CLAIM</h1>
          <p style={{ opacity: 0.6 }}>Automated NLP based policy verification & rapid claim approval.</p>
        </div>

        {!result ? (
          <form className="quantum-card elite-glass animate-fade-in" onSubmit={simulateAnalysis} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0 }}>NEW CLAIM REQUEST</h3>
            <input type="text" placeholder="Patient ID (e.g. PX-9284)" required style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
            <input type="text" placeholder="Insurance Provider (e.g. Star Health)" required style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
            <input type="text" placeholder="Policy Number" required style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
            <input type="number" placeholder="Estimated Bill Amount (₹)" required style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }} />
            
            <button className="btn btn-primary" style={{ background: 'var(--elite-gradient)', border: 'none', padding: '15px', marginTop: '20px' }} disabled={loading}>
              {loading ? 'AI IS SCANNING POLICY TERMS...' : 'SUBMIT TO AI ENGINE'}
            </button>
          </form>
        ) : (
          <div className="quantum-card elite-glass animate-slide-up" style={{ padding: '40px', textAlign: 'center', borderTop: '5px solid var(--neon-green)' }}>
             <h2 style={{ color: 'var(--neon-green)', letterSpacing: '4px', fontSize: '2.5rem', margin: '0 0 20px 0' }}>CLAIM {result.status}</h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                   <p style={{ margin: 0, opacity: 0.5, fontSize: '0.8rem' }}>AI APPROVED COVERAGE</p>
                   <h3 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{result.coverage}</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                   <p style={{ margin: 0, opacity: 0.5, fontSize: '0.8rem' }}>PATIENT CO-PAY</p>
                   <h3 style={{ margin: '10px 0 0 0', fontSize: '2rem', color: '#facc15' }}>{result.coPay}</h3>
                </div>
             </div>
             <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SANCTIONED: {result.approvedAmount}</p>
             <p style={{ opacity: 0.6, fontSize: '0.9rem', fontStyle: 'italic', marginTop: '20px' }}>" {result.aiNote} "</p>
             <button className="btn" onClick={() => setResult(null)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 30px', marginTop: '30px', border: 'none', borderRadius: '8px' }}>PROCESS ANOTHER</button>
          </div>
        )}
      </div>
    </div>
  );
}
