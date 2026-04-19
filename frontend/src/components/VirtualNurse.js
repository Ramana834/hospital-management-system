import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// ─────────────────────────────────────────────
//  Medical AI Brain — knowledge base
// ─────────────────────────────────────────────
const SYMPTOM_KB = {
  // HIGH RISK — emergency escalation
  emergency: {
    keywords: ['chest pain', 'heart attack', 'stroke', 'unconscious', 'no breathing', 'severe bleeding',
      'cannot breathe', 'not breathing', 'collapsed', 'unresponsive', 'severe chest',
      '胸部', 'ఛాతీ నొప్పి', 'స్వాస లేదు', 'రక్తస్రావం'],
    risk: 'CRITICAL',
    response: (lang) => lang === 'te'
      ? '🚨 ఇది అత్యవసర పరిస్థితి! వెంటనే 108 కి కాల్ చేయండి లేదా దగ్గరలోని అత్యవసర విభాగానికి వెళ్ళండి!'
      : '🚨 EMERGENCY DETECTED! Call 108 immediately or go to the nearest Emergency Room! Do not wait.',
  },

  // Symptom → speciality + follow-up question mapping
  symptoms: [
    {
      keywords: ['fever', 'temperature', 'hot', 'chills', 'జ్వరం', 'వేడి'],
      topic: 'fever',
      specialist: 'General Physician',
      dept: 'General Medicine',
      riskWeight: 2,
      followUp: (lang) => lang === 'te'
        ? 'జ్వరం ఎంత డిగ్రీలు ఉంది? ఎన్ని రోజులనుండి ఉంది?'
        : 'What is your temperature reading? How many days have you had the fever?',
    },
    {
      keywords: ['headache', 'head pain', 'migraine', 'తలనొప్పి', 'మైగ్రేన్'],
      topic: 'headache',
      specialist: 'Neurologist',
      dept: 'Neurology',
      riskWeight: 3,
      followUp: (lang) => lang === 'te'
        ? 'తలనొప్పి ఒకవైపు ఉందా లేదా రెండు వైపులా? వికారం కూడా వస్తుందా?'
        : 'Is the headache one-sided or both sides? Do you have nausea or light sensitivity?',
    },
    {
      keywords: ['cough', 'cold', 'sore throat', 'runny nose', 'దగ్గు', 'జలుబు', 'గొంతు నొప్పి'],
      topic: 'cold',
      specialist: 'ENT Specialist',
      dept: 'ENT',
      riskWeight: 1,
      followUp: (lang) => lang === 'te'
        ? 'దగ్గులో రక్తం వస్తుందా? శ్వాస తీసుకోవడంలో ఇబ్బంది ఉందా?'
        : 'Is there blood in the cough? Any difficulty in breathing?',
    },
    {
      keywords: ['stomach', 'abdomen', 'belly', 'vomit', 'nausea', 'diarrhea', 'పొట్ట', 'వాంతి', 'విరేచనాలు'],
      topic: 'gastro',
      specialist: 'Gastroenterologist',
      dept: 'Gastroenterology',
      riskWeight: 2,
      followUp: (lang) => lang === 'te'
        ? 'నొప్పి ఏ భాగంలో ఉంది? తినిన తర్వాత ఎక్కువ అవుతుందా?'
        : 'Where exactly is the pain? Does it worsen after eating?',
    },
    {
      keywords: ['sugar', 'diabetes', 'blood sugar', 'thirst', 'glucose', 'చక్కెర', 'మధుమేహం', 'దాహం'],
      topic: 'diabetes',
      specialist: 'Endocrinologist',
      dept: 'Endocrinology',
      riskWeight: 3,
      followUp: (lang) => lang === 'te'
        ? 'మీ చివరి రక్తపరీక్ష ఎప్పుడు చేసారు? ఇప్పుడు రక్తంలో చక్కెర స్థాయి ఎంత?'
        : 'When was your last blood test? Do you know your current blood sugar level?',
    },
    {
      keywords: ['eye', 'vision', 'blur', 'కళ్ళు', 'చూపు', 'మబ్బు'],
      topic: 'vision',
      specialist: 'Ophthalmologist',
      dept: 'Ophthalmology',
      riskWeight: 2,
      followUp: (lang) => lang === 'te'
        ? 'చూపు మసకగా ఉందా లేదా నొప్పి కూడా ఉందా?'
        : 'Is the vision blurry, or is there pain in the eye too?',
    },
    {
      keywords: ['heart', 'breathing', 'shortness', 'palpitation', 'హృదయం', 'ఆయాసం', 'గుండె'],
      topic: 'cardio',
      specialist: 'Cardiologist',
      dept: 'Cardiology',
      riskWeight: 5,
      followUp: (lang) => lang === 'te'
        ? 'గుండె వేగంగా కొట్టుకుంటుందా? ఆయాసం ఎప్పుడు వస్తుంది — విశ్రాంతిలో లేదా పనిచేసేటప్పుడు?'
        : 'Does your heart race or skip beats? Does breathlessness occur at rest or during exertion?',
    },
    {
      keywords: ['bone', 'joint', 'knee', 'back pain', 'fracture', 'ఎముక', 'మోకాలు', 'వెన్నునొప్పి'],
      topic: 'ortho',
      specialist: 'Orthopedic Surgeon',
      dept: 'Orthopedics',
      riskWeight: 2,
      followUp: (lang) => lang === 'te'
        ? 'ఇటీవల గాయం జరిగిందా? నడవడంలో ఇబ్బంది ఉందా?'
        : 'Was there a recent injury or fall? Do you have difficulty walking?',
    },
    {
      keywords: ['skin', 'rash', 'itching', 'allergy', 'చర్మం', 'దురద', 'ఎలర్జీ'],
      topic: 'skin',
      specialist: 'Dermatologist',
      dept: 'Dermatology',
      riskWeight: 1,
      followUp: (lang) => lang === 'te'
        ? 'దద్దుర్లు ఎక్కడ వస్తున్నాయి? వేసవిలో లేదా నిర్దిష్ట ఆహారం తిన్న తర్వాత వస్తుందా?'
        : 'Where is the rash appearing? Does it worsen with certain foods or seasons?',
    },
    {
      keywords: ['appointment', 'book', 'doctor', 'consult', 'అపాయింట్మెంట్', 'డాక్టర్'],
      topic: 'appointment',
      specialist: null,
      dept: null,
      riskWeight: 0,
      followUp: null,
    },
    {
      keywords: ['blood', 'donate', 'donor', 'రక్తం', 'దాత'],
      topic: 'blood',
      specialist: null,
      dept: null,
      riskWeight: 0,
      followUp: null,
    },
  ],
};

