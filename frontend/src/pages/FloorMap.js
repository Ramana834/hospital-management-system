import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FloorMap = () => {
  const { language, t } = useLanguage();
  const [floor, setFloor] = useState(2);
  const [activeWard, setActiveWard] = useState('ICU');
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    // Simulate real-time bed data
    const newBeds = [...Array(12)].map((_, i) => ({
      id: `B${floor}-${i + 1}`,
      status: Math.random() > 0.7 ? 'Occupied' : (Math.random() > 0.5 ? 'Cleaning' : 'Available'),
      patient: Math.random() > 0.7 ? 'Patient #' + (1000 + i) : null
    }));
    setBeds(newBeds);
  }, [floor, activeWard]);

  const wards = ['ICU', 'General', 'Private', 'Surgical'];

  return (
    <div className="map-view" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>HOSPITAL DIGITAL TWIN v2.0</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4rem', margin: 0 }}>SMART BED MANAGEMENT</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Real-time Occupancy & IoT Asset Tracking Across All Floors</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '40px' }}>
          {/* Controls */}
          <div className="quantum-card elite-glass" style={{ padding: '30px', height: 'fit-content' }}>
            <h4 style={{ letterSpacing: '2px', marginBottom: '25px' }}>FLOOR SELECTOR</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
              {[1, 2, 3, 4].map(f => (
                <button 
                  key={f} 
                  onClick={() => setFloor(f)} 
                  style={{ 
                    padding: '15px', 
                    background: floor === f ? 'var(--elite-gradient)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: '0.3s',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  Floor {f}
                  {floor === f && <span>ACTIVE</span>}
                </button>
              ))}
            </div>

            <h4 style={{ letterSpacing: '2px', marginBottom: '25px' }}>WARD CATEGORY</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {wards.map(w => (
                <button 
                  key={w} 
                  onClick={() => setActiveWard(w)} 
                  style={{ 
                    padding: '12px', 
                    background: activeWard === w ? 'var(--neon-blue)' : 'transparent',
                    border: `1px solid ${activeWard === w ? 'var(--neon-blue)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px',
                    color: activeWard === w ? 'black' : 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Bed Grid Visualization */}
          <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
               <h3 style={{ margin: 0 }}>BLOCK A - FLOOR {floor} - {activeWard.toUpperCase()}</h3>
               <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--neon-green)' }}></span> Available
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--elite-danger)' }}></span> Occupied
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#facc15' }}></span> Cleaning
                  </div>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
               {beds.map((bed, i) => (
                 <div key={i} className="animate-fade-in" style={{ 
                   padding: '25px', 
                   background: 'rgba(255,255,255,0.03)', 
                   border: `1px solid ${bed.status === 'Occupied' ? 'var(--elite-danger)' : (bed.status === 'Cleaning' ? '#facc15' : 'var(--neon-green)')}`,
                   borderRadius: '16px',
                   textAlign: 'center',
                   transition: '0.3s',
                   cursor: 'pointer'
                 }}>
                   <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                     {bed.status === 'Occupied' ? '🛌' : (bed.status === 'Cleaning' ? '🧹' : '✨')}
                   </div>
                   <h4 style={{ margin: '0 0 5px', fontSize: '1rem' }}>{bed.id}</h4>
                   <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.5, letterSpacing: '1px' }}>{bed.status.toUpperCase()}</p>
                   {bed.patient && (
                     <div style={{ marginTop: '15px', padding: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {bed.patient}
                     </div>
                   )}
                 </div>
               ))}
            </div>

            <div className="elite-glass" style={{ marginTop: '40px', padding: '25px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px dashed rgba(255,255,255,0.2)' }}>
               <div style={{ fontSize: '2rem' }}>📡</div>
               <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0 }}>IoT Asset Tracking Active</h4>
                  <p style={{ margin: '5px 0 0', opacity: 0.6, fontSize: '0.8rem' }}>Monitoring 452 medical assets on this floor including ventilators and infusion pumps.</p>
               </div>
               <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>VIEW ASSETS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorMap;
