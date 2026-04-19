import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Metaverse = () => {
  const { language, t } = useLanguage();
  const [isEntering, setIsEntering] = useState(false);
  const [spatialRotation, setSpatialRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpatialRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const locations = [
    { id: 'lobby', name: 'Grand Lobby', img: 'https://images.unsplash.com/photo-1593508512855-994451a9e81f?auto=format&fit=crop&q=80&w=1200' },
    { id: 'surgery', name: 'Operation Theater', img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200' },
    { id: 'lab', name: 'Quantum Lab', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200' }
  ];
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  const enterMetaverse = () => {
    setIsEntering(true);
    setTimeout(() => {
      alert(`SYNCHRONIZING NEURAL LINK... TELEPORTING TO ${selectedLocation.name.toUpperCase()}.`);
      setIsEntering(false);
    }, 2000);
  };

  return (
    <div className="metaverse-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Spatial Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '100px 100px',
        transform: `perspective(1000px) rotateX(60deg) translateY(${spatialRotation}px)`,
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="animate-fade-in" style={{ marginBottom: '80px' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-purple)', marginBottom: '15px', fontWeight: '900' }}>SPATIAL MEDICINE v1.0</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '5rem', margin: 0, fontWeight: '900' }}>
             VIRTUAL CLINIC
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.6, marginTop: '10px' }}>Experience personalized consultations in a persistent 3D medical metaverse.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
           <div className="quantum-card elite-glass" style={{ padding: '0', background: 'none', border: 'none', position: 'relative' }}>
              
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.5)', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                 <span style={{ fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.7 }}>DESTINATION:</span>
                 <select 
                   value={selectedLocation.id}
                   onChange={(e) => setSelectedLocation(locations.find(l => l.id === e.target.value))}
                   style={{ padding: '10px', background: 'var(--elite-dark)', color: 'white', border: '1px solid var(--neon-purple)', borderRadius: '8px', cursor: 'pointer' }}
                 >
                   {locations.map(loc => (
                     <option key={loc.id} value={loc.id}>{loc.name}</option>
                   ))}
                 </select>
              </div>

              <div style={{ 
                width: '100%', 
                height: '470px', 
                background: `url("${selectedLocation.img}") center/cover`, 
                borderBottomLeftRadius: '40px',
                borderBottomRightRadius: '40px',
                boxShadow: '0 0 100px rgba(168, 85, 247, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                borderTop: 'none',
                transition: 'background 0.5s ease'
              }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--elite-dark))' }}></div>
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '6rem', marginBottom: '30px', filter: 'drop-shadow(0 0 20px var(--neon-purple))' }}>🥽</div>
                    <button 
                      className="btn btn-primary" 
                      onClick={enterMetaverse}
                      style={{ 
                        padding: '20px 60px', 
                        fontSize: '1.4rem', 
                        borderRadius: '20px', 
                        background: 'var(--elite-gradient)', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: '900',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        letterSpacing: '2px'
                      }}
                    >
                      {isEntering ? 'INITIALIZING LINK...' : 'INITIATE NEURAL PORTAL'}
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5, letterSpacing: '2px' }}>SUPPORTED ON VISION PRO & QUEST 3</p>
                 </div>
              </div>
           </div>

           <div style={{ textAlign: 'left' }}>
              <h2 style={{ marginBottom: '35px', letterSpacing: '2px' }}>META-CLINIC CAPABILITIES</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                 {[
                   { title: "3D BIO-VOLUMETRIC VISUALS", color: 'var(--neon-blue)', desc: "Interact with high-fidelity 3D reconstructions of your clinical scans." },
                   { title: "SPATIAL AVATAR CONSULTS", color: 'var(--neon-purple)', desc: "Collaborative presence with specialized avatars for immersive empathy." },
                   { title: "UNIVERSAL BIO-BRIDGE", color: 'var(--neon-green)', desc: "Zero-latency medical data streaming across global Metaverse nodes." }
                 ].map((feat, i) => (
                   <div key={i} className="quantum-card elite-glass animate-slide-up" style={{ padding: '25px', animationDelay: `${i * 0.1}s` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: feat.color, boxShadow: `0 0 10px ${feat.color}` }}></div>
                        <h4 style={{ margin: 0, letterSpacing: '2px', color: 'white' }}>{feat.title}</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.6, lineHeight: '1.6' }}>{feat.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Metaverse;