// Duration keywords for risk boost
const DURATION_HIGH = ['week', 'weeks', 'month', 'months', 'వారం', 'నెల'];
const SEVERITY_HIGH = ['severe', 'extreme', 'unbearable', 'worst', 'తీవ్రమైన', 'భరించలేని'];

// Advanced Fuzzy Matching Engine (August AI replication)
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  matrix[0] = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function isFuzzyMatch(word, keyword) {
  if (!word || !keyword) return false;
  if (word === keyword) return true;
  if (keyword.length > 5 && levenshtein(word, keyword) <= 2) return true;
  if (keyword.length > 3 && keyword.length <= 5 && levenshtein(word, keyword) <= 1) return true;
  return false;
}

function analyzeInput(text, lang, conversationHistory) {
  const lower = text.toLowerCase();
  const words = lower.split(/[\s,.-]+/);

  // 1. Emergency check first
  if (SYMPTOM_KB.emergency.keywords.some(k => lower.includes(k) || words.some(w => isFuzzyMatch(w, k)))) {
    return {
      type: 'emergency',
      text: SYMPTOM_KB.emergency.response(lang),
      risk: 'CRITICAL',
    };
  }

  // 2. Match symptom
  const matched = SYMPTOM_KB.symptoms.find(s => 
     s.keywords.some(k => lower.includes(k) || words.some(w => isFuzzyMatch(w, k)))
  );

  if (!matched) {
    // Generic intelligent response
    const generic = [
      lang === 'te'
        ? 'మీ ఆరోగ్య సమస్యను వివరంగా చెప్పండి — ఉదాహరణకు జ్వరం, నొప్పి, దగ్గు, చక్కెర వ్యాధి వంటివి.'
        : 'Could you describe your symptom in more detail? For example: fever, pain, cough, diabetes, back pain.',
    ];
    return { type: 'clarify', text: generic[0], risk: 'NONE' };
  }

  // 3. Special topics
  if (matched.topic === 'appointment') {
    return {
      type: 'navigation',
      text: lang === 'te'
        ? '📅 అపాయింట్‌మెంట్ బుక్ చేసుకోవాలంటే మా పేషెంట్ పోర్టల్‌కు వెళ్ళండి. ఏ విభాగంలో డాక్టర్ కావాలో కూడా చెప్పండి!'
        : '📅 You can book an appointment from the Patient Portal. Which department do you need — General, Cardiology, Orthopedics, or others?',
      risk: 'NONE',
      action: { label: 'Book Appointment', path: '/book-appointment' },
    };
  }
  if (matched.topic === 'blood') {
    return {
      type: 'navigation',
      text: lang === 'te'
        ? '🩸 Blood Nexus కు వెళ్ళి donor search చేయవచ్చు — Telangana & AP donors అందుబాటులో ఉన్నారు.'
        : '🩸 Visit our Blood Nexus to find donors in Telangana and AP in real time.',
      risk: 'NONE',
      action: { label: 'Blood Nexus', path: '/blood-nexus' },
    };
  }

  // 4. Compute risk
  let risk = matched.riskWeight;
  if (DURATION_HIGH.some(k => lower.includes(k))) risk += 2;
  if (SEVERITY_HIGH.some(k => lower.includes(k))) risk += 2;
  const riskLabel = risk >= 6 ? 'HIGH' : risk >= 3 ? 'MEDIUM' : 'LOW';

  // 5. Has follow up been asked already?
  const alreadyAskedFollowUp = conversationHistory.some(m =>
    m.sender === 'ai' && m.topic === matched.topic && m.isFollowUp
  );

  if (matched.followUp && !alreadyAskedFollowUp) {
    return {
      type: 'followup',
      text: matched.followUp(lang),
      topic: matched.topic,
      risk: riskLabel,
      specialist: matched.specialist,
      dept: matched.dept,
      isFollowUp: true,
    };
  }

  // 6. Final diagnosis
  const riskMessages = {
    HIGH: lang === 'te'
      ? `⚠️ మీ ${matched.dept} సమస్య తీవ్రంగా కనిపిస్తుంది. **${matched.specialist}** ని వెంటనే కలవడం మంచిది.`
      : `⚠️ Your ${matched.dept} symptoms appear significant. I strongly recommend seeing a **${matched.specialist}** soon.`,
    MEDIUM: lang === 'te'
      ? `📋 మీ లక్షణాలు ${matched.dept} సంబంధమైనవి. **${matched.specialist}** ని 24-48 గంటల్లో కలవండి.`
      : `📋 Your symptoms relate to **${matched.dept}**. Please consult a **${matched.specialist}** within 24–48 hours.`,
    LOW: lang === 'te'
      ? `✅ మీ లక్షణాలు చాలా సాధారణంగా ఉన్నాయి. అవసరమైతే **${matched.specialist}** ని కలవండి.`
      : `✅ Your symptoms appear mild. Consider visiting a **${matched.specialist}** if symptoms persist.`,
  };

  return {
    type: 'diagnosis',
    text: riskMessages[riskLabel],
    risk: riskLabel,
    specialist: matched.specialist,
    dept: matched.dept,
    topic: matched.topic,
    action: { label: 'Book Appointment', path: '/book-appointment' },
    suggestions: lang === 'te'
      ? ['AI X-Ray/Prescription అనాలిసిస్ చేయండి', 'ఇంటి దగ్గర విశ్రాంతి తీసుకోండి', 'సాదా ఆహారం తినండి']
      : ['Try AI Report Analysis', 'Rest and hydrate well', 'Avoid self-medication'],
  };
}

