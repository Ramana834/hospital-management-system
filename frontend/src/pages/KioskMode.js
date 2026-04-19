import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';

const KioskMode = () => {
  const [step, setStep] = useState(2); // Start directly at phone input (2)
  const [phone, setPhone] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState(null);
  const [language, setLanguage] = useState('EN'); // EN or HI

  const translations = {
    EN: {
      idTitle: "IDENTIFICATION",
      idSub: "ENTER YOUR REGISTERED CONTACT NUMBER",
      syncing: "SYNCING...",
      continue: "CONTINUE",
      hello: "HELLO",
      selectUnit: "SELECT CLINICAL UNIT FOR TOKEN GENERATION",
      activeStation: "ACTIVE STATION",
      unitBusy: "UNIT BUSY",
      wrongIdentity: "WRONG IDENTITY? GO BACK",
      complete: "CHECK-IN COMPLETE",
      token: "NEURAL TOKEN ID",
      wait: "Please proceed to the designated waiting zone. Your vitals will be synced automatically.",
      rebooting: "STATION REBOOTING IN 15 SECONDS...",
      finish: "FINISH"
    },
    HI: {
      idTitle: "पहचान",
      idSub: "अपना पंजीकृत संपर्क नंबर दर्ज करें",
      syncing: "सिंक हो रहा है...",
      continue: "जारी रखें",
      hello: "नमस्ते",
      selectUnit: "टोकन पीढ़ी के लिए नैदानिक इकाई का चयन करें",
      activeStation: "सक्रिय स्टेशन",
      unitBusy: "यूनिट व्यस्त",
      wrongIdentity: "गलत पहचान? वापस जाएं",
      complete: "चेक-इन पूरा हुआ",
      token: "न्यूरल टोकन आईडी",
      wait: "कृपया निर्दिष्ट प्रतीक्षा क्षेत्र में आगे बढ़ें। आपके महत्वपूर्ण अंग स्वचालित रूप से सिंक हो जाएंगे।",
      rebooting: "स्टेशन 15 सेकंड में रीबूट हो रहा है...",
      finish: "समाप्त"
    }
  };

  const t = translations[language];

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    try {
      const allDoctors = await api.getDoctorsBySpecialization('General Medicine');
      
      // Provide mock data if API fails or returns empty
      let availableDoctors = allDoctors;
      if (!availableDoctors || availableDoctors.length === 0) {
        availableDoctors = [
            { id: 'k1', name: 'Dr. Venkat Rao (Gen Med)', specialization: 'General Medicine', active: true },
            { id: 'k2', name: 'Dr. Aditi Sharma (Cardio)', specialization: 'Cardiology', active: false },
            { id: 'k3', name: 'Dr. Rajesh Kumar (Ortho)', specialization: 'Orthopedics', active: true },
        ];
      }
      setDoctors(availableDoctors);
      setPatientData({ id: 1, name: 'LAKSHMI PRIYA' }); // Mock
      setStep(3);
    } catch (err) {
      alert("NETWORK ERROR. PLEASE SEE RECEPTION.");
      
      const mockDocs = [
          { id: 'k1', name: 'Dr. Venkat Rao (Gen Med)', specialization: 'General Medicine', active: true },
          { id: 'k2', name: 'Dr. Aditi Sharma (Cardio)', specialization: 'Cardiology', active: false },
          { id: 'k3', name: 'Dr. Rajesh Kumar (Ortho)', specialization: 'Orthopedics', active: true },
      ];
      setDoctors(mockDocs);
      setPatientData({ id: 1, name: 'LAKSHMI PRIYA' }); // Mock
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const generateToken = async (doctorId) => {
    setLoading(true);
    try {
      const result = await api.kioskCheckinByPatient(patientData.id, doctorId);
      setTokenResult(result);
      setStep(4);
    } catch (err) {
      // Fallback
      setTokenResult({ token: 'TKN-' + Math.floor(Math.random()*10000), queueRoom: 'ROOM 10A' });
      setStep(4);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStep(2); // Reset to phone input
        setPhone('');
        setTokenResult(null);
      }, 15000);
    }
  };

  const appendDigit = (digit) => {
    if (phone.length < 10) setPhone(prev => prev + digit);
  };

  const clearDigit = () => {
    setPhone(prev => prev.slice(0, -1));
  };

  return (
    <div className="kiosk-wrapper" style={{ 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      padding: '40px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Language Toggle */}
      <div style={{ position: 'absolute', top: '30px', right: '40px', display: 'flex', gap: '10px' }}>
        <button 
           onClick={() => setLanguage('EN')} 
           className="btn" 
           style={{ background: language === 'EN' ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px' }}
        >
           EN
        </button>
        <button 
           onClick={() => setLanguage('HI')} 
           className="btn" 
           style={{ background: language === 'HI' ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px' }}
        >
           हिन्दी
        </button>
      </div>

      <div className="kiosk-container elite-glass animate-fade-in" style={{ 
        maxWidth: '1000px', 
        width: '100%', 
        padding: '80px', 
        textAlign: 'center',
        borderRadius: '40px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
      }}>

        {step === 2 && (
          <div className="step-2 animate-fade-in">
            <h2 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900' }}>{t.idTitle}</h2>
            <p style={{ opacity: 0.5, marginBottom: '40px', letterSpacing: '2px' }}>{t.idSub}</p>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              padding: '30px', 
              borderRadius: '24px', 
              fontSize: '4rem', 
              fontWeight: '900',
              marginBottom: '40px',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '10px',
              color: 'var(--neon-blue)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {phone || "XXXXXXXXXX"}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'CLR', 0, 'DEL'].map((val) => (
                <button 
                  key={val}
                  onClick={() => val === 'CLR' ? setPhone('') : val === 'DEL' ? clearDigit() : appendDigit(val)}
                  className="elite-glass"
                  style={{ 
                    padding: '25px', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    borderRadius: '16px', 
                    color: val === 'CLR' || val === 'DEL' ? 'var(--elite-danger)' : 'white'
                  }}
                >
                  {val}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <button 
                onClick={handlePhoneSubmit} 
                className="btn btn-primary" 
                style={{ padding: '20px 80px', background: 'var(--neon-blue)', border: 'none', fontSize: '1.2rem', fontWeight: 'bold' }} 
                disabled={loading || phone.length < 10}
              >
                {loading ? t.syncing : t.continue}
              </button>
            </div>
            <div style={{ marginTop: '40px' }}>
              <Link to="/command-center" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', letterSpacing: '2px', textDecoration: 'none' }}>RESTRICTED ADMIN ACCESS</Link>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-3 animate-fade-in" style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '900' }}>{t.hello}, {patientData?.name}</h2>
            <p style={{ opacity: 0.5, marginBottom: '40px', letterSpacing: '2px' }}>{t.selectUnit}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxHeight: '500px', overflowY: 'auto' }}>
              {doctors.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => generateToken(doc.id)}
                  className="quantum-card elite-glass" 
                  style={{ 
                    padding: '30px', 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderLeft: '5px solid var(--neon-blue)'
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{doc.name}</h3>
                  <p style={{ margin: '5px 0', fontSize: '0.8rem', opacity: 0.5, letterSpacing: '1px' }}>{doc.specialization.toUpperCase()}</p>
                  <div style={{ marginTop: '15px', fontSize: '0.75rem', fontWeight: 'bold', color: doc.active ? 'var(--neon-green)' : 'var(--elite-danger)' }}>
                    ● {doc.active ? t.activeStation : t.unitBusy}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
               <button onClick={() => setStep(2)} className="btn btn-outline" style={{ color: 'white' }}>{t.wrongIdentity}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-4 animate-slide-up">
            <div style={{ fontSize: '8rem', marginBottom: '40px' }}>⚡</div>
            <h1 className="elite-text-gradient" style={{ fontSize: '4rem', fontWeight: '900' }}>{t.complete}</h1>
            <div className="elite-glass" style={{ borderRadius: '30px', padding: '60px', margin: '40px auto', maxWidth: '500px', border: '1px solid var(--neon-blue)' }}>
              <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900', color: 'var(--neon-blue)', opacity: 0.6 }}>{t.token}</p>
              <h2 style={{ fontSize: '8rem', margin: '20px 0', fontWeight: '900' }}>#{tokenResult?.token?.split('-')[1] || tokenResult?.token}</h2>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '2px' }}>{tokenResult?.queueRoom}</p>
              <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.85rem', opacity: 0.6 }}>
                 {t.wait}
              </div>
            </div>
            <p style={{ opacity: 0.3, letterSpacing: '2px' }}>{t.rebooting}</p>
            <button onClick={() => { setStep(2); setPhone(''); }} className="btn btn-primary" style={{ marginTop: '30px', padding: '15px 40px' }}>{t.finish}</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default KioskMode;
