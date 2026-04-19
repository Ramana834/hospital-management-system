import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CommandCenter = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const services = [
    { id: 'blood-nexus', name: 'Blood Nexus (TS & AP)', icon: '🩸', color: 'var(--elite-danger)', path: '/blood-nexus', desc: 'Real-time donor network across states.' },
    { id: 'live-now', name: 'Live Emergency 360', icon: '📡', color: 'var(--elite-gradient)', path: '/live-now', desc: 'Ambulance tracking & city heatmap.' },
    { id: 'genomics', name: 'Genomic Profile', icon: '🧬', color: 'var(--elite-purple)', path: '/genomics', desc: 'Personalized DNA-based treatments.' },
    { id: 'blockchain', name: 'Blockchain Audit', icon: '⛓️', color: 'var(--elite-dark)', path: '/blockchain', desc: 'Immutable medical record ledger.' },
    { id: 'surgery', name: 'Surgery Live Track', icon: '🔪', color: 'var(--elite-gradient)', path: '/surgery-tracker', desc: 'Real-time progress for families.' },
    { id: 'floor-map', name: 'Digital Twin Floor', icon: '🏢', color: 'var(--elite-purple)', path: '/floor-map', desc: 'Smart bed management system.' },
    { id: 'ai-analyzer', name: 'AI Report Analyzer', icon: '🧠', color: 'var(--elite-gradient)', path: '/ai-analyzer', desc: 'Instant clinical document insights.' },
    { id: 'biometrics', name: 'Biometric Security', icon: '👤', color: 'var(--elite-dark)', path: '/biometrics', desc: 'Face & Fingerprint authentication.' },
    { id: 'quantum-sim', name: 'Quantum Lab Sim', icon: '⚛️', color: 'var(--elite-purple)', path: '/quantum-sim', desc: 'High-speed pharmaceutical labs.' },
    { id: 'metaverse', name: 'Metaverse Tour', icon: '🥽', color: 'var(--elite-gradient)', path: '/metaverse', desc: 'Virtual 3D hospital walkthrough.' },
    { id: 'specialists', name: 'Specialists Network', icon: '⚕️', color: 'var(--elite-dark)', path: '/specialists', desc: 'Global medical expert directory.' },
    { id: 'health-vault', name: 'Health Vault', icon: '🔐', color: 'var(--elite-purple)', path: '/health-vault', desc: 'Secure patient data repository.' },
    { id: 'virtual-nurse', name: 'MahaLakshmi AI', icon: '👩‍⚕️', color: 'var(--elite-gradient)', path: '/ai-analyzer', desc: '24/7 Intelligent health assistant.' },
    { id: 'kiosk', name: 'Smart Kiosk 2.0', icon: '🖥️', color: 'var(--elite-dark)', path: '/kiosk', desc: 'Self-service check-in system.' },
    { id: 'telemedicine', name: 'Tele-Consult Pro', icon: '📹', color: 'var(--elite-purple)', path: '/telemedicine', desc: 'Seamless virtual care links.' },
    { id: 'pharmacy', name: 'Robotic Pharmacy', icon: '💊', color: 'var(--elite-gradient)', path: '/pharmacy', desc: 'Automated medicine dispensing.' },
    { id: 'analytics', name: 'Regional Analytics', icon: '📊', color: 'var(--elite-dark)', path: '/regional-analytics', desc: 'Disease outbreak monitoring.' },
    { id: 'insurance', name: 'Insurance AI', icon: '🛡️', color: 'var(--elite-purple)', path: '/insurance-ai', desc: 'Eligibility & claims automation.' },
    { id: 'lab-trends', name: 'Lab Comparison', icon: '📈', color: 'var(--elite-gradient)', path: '/lab-reports', desc: 'Historical test data visualization.' },
    { id: 'emergency', name: 'Priority Queue', icon: '⚡', color: 'var(--elite-danger)', path: '/emergency', desc: 'Algorithmic emergency triaging.' },
    { id: 'bed-monitor', name: 'Smart Bed Vitals', icon: '💓', color: 'var(--elite-dark)', path: '/smart-bed-vitals', desc: 'IoT integration for recovery.' },
    { id: 'feedback', name: 'Patient Feedback', icon: '⭐', color: 'var(--elite-purple)', path: '/patient-dashboard', desc: 'Experience & satisfaction metrics.' },
    { id: 'disclaimer', name: 'Clinical Safety', icon: '⚖️', color: 'var(--elite-gradient)', path: '/clinical-safety', desc: 'Compliance & regulatory standards.' },
    { id: 'snapshot', name: 'Admin Snapshot', icon: '📁', color: 'var(--elite-dark)', path: '/admin-dashboard', desc: 'Enterprise performance overview.' },
    { id: 'developer', name: 'Elite Suite Core', icon: '💻', color: 'var(--elite-purple)', path: '/developer', desc: 'System architecture & tech stack.' },
  ];

  return (
    <div className="command-center-wrapper" style={{ 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      padding: '80px 20px',
      color: 'white'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fade-in text-center">
          <h1 className="elite-text-gradient" style={{ fontSize: '4rem', marginBottom: '10px' }}>ELITE COMMAND CENTER</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '700px', margin: '0 auto' }}>
            {language === 'te' 
              ? "మహాలక్ష్మి హాస్పిటల్ యొక్క 25 అడ్వాన్స్‌డ్ ఫీచర్ల నియంత్రణ కేంద్రం." 
              : "Mission Control for MahaLakshmi's 25 Revolutionary Clinical & Operational Modules."}
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {services.map((svc, idx) => (
            <div 
              key={svc.id}
              onClick={() => navigate(svc.path)}
              className="quantum-card elite-glass"
              style={{ 
                padding: '30px', 
                cursor: 'pointer',
                transition: 'all 0.4s ease'
              }}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '16px', 
                background: svc.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '20px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
              }}>
                {svc.icon}
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.25rem' }}>{svc.name}</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, lineHeight: '1.5' }}>{svc.desc}</p>
              <div style={{ 
                marginTop: '20px', 
                fontSize: '0.75rem', 
                color: 'var(--neon-blue)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px' 
              }}>
                ACCESS SYSTEM <span style={{ fontSize: '1rem' }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .command-center-wrapper {
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(0, 242, 254, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 80% 80%, rgba(112, 40, 228, 0.05) 0%, transparent 25%);
        }
      `}</style>
    </div>
  );
};

export default CommandCenter;