// ─────────────────────────────────────────────
//  Risk Badge component
// ─────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
  const colors = { CRITICAL: '#ff2d55', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#10b981', NONE: 'transparent' };
  if (risk === 'NONE' || !risk) return null;
  return (
    <span style={{
      background: colors[risk] || '#666',
      color: 'white',
      fontSize: '0.55rem',
      fontWeight: '900',
      letterSpacing: '1px',
      padding: '2px 7px',
      borderRadius: '4px',
      marginLeft: '6px',
      verticalAlign: 'middle',
    }}>
      {risk}
    </span>
  );
};

// ─────────────────────────────────────────────
//  Main VirtualNurse component
// ─────────────────────────────────────────────
const VirtualNurse = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionRisk, setSessionRisk] = useState('NONE');
  const [quickTips] = useState(
    language === 'te'
      ? ['జ్వరం', 'తలనొప్పి', 'దగ్గు', 'పొట్ట నొప్పి', 'చక్కెర వ్యాధి', 'అపాయింట్మెంట్']
      : ['Fever', 'Headache', 'Cough', 'Stomach pain', 'Diabetes', 'Book appointment']
  );
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = language === 'te'
        ? 'నమస్కారం! 👋 నేను MahaLakshmi AI Health Assistant. మీ లక్షణాలు చెప్పండి — నేను risk assess చేసి, సరైన specialist recommend చేస్తాను.'
        : "Hello! 👋 I'm MahaLakshmi's AI Health Assistant.\n\nTell me your symptoms and I'll assess your risk level and recommend the right specialist.";
      setMessages([{ sender: 'ai', text: welcome, type: 'welcome' }]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Web Speech API — voice input
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Please use Chrome.');
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = language === 'te' ? 'te-IN' : 'en-IN';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recog.onerror = () => setIsListening(false);
    recognitionRef.current = recog;
    recog.start();
  };

  const handleSend = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { sender: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const result = analyzeInput(trimmed, language, newMessages);

      // Track highest session risk
      const riskOrder = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      if (riskOrder.indexOf(result.risk) > riskOrder.indexOf(sessionRisk)) {
        setSessionRisk(result.risk);
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: result.text,
        type: result.type,
        risk: result.risk,
        topic: result.topic,
        isFollowUp: result.isFollowUp,
        action: result.action,
        suggestions: result.suggestions,
        specialist: result.specialist,
        dept: result.dept,
      }]);
      setIsTyping(false);
    }, delay);
  };

  const riskColors = {
    CRITICAL: 'rgba(255,45,85,0.15)',
    HIGH: 'rgba(249,115,22,0.12)',
    MEDIUM: 'rgba(245,158,11,0.1)',
    LOW: 'rgba(16,185,129,0.08)',
    NONE: 'rgba(30,41,59,0.95)',
  };

  const headerBg = {
    CRITICAL: 'linear-gradient(135deg, #c0392b, #e74c3c)',
    HIGH: 'linear-gradient(135deg, #b45309, #f97316)',
    MEDIUM: 'linear-gradient(135deg, #92400e, #d97706)',
    LOW: 'linear-gradient(135deg, #065f46, #10b981)',
    NONE: 'linear-gradient(135deg, #0f4c75, #1b6ca8)',
  };

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}>
      <style>{`
        @keyframes nurse-bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes msg-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes listening-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 50%{box-shadow:0 0 0 12px rgba(239,68,68,0)} }
        .msg-bubble { animation: msg-in 0.3s ease forwards; }
        .quick-chip:hover { background: var(--elite-gradient) !important; color: white !important; }
        .send-btn:hover { transform: scale(1.1); }
        .nurse-btn:hover { transform: scale(1.05); }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {isOpen ? (
        <div style={{
          width: '380px',
          height: '580px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#0d1117',
        }}>

          {/* Header */}
          <div style={{
            background: headerBg[sessionRisk] || headerBg.NONE,
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '1.6rem' }}>👩‍⚕️</div>
              <div>
                <p style={{ margin: 0, fontWeight: '900', fontSize: '0.9rem', color: 'white', letterSpacing: '0.5px' }}>
                  MahaLakshmi AI
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '7px', height: '7px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px #4ade80' }} />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>
                    ONLINE · AI HEALTH ASSISTANT
                  </span>
                  {sessionRisk !== 'NONE' && <RiskBadge risk={sessionRisk} />}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => { setMessages([]); setSessionRisk('NONE'); }}
                title="New session"
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', color: 'white', padding: '4px 8px', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 'bold' }}
              >↺</button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', color: 'white', padding: '4px 8px', fontSize: '1rem', cursor: 'pointer', lineHeight: 1 }}
              >×</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0d1117' }}>
            {messages.map((m, i) => (
              <div key={i} className="msg-bubble" style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'ai' ? 'flex-start' : 'flex-end' }}>
                {m.sender === 'ai' && (
                  <div style={{ fontSize: '0.65rem', opacity: 0.4, marginBottom: '4px', letterSpacing: '0.5px' }}>
                    AI NURSE {m.risk && m.risk !== 'NONE' && <RiskBadge risk={m.risk} />}
                  </div>
                )}
                <div style={{
                  padding: '12px 15px',
                  borderRadius: m.sender === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                  maxWidth: '88%',
                  fontSize: '0.85rem',
                  lineHeight: '1.55',
                  background: m.sender === 'ai'
                    ? (m.type === 'emergency' ? 'rgba(255,45,85,0.2)' : 'rgba(255,255,255,0.06)')
                    : 'linear-gradient(135deg, #0f4c75, #1b6ca8)',
                  color: 'white',
                  border: m.type === 'emergency'
                    ? '1px solid rgba(255,45,85,0.4)'
                    : m.sender === 'ai' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>

                {/* Suggestions */}
                {m.suggestions && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '88%' }}>
                    {m.suggestions.map((s, si) => (
                      <div key={si} style={{ fontSize: '0.75rem', opacity: 0.7, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        • {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action button */}
                {m.action && (
                  <button
                    className="action-btn"
                    onClick={() => navigate(m.action.path)}
                    style={{
                      marginTop: '8px',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      padding: '8px 16px',
                      fontSize: '0.75rem',
                      fontWeight: '900',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    → {m.action.label}
                  </button>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px 14px 14px 14px', width: 'fit-content', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)',
                    animation: 'nurse-bounce 1s infinite', animationDelay: `${d}s`
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips */}
          {messages.length <= 2 && (
            <div style={{ padding: '8px 14px', display: 'flex', flexWrap: 'wrap', gap: '6px', background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {quickTips.map(tip => (
                <button
                  key={tip}
                  className="quick-chip"
                  onClick={() => handleSend(tip)}
                  style={{
                    padding: '5px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: '600',
                  }}
                >
                  {tip}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{ padding: '12px 14px', background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Voice button */}
            <button
              onClick={startVoice}
              title="Voice input"
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: isListening ? '#ef4444' : 'rgba(255,255,255,0.07)',
                border: isListening ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '1rem', cursor: 'pointer',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: isListening ? 'listening-pulse 1s infinite' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {isListening ? '⏹' : '🎤'}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'te' ? 'మీ లక్షణాలు టైప్ చేయండి...' : 'Describe your symptoms...'}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              className="send-btn"
              onClick={() => handleSend()}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'rgba(255,255,255,0.07)',
                border: 'none', color: 'white', fontSize: '1.1rem',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              ➤
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: '6px 14px 10px', background: '#0d1117', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.4 }}>
              AI analysis only. Not a replacement for professional medical advice.
            </p>
          </div>
        </div>

      ) : (
        /* Floating button */
        <div style={{ position: 'relative' }}>
          <button
            className="nurse-btn"
            onClick={() => setIsOpen(true)}
            style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: sessionRisk === 'CRITICAL' ? 'linear-gradient(135deg,#c0392b,#e74c3c)'
                : sessionRisk === 'HIGH' ? 'linear-gradient(135deg,#b45309,#f97316)'
                : 'linear-gradient(135deg, #0f4c75, #1b6ca8)',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              cursor: 'pointer', fontSize: '1.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            👩‍⚕️
          </button>
          {/* Notification dot */}
          <div style={{
            position: 'absolute', top: '4px', right: '4px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#10b981', border: '2px solid #0d1117',
            boxShadow: '0 0 8px #10b981',
            animation: 'nurse-bounce 2s infinite',
          }} />
          {/* Tooltip */}
          <div style={{
            position: 'absolute', right: '80px', bottom: '16px',
            background: 'rgba(0,0,0,0.85)', color: 'white',
            padding: '6px 12px', borderRadius: '10px',
            fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            💬 AI Health Assistant
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualNurse;
