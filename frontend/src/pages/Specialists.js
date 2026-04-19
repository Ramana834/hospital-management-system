import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as api from '../services/api';

const Specialists = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sector = queryParams.get('sector');

  useEffect(() => {
    const fetchSpecialists = async () => {
      setLoading(true);
      try {
        let data;
        if (sector) {
          data = await api.getDoctorsBySpecialization(sector);
        } else {
          data = await api.getAllDoctors();
        }

        if (!data || data.length === 0) {
          data = [
            { id: 'v1', name: 'Dr. Venkat Rao', specialization: sector || 'Global Expert', active: true },
            { id: 'v2', name: 'Dr. Aditi Sharma', specialization: sector || 'Neural Interface', active: false },
            { id: 'v3', name: 'Dr. Rajesh Kumar', specialization: sector || 'Quantum Therapeutics', active: true },
            { id: 'v4', name: 'Dr. Priya Desai', specialization: sector || 'Advanced Cybernetics', active: true }
          ];
        }
        
        setDoctors(data || []);
      } catch (err) {
        console.error('Failed to fetch specialists', err);
        setDoctors([
            { id: 'v1', name: 'Dr. Venkat Rao', specialization: sector || 'Global Expert', active: true },
            { id: 'v2', name: 'Dr. Aditi Sharma', specialization: sector || 'Neural Interface', active: false },
            { id: 'v3', name: 'Dr. Rajesh Kumar', specialization: sector || 'Quantum Therapeutics', active: true },
            { id: 'v4', name: 'Dr. Priya Desai', specialization: sector || 'Advanced Cybernetics', active: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, [sector]);

  return (
    <div className="specialists-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>ELITE CLINICAL NETWORK</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', margin: 0 }}>
            {sector ? `${sector.toUpperCase()} EXPERTS` : 'GLOBAL SPECIALISTS'}
          </h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>
            Direct access to MahaLakshmi's board-certified medical leadership.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="animate-pulse" style={{ letterSpacing: '2px', opacity: 0.5 }}>SYNCHRONIZING EXPERT NODES...</div>
          </div>
        ) : doctors.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {doctors.map((doc, idx) => (
              <div key={doc.id} className="quantum-card elite-glass animate-slide-up" style={{ 
                padding: '0', 
                overflow: 'hidden',
                animationDelay: `${idx * 0.1}s`,
                borderTop: '4px solid var(--neon-blue)'
              }}>
                <div style={{ 
                  height: '160px', 
                  background: 'linear-gradient(to bottom, rgba(0, 242, 254, 0.1), transparent)', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                   <div style={{ 
                     fontSize: '4rem', 
                     filter: 'drop-shadow(0 0 10px var(--neon-blue))'
                   }}>
                     👨‍⚕️
                   </div>
                   <div style={{ 
                     position: 'absolute', 
                     bottom: '15px', 
                     right: '15px',
                     background: doc.active ? 'var(--neon-green)' : 'var(--elite-danger)',
                     padding: '4px 12px',
                     borderRadius: '4px',
                     fontSize: '0.65rem',
                     fontWeight: '900',
                     letterSpacing: '1px',
                     color: 'black'
                   }}>
                     {doc.active ? 'READY' : 'BUSY'}
                   </div>
                </div>

                <div style={{ padding: '30px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>{doc.name}</h3>
                  <p style={{ color: 'var(--neon-blue)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', marginTop: '5px' }}>
                    {doc.specialization.toUpperCase()}
                  </p>
                  
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    opacity: 0.6
                  }}>
                    EXPERIENCE: 12+ YEARS <br/>
                    QUALIFICATIONS: MBBS, MD, BOARD CERTIFIED
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' }}>
                    <Link 
                      to={`/book-appointment?docId=${doc.id}&name=${doc.name}&dept=${doc.specialization}`} 
                      className="btn btn-primary" 
                      style={{ background: 'var(--elite-gradient)', border: 'none', padding: '12px', fontSize: '0.8rem', fontWeight: '900' }}
                    >
                      BOOK SLOT
                    </Link>
                    <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>PROFILE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="quantum-card elite-glass text-center" style={{ padding: '100px 0' }}>
             <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏥</div>
             <h3>NO NODES FOUND IN {sector?.toUpperCase()}</h3>
             <p style={{ opacity: 0.5 }}>The clinical directory is currently being updated.</p>
             <Link to="/sectors" className="btn btn-primary" style={{ marginTop: '20px', background: 'var(--elite-gradient)', border: 'none' }}>BROWSE DEPARTMENTS</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialists;
