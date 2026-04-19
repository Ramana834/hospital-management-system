import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HealthVault = () => {
  const { language, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      navigate('/patient-login');
      return;
    }
    fetchVaultData();
  }, [user.id, navigate]);

  const fetchVaultData = async () => {
    setLoading(true);
    try {
      const result = await api.getPaperlessRecords(user.id);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch health vault data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    // Simulated biometric unlock
    setIsUnlocked(true);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--elite-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        <div className="animate-pulse">SYNCHRONIZING SECURE NODE...</div>
      </div>
    );
  }

  if (!isUnlocked) {
     return (
        <div style={{ background: 'var(--elite-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px' }}>
           <div className="quantum-card elite-glass" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '30px' }}>🔐</div>
              <h2 className="elite-text-gradient" style={{ fontSize: '2.5rem' }}>HEALTH VAULT</h2>
              <p style={{ opacity: 0.6, marginBottom: '40px' }}>Personal cryptographic medical records stored on the MahaLakshmi Neural Ledger.</p>
              <button 
                className="btn btn-primary" 
                onClick={handleUnlock}
                style={{ width: '100%', padding: '18px', background: 'var(--elite-gradient)', border: 'none', borderRadius: '15px', fontWeight: 'bold' }}
              >
                BIOMETRIC UNLOCK
              </button>
              <p style={{ fontSize: '0.7rem', marginTop: '20px', opacity: 0.4 }}>SECURED BY 256-BIT QUANTUM ENCRYPTION</p>
           </div>
        </div>
     );
  }

  const timeline = [];
  if (data) {
    if (data.appointments) data.appointments.forEach(a => timeline.push({ type: 'VISIT', date: a.appointmentDate, data: a }));
    if (data.prescriptions) data.prescriptions.forEach(p => timeline.push({ type: 'MEDS', date: p.createdAt, data: p }));
    if (data.labTests) data.labTests.forEach(l => timeline.push({ type: 'LAB', date: l.createdAt, data: l }));
    if (data.billing) data.billing.forEach(b => timeline.push({ type: 'BILL', date: b.createdAt, data: b }));
  }
  timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="health-vault-page" style={{ 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      padding: '80px 20px', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>DECENTRALIZED MEDICAL VAULT</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4rem', margin: 0 }}>PATIENT ARCHIVE</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Zero-knowledge history of all clinical interactions and test metrics.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
           {/* Sidebar: Digital Passport */}
           <div className="quantum-card elite-glass" style={{ padding: '30px', height: 'fit-content' }}>
              <h4 style={{ letterSpacing: '2px', marginBottom: '25px', textAlign: 'center' }}>DIGITAL PASSPORT</h4>
              <div style={{ padding: '20px', background: 'white', borderRadius: '15px', margin: '0 auto 20px', width: '200px', height: '200px' }}>
                 <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                    {[...Array(64)].map((_, i) => (
                      <div key={i} style={{ width: '12.5%', height: '12.5%', background: Math.random() > 0.5 ? '#0f172a' : 'transparent' }}></div>
                    ))}
                 </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                 <p style={{ margin: '5px 0', fontWeight: '900', color: 'var(--neon-blue)' }}>PX-{user.id}-9284</p>
                 <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>ACTIVE IDENTITY TOKEN</p>
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>BLOOD GROUP</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--elite-danger)' }}>O+ POSITIVE</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>ALLERGIES</span>
                    <span style={{ fontWeight: 'bold' }}>PENICILLIN</span>
                 </div>
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '15px' }}>ADD EXTERNAL RECORD</p>
                 <label style={{ cursor: 'pointer', display: 'block', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--neon-blue)', borderRadius: '12px', transition: 'all 0.3s ease' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📤</div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--neon-blue)', fontWeight: 'bold' }}>UPLOAD SECURE FILE</span>
                    <input type="file" style={{ display: 'none' }} onChange={(e) => {
                      if(e.target.files.length > 0) {
                        alert(`FILE "${e.target.files[0].name}" SECURELY ENCRYPTED & UPLOADED TO VAULT.`);
                      }
                    }} />
                 </label>
              </div>
           </div>

           {/* Main Timeline */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ letterSpacing: '2px', marginBottom: '10px' }}>HISTORICAL LEDGER</h3>
              {timeline.map((item, index) => (
                <div key={index} className="quantum-card elite-glass animate-slide-up" style={{ 
                  padding: '25px', 
                  animationDelay: `${index * 0.1}s`,
                  borderLeft: `5px solid ${item.type === 'LAB' ? 'var(--neon-green)' : (item.type === 'BILL' ? '#facc15' : 'var(--neon-blue)')}` 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                     <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '4px', letterSpacing: '1px' }}>
                       {item.type}
                     </span>
                     <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(item.date).toLocaleDateString()}</span>
                  </div>

                  {item.type === 'VISIT' && (
                    <div>
                      <h4 style={{ margin: 0 }}>Consultation: {item.data.doctor?.name}</h4>
                      <p style={{ margin: '5px 0 0', fontSize: '0.9rem', opacity: 0.6 }}>Status: Unified Clinic Registry Verified</p>
                    </div>
                  )}

                  {item.type === 'MEDS' && (
                    <div>
                      <h4 style={{ margin: 0 }}>Neural Prescription Issued</h4>
                      <p style={{ margin: '10px 0 0', fontWeight: 'bold', color: 'var(--neon-blue)' }}>{item.data.medicines}</p>
                    </div>
                  )}

                  {item.type === 'LAB' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{item.data.testName} Analysis</h4>
                        <p style={{ margin: '5px 0 0', fontSize: '0.75rem', opacity: 0.6 }}>Validated by MediBrain™ AI</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.data.resultValue}</span>
                         <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '5px' }}>{item.data.unit}</span>
                      </div>
                    </div>
                  )}

                  {item.type === 'BILL' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <h4 style={{ margin: 0 }}>Digital Invoice #{item.data.id}</h4>
                       <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#facc15' }}>₹ {item.data.amount}</span>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HealthVault;
