import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BlockchainAudit = () => {
  const { language, t } = useLanguage();
  const [blocks, setBlocks] = useState([
    { id: "0xf12a...88a4", type: "DATA_SET", user: "Dr. Karthik Rao", timestamp: "10:02:11", status: "VERIFIED", hash: "88a4c21b93f" },
    { id: "0x3e1b...22bf", type: "ENCRYPTION", user: "System Core", timestamp: "09:45:00", status: "VERIFIED", hash: "22bf91a33d2" },
    { id: "0x88d4...7c41", type: "SYNC", user: "IoT Wearable", timestamp: "09:30:12", status: "VERIFIED", hash: "7c41e0b55a8" }
  ]);
  const [activeNodes, setActiveNodes] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlock = {
        id: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        type: Math.random() > 0.6 ? "ACCESS_GRANT" : "DATA_SYMMETRY",
        user: Math.random() > 0.5 ? "MH-AI Core" : "Dr. Sneha",
        timestamp: new Date().toLocaleTimeString(),
        status: "VERIFIED",
        hash: Math.random().toString(16).substr(2, 11)
      };
      setBlocks(prev => [newBlock, ...prev].slice(0, 8));
      setActiveNodes(prev => prev > 15 ? 12 : prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="blockchain-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ 
            display: 'inline-block', 
            padding: '80x 25px', 
            background: 'rgba(0, 242, 254, 0.1)', 
            border: '1px solid var(--neon-blue)', 
            borderRadius: '2px', 
            color: 'var(--neon-blue)', 
            fontWeight: '900', 
            fontSize: '0.7rem', 
            letterSpacing: '4px',
            marginBottom: '20px',
            padding: '5px 15px'
          }}>
            PROTOCOL: SHIELD-X9
          </div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', marginBottom: '10px' }}>
            {t('ultimate.blockchain') || 'Blockchain Audit'}
          </h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem' }}>Automated Cryptographic Validation of Clinical Transactions</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px' }}>
           {/* Ledger Feed */}
           <div className="quantum-card elite-glass" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ 
                padding: '25px', 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                 <h3 style={{ margin: 0, letterSpacing: '2px' }}>LIVE IMMUTABLE LEDGER</h3>
                 <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', animation: 'heartbeat 1.5s infinite' }}></span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>SYNCING</span>
                 </div>
              </div>
              <div style={{ minHeight: '520px' }}>
                 {blocks.map((b, i) => (
                    <div key={b.id} className="animate-fade-in" style={{ 
                      padding: '20px 30px', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: i === 0 ? 'rgba(0, 242, 254, 0.02)' : 'transparent'
                    }}>
                       <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            borderRadius: '8px'
                          }}>
                             {b.type.includes('ACCESS') ? '🔑' : '📑'}
                          </div>
                          <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{b.type}</p>
                                <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>UID: {b.id}</span>
                             </div>
                             <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--neon-blue)', fontWeight: 'bold' }}>{b.user.toUpperCase()}</p>
                          </div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.4 }}>HASH: {b.hash}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '5px' }}>
                             <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>{b.status}</span>
                             <span style={{ width: '6px', height: '6px', background: 'var(--neon-green)', borderRadius: '50%' }}></span>
                          </div>
                       </div>
                    </div>
                 ))}
                 {blocks.length === 0 && (
                   <div style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>
                      <p>Awaiting network initialization...</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Security Panels */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="quantum-card elite-glass" style={{ padding: '30px' }}>
                 <p style={{ margin: 0, opacity: 0.6, fontSize: '0.7rem', letterSpacing: '2px' }}>ENCRYPTION STRENGTH</p>
                 <h2 style={{ fontSize: '3.5rem', margin: '10px 0', fontWeight: '900' }} className="elite-text-gradient">SHA-512</h2>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--neon-blue)' }}>Quantum-Resistant Ledger Layer</p>
                 <div style={{ marginTop: '20px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'var(--elite-gradient)' }}></div>
                 </div>
              </div>

              <div className="quantum-card elite-glass" style={{ padding: '30px' }}>
                 <h4 style={{ margin: '0 0 20px', letterSpacing: '2px' }}>NETWORK CONSENSUS</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    {[...Array(12)].map((_, i) => (
                       <div key={i} style={{ 
                         width: '100%', 
                         height: '40px', 
                         background: i < activeNodes ? 'var(--neon-green)' : 'rgba(255,255,255,0.05)', 
                         borderRadius: '8px', 
                         opacity: i < activeNodes ? 0.8 : 0.2,
                         boxShadow: i < activeNodes ? '0 0 10px var(--neon-green)' : 'none',
                         transition: 'all 0.5s ease'
                       }}></div>
                    ))}
                 </div>
                 <p style={{ marginTop: '20px', fontSize: '0.85rem', opacity: 0.7 }}>
                  {activeNodes}/12 High-Priority Data Centers Synchronized Across States (TS/AP).
                 </p>
              </div>

              <div className="quantum-card elite-glass" style={{ padding: '30px', border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'center' }}>
                 <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📜</div>
                 <h4 style={{ marginBottom: '10px' }}>GENERATE PROOF</h4>
                 <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '20px' }}>
                    Cryptographic signature of patient record integrity for legal & insurance verification.
                 </p>
                 <button className="btn btn-primary" style={{ width: '100%', background: 'var(--elite-purple)', border: 'none' }}>REQUEST SIGNED CERTIFICATE</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainAudit;
