import React from 'react';
import { Link } from 'react-router-dom';
import './HospitalSectors.css';

const HospitalSectors = () => {
  const sectors = [
    { name: 'Cardiology', desc: 'Advanced heart care, angioplasty, and cardiothoracic surgeries.', icon: '❤️' },
    { name: 'Neurology', desc: 'Comprehensive care for stroke, epilepsy, and neuro-disorders.', icon: '🧠' },
    { name: 'Orthopedics', desc: 'Joint replacement, trauma care, and sports medicine.', icon: '🦴' },
    { name: 'Oncology', desc: 'State-of-the-art cancer treatment and chemotherapy.', icon: '🎗️' },
    { name: 'Pediatrics', desc: 'Specialized care for infants, children, and adolescents.', icon: '👶' },
    { name: 'Radiology', desc: 'Advanced imaging including MRI, CT, and Ultrasound.', icon: '☢️' },
    { name: 'Gastroenterology', desc: 'Treatment for digestive system and liver disorders.', icon: '🩺' },
    { name: 'General Medicine', desc: 'Minimally invasive and laparoscopic surgical procedures.', icon: '🏥' }
  ];

  return (
    <div className="sectors-wrapper">
      <div className="sectors-header glass-panel animate-fade-in">
        <h1>Centres of Excellence</h1>
        <p>Explore our specialized medical departments equipped with world-class technology and highly experienced clinicians.</p>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="sectors-grid">
          {sectors.map((sec, idx) => (
            <div key={idx} className="sector-card">
              <div className="sector-icon">{sec.icon}</div>
              <h3>{sec.name}</h3>
              <p>{sec.desc}</p>
              <Link 
                to={`/specialists?sector=${sec.name}`} 
                className="btn btn-outline" 
                style={{ marginTop: '16px', width: '100%' }}
              >
                View Specialists
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalSectors;
