import React, { useState, useEffect } from 'react';

export default function SmartBedVitals() {
  const [vitals, setVitals] = useState({ hr: 82, spo2: 98, bpSys: 120, bpDia: 80, rr: 16 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(v => ({
        hr: v.hr + (Math.floor(Math.random() * 5) - 2),
        spo2: Math.min(100, Math.max(90, v.spo2 + (Math.floor(Math.random() * 3) - 1))),
        bpSys: 120 + (Math.floor(Math.random() * 10) - 5),
        bpDia: 80 + (Math.floor(Math.random() * 6) - 3),
        rr: 16 + (Math.floor(Math.random() * 3) - 1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '80px 20px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="elite-text-gradient" style={{ fontSize: '3rem', marginBottom: '10px' }}>SMART BED VITALS</h1>
        <p style={{ opacity: 0.6, marginBottom: '50px' }}>Real-time IoT patient monitoring from Ward B4.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {/* Heart Rate */}
          <div className="quantum-card elite-glass" style={{ width: '250px', padding: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💓</div>
            <h2 style={{ color: 'var(--neon-green)', fontSize: '4rem', margin: 0 }}>{vitals.hr}</h2>
            <p style={{ opacity: 0.5, letterSpacing: '2px', fontSize: '0.8rem' }}>BPM</p>
            <div style={{ height: '40px', borderBottom: '2px solid var(--neon-green)', marginTop: '20px' }}></div>
          </div>
          
          {/* SpO2 */}
          <div className="quantum-card elite-glass" style={{ width: '250px', padding: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🫁</div>
            <h2 style={{ color: 'var(--neon-blue)', fontSize: '4rem', margin: 0 }}>{vitals.spo2}%</h2>
            <p style={{ opacity: 0.5, letterSpacing: '2px', fontSize: '0.8rem' }}>OXYGEN SpO2</p>
            <div style={{ height: '40px', borderBottom: '2px solid var(--neon-blue)', marginTop: '20px' }}></div>
          </div>
          
          {/* Blood Pressure */}
          <div className="quantum-card elite-glass" style={{ width: '250px', padding: '30px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🩸</div>
            <h2 style={{ color: '#f43f5e', fontSize: '3rem', margin: '10px 0' }}>{vitals.bpSys}/{vitals.bpDia}</h2>
            <p style={{ opacity: 0.5, letterSpacing: '2px', fontSize: '0.8rem' }}>BLOOD PRESSURE</p>
            <div style={{ height: '40px', borderBottom: '2px solid #f43f5e', marginTop: '20px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
