import React, { useState, useEffect, useRef } from 'react';
import './Telemedicine.css';

const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', exp: '15 yrs', rating: 4.9, fee: 500, avatar: '👩‍⚕️', status: 'Online', nextSlot: 'In 5 mins', patients: 1240 },
  { id: 2, name: 'Dr. Arun Reddy', specialty: 'Neurologist', exp: '12 yrs', rating: 4.8, fee: 600, avatar: '👨‍⚕️', status: 'Online', nextSlot: 'In 15 mins', patients: 980 },
  { id: 3, name: 'Dr. Sunitha Nair', specialty: 'Dermatologist', exp: '10 yrs', rating: 4.7, fee: 400, avatar: '👩‍⚕️', status: 'Busy', nextSlot: 'In 45 mins', patients: 1560 },
  { id: 4, name: 'Dr. Rajesh Kumar', specialty: 'Orthopedic', exp: '18 yrs', rating: 4.9, fee: 700, avatar: '👨‍⚕️', status: 'Online', nextSlot: 'Now', patients: 2100 },
  { id: 5, name: 'Dr. Kavya Reddy', specialty: 'Endocrinologist', exp: '8 yrs', rating: 4.6, fee: 450, avatar: '👩‍⚕️', status: 'Online', nextSlot: 'In 10 mins', patients: 760 },
  { id: 6, name: 'Dr. Venkat Rao', specialty: 'Gastroenterologist', exp: '14 yrs', rating: 4.8, fee: 550, avatar: '👨‍⚕️', status: 'Offline', nextSlot: 'Tomorrow 9AM', patients: 1890 },
];

const chatHistory = [
  { from: 'doctor', text: 'Hello! I can see your reports. How are you feeling today?', time: '10:32 AM' },
  { from: 'patient', text: 'Doctor, I have been experiencing chest pain and shortness of breath since yesterday.', time: '10:33 AM' },
  { from: 'doctor', text: 'I understand. Can you describe the pain? Is it sharp or dull? Does it radiate to your arm?', time: '10:33 AM' },
  { from: 'patient', text: 'It\'s a dull ache, mostly in the center. Sometimes it goes to my left shoulder.', time: '10:34 AM' },
  { from: 'doctor', text: 'That sounds concerning. I\'m going to recommend an ECG and cardiac enzymes test immediately. Are you near a hospital?', time: '10:35 AM' },
];

