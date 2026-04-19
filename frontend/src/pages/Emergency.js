import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { triggerEmergency } from '../services/api';
import './AuthCore.css';

const Emergency = () => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await triggerEmergency({
        patientName: formData.name,
        contactNumber: formData.phone,
        location: formData.location,
        description: formData.type,
        status: 'active'
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      console.error('Emergency dispatch failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-wrapper" style={{ background: '#fef2f2', minHeight: '100vh', padding: '40px 0' }}>
        <div className="auth-container animate-fade-in" style={{ maxWidth: '800px', textAlign: 'center', borderTop: '4px solid var(--danger-600)', background: 'white', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🚑</div>
          <h2 style={{ color: 'var(--danger-700)', fontSize: '2rem' }}>Ambulance Dispatched!</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Emergency Team Alpha-4 is on the way to <strong>{formData.location}</strong></p>
          
          {/* Simulated Map */}
          <div className="geo-tracker" style={{ 
            height: '300px', 
            background: '#e2e8f0', 
            borderRadius: '16px', 
            margin: '30px 0', 
            position: 'relative', 
            overflow: 'hidden',
            border: '2px solid #cbd5e1'
          }}>
            {/* Grid Pattern Background */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Roads Simulation */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '40px', background: '#94a3b8' }}></div>
            <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '40px', background: '#94a3b8' }}></div>
            
            {/* Destination Marker */}
            <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
              <div style={{ fontSize: '2rem' }}>🏠</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#1e293b' }}>PICKUP POINT</div>
            </div>

            {/* Moving Ambulance */}
            <div className="ambulance-move" style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '0', 
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              fontSize: '2.5rem'
            }}>
              🚑
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                width: '60px', 
                height: '60px', 
                background: 'rgba(239, 68, 68, 0.2)', 
                borderRadius: '50%', 
                transform: 'translate(-50%, -50%)',
                animation: 'radar 2s infinite'
              }}></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div className="glass-panel" style={{ padding: '15px', background: '#fff' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>ETA</p>
              <h4 style={{ margin: 0, color: 'var(--danger-600)' }}>8 mins</h4>
            </div>
            <div className="glass-panel" style={{ padding: '15px', background: '#fff' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Distance</p>
              <h4 style={{ margin: 0 }}>4.2 km</h4>
            </div>
            <div className="glass-panel" style={{ padding: '15px', background: '#fff' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Unit</p>
              <h4 style={{ margin: 0 }}>ADV-34</h4>
            </div>
          </div>

          <p style={{ marginTop: '30px', fontWeight: 'bold' }}>Please keep your phone line clear. Our paramedics will call you shortly.</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Home</button>
            <button className="btn btn-danger" style={{ background: '#b91c1c' }}>Call Dispatch 1066</button>
          </div>
        </div>

        <style>{`
          @keyframes radar {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }
          .ambulance-move {
            animation: drive 10s linear forwards;
          }
          @keyframes drive {
            0% { left: 0%; }
            100% { left: 63%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-wrapper" style={{ background: '#fef2f2' }}>
      <div className="auth-container animate-fade-in" style={{ maxWidth: '650px', borderTop: '4px solid var(--danger-600)', background: 'white' }}>
        <div className="auth-header">
          <h2 style={{ color: 'var(--danger-700)' }}>Emergency Fast Track</h2>
          <p>Immediate triage and ambulance dispatch. Call 1066 for immediate phone support.</p>
        </div>
        
        <form className="auth-form" onSubmit={handleDispatch}>
          <div className="form-group">
            <label>Nature of Emergency</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-input" 
              required 
              style={{ border: '2px solid var(--danger-400)', background: '#fff' }}
            >
              <option value="">Select Severity / Type</option>
              <option value="Cardiac Arrest">Cardiac Arrest / Heart Attack</option>
              <option value="Trauma / Accident">Severe Trauma / Road Accident</option>
              <option value="Stroke">Stroke / Loss of Consciousness</option>
              <option value="Breathing">Severe Breathing Difficulty</option>
              <option value="Other">Other Life Threatening</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Contact Name</label>
              <input 
                name="name"
                type="text" 
                value={formData.name}
                onChange={handleInputChange}
                className="form-input" 
                placeholder="Your Name" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input 
                name="phone"
                type="tel" 
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input" 
                placeholder="+91 XXXX XXXX" 
                required 
                style={{ border: '1px solid var(--danger-400)' }} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pickup Location / Address</label>
            <textarea 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input" 
              rows="2" 
              placeholder="Provide accurate landmark details for Ambulance" 
              required
            ></textarea>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-danger w-100 btn-lg" style={{ marginTop: '16px', fontSize: '1.2rem', padding: '16px' }}>
            {loading ? 'DISPATCHING...' : 'DISPATCH AMBULANCE NOW'}
          </button>
        </form>
        
        <div className="auth-footer" style={{ borderTop: 'none', background: '#fef2f2', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
          <p style={{ margin: 0, fontWeight: '700', color: 'var(--danger-700)' }}>Do not use this for general appointments. <Link to="/book-appointment">Book normally here.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
