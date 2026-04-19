import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './AuthCore.css';

const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Oncology',
  'Pediatrics', 'Radiology', 'Gastroenterology', 'General Medicine'
];

const BookAppointment = () => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    department: '',
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [paymentMode, setPaymentMode] = useState('hospital'); // 'hospital' or 'online'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookedToken, setBookedToken] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill from URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const docId = queryParams.get('docId');
    const dept = queryParams.get('dept');
    if (dept) {
      setFormData(prev => ({ ...prev, department: dept, doctorId: docId || '' }));
      fetchDoctorsByDept(dept);
    }
  }, [location]);

  const fetchDoctorsByDept = async (dept) => {
    if (!dept) { setDoctors([]); return; }
    try {
      const data = await api.getDoctorsBySpecialization(dept);
      setDoctors(data || []);
    } catch (e) {
      setDoctors([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'department') {
      setFormData(prev => ({ ...prev, department: value, doctorId: '' }));
      fetchDoctorsByDept(value);
      setSelectedDoctor(null);
      setAvailability(null);
    }
    if (name === 'doctorId') {
      const doc = doctors.find(d => d.id === parseInt(value));
      setSelectedDoctor(doc);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      if (formData.doctorId && formData.date) {
        try {
          const data = await api.getAppointmentAvailability(formData.doctorId, formData.date);
          setAvailability(data);
        } catch (err) {
          console.error("Failed to fetch availability", err);
        }
      } else {
        setAvailability(null);
      }
    };
    fetchAvailability();
  }, [formData.doctorId, formData.date]);

  const toggleVoiceBooking = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(transcript);
    };

    recognition.start();
  };

  const processVoiceCommand = (cmd) => {
    // Simple natural language processing logic
    if (cmd.includes('karthik') || cmd.includes('cardio')) {
      handleInputChange({ target: { name: 'department', value: 'Cardiology' } });
    } else if (cmd.includes('general') || cmd.includes('ananya')) {
      handleInputChange({ target: { name: 'department', value: 'General Medicine' } });
    }
    
    if (cmd.includes('tomorrow') || cmd.includes('రేపు')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({ ...prev, date: tomorrow.toISOString().split('T')[0] }));
    }

    if (cmd.includes('10')) {
        setFormData(prev => ({ ...prev, time: '10:00' }));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let doctorId = formData.doctorId;
    if (!doctorId && doctors.length > 0) doctorId = doctors[0].id;
    
    if (!doctorId) {
      setError('Please select a department and doctor.');
      setLoading(false);
      return;
    }

    const patientId = user.id || 1;
    const payload = {
      patient: { id: patientId },
      doctor: { id: parseInt(doctorId) },
      appointmentDate: formData.date,
      appointmentTime: formData.time + ':00',
      status: 'scheduled',
      paymentStatus: paymentMode === 'online' ? 'Paid' : 'Pending'
    };

    try {
      if (paymentMode === 'online') {
        setIsProcessingPayment(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessingPayment(false);
      }
      
      const result = await api.bookAppointment(payload);
      setBookedToken(result.tokenNumber);
      setSuccess(true);
      
      // Simulate automatic SMS trigger
      setTimeout(() => {
         if(formData.phone) {
           alert(`📲 [SYSTEM SMS ALERT to ${formData.phone}]\n\nDear ${formData.patientName}, your appointment at MahaLakshmi Hospital for ${formData.date} at ${formData.time} is CONFIRMED. Token: #${result.tokenNumber}`);
         }
      }, 1500);

      setTimeout(() => navigate('/patient-login'), 8000);
    } catch (err) {
      setError('Booking failed. Please check availability and try again.');
    } finally {
      setLoading(false);
      setIsProcessingPayment(false);
    }
  };

  if (success) {
    return (
      <div className="auth-wrapper" style={{ background: 'var(--bg-app)' }}>
        <div className="auth-container animate-fade-in" style={{ maxWidth: '450px', background: 'transparent', boxShadow: 'none' }}>
          <div className="whatsapp-card glass-panel" style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#075e54', padding: '15px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏥</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>MahaLakshmi Hospital</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>Official Support</p>
              </div>
            </div>
            <div style={{ background: '#e5ddd5', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '300px' }}>
              <div className="wa-bubble animate-slide-up" style={{ background: '#dcf8c6', padding: '12px 15px', borderRadius: '0 15px 15px 15px', maxWidth: '85%', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                <p style={{ margin: 0 }}><strong>{t('booking.success')}</strong> 🎉</p>
                <p style={{ margin: '5px 0 0' }}>Hi {formData.patientName}, your appointment is confirmed for {formData.date}.</p>
              </div>
              <div className="wa-bubble animate-slide-up" style={{ background: 'white', padding: '12px 15px', borderRadius: '15px 0 15px 15px', maxWidth: '85%', fontSize: '0.9rem', alignSelf: 'flex-end', animationDelay: '0.5s' }}>
                <p style={{ margin: 0, color: 'var(--primary-700)', fontWeight: 'bold' }}>Token: #{bookedToken}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem' }}>Payment: {paymentMode === 'online' ? '✅ Paid' : '⏳ Pending'}</p>
              </div>
            </div>
            <div style={{ padding: '15px', background: '#f0f2f5', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => navigate('/patient-login')} className="btn btn-primary" style={{ borderRadius: '25px', padding: '10px 30px', background: '#25d366', border: 'none' }}>Go to Portal</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper" style={{ background: 'var(--bg-app)' }}>
      <div className="auth-container glass-panel animate-fade-in" style={{ maxWidth: '680px', borderTop: '4px solid var(--primary-500)' }}>
        <div className="auth-header" style={{ position: 'relative' }}>
          <h2>{t('booking.title')}</h2>
          <p>{t('booking.subtitle')}</p>
          <button 
            type="button" 
            onClick={toggleVoiceBooking} 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            style={{ position: 'absolute', right: '0', top: '0', width: '50px', height: '50px', borderRadius: '50%', border: 'none', background: isListening ? 'var(--danger-500)' : 'var(--primary-500)', color: 'white', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
          >
            {isListening ? '🛑' : '🎙️'}
          </button>
          {isListening && <p style={{ color: 'var(--danger-600)', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px' }}>Listening... Try: "Book Cardiologist for tomorrow at 10"</p>}
        </div>

        {error && <div className="disclaimer-alert" style={{ marginBottom: '16px', color: 'var(--danger-600)', background: 'rgba(239,68,68,0.08)', border: '1px solid var(--danger-200)' }}>⚠️ {error}</div>}

        <form className="auth-form" onSubmit={handleBook}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>{t('booking.patientName')}</label>
              <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} className="form-input" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>{t('booking.phone')}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="+91 XXXXX XXXXX" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>{t('booking.department')}</label>
              <select name="department" value={formData.department} onChange={handleInputChange} className="form-input" required>
                <option value="">Choose Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('booking.doctor')}</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="form-input" required>
                <option value="">Select Doctor</option>
                {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>{t('booking.date')}</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-input" min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="form-group">
              <label>{t('booking.time')}</label>
              <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="form-input" required />
            </div>
          </div>

          <div className="form-group">
            <label>{t('booking.reason')}</label>
            <textarea name="reason" value={formData.reason} onChange={handleInputChange} className="form-input" rows="3" placeholder="Briefly describe your symptoms" />
          </div>

          <button type="submit" disabled={loading || isProcessingPayment} className="btn btn-primary w-100 btn-lg" style={{ marginTop: '16px', borderRadius: '12px', height: '54px' }}>
             {isProcessingPayment ? 'Processing...' : loading ? 'Booking...' : t('booking.confirm')}
          </button>
        </form>

        <div className="auth-footer">
          <p>{t('navbar.emergency')}? <Link to="/emergency" style={{ color: 'var(--danger-600)' }}>{t('navbar.emergency')}</Link></p>
        </div>
      </div>
      <style>{`
        .mic-btn.listening { animation: pulse-red 1.5s infinite; }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};

export default BookAppointment;
