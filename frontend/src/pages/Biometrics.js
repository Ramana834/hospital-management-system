import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Biometrics = () => {
  const { language, t } = useLanguage();
  const [vitals, setVitals] = useState({ hr: 72, spo2: 98, temp: 98.6, bp: '120/80' });
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState(null);
  const [scanComplete, setScanComplete] = useState(false);
  const videoRef = React.useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals({
        hr: 70 + Math.floor(Math.random() * 10),
        spo2: 97 + Math.floor(Math.random() * 3),
        temp: 98.4 + (Math.random() * 0.4),
        bp: (115 + Math.floor(Math.random() * 10)) + "/" + (75 + Math.floor(Math.random() * 8))
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = async (type) => {
    setScanType(type);
    setIsScanning(true);
    setScanComplete(false);

    if (type === 'face') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setWebcamActive(true);
        }
      } catch (err) {
        console.warn("Camera access denied", err);
      }
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
        setWebcamActive(false);
      }
    }, 4500);
  };

  return (
    <div className="biometrics-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ 
            fontSize: '0.8rem', 
            letterSpacing: '4px', 
            color: 'var(--neon-blue)', 
            marginBottom: '15px',
            fontWeight: '900'
          }}>SECURITY PROTOCOL: BIO-SHIELD</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4rem', margin: 0 }}>
             IDENTITY VERIFICATION
          </h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Real-time Biometric Sync via MahaSync™ Wearable Protocol</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px' }}>
           {/* Vitals Command Center */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="quantum-card elite-glass" style={{ padding: '30px', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>HEART RATE</p>
                 <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--neon-blue)', margin: '10px 0' }}>
                    {vitals.hr} <small style={{ fontSize: '1.2rem', opacity: 0.3 }}>BPM</small>
                 </div>
                 <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    {[...Array(15)].map((_, i) => (
                      <div key={i} style={{ 
                        width: '3px', 
                        height: `${20 + Math.random() * 20}px`, 
                        background: 'var(--neon-blue)', 
                        animation: 'heartbeat 1s infinite alternate',
                        animationDelay: `${i * 0.05}s`
                      }} />
                    ))}
                 </div>
              </div>

              <div className="quantum-card elite-glass" style={{ padding: '30px', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>BLOOD OXYGEN</p>
                 <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--neon-green)', margin: '10px 0' }}>
                    {vitals.spo2}<small style={{ fontSize: '1.2rem', opacity: 0.3 }}>%</small>
                 </div>
                 <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ width: `${vitals.spo2}%`, height: '100%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }} />
                 </div>
              </div>

              <div className="quantum-card elite-glass" style={{ padding: '30px', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>BLOOD PRESSURE</p>
                 <div style={{ fontSize: '3rem', fontWeight: '900', margin: '20px 0' }}>{vitals.bp}</div>
                 <span style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', background: 'rgba(0,242,254,0.1)', padding: '4px 12px', borderRadius: '50px' }}>NOMINAL</span>
              </div>

              <div className="quantum-card elite-glass" style={{ padding: '30px', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>BODY TEMP</p>
                 <div style={{ fontSize: '3rem', fontWeight: '900', margin: '20px 0' }}>{vitals.temp.toFixed(1)}°F</div>
                 <span style={{ fontSize: '0.7rem', color: 'var(--neon-green)', background: 'rgba(52,211,153,0.1)', padding: '4px 12px', borderRadius: '50px' }}>STABLE</span>
              </div>
           </div>

           {/* Biometric Verification */}
           <div className="quantum-card elite-glass" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ letterSpacing: '2px', marginBottom: '30px' }}>FACIAL & HAPTIC SCANNER</h3>
              
              <div style={{ 
                height: '240px', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '20px', 
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted 
                   style={{ width: '100%', height: '100%', objectFit: 'cover', display: webcamActive ? 'block' : 'none', opacity: isScanning ? 1 : 0.4 }} 
                />
                
                {!webcamActive && (
                  <div style={{ fontSize: '5rem', opacity: isScanning ? 0.3 : 1, transition: 'all 0.5s', position: 'absolute' }}>
                    {scanComplete ? '✅' : (scanType === 'finger' ? '👆' : '👤')}
                  </div>
                )}

                {isScanning && (
                   <div style={{ 
                     position: 'absolute', 
                     top: 0, 
                     left: 0, 
                     width: '100%', 
                     height: '4px', 
                     background: 'var(--neon-blue)', 
                     boxShadow: '0 0 20px var(--neon-blue)', 
                     animation: 'scanning 2s infinite linear' 
                   }} />
                )}
                
                {isScanning && (
                   <div style={{ 
                     position: 'absolute', 
                     bottom: '20px', 
                     left: '0', 
                     width: '100%', 
                     fontSize: '0.7rem', 
                     letterSpacing: '2px',
                     color: 'var(--neon-blue)'
                   }}>MATCHING BIOMETRIC HASH...</div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ background: 'var(--elite-gradient)', border: 'none', padding: '12px' }}
                  onClick={() => handleScan('face')}
                  disabled={isScanning}
                >FACE ID SCAN</button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: 'var(--elite-purple)', border: 'none', padding: '12px' }}
                  onClick={() => handleScan('finger')}
                  disabled={isScanning}
                >RE-SCAN FINGERPRINT</button>
              </div>

              {scanComplete && (
                <div className="animate-fade-in" style={{ marginTop: '20px', padding: '15px', background: 'rgba(52,211,153,0.1)', color: 'var(--neon-green)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  IDENTITY CONFIRMED: KARTHIK RAO (PATIENT ID #7729)
                </div>
              )}

              <p style={{ marginTop: '30px', fontSize: '0.7rem', opacity: 0.4 }}>
                This data is transmitted using 512-bit End-to-End Encryption to the MahaLakshmi Clinical Cloud.
              </p>
           </div>
        </div>

        <div className="quantum-card elite-glass" style={{ marginTop: '40px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div>
              <h4 style={{ margin: 0 }}>Syncing with Apex-7 Core</h4>
              <p style={{ margin: '5px 0 0', opacity: 0.6, fontSize: '0.8rem' }}>Last Sync: Just now | Signal Strength: 98% | Latency: 4ms</p>
           </div>
           <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: '0.65rem', opacity: 0.4, margin: 0 }}>GLOBAL RANK</p>
                 <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--neon-blue)' }}>TOP 2% HEALTHIEST</p>
              </div>
              <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>ELITE METRICS REPORT</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Biometrics;
