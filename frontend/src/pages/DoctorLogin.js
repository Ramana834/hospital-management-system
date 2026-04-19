import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './AuthCore.css';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/doctors/login', { username: email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', 'DOCTOR');
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-panel animate-fade-in" style={{ borderTop: '4px solid var(--teal-500)' }}>
        <div className="auth-header">
          <h2>Doctor Portal Login</h2>
          <p>Access your schedule and patient profiles.</p>
        </div>

        {error && <div className="disclaimer-alert" style={{marginBottom: '16px', borderLeftColor: 'var(--danger-500)'}}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Professional Email</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. dr.karthik@mahalakshmi.health" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot" className="forgot-link">Forgot Password?</a>
          </div>
          
          <button type="submit" className="btn w-100 btn-lg" style={{ marginTop: '16px', background: 'var(--teal-600)', color: 'white' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Workspace'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>New Specialist? <Link to="/doctor-register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
