import React from 'react';

export default function ClinicalSafety() {
  return (
    <div style={{ padding: '80px 20px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="elite-text-gradient" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>CLINICAL SAFETY</h1>
        <p style={{ opacity: 0.6, fontSize: '1.2rem', marginBottom: '50px' }}>MahaLakshmi Compliance & Regulatory Standards.</p>

        <div className="quantum-card elite-glass" style={{ padding: '40px', textAlign: 'left', marginBottom: '30px' }}>
           <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Data Privacy & Compliance</h3>
           <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
             All patient records, test results, and virtual consultations are protected under the strict 
             guidelines of the National Clinical Data Protection Act.
           </p>
           <ul style={{ lineHeight: '2', opacity: 0.8, marginTop: '20px' }}>
             <li>End-to-End Encryption for all Telemedicine streams.</li>
             <li>Zero-knowledge architecture for the decentralized Health Vault.</li>
             <li>Daily automated blockchain audits on administrative actions.</li>
           </ul>
        </div>

        <div className="quantum-card elite-glass" style={{ padding: '40px', textAlign: 'left' }}>
           <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Clinical Disclaimer</h3>
           <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
             The Quantum Health Sim and AI Analyzer modules are auxiliary diagnostic tools. They 
             are <strong>not replacements</strong> for professional medical consultation. MahaLakshmi 
             Multi Speciality Hospital ensures that all AI-generated reports are verified by a 
             board-certified physician before final issuance.
           </p>
        </div>
      </div>
    </div>
  );
}
