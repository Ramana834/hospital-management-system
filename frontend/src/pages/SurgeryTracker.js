import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SurgeryTracker = () => {
  const { language, t } = useLanguage();
  const [trackId, setTrackId] = useState('');
  const [trackType, setTrackType] = useState('surgery'); // 'surgery' or 'patient'
  const [surgeryData, setSurgeryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live Auto-updating Vitals mock
  useEffect(() => {
    let interval;
    if (surgeryData && (surgeryData.status === 'in-surgery' || surgeryData.status === 'recovering')) {
      interval = setInterval(() => {
        setSurgeryData(prev => ({
          ...prev,
          vitals: {
            hr: prev.vitals.hr + (Math.floor(Math.random() * 5) - 2),
            bp: '1' + (15 + Math.floor(Math.random() * 10)) + '/' + (70 + Math.floor(Math.random() * 5)),
            spo2: (98 + Math.floor(Math.random() * 2)) + '%'
          }
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [surgeryData?.status]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackId) return;
    setLoading(true);
    setError('');
    
    // Simulating deep network search
    setTimeout(() => {
      const isMatch = 
        trackId === '1' || 
        trackId === '2' || 
        trackId.toLowerCase() === 'mh-772' || 
        (trackType === 'patient' && (trackId === 'P100' || trackId === 'P200'));

      if (isMatch) {
        const mockData = {
          id: trackId === '1' || trackId === 'P100' ? 'SR-2024-001' : 'SR-2024-002',
          type: trackId === '1' || trackId === 'P100' ? 'Cardiac Bypass' : 'Knee Replacement',
          patient: trackId === '1' || trackId === 'P100' ? 'Lakshmi Priya' : 'Demo Patient',
          doctor: 'Dr. Karthik Rao',
          status: trackId === '1' || trackId === 'P100' ? 'recovering' : 'in-surgery',
          time: '09:20 AM',
          vitals: { hr: 78, bp: '118/72', spo2: '99%' }
        };
        setSurgeryData(mockData);
      } else {
        setError(`${trackType === 'patient' ? 'Patient' : 'Surgery'} ID not found in regional database.`);
        setSurgeryData(null);
      }
      setLoading(false);
    }, 1500);
  };

  const steps = [
    { id: 'scheduled', label: 'IN QUEUE', icon: '📝' },
    { id: 'pre-op', label: 'PRE-OP', icon: '💉' },
    { id: 'in-surgery', label: 'IN SURGERY', icon: '🔪' },
    { id: 'recovering', label: 'RECOVERY', icon: '🛌' },
    { id: 'ward', label: 'WARD/DEPT', icon: '✅' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === surgeryData?.status);

  return (
    <div className="surgery-tracker-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>MAHALAKSHMI SURGICAL CORE</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4rem', margin: 0 }}>LIVE SURGERY TRACK</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Real-time surgical progress monitoring for authorized family members.</p>
        </div>

        <div className="quantum-card elite-glass" style={{ padding: '60px', textAlign: 'center' }}>
          {!surgeryData ? (
             <div className="animate-fade-in">
               <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                 <button 
                    onClick={() => setTrackType('surgery')}
                    style={{ padding: '10px 20px', background: trackType === 'surgery' ? 'var(--neon-blue)' : 'transparent', color: trackType === 'surgery' ? 'white' : 'var(--neon-blue)', border: '1px solid var(--neon-blue)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                   USE SURGERY ID
                 </button>
                 <button 
                    onClick={() => setTrackType('patient')}
                    style={{ padding: '10px 20px', background: trackType === 'patient' ? 'var(--neon-blue)' : 'transparent', color: trackType === 'patient' ? 'white' : 'var(--neon-blue)', border: '1px solid var(--neon-blue)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                   USE PATIENT ID
                 </button>
               </div>
               
               <h3 style={{ marginBottom: '30px', letterSpacing: '2px' }}>AUTHENTICATE {trackType === 'surgery' ? 'SURGERY' : 'PATIENT'} ID</h3>
               
               <form onSubmit={handleTrack} style={{ display: 'flex', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
                 <input 
                   type="text" 
                   value={trackId}
                   onChange={(e) => setTrackId(e.target.value)}
                   placeholder={`Enter ${trackType === 'patient' ? 'Patient ID (e.g. P100)' : 'Surgery token (e.g. MH-772)'}`} 
                   style={{ 
                     flex: 1, 
                     padding: '18px 25px', 
                     background: 'rgba(255,255,255,0.05)', 
                     border: '1px solid rgba(255,255,255,0.1)',
                     borderRadius: '16px',
                     color: 'white',
                     fontSize: '1.1rem'
                   }}
                 />
                 <button className="btn btn-primary" style={{ padding: '0 40px', background: 'var(--elite-gradient)', border: 'none' }} disabled={loading}>
                    {loading ? 'SYNCING...' : 'TRACK LIVE'}
                 </button>
               </form>
               {error && <p style={{ color: '#f43f5e', marginTop: '20px', fontWeight: 'bold' }}>{error}</p>}
               <p style={{ opacity: 0.4, fontSize: '0.8rem', marginTop: '20px' }}>*You can now track using Patient User ID for convenience.</p>
             </div>
          ) : (
             <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
                   <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>PATIENT NAME</p>
                      <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{surgeryData.patient}</h2>
                      <span style={{ fontSize: '0.8rem', background: 'var(--neon-blue)', padding: '5px 15px', borderRadius: '50px', color: 'black', fontWeight: 'bold' }}>{surgeryData.type}</span>
                      <p style={{ margin: '10px 0 0 0', opacity: 0.6, fontSize: '0.9rem' }}>Surgery ID: {surgeryData.id}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>LEAD SURGEON</p>
                      <h4 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{surgeryData.doctor}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                         <span className="pulse-dot" style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', animation: 'pulse-glow 1s infinite' }}></span>
                         LIVE HR: {surgeryData.vitals.hr} BPM
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>BP: {surgeryData.vitals.bp} | SpO2: {surgeryData.vitals.spo2}</p>
                   </div>
                </div>

                <div className="timeline-wrapper" style={{ position: 'relative', height: '150px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                   {/* Background Line */}
                   <div style={{ position: 'absolute', top: '50%', left: '0', width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', transform: 'translateY(-50%)' }} />
                   
                   {/* Progress Line */}
                   <div style={{ 
                     position: 'absolute', 
                     top: '50%', 
                     left: '0', 
                     width: `${(currentStepIndex / (steps.length - 1)) * 100}%`, 
                     height: '4px', 
                     background: 'var(--elite-gradient)', 
                     boxShadow: '0 0 15px var(--neon-blue)',
                     transform: 'translateY(-50%)',
                     transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)' 
                   }} />

                   {steps.map((step, idx) => (
                      <div key={idx} style={{ 
                        flex: 1, 
                        position: 'relative', 
                        zIndex: 1,
                        opacity: idx <= currentStepIndex ? 1 : 0.3
                      }}>
                         <div style={{ 
                           width: '70px', 
                           height: '70px', 
                           background: idx < currentStepIndex ? 'var(--neon-blue)' : (idx === currentStepIndex ? 'var(--elite-gradient)' : 'var(--elite-dark)'), 
                           margin: '0 auto', 
                           borderRadius: '50%',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           fontSize: '1.8rem',
                           border: `4px solid ${idx === currentStepIndex ? 'white' : 'rgba(255,255,255,0.1)'}`,
                           boxShadow: idx === currentStepIndex ? '0 0 30px var(--neon-blue)' : 'none',
                           animation: idx === currentStepIndex ? 'pulse-glow 2s infinite' : 'none'
                         }}>
                            {step.icon}
                         </div>
                         <p style={{ 
                           marginTop: '20px', 
                           fontSize: '0.75rem', 
                           fontWeight: 'bold', 
                           letterSpacing: '1px',
                           color: idx <= currentStepIndex ? 'var(--neon-blue)' : 'white'
                         }}>{step.label}</p>
                      </div>
                   ))}
                </div>

                <div style={{ 
                  background: 'rgba(52, 211, 153, 0.05)', 
                  border: '1px solid rgba(52, 211, 153, 0.2)', 
                  padding: '25px', 
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                   <div>
                      <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>STATUS</span>
                      <h4 style={{ margin: 0, color: 'var(--neon-green)', letterSpacing: '2px' }}>{steps[currentStepIndex].label}</h4>
                   </div>
                   <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                   <div>
                      <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>VITALS LOAD</span>
                      <h4 style={{ margin: 0, letterSpacing: '2px' }}>STABLE</h4>
                   </div>
                   <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
                   <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => setSurgeryData(null)}>TRACK ANOTHER</button>
                </div>
             </div>
          )}
        </div>

        <div className="quantum-card elite-glass" style={{ marginTop: '40px', padding: '30px', textAlign: 'center' }}>
           <p style={{ opacity: 0.6, fontSize: '0.85rem', margin: 0 }}>
             🛡️ This terminal is part of the MahaLakshmi Clinical Privacy Network. Transaction Hash: 0xf12...88a4
           </p>
        </div>
      </div>
    </div>
  );
};

export default SurgeryTracker;
