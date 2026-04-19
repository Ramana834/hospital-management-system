import React, { useState, useEffect } from 'react';
import './LabReports.css';

const labTests = [
  {
    id: 'LAB-2024-001', patient: 'Ravi Kumar', age: 45, test: 'Complete Blood Count (CBC)',
    category: 'Hematology', doctor: 'Dr. Priya Sharma', date: '2026-04-14', status: 'Ready',
    results: [
      { name: 'Hemoglobin', value: '13.2', unit: 'g/dL', normal: '12.0 - 17.5', status: 'normal' },
      { name: 'WBC Count', value: '11.2', unit: 'K/µL', normal: '4.5 - 11.0', status: 'high' },
      { name: 'Platelets', value: '245', unit: 'K/µL', normal: '150 - 400', status: 'normal' },
      { name: 'RBC Count', value: '4.8', unit: 'M/µL', normal: '4.5 - 6.0', status: 'normal' },
    ]
  },
  {
    id: 'LAB-2024-002', patient: 'Lakshmi Devi', age: 38, test: 'Lipid Panel',
    category: 'Biochemistry', doctor: 'Dr. Arun Reddy', date: '2026-04-14', status: 'Ready',
    results: [
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', normal: '< 200', status: 'high' },
      { name: 'LDL Cholesterol', value: '135', unit: 'mg/dL', normal: '< 130', status: 'high' },
      { name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', normal: '> 40', status: 'normal' },
      { name: 'Triglycerides', value: '148', unit: 'mg/dL', normal: '< 150', status: 'normal' },
    ]
  },
  {
    id: 'LAB-2024-003', patient: 'Venkat Rao', age: 52, test: 'Liver Function Test',
    category: 'Biochemistry', doctor: 'Dr. Sunitha Nair', date: '2026-04-14', status: 'Processing',
    results: []
  },
  {
    id: 'LAB-2024-004', patient: 'Meena Iyer', age: 29, test: 'Thyroid Profile (T3, T4, TSH)',
    category: 'Endocrinology', doctor: 'Dr. Rajesh Kumar', date: '2026-04-13', status: 'Ready',
    results: [
      { name: 'T3', value: '1.1', unit: 'ng/mL', normal: '0.8 - 2.0', status: 'normal' },
      { name: 'T4', value: '8.2', unit: 'µg/dL', normal: '5.0 - 12.0', status: 'normal' },
      { name: 'TSH', value: '6.8', unit: 'µIU/mL', normal: '0.5 - 5.0', status: 'high' },
    ]
  },
  {
    id: 'LAB-2024-005', patient: 'Suresh Babu', age: 60, test: 'HbA1c (Diabetes Marker)',
    category: 'Endocrinology', doctor: 'Dr. Kavya Reddy', date: '2026-04-13', status: 'Ready',
    results: [
      { name: 'HbA1c', value: '7.8', unit: '%', normal: '< 5.7 (normal), 5.7-6.4 (prediabetes)', status: 'high' },
      { name: 'Fasting Glucose', value: '142', unit: 'mg/dL', normal: '70 - 100', status: 'high' },
    ]
  },
  {
    id: 'LAB-2024-006', patient: 'Anitha Roy', age: 34, test: 'Urine Routine Examination',
    category: 'Microbiology', doctor: 'Dr. Priya Sharma', date: '2026-04-14', status: 'Pending',
    results: []
  },
];

const categories = ['All', 'Hematology', 'Biochemistry', 'Endocrinology', 'Microbiology'];

export default function LabReports() {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => { setTimeout(() => setAnimIn(true), 100); }, []);

  const filtered = labTests.filter(t =>
    (filterStatus === 'All' || t.status === filterStatus) &&
    (filterCat === 'All' || t.category === filterCat) &&
    (t.patient.toLowerCase().includes(search.toLowerCase()) || t.test.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: labTests.length,
    ready: labTests.filter(t => t.status === 'Ready').length,
    processing: labTests.filter(t => t.status === 'Processing').length,
    pending: labTests.filter(t => t.status === 'Pending').length,
  };

  return (
    <div className={`lab-page ${animIn ? 'anim-in' : ''}`}>
      {/* Header */}
      <div className="lab-header">
        <div className="lab-header-top">
          <div className="lab-title-group">
            <div className="lab-badge-icon">🔬</div>
            <div>
              <h1>Pathology & Lab Reports</h1>
              <p>Clinical Laboratory Information System</p>
            </div>
          </div>
          <button className="new-test-btn">+ New Test Request</button>
        </div>

        <div className="lab-stats">
          <div className="lab-stat indigo">
            <span className="lab-stat-num">{stats.total}</span>
            <span className="lab-stat-lbl">Total Tests Today</span>
          </div>
          <div className="lab-stat green">
            <span className="lab-stat-num">{stats.ready}</span>
            <span className="lab-stat-lbl">Results Ready</span>
          </div>
          <div className="lab-stat blue">
            <span className="lab-stat-num">{stats.processing}</span>
            <span className="lab-stat-lbl">Processing</span>
          </div>
          <div className="lab-stat orange">
            <span className="lab-stat-num">{stats.pending}</span>
            <span className="lab-stat-lbl">Pending</span>
          </div>
        </div>
      </div>

      <div className="lab-body">
        {/* Left Panel: List */}
        <div className="lab-list-panel">
          <div className="lab-filters">
            <input
              type="text"
              className="lab-search"
              placeholder="🔍 Search patient or test..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="lab-filter-row">
              {['All', 'Ready', 'Processing', 'Pending'].map(s => (
                <button key={s} className={`lab-filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>
            <div className="lab-filter-row">
              {categories.map(c => (
                <button key={c} className={`lab-filter-btn sm ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="lab-tests-list">
            {filtered.map(test => (
              <div
                key={test.id}
                className={`lab-test-card ${selected?.id === test.id ? 'selected' : ''}`}
                onClick={() => setSelected(test)}
              >
                <div className="test-card-top">
                  <div>
                    <div className="test-patient-name">{test.patient}</div>
                    <div className="test-age-sex">Age: {test.age} • {test.category}</div>
                  </div>
                  <span className={`test-status-chip ${test.status.toLowerCase()}`}>{test.status}</span>
                </div>
                <div className="test-name">{test.test}</div>
                <div className="test-meta">
                  <span>👨‍⚕️ {test.doctor}</span>
                  <span>📅 {test.date}</span>
                </div>
                <div className="test-id-tag">{test.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Result Viewer */}
        <div className="lab-result-panel">
          {selected ? (
            <div className="lab-result-view">
              <div className="result-header">
                <div>
                  <h2>{selected.test}</h2>
                  <p className="result-meta">
                    Patient: <strong>{selected.patient}</strong> &nbsp;|&nbsp;
                    Doctor: <strong>{selected.doctor}</strong> &nbsp;|&nbsp;
                    Date: <strong>{selected.date}</strong>
                  </p>
                </div>
                <span className={`test-status-chip lg ${selected.status.toLowerCase()}`}>{selected.status}</span>
              </div>

              {selected.status === 'Ready' && selected.results.length > 0 ? (
                <>
                  <div className="result-report-header">
                    <div className="report-hospital">
                      🏥 MahaLakshmi Multi Speciality Hospital
                    </div>
                    <div className="report-id">Report ID: {selected.id}</div>
                  </div>
                  <div className="results-table-wrapper">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Investigation</th>
                          <th>Result</th>
                          <th>Unit</th>
                          <th>Reference Range</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.results.map((r, i) => (
                          <tr key={i} className={r.status !== 'normal' ? 'row-abnormal' : ''}>
                            <td className="param-name">{r.name}</td>
                            <td className={`param-value ${r.status}`}>{r.value}</td>
                            <td className="param-unit">{r.unit}</td>
                            <td className="param-range">{r.normal}</td>
                            <td>
                              <span className={`result-flag ${r.status}`}>
                                {r.status === 'normal' ? '✅ Normal' : r.status === 'high' ? '⬆️ High' : '⬇️ Low'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="result-actions">
                    <button className="result-action-btn primary">🖨️ Print Report</button>
                    <button className="result-action-btn secondary">📧 Email to Patient</button>
                    <button className="result-action-btn secondary">📥 Download PDF</button>
                  </div>
                  <div className="result-disclaimer">
                    <strong>Note:</strong> This report is generated by MahaLakshmi Clinical Laboratory. Results should be interpreted by a qualified physician in clinical context.
                  </div>
                </>
              ) : (
                <div className="result-processing">
                  <div className="processing-animation">
                    <div className="processing-ring"></div>
                    <div className="processing-icon">🔬</div>
                  </div>
                  <h3>{selected.status === 'Processing' ? 'Analysis In Progress...' : 'Test Pending Collection'}</h3>
                  <p>{selected.status === 'Processing' ? 'Sample is currently being analyzed in the lab. Results will be available shortly.' : 'Sample has been requested. Awaiting collection from patient.'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="lab-select-prompt">
              <div className="lab-select-icon">🔬</div>
              <h3>Select a Test</h3>
              <p>Click on any test from the list to view the detailed report and results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