export default function Telemedicine() {
  const [view, setView] = useState('doctors'); // doctors | waiting | call | chat
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatHistory);
  const [filterSpec, setFilterSpec] = useState('All');
  const timerRef = useRef(null);
  const chatRef = useRef(null);

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  const startCall = (doc) => {
    setSelectedDoctor(doc);
    setView('waiting');
    setTimeout(() => {
      setView('call');
      timerRef.current = setInterval(() => setCallTimer(t => t + 1), 1000);
    }, 3000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallTimer(0);
    setView('doctors');
    setSelectedDoctor(null);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { from: 'patient', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'doctor', text: 'Thank you for sharing that. I am reviewing your details now.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const filteredDocs = doctors.filter(d => filterSpec === 'All' || d.specialty === filterSpec);

  return (
    <div className="tele-page">
      {/* HEADER */}
      <div className="tele-header">
        <div className="tele-header-inner">
          <div className="tele-title-group">
            <div className="tele-icon">📹</div>
            <div>
              <h1>Telemedicine</h1>
              <p>Consult top specialists from the comfort of your home</p>
            </div>
          </div>
          <div className="tele-online-count">
            <span className="tele-online-dot"></span>
            {doctors.filter(d => d.status === 'Online').length} Doctors Online
          </div>
        </div>

        {/* Feature Pills */}
        <div className="tele-features">
          {['🔒 End-to-End Encrypted', '📝 Digital Prescription', '🎥 HD Video Call', '📁 Share Reports', '⚡ Instant Connect'].map(f => (
            <span key={f} className="tele-feature-pill">{f}</span>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {view === 'doctors' && (
        <div className="tele-body">
          <div className="tele-filter-bar">
            <h2>Available Specialists</h2>
            <div className="tele-spec-filters">
              {specialties.map(s => (
                <button key={s} className={`tele-spec-btn ${filterSpec === s ? 'active' : ''}`} onClick={() => setFilterSpec(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="tele-doctors-grid">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="tele-doc-card">
                <div className="tele-doc-card-top">
                  <div className="tele-doc-avatar-wrap">
                    <div className="tele-doc-avatar">{doc.avatar}</div>
                    <span className={`tele-status-dot ${doc.status.toLowerCase()}`}></span>
                  </div>
                  <div className="tele-doc-info">
                    <h3>{doc.name}</h3>
                    <p className="tele-specialty">{doc.specialty}</p>
                    <p className="tele-exp">{doc.exp} experience • {doc.patients.toLocaleString()} patients</p>
                  </div>
                </div>
                <div className="tele-doc-meta">
                  <div className="tele-meta-item">⭐ {doc.rating}</div>
                  <div className="tele-meta-item">💰 ₹{doc.fee}/consult</div>
                  <div className={`tele-meta-item slot ${doc.status.toLowerCase()}`}>🕐 {doc.nextSlot}</div>
                </div>
                <div className="tele-doc-actions">
                  <button
                    className={`tele-consult-btn ${doc.status === 'Offline' ? 'disabled' : ''}`}
                    onClick={() => doc.status !== 'Offline' && startCall(doc)}
                    disabled={doc.status === 'Offline'}
                  >
                    {doc.status === 'Offline' ? '📅 Schedule' : '📹 Video Consult'}
                  </button>
                  <button className="tele-chat-btn" onClick={() => { setSelectedDoctor(doc); setView('chat'); }}>💬 Chat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'waiting' && (
        <div className="tele-waiting-screen">
          <div className="waiting-glow-ring">
            <div className="waiting-avatar">{selectedDoctor?.avatar}</div>
          </div>
          <h2>Connecting to {selectedDoctor?.name}...</h2>
          <p>{selectedDoctor?.specialty}</p>
          <div className="waiting-dots"><span></span><span></span><span></span></div>
          <p className="waiting-note">Please ensure your camera and microphone are enabled.</p>
          <button className="cancel-call-btn" onClick={endCall}>Cancel</button>
        </div>
      )}

      {view === 'call' && (
        <div className="tele-call-screen">
          {/* Remote Video */}
          <div className="remote-video">
            <div className="remote-video-inner">
              <div className="doctor-video-avatar">{selectedDoctor?.avatar}</div>
              <div className="remote-doc-name">{selectedDoctor?.name}</div>
              <div className="remote-doc-spec">{selectedDoctor?.specialty}</div>
            </div>

            {/* Local video PiP */}
            <div className={`local-video-pip ${isCamOff ? 'cam-off' : ''}`}>
              {isCamOff ? '📷 Camera Off' : '👤 You'}
            </div>

            {/* Timer */}
            <div className="call-timer">{formatTime(callTimer)}</div>

            {/* Controls */}
            <div className="call-controls">
              <button className={`call-ctrl-btn ${isMuted ? 'active-red' : ''}`} onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button className={`call-ctrl-btn ${isCamOff ? 'active-red' : ''}`} onClick={() => setIsCamOff(!isCamOff)}>
                {isCamOff ? '📷' : '📹'}
              </button>
              <button className="call-ctrl-btn">🖥️</button>
              <button className="call-ctrl-btn">📁</button>
              <button className="call-end-btn" onClick={endCall}>📞</button>
              <button className="call-ctrl-btn">💬</button>
            </div>
          </div>
        </div>
      )}

      {view === 'chat' && (
        <div className="tele-chat-screen">
          <div className="chat-header">
            <button className="back-btn" onClick={() => setView('doctors')}>← Back</button>
            <div className="chat-doc-info">
              <div className="chat-doc-avatar">{selectedDoctor?.avatar}</div>
              <div>
                <strong>{selectedDoctor?.name}</strong>
                <p>{selectedDoctor?.specialty}</p>
              </div>
            </div>
            <button className="start-video-btn" onClick={() => startCall(selectedDoctor)}>📹 Start Video</button>
          </div>

          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                <div className="chat-bubble">{msg.text}</div>
                <div className="chat-time">{msg.time}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-bar">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button className="chat-attach-btn">📎</button>
            <button className="chat-send-btn" onClick={sendMessage}>Send ➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
