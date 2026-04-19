import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginPatient } from '../services/api';
import './AuthCore.css';

const PatientLogin = () => {
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
      const response = await loginPatient({ username: email, password });
      if (response.token) {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-panel animate-fade-in">
        <div className="auth-header">
          <h2>Patient Portal Login</h2>
          <p>Access your digital health records securely.</p>
        </div>
        
        {error && <div className="disclaimer-alert" style={{marginBottom: '16px'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Patient ID / Email</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your registered ID" 
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
          
          <button type="submit" className="btn btn-primary w-100 btn-lg" style={{ marginTop: '16px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/patient-register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
