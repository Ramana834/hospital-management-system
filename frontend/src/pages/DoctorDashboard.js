import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: '',
    instructions: '',
    selectedPatientName: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (localStorage.getItem('role') !== 'DOCTOR') {
      navigate('/doctor-login');
      return;
    }
    fetchDoctorData();
  }, [navigate]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctorAppointments(user.id);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch doctor appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescribe = (appt) => {
    setPrescriptionForm({
      patientId: appt.patient.id,
      selectedPatientName: appt.patient.name,
      medicines: '',
      instructions: ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      await api.addPrescription({
        patient: { id: prescriptionForm.patientId },
        doctor: { id: user.id },
        medicines: prescriptionForm.medicines,
        instructions: prescriptionForm.instructions
      });
      alert('Prescription added successfully!');
      setPrescriptionForm({ patientId: '', selectedPatientName: '', medicines: '', instructions: '' });
      fetchDoctorData();
    } catch (err) {
      alert('Failed to add prescription. Please check the backend.');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Syncing Clinical Records...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar doctor-theme" style={{ background: '#064e3b' }}>
        <div className="sidebar-brand">
          <span className="brand-logo" style={{ width: '36px', height: '36px', fontSize: '1rem', marginRight: '10px', background: 'var(--teal-600)' }}>MH</span>
          <h3>Clinical Suite</h3>
        </div>
        <nav className="sidebar-nav">
          <a href="#overview" className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>Patient Queue</a>
          <a href="#profile" className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>My Profile</a>
          <a href="#schedule" className="sidebar-link" onClick={() => setActiveTab('overview')}>My Schedule</a>
          <a href="#records" className="sidebar-link" onClick={() => setActiveTab('overview')}>Case History</a>
          <a href="#settings" className="sidebar-link" onClick={() => setActiveTab('overview')}>Clinical Settings</a>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="btn btn-outline" style={{width: '100%', color: 'white', borderColor: 'rgba(255,255,255,0.2)'}}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ background: '#f0fdf4' }}>
        <header className="dashboard-header border-bottom">
          <div className="header-title">
            <h2>Welcome, {user.name}</h2>
            <p>{user.specialization} Specialist | Hospital IP: 192.168.1.45</p>
          </div>
          <div className="header-actions">
             <div className="status-badge pulse online">Ready for Consult</div>
             <div className="avatar" style={{ background: 'var(--teal-600)', color: 'white' }}>DR</div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'overview' ? (
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="dash-card animate-fade-in">
                <div className="card-header border-bottom mb-4 pb-2 d-flex justify-content-between align-items-center">
                  <h3>Today's Patient Queue</h3>
                  <span className="badge teal" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}>{appointments.length} Consultations</span>
                </div>
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Token</th>
                        <th>Appt Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length > 0 ? (
                        appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td><strong>{appt.patient?.name}</strong></td>
                            <td><span className="token-id"># {appt.tokenNumber}</span></td>
                            <td>{appt.appointmentTime}</td>
                            <td>Routine Checkup</td>
                            <td><span className={`badge ${appt.status}`}>{appt.status}</span></td>
                            <td>
                              <button className="btn btn-primary" onClick={() => handlePrescribe(appt)}>Add Prescription</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="text-center py-4">Your queue is clear. No pending appointments.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Prescription Form Section */}
              {prescriptionForm.patientId && (
                <div id="prescription-section" className="dash-card mt-4 animate-fade-in" style={{ border: '2px solid var(--teal-500)' }}>
                  <div className="card-header border-bottom mb-4 pb-2">
                    <h3>New Prescription for: <span style={{ color: 'var(--teal-600)' }}>{prescriptionForm.selectedPatientName}</span></h3>
                  </div>
                  <form onSubmit={submitPrescription}>
                    <div className="form-group mb-3">
                      <label>Medicines (Name, Dosage, Duration)</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Example: Paracetamol 650mg - 1-0-1 - 5 days"
                        rows="4"
                        required
                        value={prescriptionForm.medicines}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, medicines: e.target.value})}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Additional Instructions</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Example: Take after meals. Drink plenty of water."
                        rows="2"
                        value={prescriptionForm.instructions}
                        onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">Save & Issue Prescription</button>
                      <button type="button" className="btn btn-outline" onClick={() => setPrescriptionForm({patientId: ''})}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="dash-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', borderTop: '4px solid var(--teal-600)' }}>
                <div className="card-header border-bottom mb-4 pb-2" style={{ textAlign: 'center' }}>
                  <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 15px auto', background: 'var(--teal-600)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    DR
                  </div>
                  <h3 style={{ color: 'var(--teal-800)' }}>Doctor Profile</h3>
                </div>
                <div className="profile-details" style={{ lineHeight: '2' }}>
                  <p><strong>Name:</strong> DR. {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Contact:</strong> {user.contact || 'Not provided'}</p>
                  <p><strong>Specialization:</strong> <span className="badge teal" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)', padding: '4px 8px' }}>{user.specialization || 'General'}</span></p>
                  <p><strong>Available Slots:</strong> {user.availableSlots || 'Not configured'}</p>
                  <p><strong>Role:</strong> Medical Professional</p>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="btn" style={{ background: 'var(--teal-600)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px' }} onClick={() => alert('Profile update functionality coming soon!')}>Edit Profile Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
