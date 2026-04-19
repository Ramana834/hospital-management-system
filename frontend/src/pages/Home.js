import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [beds, setBeds] = useState([]);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const data = await api.getBeds();
        setBeds(data);
      } catch (err) {
        console.error("Failed to fetch beds", err);
      }
    };
    fetchBeds();
  }, []);

  const totalBeds = beds.length || 500;
  const availableBeds = beds.filter(b => b.status === 'available').length || 142;

  return (
    <div className="home-wrapper" style={{ background: 'var(--elite-dark)', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Cinematic Hero */}
      <section style={{ 
        position: 'relative', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 20px',
        textAlign: 'center'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          borderRadius: '50%',
          filter: 'blur(100px)'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in" style={{ 
            fontSize: '0.9rem', 
            letterSpacing: '8px', 
            color: 'var(--neon-blue)', 
            marginBottom: '30px', 
            fontWeight: '900',
            textTransform: 'uppercase'
          }}>
            REDEFINING GLOBAL HEALTHCARE
          </div>
          
          <h1 className="elite-text-gradient" style={{ 
            fontSize: '6.5rem', 
            fontWeight: '900', 
            lineHeight: '1.1', 
            margin: 0,
            letterSpacing: '-2px'
          }}>
            MAHALAKSHMI<br/>
            ELITE SUITE
          </h1>

          <p style={{ 
            fontSize: '1.5rem', 
            opacity: 0.6, 
            maxWidth: '800px', 
            margin: '30px auto 50px',
            lineHeight: '1.6'
          }}>
            Experience the "Ultimate 25" — a revolutionary ecosystem of 25 world-class clinical & AI modules designed for enterprise-grade excellence.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
             <button 
               onClick={() => navigate('/command-center')} 
               className="btn btn-primary"
               style={{ 
                 padding: '20px 50px', 
                 fontSize: '1.1rem', 
                 fontWeight: '900', 
                 background: 'var(--elite-gradient)', 
                 border: 'none', 
                 borderRadius: '15px',
                 letterSpacing: '2px',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
               }}
             >
               ENTER COMMAND CENTER
             </button>
             <button 
               onClick={() => navigate('/book-appointment')} 
               className="btn btn-outline"
               style={{ 
                 padding: '20px 50px', 
                 fontSize: '1.1rem', 
                 fontWeight: '900', 
                 color: 'white', 
                 borderColor: 'var(--neon-blue)', 
                 borderRadius: '15px',
                 letterSpacing: '2px'
               }}
             >
               BOOK APPOINTMENT
             </button>
          </div>

          {/* Real-time Ticker */}
          <div style={{ 
            marginTop: '80px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '30px', 
            padding: '15px 40px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', boxShadow: '0 0 10px var(--neon-green)' }}></div>
                <span style={{ fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.6 }}>SYSTEMS OPERATIONAL</span>
             </div>
             <div style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>
                LIVE BEDS: <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>{availableBeds}</span> / {totalBeds}
             </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section style={{ padding: '100px 20px', background: 'var(--elite-dark)' }}>
         <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
               {[
                 { title: 'NEURAL GENOMICS', desc: 'DNA Sequencing & Quantum Diagnostics.', icon: '🧬', path: '/genomics' },
                 { title: 'BLOCKCHAIN AUDIT', desc: 'Immutable distributed medical ledger.', icon: '⛓️', path: '/blockchain' },
                 { title: 'SPATIAL CLINIC', desc: 'Immersive VR medical consultations.', icon: '🥽', path: '/metaverse' }
               ].map((mod, i) => (
                 <div key={i} onClick={() => navigate(mod.path)} className="quantum-card elite-glass" style={{ padding: '50px', cursor: 'pointer', transition: 'all 0.4s ease' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '30px' }}>{mod.icon}</div>
                    <h3 style={{ fontSize: '1.8rem', letterSpacing: '2px', marginBottom: '15px' }}>{mod.title}</h3>
                    <p style={{ opacity: 0.6, lineHeight: '1.6' }}>{mod.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Ultimate 25 Teaser */}
      <section style={{ padding: '150px 20px', background: 'linear-gradient(to bottom, var(--elite-dark), #000)' }}>
         <div className="container text-center">
            <h2 style={{ fontSize: '3rem', letterSpacing: '10px', fontWeight: '900', marginBottom: '80px' }}>THE ULTIMATE 25</h2>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: '20px', 
              opacity: 0.2, 
              filter: 'grayscale(1)' 
            }}>
               {["AI-Analyzer", "Quantum-Sim", "Live-Heatmap", "Blood-Nexus", "Bio-Key", "Vault", "Surgical-Flow", "Kiosk-2.0", "Digital-Twin", "Genom-X", "Neuro-Link"].map(n => (
                 <span key={n} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{n}</span>
               ))}
            </div>
            <p style={{ marginTop: '80px', fontSize: '1.2rem', opacity: 0.4 }}>ALL SYSTEMS INTEGRATED INTO THE ELITE PIPELINE</p>
         </div>
      </section>
    </div>
  );
};

export default Home;
