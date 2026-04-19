import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const AIAnalyzer = () => {
  const { language: currentLang } = useLanguage();
  const [activeType, setActiveType] = useState('xray');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanLine, setScanLine] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(() => {
        setScanLine(prev => (prev >= 100 ? 0 : prev + 2));
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const scanTypes = [
    { id: 'xray',         label: 'X-RAY SCAN',      icon: '🦴', accept: 'image/*' },
    { id: 'prescription', label: 'PRESCRIPTION',     icon: '💊', accept: 'image/*,.pdf' },
    { id: 'report',       label: 'LAB REPORT',       icon: '🧪', accept: 'image/*,.pdf' },
  ];

  const mockResults = {
    en: {
      xray: {
        title: 'X-Ray Radiological Analysis',
        confidence: '97.4%',
        badge: 'MINOR FINDING',
        badgeColor: '#f59e0b',
        findings: [
          { icon: '🦴', label: 'Bone Density', value: 'Normal — T-score: -0.8' },
          { icon: '🫁', label: 'Lung Fields', value: 'Clear — No consolidation detected' },
          { icon: '❤️', label: 'Cardiac Silhouette', value: 'Normal size, no cardiomegaly' },
          { icon: '⚠️', label: 'Notable Finding', value: 'Minor hairline fracture — radial wrist (R)' },
        ],
        recommendation: 'Consult Orthopedic. Splinting advised for 3–4 weeks. Follow-up X-ray in 6 weeks.',
        diet: ['Increase calcium intake (dairy, leafy greens)', 'Vitamin D supplement — 1000 IU/day', 'Avoid strenuous activities'],
      },
      prescription: {
        title: 'Prescription OCR Analysis',
        confidence: '99.1%',
        badge: 'VERIFIED',
        badgeColor: '#10b981',
        findings: [
          { icon: '💊', label: 'Drug 1', value: 'Paracetamol 650mg — Twice daily after meals' },
          { icon: '💊', label: 'Drug 2', value: 'Amoxicillin 500mg — Thrice daily for 5 days' },
          { icon: '💊', label: 'Drug 3', value: 'Pantoprazole 40mg — Once daily (empty stomach)' },
          { icon: '⚠️', label: 'Interaction Alert', value: 'No significant drug-drug interactions detected' },
        ],
        recommendation: 'Complete the antibiotic course. Do not skip doses. Return if symptoms worsen after 48 hours.',
        diet: ['Drink warm water after every dose', 'Avoid alcohol during antibiotic course', 'Take probiotic after meals to protect gut flora'],
      },
      report: {
        title: 'Lab Bio-Report Intelligence',
        confidence: '98.6%',
        badge: 'BORDERLINE',
        badgeColor: '#f59e0b',
        findings: [
          { icon: '🩸', label: 'HbA1c', value: '6.3% — Slightly above normal (ref: <5.7%)' },
          { icon: '🧬', label: 'Total Cholesterol', value: '198 mg/dL — Within normal range' },
          { icon: '💧', label: 'Creatinine', value: '0.9 mg/dL — Normal kidney function' },
          { icon: '⚠️', label: 'Alert', value: 'Pre-diabetic range detected — lifestyle change recommended' },
        ],
        recommendation: 'Consult Endocrinologist. Monitor blood sugar weekly. Repeat HbA1c in 3 months.',
        diet: ['Low glycemic index foods (oats, lentils)', 'Avoid refined sugar and white rice', 'Walk 30 minutes daily'],
      },
    },
    te: {
      xray: {
        title: 'X-రే రేడియోలాజికల్ విశ్లేషణ',
        confidence: '97.4%',
        badge: 'చిన్న సమస్య',
        badgeColor: '#f59e0b',
        findings: [
          { icon: '🦴', label: 'ఎముక సాంద్రత', value: 'సాధారణం — T-స్కోర్: -0.8' },
          { icon: '🫁', label: 'ఊపిరితిత్తులు', value: 'స్పష్టంగా ఉన్నాయి' },
          { icon: '❤️', label: 'హృదయపు ఆకారం', value: 'సాధారణ పరిమాణం' },
          { icon: '⚠️', label: 'ముఖ్యమైన విషయం', value: 'చేతి మణికట్టులో చిన్న పగుళ్ళు కనుగొనబడ్డాయి' },
        ],
        recommendation: 'ఆర్థోపెడిక్ డాక్టర్‌ను సంప్రదించండి. 3-4 వారాలు స్పిల్ంటింగ్ అవసరం.',
        diet: ['కాల్షియం ఆహారాలు తినండి', 'విటమిన్ D తీసుకోండి', 'కఠినమైన అభ్యాసాలు మానుకోండి'],
      },
      prescription: {
        title: 'ప్రిస్క్రిప్షన్ OCR విశ్లేషణ',
        confidence: '99.1%',
        badge: 'ధృవీకరించబడింది',
        badgeColor: '#10b981',
        findings: [
          { icon: '💊', label: 'మందు 1', value: 'పారాసెటమాల్ 650mg — రోజుకు రెండుసార్లు' },
          { icon: '💊', label: 'మందు 2', value: 'అమాక్సిసిలిన్ 500mg — 5 రోజులు' },
          { icon: '💊', label: 'మందు 3', value: 'పాంటోప్రజోల్ 40mg — ఖాళీ కడుపున' },
          { icon: '⚠️', label: 'హెచ్చరిక', value: 'మందుల మధ్య ఎటువంటి ప్రమాదకర చర్యలు లేవు' },
        ],
        recommendation: 'యాంటీబయోటిక్ కోర్స్ పూర్తి చేయండి. 48 గంటల్లో మెరుగుపడకపోతే తిరిగి వచ్చండి.',
        diet: ['ప్రతి మోతాదు తర్వాత గోరువెచ్చని నీరు తాగండి', 'Probiotic తీసుకోండి', 'మద్యం మానండి'],
      },
      report: {
        title: 'ల్యాబ్ రిపోర్ట్ విశ్లేషణ',
        confidence: '98.6%',
        badge: 'హెచ్చరిక',
        badgeColor: '#f59e0b',
        findings: [
          { icon: '🩸', label: 'HbA1c', value: '6.3% — రెఫరెన్స్ (<5.7%) కంటే కొంచెం ఎక్కువ' },
          { icon: '🧬', label: 'కొలెస్ట్రాల్', value: '198 mg/dL — సాధారణం' },
          { icon: '💧', label: 'క్రియేటినిన్', value: '0.9 mg/dL — మూత్రపిండాలు సాధారణం' },
          { icon: '⚠️', label: 'హెచ్చరిక', value: 'Pre-diabetic స్థాయి గుర్తించబడింది' },
        ],
        recommendation: 'Endocrinologist ను సంప్రదించండి. వారంవారం రక్తంలో చక్కెర తనిఖీ చేయండి.',
        diet: ['తక్కువ GI ఆహారాలు తినండి', 'తెల్ల అన్నం, చక్కెర తగ్గించండి', 'రోజు 30 నిమిషాలు నడవండి'],
      },
    },
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setResults(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const startScan = () => {
    if (!uploadedFile) return;
    setIsScanning(true);
    setResults(null);
    setScanLine(0);
    setTimeout(() => {
      setIsScanning(false);
      const lang = currentLang === 'te' ? 'te' : 'en';
      setResults(mockResults[lang][activeType]);
    }, 4000);
  };

  const reset = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setIsScanning(false);
  };

  const activeTypeData = scanTypes.find(s => s.id === activeType);

  return (
    <div style={{ padding: '100px 20px 60px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @keyframes scanMove { from { top: 0%; } to { top: 100%; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .upload-zone:hover { border-color: var(--neon-blue) !important; background: rgba(0,242,254,0.05) !important; }
        .scan-type-btn { transition: all 0.3s ease; }
        .scan-type-btn:hover { transform: translateY(-2px); }
        .result-item { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '5px', color: 'var(--neon-blue)', marginBottom: '12px', fontWeight: '900' }}>
            MediBrain™ AI DIAGNOSTIC ENGINE v9.0
          </div>
          <h1 style={{ fontSize: '3.5rem', margin: 0, fontWeight: '900', background: 'var(--elite-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Lab Analyzer
          </h1>
          <p style={{ opacity: 0.5, fontSize: '1.1rem', marginTop: '10px' }}>
            Upload X-Ray, Prescription, or Lab Report → Get instant AI analysis
          </p>
        </div>

        {/* Scan type selector */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
          {scanTypes.map(type => (
            <button
              key={type.id}
              className="scan-type-btn"
              onClick={() => { setActiveType(type.id); reset(); }}
              style={{
                padding: '14px 30px',
                background: activeType === type.id ? 'var(--elite-gradient)' : 'rgba(255,255,255,0.05)',
                border: activeType === type.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '900',
                letterSpacing: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeType === type.id ? '0 0 25px rgba(0,242,254,0.25)' : 'none',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '30px' }}>

          {/* Left: Upload + Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Drop Zone */}
            {!previewUrl ? (
              <div
                className="upload-zone"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--neon-blue)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '24px',
                  padding: '60px 30px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'rgba(0,242,254,0.05)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.3s ease',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                }}
              >
                <div style={{ fontSize: '4rem' }}>{activeTypeData.icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>
                    Drop your {activeType === 'xray' ? 'X-Ray Image' : activeType === 'prescription' ? 'Prescription' : 'Lab Report'} here
                  </p>
                  <p style={{ margin: '8px 0 0', opacity: 0.5, fontSize: '0.85rem' }}>
                    or click to browse — JPG, PNG, PDF supported
                  </p>
                </div>
                <div style={{
                  background: 'var(--elite-gradient)',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  marginTop: '10px',
                }}>
                  📁 CHOOSE FILE
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={activeTypeData.accept}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            ) : (
              /* Preview Panel */
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(0,242,254,0.2)',
                background: '#000',
                position: 'relative',
                minHeight: '300px',
              }}>
                {/* Scan animation overlay */}
                {isScanning && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Scan progress line */}
                    <div style={{
                      position: 'absolute',
                      top: scanLine + '%',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'var(--neon-blue)',
                      boxShadow: '0 0 15px var(--neon-blue), 0 0 40px rgba(0,242,254,0.4)',
                    }} />
                    {/* Corners */}
                    {[['0%','0%'], ['0%','auto'], ['auto','0%'], ['auto','auto']].map(([t,b], i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        top: t === 'auto' ? undefined : '15px',
                        bottom: t === 'auto' ? '15px' : undefined,
                        left: b === 'auto' ? undefined : '15px',
                        right: b === 'auto' ? '15px' : undefined,
                        width: '25px',
                        height: '25px',
                        borderTop: i < 2 ? '3px solid var(--neon-blue)' : 'none',
                        borderBottom: i >= 2 ? '3px solid var(--neon-blue)' : 'none',
                        borderLeft: (i === 0 || i === 2) ? '3px solid var(--neon-blue)' : 'none',
                        borderRight: (i === 1 || i === 3) ? '3px solid var(--neon-blue)' : 'none',
                      }} />
                    ))}
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: '16px 30px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚡</div>
                      <p style={{ margin: 0, fontWeight: '900', color: 'var(--neon-blue)', fontSize: '0.85rem', letterSpacing: '2px' }}>
                        AI ANALYZING...
                      </p>
                      <div style={{ marginTop: '10px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '200px' }}>
                        <div style={{
                          height: '100%',
                          width: scanLine + '%',
                          background: 'var(--elite-gradient)',
                          borderRadius: '2px',
                          transition: 'width 0.05s',
                        }} />
                      </div>
                      <p style={{ margin: '8px 0 0', fontSize: '0.75rem', opacity: 0.6 }}>{Math.round(scanLine)}% complete</p>
                    </div>
                  </div>
                )}

                {/* The uploaded image */}
                <img
                  src={previewUrl}
                  alt="Uploaded scan"
                  style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', filter: isScanning ? 'brightness(0.5) saturate(0.3)' : 'brightness(1)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />

                {/* File info */}
                <div style={{ padding: '15px 20px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.85rem' }}>{uploadedFile.name}</p>
                    <p style={{ margin: '3px 0 0', opacity: 0.5, fontSize: '0.75rem' }}>{(uploadedFile.size / 1024).toFixed(1)} KB — Ready for analysis</p>
                  </div>
                  <button onClick={reset} style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', color: '#f43f5e', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            )}

            {/* Scan Button */}
            <button
              onClick={startScan}
              disabled={!uploadedFile || isScanning}
              style={{
                width: '100%',
                padding: '18px',
                background: (!uploadedFile || isScanning) ? 'rgba(255,255,255,0.05)' : 'var(--elite-gradient)',
                border: 'none',
                borderRadius: '16px',
                color: (!uploadedFile || isScanning) ? 'rgba(255,255,255,0.3)' : 'white',
                fontSize: '0.9rem',
                fontWeight: '900',
                letterSpacing: '3px',
                cursor: (!uploadedFile || isScanning) ? 'not-allowed' : 'pointer',
                boxShadow: uploadedFile && !isScanning ? '0 0 30px rgba(0,242,254,0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {!uploadedFile ? '⬆ UPLOAD A FILE TO SCAN' : isScanning ? '⏳ ANALYZING NEURAL DATA...' : '🔬 START AI CLINICAL SCAN'}
            </button>

            {/* Info box */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,242,254,0.04)', border: '1px solid rgba(0,242,254,0.1)', borderRadius: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, lineHeight: '1.6' }}>
                ⚠️ <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and is not a substitute for professional medical diagnosis. Always consult a qualified doctor.
              </p>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)', padding: '35px' }}>
            <h3 style={{ margin: '0 0 25px', letterSpacing: '3px', fontSize: '0.85rem', opacity: 0.6 }}>DIAGNOSTIC REPORT</h3>

            {!results && !isScanning && (
              <div style={{ textAlign: 'center', paddingTop: '80px', opacity: 0.3 }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🤖</div>
                <p style={{ fontSize: '1rem' }}>Upload a file and click "Start AI Scan" to see detailed results here.</p>
              </div>
            )}

            {isScanning && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{
                    height: '70px',
                    background: 'rgba(0,242,254,0.04)',
                    borderRadius: '14px',
                    border: '1px solid rgba(0,242,254,0.08)',
                    animationName: 'pulse-glow',
                    animationDuration: '1.5s',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.15}s`,
                  }} />
                ))}
              </div>
            )}

            {results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Title & confidence */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--neon-blue)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{results.title}</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.75rem', opacity: 0.5, letterSpacing: '1px' }}>MediBrain™ AI Radiologist v4.2</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: results.badgeColor, padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', marginBottom: '5px' }}>{results.badge}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 'bold' }}>AI Confidence: {results.confidence}</div>
                  </div>
                </div>

                {/* Findings */}
                <div style={{ padding: '20px', background: 'rgba(244,63,94,0.04)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '16px' }}>
                  <h5 style={{ margin: '0 0 15px', fontSize: '0.75rem', letterSpacing: '2px', color: '#f87171' }}>🔍 CLINICAL FINDINGS</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {results.findings.map((f, i) => (
                      <div key={i} className="result-item" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6, letterSpacing: '1px', fontWeight: '700' }}>{f.label}</p>
                          <p style={{ margin: '3px 0 0', fontSize: '0.9rem' }}>{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ padding: '20px', background: 'rgba(0,242,254,0.04)', border: '1px solid rgba(0,242,254,0.15)', borderRadius: '16px' }}>
                  <h5 style={{ margin: '0 0 10px', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--neon-blue)' }}>👨‍⚕️ AI RECOMMENDATION</h5>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{results.recommendation}</p>
                </div>

                {/* Diet & Lifestyle */}
                <div style={{ padding: '20px', background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '16px' }}>
                  <h5 style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--neon-green)' }}>🥗 DIET & LIFESTYLE</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.diet.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--neon-green)' }}>✓</span> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={reset} style={{ padding: '14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem' }}>
                  ↩ ANALYZE ANOTHER FILE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyzer;
