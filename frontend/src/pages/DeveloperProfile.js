import React from 'react';

const DeveloperProfile = () => {
  return (
    <div className="developer-profile-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>ELITE SUITE ARCHITECT</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', margin: 0 }}>SYSTEM CORE</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>
            Technical breakdown and architectural vision of the MahaLakshmi Elite Platform.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
           {/* Manifest Section */}
           <div className="quantum-card elite-glass animate-slide-up" style={{ padding: '40px' }}>
              <h2 style={{ letterSpacing: '2px', marginBottom: '25px' }}>DEVELOPER MANIFEST</h2>
              <p style={{ lineHeight: '1.8', opacity: 0.7, fontSize: '1.1rem' }}>
                "The Elite Ultimate 25 suite is more than a hospital management system; it is a bio-digital ecosystem designed for infinite scalability. 
                By leveraging glassmorphism, cryptographic ledgers, and real-time neural mapping, we bridge the gap between clinical excellence and futuristic user experience."
              </p>
              
              <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                 <div className="elite-glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
                    <h4 style={{ margin: 0 }}>PERFORMANCE</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', opacity: 0.5 }}>Zero-dependency CSS animations.</p>
                 </div>
                 <div className="elite-glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⛓️</div>
                    <h4 style={{ margin: 0 }}>INTEGRITY</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', opacity: 0.5 }}>Immutable audit blockchain.</p>
                 </div>
              </div>
           </div>

           {/* Tech Stack Radar */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div className="quantum-card elite-glass animate-slide-up" style={{ padding: '30px', animationDelay: '0.1s' }}>
                 <h3 style={{ letterSpacing: '2px', marginBottom: '20px', fontSize: '1rem' }}>TECHNOLOGY STACK</h3>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {['REACT 18', 'SPRING BOOT 3', 'JAVA 17', 'REST API', 'H2 DATABASE', 'NATIVE CSS', 'SVG OPTICS'].map(tag => (
                      <span key={tag} style={{ 
                        padding: '8px 15px', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '4px', 
                        fontSize: '0.7rem', 
                        fontWeight: '900',
                        letterSpacing: '1px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="quantum-card elite-glass animate-slide-up" style={{ padding: '30px', animationDelay: '0.2s', borderLeft: '5px solid var(--neon-blue)' }}>
                 <h3 style={{ letterSpacing: '2px', marginBottom: '20px', fontSize: '1rem' }}>SECURE CONNECT</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>GITHUB ARCHIVE</span>
                       <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>REPO: ELITE-ULTIMATE-25</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>CONSULTANCY</span>
                       <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>@MAHALAKSHMI-ELITE</span>
                    </div>
                    <button className="btn btn-primary" style={{ marginTop: '10px', background: 'var(--elite-gradient)', border: 'none', padding: '12px', fontWeight: '900', letterSpacing: '2px' }}>
                       INITIATE HANDSHAKE
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;
