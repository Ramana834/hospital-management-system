import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

const PatientDashboard = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [wellnessData, setWellnessData] = useState({ mood: '', water: 0, steps: 8430 });
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [newFamily, setNewFamily] = useState({ name: '', relationship: '', age: '' });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      navigate('/patient-login');
      return;
    }
    fetchPatientData();
  }, [navigate]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const appts = await api.getPatientAppointments(user.id);
      setAppointments(appts);
      const records = await api.getPaperlessRecords(user.id);
      setPrescriptions(records.prescriptions || []);
      setBills(records.billing || []);
      setFamily(records.familyMembers || []);
    } catch (err) {
      console.error('Failed to fetch patient data', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (billId) => {
    try {
      await api.payBill(billId, 'UPI');
      alert('Payment Successful!');
      fetchPatientData();
    } catch (err) {
      alert('Payment Failed. Please try again.');
    }
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    try {
      await api.addFamilyMember({ ...newFamily, patient: { id: user.id } });
      setShowFamilyModal(false);
      setNewFamily({ name: '', relationship: '', age: '' });
      fetchPatientData();
    } catch (err) {
      alert("Failed to add family member");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading Your Health Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar patient-theme">
        <div className="sidebar-brand">
          <span className="brand-logo" style={{ width: '36px', height: '36px', fontSize: '1rem', marginRight: '10px' }}>MH</span>
          <h3>Patient Hub</h3>
        </div>
        <nav className="sidebar-nav">
          <a href="#overview" className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>{t('dashboard.myAppts')}</a>
          <a href="#family" className={`sidebar-link ${activeTab === 'family' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('family'); }}>👨‍👩‍👧‍👦 {t('dashboard.familyProfiles') || 'Family Profiles'}</a>
          <a href="#wellness" className={`sidebar-link ${activeTab === 'wellness' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('wellness'); }}>🧘 {t('dashboard.wellnessScore') || 'Wellness Tracking'}</a>
          <Link to="/health-vault" className="sidebar-link" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 'bold' }}>🔓 {t('dashboard.healthVault')}</Link>
          <a href="#profile" className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>My Profile</a>
          <Link to="/ai-analyzer" className="sidebar-link" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', borderLeft: '4px solid var(--teal-600)', fontWeight: 'bold' }}>✨ AI Health Assistant</Link>
          <Link to="/book-appointment" className="sidebar-link">{t('navbar.bookAppt')}</Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="btn btn-outline" style={{width: '100%'}}>Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header border-bottom">
          <div className="header-title">
            <h2>Welcome, {user.name}</h2>
            <p>Your Health Summary & Medical History</p>
          </div>
          <div className="header-actions">
            <Link to="/book-appointment" className="btn btn-primary d-flex align-items-center gap-2">
              <span>+</span> New Appointment
            </Link>
            <Link to="/emergency" className="btn btn-danger">Emergency SOS</Link>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <>
              {/* Feature 8: AI Wellness Score Hero */}
              <div className="quantum-card animate-fade-in" style={{ padding: '30px', marginBottom: '30px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid var(--primary-100)', borderTopColor: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <h2 style={{ fontSize: '2.5rem', margin: 0 }}>A-</h2>
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>{t('dashboard.wellnessScore') || 'AI Wellness Grade'}</h3>
                      <p style={{ margin: '5px 0 0', fontWeight: 'bold', color: 'var(--primary-600)' }}>Your health is in the "Peak Performance" zone.</p>
                      <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        AI Insight: "You've been consistent with meds (98%) and steps (8.4k). Increase hydration to reach A+."
                      </p>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ textAlign: 'center', padding: '10px 20px', background: '#f8fafc', borderRadius: '12px' }}>
                       <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>Longevity</p>
                       <h4 style={{ margin: 0 }}>+2.4y</h4>
                    </div>
                    <Link to="/quantum-sim" className="btn btn-primary" style={{ height: 'fit-content' }}>Simulate Future</Link>
                 </div>
              </div>

              <div className="card-grid">
                {/* Appointments Section */}
                <div className="dash-card animate-fade-in">
                  <div className="card-header border-bottom mb-4 pb-2">
                    <h3>My Appointments</h3>
                  </div>
                  <div className="table-responsive">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Meeting</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length > 0 ? (
                          appointments.map((appt) => (
                            <tr key={appt.id}>
                              <td><strong>{appt.doctor?.name}</strong></td>
                              <td>{appt.appointmentDate}</td>
                              <td>{appt.appointmentTime}</td>
                              <td>
                                {appt.videoMeetingLink ? (
                                  <a href={appt.videoMeetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem', background: '#4f46e5' }}>
                                    🎥 {t('dashboard.videoConsult')}
                                  </a>
                                ) : (
                                  <span className="token-id"># {appt.tokenNumber}</span>
                                )}
                              </td>
                              <td><span className={`badge ${appt.status}`}>{appt.status}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="5" className="text-center">{t('dashboard.noAppts')}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prescriptions Section */}
                <div className="dash-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="card-header border-bottom mb-4 pb-2">
                    <h3>Latest Prescriptions</h3>
                  </div>
                  <div className="activity-feed">
                    {prescriptions.length > 0 ? (
                       prescriptions.map((p, i) => (
                        <div key={i} className="activity-item" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong style={{ color: 'var(--primary-600)' }}>{p.doctor?.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>{p.medicines}</p>
                          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{p.instructions}</p>
                        </div>
                       ))
                    ) : (
                      <p className="text-center py-4">No prescriptions issued yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Section */}
              <div className="dash-card mt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="card-header border-bottom mb-4 pb-2">
                  <h3>Payments & Billing</h3>
                </div>
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.length > 0 ? (
                        bills.map((bill) => (
                          <tr key={bill.id}>
                            <td>#INV-{bill.id}</td>
                            <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontSize: '0.85rem' }}>{bill.description}</td>
                            <td style={{ fontWeight: 'bold' }}>₹ {bill.amount}</td>
                            <td><span className={`badge ${bill.status}`}>{bill.status}</span></td>
                            <td>
                              {bill.status === 'pending' ? (
                                <button className="btn btn-primary" style={{ padding: '4px 12px' }} onClick={() => handlePay(bill.id)}>Pay Now</button>
                              ) : (
                                <button className="btn btn-outline" style={{ padding: '4px 12px' }} disabled>Paid</button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="text-center">No billing history found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'wellness' && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
              {/* Daily Vitals Card */}
              <div className="quantum-card" style={{ padding: '30px', background: 'white' }}>
                  <h3 style={{ marginBottom: '25px' }}>{t('dashboard.vitals') || 'Biometric Sync'}</h3>
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                     <div style={{ fontSize: '4rem', animation: 'heartbeat 1.5s infinite' }}>❤️</div>
                     <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>72 <small style={{ fontSize: '1rem', opacity: 0.5 }}>BPM</small></h2>
                     <p style={{ color: '#10b981', fontWeight: 'bold' }}>● Live Sync from Watch</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>SpO2</p>
                      <h4 style={{ margin: 0 }}>98%</h4>
                    </div>
                    <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>Sleep</p>
                      <h4 style={{ margin: 0 }}>7.2h</h4>
                    </div>
                  </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {/* Wellness Tracker */}
                <div className="quantum-card" style={{ padding: '30px', background: 'white' }}>
                  <h3 style={{ marginBottom: '20px' }}>How are you feeling today?</h3>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
                    {['😊', '😐', '😔', '💪', '🤒'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setWellnessData({...wellnessData, mood: m})}
                        style={{ fontSize: '2rem', background: wellnessData.mood === m ? 'var(--primary-100)' : 'none', border: '2px solid transparent', borderColor: wellnessData.mood === m ? 'var(--primary-500)' : 'transparent', borderRadius: '15px', cursor: 'pointer', padding: '10px' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  
                  <div className="water-tracker" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>Hydration Tracker</strong>
                      <span>{wellnessData.water} / 8 Glasses</span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          onClick={() => setWellnessData({...wellnessData, water: i + 1})}
                          style={{ flex: 1, height: '40px', background: i < wellnessData.water ? '#60a5fa' : '#e2e8f0', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Steps Analytics */}
                <div className="quantum-card" style={{ padding: '30px', background: 'white', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Daily Activity</h3>
                      <p style={{ margin: 0, opacity: 0.6 }}>Steps Today</p>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--primary-600)' }}>{wellnessData.steps.toLocaleString()}</h2>
                  </div>
                  <div style={{ marginTop: '20px', height: '10px', background: '#f1f5f9', borderRadius: '5px' }}>
                     <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '5px' }}></div>
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#10b981' }}>🔥 You are in the top 10% of active patients this week!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="dash-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card-header border-bottom mb-4 pb-2" style={{ textAlign: 'center' }}>
                  <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 15px auto', background: 'var(--primary-600)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h3>My Profile</h3>
                </div>
                <div className="profile-details" style={{ lineHeight: '2' }}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Contact:</strong> {user.contact || 'Not provided'}</p>
                  <p><strong>Age:</strong> {user.age || 'Not provided'}</p>
                  <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
                  <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
                  <p><strong>Role:</strong> Patient</p>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={() => alert('Profile update functionality coming soon!')}>Edit Profile</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Family Modal */}
      {showFamilyModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-slide-up" style={{ background: 'var(--bg-surface)', padding: '40px', width: '450px', position: 'relative' }}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowFamilyModal(false)}>×</button>
            <h2 style={{ marginBottom: '10px' }}>Link Family Member</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Add members to your health circle to share records and books appointments easily.</p>
            
            <form onSubmit={handleAddFamily}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
                <input type="text" className="form-input" required value={newFamily.name} onChange={e => setNewFamily({...newFamily, name: e.target.value})} placeholder="Enter name" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Relationship</label>
                <select className="form-input" required value={newFamily.relationship} onChange={e => setNewFamily({...newFamily, relationship: e.target.value})}>
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                </select>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Age</label>
                <input type="number" className="form-input" required value={newFamily.age} onChange={e => setNewFamily({...newFamily, age: e.target.value})} placeholder="Years" />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFamilyModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Secure Link Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
