import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Genomics = () => {
  const { language, t } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadedFile(file);
    startDNAAnalysis(file.name.toLowerCase());
  };

  const startDNAAnalysis = (filename) => {
    setIsAnalyzing(true);
    setReport(null);
    
    // Determine the report style based on the uploaded file name
    let mockReport = {
      score: "96/100",
      traits: [
        { name: "Metabolic Efficiency", risk: "Optimal", insight: "High metabolic rate, efficient glucose processing." },
        { name: "Cardiac Resilience", risk: "High", insight: "Low genetic markers for arterial inflammation." },
        { name: "Neurological Health", risk: "Optimal", insight: "Superior cognitive preservation markers detected." },
        { name: "Muscle Recovery", risk: "Fast", insight: "ACTN3 gene variant indicates elite recovery potential." }
      ],
      scoreColor: "var(--neon-green)",
      aiInsight: "Based on your genomic data, you have a 92% higher resilience to systemic oxidative stress than the average population."
    };

    if (filename.includes('cancer') || filename.includes('onco')) {
       mockReport = {
         score: "82/100",
         traits: [
           { name: "BRCA1 / BRCA2", risk: "Negative", insight: "No deleterious mutations detected in breast cancer susceptibility genes." },
           { name: "TP53 Mutation", risk: "Clear", insight: "Tumor protein p53 shows normal wild-type sequencing." },
           { name: "Skin Sensitivity", risk: "Moderate", insight: "Slightly elevated risk for UV-induced damage." },
           { name: "Cellular Repair", risk: "Optimal", insight: "Mismatch repair genes functioning efficiently." }
         ],
         scoreColor: "#ffaa00",
         aiInsight: "Your oncology genetic screening indicates no severe hereditary cancer markers. Regular standard-of-care screening is recommended."
       };
    } else if (filename.includes('blood') || filename.includes('hema')) {
       mockReport = {
         score: "89/100",
         traits: [
           { name: "Iron Absorption", risk: "Elevated", insight: "Genetic predisposition to absorb iron faster than average (HFE gene)." },
           { name: "Hemoglobin S", risk: "Negative", insight: "No sickle cell trait detected." },
           { name: "Clotting Factor", risk: "Normal", insight: "Factor V Leiden mutation not present." },
           { name: "Vitamin B12", risk: "Low", insight: "MTHFR mutation detected, affecting B12 processing." }
         ],
         scoreColor: "#00ccff",
         aiInsight: "Hematological screening indicates a potential need for methylated Vitamin B12 supplements. Oxygen transport is otherwise exceptional."
       };
    }

    setTimeout(() => {
      setReport(mockReport);
      setIsAnalyzing(false);
    }, 3500);
  };

  return (
    <div className="genomics-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fade-in">
          <div className="elite-text-gradient" style={{ fontSize: '1rem', letterSpacing: '4px', marginBottom: '20px' }}>PRECISION MEDICINE v4.0</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', marginBottom: '10px' }}>
            {t('ultimate.genomics') || "GENOMIC PROFILE"}
          </h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem' }}>Upload DNA reports to analyze sample-specific epigenetic blueprints.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '40px' }}>
           <div className="quantum-card elite-glass" style={{ padding: '40px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '40px', letterSpacing: '2px' }}>DNA SEQUENCE UPLOAD</h3>
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg viewBox="0 0 100 300" style={{ height: '100%', width: '120px' }}>
                  {[...Array(20)].map((_, i) => {
                    const y = i * 15 + 10;
                    const angle = (rotation + i * 20) * (Math.PI / 180);
                    const x1 = 50 + Math.cos(angle) * 35;
                    const x2 = 50 - Math.cos(angle) * 35;
                    const opacity = (Math.sin(angle) + 1.5) / 2.5;
                    
                    return (
                      <g key={i} style={{ opacity }}>
                        <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <circle cx={x1} cy={y} r="3" fill="var(--neon-blue)" />
                        <circle cx={x2} cy={y} r="3" fill="var(--neon-purple)" />
                      </g>
                    );
                  })}
                </svg>
                {isAnalyzing && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '2px', 
                    background: 'var(--neon-blue)', 
                    boxShadow: '0 0 15px var(--neon-blue)',
                    animation: 'scanning 2s infinite linear' 
                  }}></div>
                )}
              </div>
              
              <div style={{ marginTop: '30px' }}>
                {uploadedFile && (
                  <p style={{ margin: '10px 0', fontSize: '0.9rem', color: 'var(--neon-blue)' }}>
                    {uploadedFile.name}
                  </p>
                )}
                <input 
                  type="file" 
                  accept=".txt,.pdf,.csv,.json" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <button 
                  className="btn btn-primary" 
                  style={{ 
                    width: '100%', 
                    background: isAnalyzing ? 'rgba(255,255,255,0.1)' : 'var(--elite-gradient)', 
                    border: 'none',
                    padding: '15px' 
                  }} 
                  onClick={() => fileInputRef.current.click()} 
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "SEQUENCING SAMPLE..." : "UPLOAD LAB SAMPLE REPORT"}
                </button>
              </div>
           </div>

           <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
              <h3 style={{ marginBottom: '30px', letterSpacing: '2px' }}>EPIGENETIC ANALYTICS REPORT</h3>
              {!report && !isAnalyzing && (
                <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.3 }}>
                   <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔬</div>
                   <p>Waiting for secure genetic sample upload...</p>
                </div>
              )}
              {isAnalyzing && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} style={{ height: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', animation: 'pulse-glow 1.5s infinite', animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                 </div>
              )}
              {report && (
                <div className="animate-fade-in">
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                      <div>
                        <p style={{ opacity: 0.6, margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>BIOGENETIC SCORE</p>
                        <h2 style={{ fontSize: '4rem', color: report.scoreColor, margin: 0, fontWeight: '900' }}>{report.score}</h2>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ padding: '5px 15px', background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold' }}>VERIFIED</span>
                      </div>
                   </div>
                   <div style={{ display: 'grid', gap: '20px' }}>
                      {report.traits.map((t, i) => (
                        <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: report.scoreColor }}></span>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, letterSpacing: '1px' }}>{t.name.toUpperCase()}</p>
                              </div>
                              <p style={{ margin: 0, fontWeight: '500', fontSize: '1.1rem' }}>{t.insight}</p>
                           </div>
                           <div style={{ textAlign: 'center', minWidth: '80px' }}>
                              <div style={{ fontSize: '0.65rem', opacity: 0.4, marginBottom: '5px' }}>STATUS</div>
                              <span style={{ color: report.scoreColor, fontWeight: '800' }}>{t.risk.toUpperCase()}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', borderLeft: `4px solid ${report.scoreColor}` }}>
                      <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.8 }}><strong>AI Prediction:</strong> {report.aiInsight}</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Genomics;
