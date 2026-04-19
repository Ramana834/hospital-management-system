import React, { useState } from 'react';
import * as api from '../services/api';
import './SmartDemo.css';

const SmartHospitalDemo = () => {
  const [activeTab, setActiveTab] = useState('clinical');
  const [inputs, setInputs] = useState({
    symptoms: '',
    botQuery: '',
    deptId: '',
    queueSize: '',
    ambulanceId: 'AMB-108',
    alertMsg: ''
  });
  const [logs, setLogs] = useState([
    { type: 'system', msg: 'Command Center Sandbox Initialized... Waiting for commands.', time: new Date().toLocaleTimeString() }
  ]);

  const addLog = (type, msg) => {
    setLogs(prev => [{ type, msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const runAction = async (actionName, apiCall) => {
    addLog('request', `Calling: ${actionName}...`);
    try {
      const data = await apiCall();
      addLog('response', `Success: ${JSON.stringify(data)}`);
    } catch (err) {
      addLog('error', `Failed: ${err.message}`);
    }
  };

  return (
    <div className="smart-demo-wrapper">
      <div className="demo-header glass-panel animate-fade-in">
        <div className="container">
          <div className="header-flex">
            <div>
              <span className="badge-tech">Powered by MahaLakshmi AI</span>
              <h1 className="demo-title">Command Center Sandbox</h1>
              <p className="demo-subtitle">Experience our integrated artificial intelligence, predictive analytics, and automated emergency routing systems.</p>
            </div>
            <div className="role-indicator">
              <span>Current Role:</span>
              <strong>SYSTEM GUEST</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="demo-layout">
          {/* Controls Sidebar */}
          <div className="demo-sidebar">
            <h3 className="panel-title">System Modules</h3>
            <div className="demo-tabs">
              <button
                className={`demo-tab ${activeTab === 'clinical' ? 'active' : ''}`}
                onClick={() => setActiveTab('clinical')}
              >
                <span className="icon">🧠</span> Clinical AI Zone
              </button>
              <button
                className={`demo-tab ${activeTab === 'operations' ? 'active' : ''}`}
                onClick={() => setActiveTab('operations')}
              >
                <span className="icon">⚙️</span> Hospital Operations
              </button>
              <button
                className={`demo-tab ${activeTab === 'emergency' ? 'active' : ''}`}
                onClick={() => setActiveTab('emergency')}
              >
                <span className="icon">🚑</span> Emergency & Mobility
              </button>
            </div>

            <div className="system-status mt-4">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Live Streams & Telemetry</h4>
              <div className="status-item"><span className="dot online"></span> Vitals Stream (Active Simulator)</div>
              <div className="status-item"><span className="dot online"></span> Queue Displays (Connected)</div>
              <div className="status-item"><span className="dot online"></span> Ambulance GPS (Live)</div>
            </div>
          </div>

          {/* Interactive Workspace */}
          <div className="demo-workspace">
            {activeTab === 'clinical' && (
              <div className="workspace-panel animate-fade-in">
                <div className="panel-header">
                  <h3>Clinical Intelligence</h3>
                  <p>Test NLP symptoms, disease prediction models, and medical chatbot.</p>
                </div>
                <div className="action-grid">
                  <div className="input-group-modern">
                    <label>Symptom NLP Engine</label>
                    <input
                      type="text"
                      name="symptoms"
                      value={inputs.symptoms}
                      onChange={handleInputChange}
                      placeholder="e.g., fever, cough, chest pain"
                      className="form-input"
                    />
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => runAction('Doctor Recommendation', () => api.recommendDoctor(inputs.symptoms))}
                    >
                      Run AI Recommendation
                    </button>
                  </div>
                  <div className="input-group-modern">
                    <label>Medical Bot Query</label>
                    <input
                      type="text"
                      name="botQuery"
                      value={inputs.botQuery}
                      onChange={handleInputChange}
                      placeholder="e.g., medicine usage help"
                      className="form-input"
                    />
                    <button
                      className="btn"
                      style={{ background: 'var(--teal-600)', color: 'white' }}
                      onClick={() => runAction('AI Chatbot', () => api.getChatbotReply(inputs.botQuery))}
                    >
                      Ask AI Chatbot
                    </button>
                  </div>
                </div>
                <div className="action-row mt-4 pt-4 border-top">
                  <button
                    className="btn btn-outline"
                    onClick={() => runAction('Disease Prediction', () => api.predictDisease(inputs.symptoms))}
                  >
                    Disease Prediction Model
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ borderColor: 'var(--warm)', color: 'var(--warm)' }}
                    onClick={() => addLog('system', 'Voice Assistant: Connecting to clinical systems... Audio Stream Syncing.')}
                  >
                    Voice Assistant (TTS)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'operations' && (
              <div className="workspace-panel animate-fade-in">
                <div className="panel-header">
                  <h3>Hospital Operations</h3>
                  <p>Trigger internal events, queue management, and kiosk commands.</p>
                </div>
                <div className="action-grid">
                  <div className="input-group-modern">
                    <label>Department Monitoring</label>
                    <input
                      type="number"
                      name="deptId"
                      value={inputs.deptId}
                      onChange={handleInputChange}
                      placeholder="Enter Dept ID (e.g., 1)"
                      className="form-input"
                    />
                    <button
                      className="btn"
                      style={{ background: '#0f172a', color: 'white' }}
                      onClick={() => runAction('Admin Snapshot', api.getAdminSnapshot)}
                    >
                      Hospital Performance Snapshot
                    </button>
                  </div>
                  <div className="input-group-modern">
                    <label>Pharmacy Command</label>
                    <input
                      type="text"
                      name="queueSize"
                      value={inputs.queueSize}
                      onChange={handleInputChange}
                      placeholder="Medicine Name"
                      className="form-input"
                    />
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => runAction('Dispense Medicine', () => api.dispenseMedicine(inputs.queueSize, 1))}
                    >
                      Force Inventory Dispense
                    </button>
                  </div>
                </div>
                <div className="action-row mt-4 pt-4 border-top">
                  <button className="btn btn-outline" onClick={() => runAction('Beds Status', api.getBeds)}>Bed Management Status</button>
                  <button className="btn btn-outline" onClick={() => runAction('Inventory Check', api.getPharmacyInventory)}>Fetch Pharmacy Audit</button>
                  <button className="btn btn-outline" onClick={() => runAction('Reminder Status', api.getReminderStatus)}>Fire Reminder Status</button>
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="workspace-panel animate-fade-in">
                <div className="panel-header">
                  <h3>Emergency & Mobility Commands</h3>
                  <p>Simulate critical incidents and ambulance coordination.</p>
                </div>
                <div className="action-grid">
                  <div className="input-group-modern">
                    <label>Ambulance ID Target</label>
                    <input
                      type="text"
                      name="ambulanceId"
                      value={inputs.ambulanceId}
                      onChange={handleInputChange}
                      placeholder="e.g., AMB-108"
                      className="form-input"
                    />
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => runAction('Track Ambulance', () => api.trackAmbulance(inputs.ambulanceId))}
                    >
                      Track Ambulance GPS
                    </button>
                  </div>
                  <div className="input-group-modern">
                    <label>Critical Alert Simulation</label>
                    <input
                      type="text"
                      name="alertMsg"
                      value={inputs.alertMsg}
                      onChange={handleInputChange}
                      placeholder="e.g., severe sugar drop"
                      className="form-input"
                    />
                    <button
                      className="btn"
                      style={{ background: 'var(--warm)', color: 'white' }}
                      onClick={() => runAction('Emergency Alert', () => api.triggerEmergency({ message: inputs.alertMsg }))}
                    >
                      Trigger Alert Notification
                    </button>
                  </div>
                </div>
                <div className="action-row mt-4 pt-4 border-top">
                  <button
                    className="btn btn-outline"
                    style={{ borderColor: 'var(--danger-500)', color: 'var(--danger-600)' }}
                    onClick={() => runAction('Ambulance GPS', () => api.trackAmbulance(inputs.ambulanceId))}
                  >
                    Simulate Ambulance Live Stream
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => runAction('Lab Comparison', () => api.getLabComparison(1, 'Sugar'))}
                  >
                    Run Lab Trend Comparison
                  </button>
                </div>
                <div className="disclaimer-alert mt-4">
                  <strong>System Notice:</strong> This sandbox interfaces with the live Spring Boot backend. All simulations generate real database entries for architectural verification.
                </div>
              </div>
            )}

            {/* Console Output Block */}
            <div className="output-console mt-4">
              <div className="console-header">Live API Output / Logs</div>
              <div className="console-body">
                {logs.map((log, i) => (
                  <div key={i} className={`console-line ${log.type}`}>
                    <span className="time">[{log.time}]</span>
                    <span className="msg">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHospitalDemo;
