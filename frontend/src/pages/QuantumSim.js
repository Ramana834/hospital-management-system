import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const QuantumSim = () => {
  const { language, t } = useLanguage();
  const [variables, setVariables] = useState({
    weight: 75,
    sleep: 7,
    exercise: 3,
    stress: 5
  });
  const [projections, setProjections] = useState({ lifeExpectancy: 82, wellnessTrend: 'Positive' });
  const [quantumDeformation, setQuantumDeformation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumDeformation(prev => (prev + 0.05) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const baseLife = 75;
    const weightImpact = variables.weight > 90 ? -5 : variables.weight < 65 ? -2 : 5;
    const sleepImpact = variables.sleep < 6 ? -4 : variables.sleep > 8 ? 2 : 5;
    const dailyExerciseImpact = variables.exercise * 2;
    const stressImpact = (10 - variables.stress) * 0.5;
    
    setProjections({
      lifeExpectancy: baseLife + weightImpact + sleepImpact + dailyExerciseImpact + stressImpact,
      wellnessTrend: dailyExerciseImpact > 5 ? 'OPTIMAL' : 'STEADY'
    });
  }, [variables]);

  return (
    <div className="quantum-sim-page" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--neon-blue)', marginBottom: '15px', fontWeight: '900' }}>NEURAL PROJECTION ENGINE v4.0</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', margin: 0 }}>QUANTUM HEALTH HUB</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Simulate biophysical outcomes based on multidimensional lifestyle parameters.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '40px' }}>
          {/* Controls */}
          <div className="quantum-card elite-glass" style={{ padding: '40px' }}>
             <h3 style={{ letterSpacing: '2px', marginBottom: '40px' }}>LIFESTYLE INPUTS</h3>
             
             {[
               { id: 'weight', label: 'BODY MASS INDEX', min: 40, max: 150, unit: 'KG', color: 'var(--neon-blue)' },
               { id: 'sleep', label: 'REGENERATIVE SLEEP', min: 3, max: 12, unit: 'HR', color: 'var(--neon-purple)' },
               { id: 'exercise', label: 'PHYSICAL ACTIVITY', min: 0, max: 7, unit: 'DAYS', color: 'var(--neon-green)' },
               { id: 'stress', label: 'CORTISOL LOAD', min: 1, max: 10, unit: 'LVL', color: '#f43f5e' }
             ].map((v) => (
               <div key={v.id} style={{ marginBottom: '35px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.7 }}>{v.label}</label>
                    <span style={{ fontWeight: '900', color: v.color }}>{variables[v.id]} {v.unit}</span>
                 </div>
                 <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <input 
                      type="range" 
                      min={v.min} 
                      max={v.max} 
                      value={variables[v.id]} 
                      onChange={(e) => setVariables({...variables, [v.id]: parseInt(e.target.value)})} 
                      style={{ 
                        position: 'absolute', 
                        width: '100%', 
                        top: 0, 
                        left: 0, 
                        opacity: 0, 
                        cursor: 'pointer',
                        zIndex: 2
                      }} 
                    />
                    <div style={{ 
                      width: `${((variables[v.id] - v.min) / (v.max - v.min)) * 100}%`, 
                      height: '100%', 
                      background: v.color, 
                      borderRadius: '3px',
                      boxShadow: `0 0 10px ${v.color}`
                    }} />
                 </div>
               </div>
             ))}
          </div>

          {/* Projection Display */}
          <div className="quantum-card elite-glass" style={{ padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ letterSpacing: '2px', marginBottom: '20px' }}>PROJECTED LONGEVITY</h3>
                <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {/* Animated Background Rings */}
                   <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--neon-blue)" strokeWidth="0.2" />
                      <circle cx="50" cy="50" r="30" fill="none" stroke="var(--neon-blue)" strokeWidth="0.2" />
                      <path d={`M 50 10 A 40 40 0 0 1 ${50 + Math.sin(quantumDeformation) * 40} ${50 - Math.cos(quantumDeformation) * 40}`} fill="none" stroke="var(--neon-blue)" strokeWidth="1" />
                   </svg>

                   <div style={{ fontSize: '8rem', fontWeight: '900' }} className="elite-text-gradient">
                     {Math.floor(projections.lifeExpectancy)}
                     <span style={{ fontSize: '1.5rem', display: 'block', opacity: 0.5, letterSpacing: '4px', marginTop: '-10px' }}>YEARS</span>
                   </div>
                </div>

                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '25px', 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginTop: '20px' 
                }}>
                   <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' }}>WELLNESS GRADIENT</p>
                   <h2 style={{ margin: '10px 0', color: 'var(--neon-green)', letterSpacing: '5px' }}>{projections.wellnessTrend}</h2>
                   <p style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic', marginTop: '15px' }}>
                     "Quantum data suggests that optimizing sleep could potentially neutralize cumulative stress markers by 14.2%."
                   </p>
                </div>

                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   <button className="btn btn-primary" style={{ background: 'var(--elite-purple)', border: 'none', padding: '15px' }}>EXPORT BIOMAP</button>
                   <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>RESET ENGINE</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSim;
