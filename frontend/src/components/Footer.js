import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="brand-logo footer-icon">MH</span>
            <h2>MahaLakshmi Hospital</h2>
          </div>
          <p className="footer-desc">
            Empowering healthcare with advanced AI, compassionate clinical care, and a complete fully-integrated multi-speciality environment.
          </p>
          <div className="contact-info">
            <p><strong>Emergency:</strong> +91 1066</p>
            <p><strong>Enquiries:</strong> 1800-123-4567</p>
            <p><strong>Email:</strong> care@mahalakshmi.com</p>
          </div>
        </div>

        <div className="footer-links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/book-appointment">Book Appointment</Link></li>
            <li><Link to="/sectors">Clinical Departments</Link></li>
            <li><Link to="/patient-login">Patient Portal</Link></li>
            <li><Link to="/doctor-login">Doctor Portal</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h3>Centres of Excellence</h3>
          <ul>
            <li>Cardiology & Thoracic Care</li>
            <li>Neurosciences & Stroke Unit</li>
            <li>Orthopaedics & Joint Replacement</li>
            <li>Oncology & Precision Therapy</li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h3>Legal & Info</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <p>&copy; {new Date().getFullYear()} MahaLakshmi Multi Speciality Hospital. All Rights Reserved.</p>
            <p className="legal-disclaimer" style={{ marginTop: '5px' }}>
              The information on this website is for reference only and is not a substitute for professional medical advice.
            </p>
          </div>
          <div className="developer-credit" style={{ textAlign: 'right', marginTop: '10px' }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Designed & Developed by</p>
            <h4 style={{ margin: 0, color: 'var(--primary-300)', fontWeight: '600' }}>Full Stack Developer</h4>
            <Link to="/developer" style={{ fontSize: '0.8rem', color: '#cbd5e1', textDecoration: 'underline' }}>View Portfolio & Credentials</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
