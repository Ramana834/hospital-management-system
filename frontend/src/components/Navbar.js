import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'MISSION CONTROL', path: '/command-center' },
    { name: 'EXPERTS', path: '/specialists' },
    { name: 'GENOMICS', path: '/genomics' },
    { name: 'BLOOD NEXUS', path: '/blood-nexus' },
    { name: 'VAULT', path: '/health-vault' },
  ];

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000, 
      background: 'rgba(2, 6, 23, 0.8)', 
      backdropFilter: 'blur(20px)', 
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div className="container" style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Hospital cross icon */}
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(220,38,38,0.4)',
              position: 'relative',
            }}>
              {/* Red cross */}
              <div style={{ position: 'absolute', width: '28px', height: '8px', background: 'white', borderRadius: '2px' }} />
              <div style={{ position: 'absolute', width: '8px', height: '28px', background: 'white', borderRadius: '2px' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{
                fontSize: '1.15rem',
                fontWeight: '900',
                color: 'white',
                letterSpacing: '1.5px',
                whiteSpace: 'nowrap',
              }}>
                MahaLakshmi
              </div>
              <div style={{
                fontSize: '0.62rem',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '1.5px',
                whiteSpace: 'nowrap',
              }}>
                MULTI SPECIALITY HOSPITAL
              </div>
              <div style={{
                fontSize: '0.5rem',
                fontWeight: '800',
                color: 'var(--neon-blue)',
                letterSpacing: '3px',
                marginTop: '1px',
              }}>
                ELITE SUITE
              </div>
            </div>
          </Link>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div className="nav-links" style={{ display: 'flex', gap: '25px' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '0.75rem', 
                  fontWeight: '900', 
                  color: location.pathname === link.path ? 'var(--neon-blue)' : 'rgba(255,255,255,0.6)',
                  letterSpacing: '2px',
                  transition: 'all 0.3s ease'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={toggleLanguage} style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '6px 12px', 
              color: 'white', 
              fontSize: '0.7rem', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              {language === 'en' ? 'తెలుగు' : 'ENGLISH'}
            </button>
            <Link to="/patient-login" className="btn btn-primary" style={{ 
              background: 'var(--elite-gradient)', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: 'white',
              textDecoration: 'none'
            }}>
              PORTAL
            </Link>
            <Link to="/emergency" style={{ 
              background: 'var(--elite-danger)', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontSize: '0.75rem', 
              fontWeight: '900', 
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
            }}>
              SOS
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
