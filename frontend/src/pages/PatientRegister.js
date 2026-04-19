import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './AuthCore.css';

const PatientRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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

    const patientData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact: formData.phone,
      password: formData.password,
      role: 'PATIENT'
    };

    try {
      await api.registerPatient(patientData);
      alert('Registration successful! Please login to your portal.');
      navigate('/patient-login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h2>Create Patient Profile</h2>
          <p>Join MahaLakshmi Hospital for seamless healthcare.</p>
        </div>
        
        {error && <div className="disclaimer-alert" style={{ marginBottom: '16px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" placeholder="First Name" required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" placeholder="Last Name" required />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="patient@example.com" required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="+91 00000 00000" required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-input" placeholder="Create a secure password" required />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary w-100 btn-lg" style={{ marginTop: '16px' }}>
            {loading ? 'Processing...' : 'Register Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/patient-login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
