import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './AuthCore.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.loginAdmin(formData);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid Administrator Credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: '#0f172a' }}>
      <div className="auth-container animate-fade-in" style={{ borderTop: '4px solid var(--danger-500)', background: '#1e293b' }}>
        <div className="auth-header" style={{ color: 'white' }}>
          <h2 style={{ color: 'white' }}>System Administrator</h2>
          <p style={{ color: '#94a3b8' }}>Secure command center access.</p>
        </div>
        
        {error && <div className="disclaimer-alert" style={{ marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-500)' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ color: '#e2e8f0' }}>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="Enter admin username" 
              style={{ background: '#0f172a', color: 'white', borderColor: '#334155' }} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label style={{ color: '#e2e8f0' }}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input" 
              placeholder="Enter password" 
              style={{ background: '#0f172a', color: 'white', borderColor: '#334155' }} 
              required 
            />
          </div>
          
          <div className="auth-options" style={{ color: '#e2e8f0' }}>
            <label className="checkbox-label" style={{ color: '#e2e8f0' }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot" className="forgot-link" style={{ color: 'var(--primary-400)' }}>Authentication Help?</a>
          </div>
          
          <button type="submit" disabled={loading} className="btn w-100 btn-lg" style={{ marginTop: '16px', background: 'var(--danger-600)', color: 'white' }}>
            {loading ? 'Authenticating...' : 'Enter Command Center'}
          </button>
        </form>
        
        <div className="auth-footer" style={{ borderTopColor: '#334155' }}>
          <p style={{ color: '#94a3b8' }}>Return to <Link to="/" style={{ color: 'var(--primary-400)' }}>Public Site</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
