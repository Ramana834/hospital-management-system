import React from 'react';

export default function RegionalAnalytics() {
  return (
    <div style={{ padding: '80px 20px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="elite-text-gradient" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>REGIONAL ANALYTICS</h1>
        <p style={{ opacity: 0.6, fontSize: '1.2rem', marginBottom: '40px' }}>AI-powered disease outbreak monitoring & population health metrics.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
             <h3 style={{ margin: '0 0 20px 0', letterSpacing: '2px', color: '#facc15' }}>EPIDEMIC ALERT</h3>
             <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🦠</div>
             <p style={{ fontWeight: 'bold' }}>Dengue Clusters Detected</p>
             <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Sector 4 & 7 show a 24% increase in viral fever cases over the last 48 hours.</p>
          </div>

          <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
             <h3 style={{ margin: '0 0 20px 0', letterSpacing: '2px', color: 'var(--neon-green)' }}>VACCINATION STATS</h3>
             <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💉</div>
             <h2 style={{ fontSize: '3rem', margin: 0 }}>84%</h2>
             <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>City-wide immunization coverage for pediatric schedules.</p>
          </div>
          
          <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
             <h3 style={{ margin: '0 0 20px 0', letterSpacing: '2px', color: 'var(--neon-blue)' }}>RESOURCE ALLOCATION</h3>
             <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏥</div>
             <p style={{ fontWeight: 'bold' }}>ICU Bed Predictive Load: 68%</p>
             <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>No immediate reallocation required across regional nodes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
