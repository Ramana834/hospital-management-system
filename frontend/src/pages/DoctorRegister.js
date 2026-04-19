import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './AuthCore.css';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.registerDoctor(formData);
      alert('Application submitted! Please login to your workspace.');
      navigate('/doctor-login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check your professional details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-panel animate-fade-in" style={{ maxWidth: '600px', borderTop: '4px solid var(--teal-500)' }}>
        <div className="auth-header">
          <h2>Specialist Registration</h2>
          <p>Apply for clinical access at MahaLakshmi Hospital.</p>
        </div>
        
        {error && <div className="disclaimer-alert" style={{ marginBottom: '16px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Full Name (with Title)</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Dr. John Doe" required />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="form-input" required>
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} className="form-input" placeholder="+91 XXXX XXXX" required />
          </div>
          
          <div className="form-group">
            <label>Professional Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="doctor@hospital.com" required />
          </div>
          
          <div className="form-group">
            <label>Create Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-input" placeholder="Enter password" required />
          </div>
          
          <button type="submit" disabled={loading} className="btn w-100 btn-lg" style={{ marginTop: '16px', background: 'var(--teal-600)', color: 'white' }}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already registered? <Link to="/doctor-login">Login to Workspace</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
