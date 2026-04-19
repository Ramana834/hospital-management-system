import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats(data);
      // Also fetch first few patients and inventory
      const allPatients = await api.getAllPatients();
      setPatients(allPatients.slice(0, 10));
      const allMeds = await api.getPharmacyItems();
      setInventory(allMeds);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      setSearching(true);
      try {
        const results = await api.searchPatients(query);
        setPatients(results);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setSearching(false);
      }
    } else if (query.length === 0) {
      fetchAdminData();
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading System Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar admin-theme" style={{ background: '#0f172a' }}>
        <div className="sidebar-brand">
          <span className="brand-logo" style={{ width: '36px', height: '36px', fontSize: '1rem', marginRight: '10px', background: 'var(--danger-600)' }}>MH</span>
          <h3>Command Center</h3>
        </div>
        <nav className="sidebar-nav">
          <a href="#overview" className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>System Overview</a>
          <a href="#wards" className={`sidebar-link ${activeTab === 'wards' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('wards'); }}>Ward Heatmap</a>
          <a href="#billing" className={`sidebar-link ${activeTab === 'billing' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('billing'); }}>Financial Analytics</a>
          <a href="#doctors" className="sidebar-link">Manage Doctors</a>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="btn btn-outline" style={{width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: 'white'}}>Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" style={{ background: '#f8fafc', padding: '0' }}>
        <header className="dashboard-header border-bottom" style={{ padding: '20px 40px', background: 'white' }}>
          <div className="header-title">
            <h2>Hospital Command Center</h2>
            <p>Live Monitoring & Predictive Insights</p>
          </div>
          <div className="header-actions">
            <div className="search-box" style={{ position: 'relative', width: '300px' }}>
              <input 
                type="text" 
                placeholder="Search patients by name or phone..." 
                value={searchQuery}
                onChange={handleSearch}
                style={{ 
                  width: '100%', 
                  padding: '10px 15px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              {searching && <div style={{ position: 'absolute', right: '10px', top: '10px', scale: '0.5' }} className="spinner-border text-primary" />}
            </div>
            <button className="btn btn-primary" onClick={fetchAdminData}>Sync Data</button>
          </div>
        </header>

        <div className="dashboard-content" style={{ padding: '30px 40px' }}>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="dash-card stat-card animate-fade-in" style={{ borderTop: '4px solid var(--danger-500)' }}>
              <h3>Total Patients</h3>
              <p className="big-stat" style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.patients || 0}</p>
              <p style={{ color: 'var(--teal-600)', fontSize: '0.85rem' }}>Active Database Count</p>
            </div>
            
            <div className="dash-card stat-card animate-fade-in" style={{ borderTop: '4px solid var(--primary-500)', animationDelay: '0.1s' }}>
              <h3>Specialist Doctors</h3>
              <p className="big-stat" style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.doctors || 0}</p>
              <p style={{ fontSize: '0.85rem' }}>Onboarded Practitioners</p>
            </div>
            
            <div className="dash-card stat-card animate-fade-in" style={{ borderTop: '4px solid var(--warm)', animationDelay: '0.2s' }}>
              <h3>Pending Invoices</h3>
              <p className="big-stat" style={{ fontSize: '2rem', fontWeight: '800' }}>{stats?.pendingBilling || 0}</p>
              <p style={{ fontSize: '0.85rem' }}>Awaiting Payment</p>
            </div>
            
            <div className="dash-card stat-card animate-fade-in" style={{ borderTop: '4px solid var(--teal-500)', animationDelay: '0.3s' }}>
              <h3>Today's Appts</h3>
              <p className="big-stat" style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--teal-600)' }}>{stats?.appointments || 0}</p>
              <p style={{ fontSize: '0.85rem' }}>Operational Capacity</p>
            </div>
          </div>

          <div className="card-grid mt-4" style={{ gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {activeTab === 'wards' && (
            <div className="animate-fade-in">
              <div className="quantum-card" style={{ padding: '40px', background: 'white' }}>
                 <h3 style={{ marginBottom: '10px' }}>Real-Time Ward Occupancy (Heatmap)</h3>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Visual monitoring of Bed Availability across Multi-Speciality Blocks.</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
                    {[...Array(25)].map((_, i) => {
                      const occupied = Math.random() > 0.4;
                      return (
                        <div key={i} className="glass-panel pulse-glow" style={{ 
                          height: '80px', 
                          background: occupied ? 'var(--danger-50)' : 'var(--teal-50)', 
                          border: `2px solid ${occupied ? 'var(--danger-200)' : 'var(--teal-200)'}`,
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '12px'
                        }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: occupied ? 'var(--danger-600)' : 'var(--teal-600)' }}>BED {100 + i}</span>
                          <span style={{ fontSize: '1.2rem' }}>{occupied ? '👤' : '🟢'}</span>
                        </div>
                      );
                    })}
                 </div>
                 
                 <div style={{ marginTop: '30px', display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: 'var(--teal-100)', border: '1px solid var(--teal-400)', borderRadius: '3px' }}></div> Available (11)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: 'var(--danger-100)', border: '1px solid var(--danger-400)', borderRadius: '3px' }}></div> Occupied (14)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px' }}></div> Maintenance</div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div className="quantum-card" style={{ padding: '40px', background: 'white' }}>
                <h3>Predictive Billing Analytics</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Monthly Revenue Projections & Financial Growth Trends.</p>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '250px', paddingBottom: '30px', borderBottom: '2px solid #f1f5f9' }}>
                   {[65, 82, 45, 95, 75, 120].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, var(--primary-600), var(--primary-400))', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>₹{h}k</div>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Month {i+1}</span>
                      </div>
                   ))}
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>
                  📈 Projected 22% Revenue Increase Next Quarter
                </div>
              </div>

              <div className="quantum-card" style={{ padding: '30px', background: 'var(--primary-600)', color: 'white' }}>
                 <h3>System-Wide Audit</h3>
                 <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Blockchain Privacy Shield Active</p>
                 <div style={{ marginTop: '30px' }} className="animate-fade-in">
                    <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                       <div style={{ fontSize: '0.85rem' }}>
                          <p style={{ margin: 0, opacity: 0.6 }}>08:45 AM</p>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>Data Access Verified: Dr. Karthik</p>
                          <small>BLOCK-HASH: 0x92f...a12</small>
                       </div>
                       <div style={{ fontSize: '0.85rem' }}>
                          <p style={{ margin: 0, opacity: 0.6 }}>09:12 AM</p>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>Secure Lab Sync Completed</p>
                          <small>BLOCK-HASH: 0x11e...b44</small>
                       </div>
                    </div>
                 </div>
                 <button className="btn btn-outline" style={{ marginTop: '40px', width: '100%', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>View Full Security Log</button>
              </div>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
