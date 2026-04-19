import React, { useState, useEffect } from 'react';
import './Billing.css';

const invoices = [
  {
    id: 'INV-2024-0891', patient: 'Ravi Kumar', patientId: 'PAT-001', date: '2026-04-14',
    doctor: 'Dr. Priya Sharma', department: 'Cardiology', status: 'Paid',
    items: [
      { desc: 'Consultation Fee', qty: 1, rate: 500, amount: 500 },
      { desc: 'ECG (12 Lead)', qty: 1, rate: 800, amount: 800 },
      { desc: 'Echocardiography', qty: 1, rate: 2500, amount: 2500 },
      { desc: 'Atorvastatin 10mg (30 tabs)', qty: 1, rate: 120, amount: 120 },
    ],
    insurance: { provider: 'Star Health', policyNo: 'SH-2024-78921', covered: 3000 },
    discount: 200,
  },
  {
    id: 'INV-2024-0892', patient: 'Lakshmi Devi', patientId: 'PAT-002', date: '2026-04-14',
    doctor: 'Dr. Arun Reddy', department: 'Neurology', status: 'Pending',
    items: [
      { desc: 'Consultation Fee', qty: 1, rate: 600, amount: 600 },
      { desc: 'MRI Brain (with contrast)', qty: 1, rate: 6500, amount: 6500 },
      { desc: 'Room Charges (1 day)', qty: 1, rate: 1500, amount: 1500 },
      { desc: 'Nursing Charges', qty: 1, rate: 500, amount: 500 },
    ],
    insurance: { provider: 'ICICI Lombard', policyNo: 'IC-2024-44512', covered: 5000 },
    discount: 0,
  },
  {
    id: 'INV-2024-0893', patient: 'Venkat Rao', patientId: 'PAT-003', date: '2026-04-13',
    doctor: 'Dr. Sunitha Nair', department: 'Dermatology', status: 'Partially Paid',
    items: [
      { desc: 'Consultation Fee', qty: 1, rate: 400, amount: 400 },
      { desc: 'Skin Biopsy', qty: 1, rate: 1200, amount: 1200 },
      { desc: 'Lab Tests (CBC + LFT)', qty: 1, rate: 800, amount: 800 },
    ],
    insurance: null,
    discount: 150,
  },
  {
    id: 'INV-2024-0894', patient: 'Meena Iyer', patientId: 'PAT-004', date: '2026-04-13',
    doctor: 'Dr. Rajesh Kumar', department: 'Orthopedics', status: 'Paid',
    items: [
      { desc: 'Consultation Fee', qty: 1, rate: 700, amount: 700 },
      { desc: 'X-Ray (Knee - Bilateral)', qty: 2, rate: 600, amount: 1200 },
      { desc: 'Physiotherapy Session', qty: 3, rate: 400, amount: 1200 },
      { desc: 'Knee Support (L-size)', qty: 1, rate: 850, amount: 850 },
    ],
    insurance: { provider: 'New India Assurance', policyNo: 'NI-2024-99231', covered: 2500 },
    discount: 300,
  },
];

const statusColors = {
  'Paid': 'green',
  'Pending': 'orange',
  'Partially Paid': 'blue',
};

export default function Billing() {
  const [selected, setSelected] = useState(invoices[0]);
  const [activeTab, setActiveTab] = useState('invoices');
  const [showReceipt, setShowReceipt] = useState(false);
  const [stats, setStats] = useState({ collected: 0, pending: 0, insurance: 0, invoices: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        collected: Math.min(prev.collected + 1450, 145000),
        pending: Math.min(prev.pending + 120, 12000),
        insurance: Math.min(prev.insurance + 850, 85000),
        invoices: Math.min(prev.invoices + 3, 347),
      }));
    }, 15);
    return () => clearInterval(timer);
  }, []);

  const getSubtotal = (inv) => inv.items.reduce((s, i) => s + i.amount, 0);
  const getGST = (inv) => Math.round(getSubtotal(inv) * 0.05);
  const getTotal = (inv) => getSubtotal(inv) + getGST(inv) - inv.discount;
  const getNetPayable = (inv) => inv.insurance ? getTotal(inv) - inv.insurance.covered : getTotal(inv);

  return (
    <div className="billing-page">
      {/* HEADER */}
      <div className="billing-header">
        <div className="billing-header-top">
          <div className="billing-title-group">
            <div className="billing-icon">💳</div>
            <div>
              <h1>Billing & Insurance</h1>
              <p>Invoice Management & Insurance Claims System</p>
            </div>
          </div>
          <button className="new-invoice-btn">+ New Invoice</button>
        </div>
        <div className="billing-stats">
          <div className="bill-stat green">
            <div className="bill-stat-icon">✅</div>
            <div className="bill-stat-value">₹{stats.collected.toLocaleString()}</div>
            <div className="bill-stat-label">Collected Today</div>
          </div>
          <div className="bill-stat orange">
            <div className="bill-stat-icon">⏳</div>
            <div className="bill-stat-value">₹{stats.pending.toLocaleString()}</div>
            <div className="bill-stat-label">Pending Amount</div>
          </div>
          <div className="bill-stat blue">
            <div className="bill-stat-icon">🏦</div>
            <div className="bill-stat-value">₹{stats.insurance.toLocaleString()}</div>
            <div className="bill-stat-label">Insurance Claims</div>
          </div>
          <div className="bill-stat purple">
            <div className="bill-stat-icon">📄</div>
            <div className="bill-stat-value">{stats.invoices}</div>
            <div className="bill-stat-label">Invoices This Month</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="billing-tabs">
        {['invoices', 'insurance', 'analytics'].map(tab => (
          <button key={tab} className={`bill-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'invoices' ? '📄 Invoices' : tab === 'insurance' ? '🏦 Insurance Claims' : '📊 Analytics'}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        <div className="billing-body">
          {/* Invoice List */}
          <div className="invoice-list">
            {invoices.map(inv => (
              <div key={inv.id} className={`invoice-card ${selected?.id === inv.id ? 'selected' : ''}`} onClick={() => { setSelected(inv); setShowReceipt(false); }}>
                <div className="inv-card-top">
                  <div>
                    <div className="inv-patient">{inv.patient}</div>
                    <div className="inv-id-date">{inv.id} • {inv.date}</div>
                  </div>
                  <span className={`inv-status ${statusColors[inv.status]}`}>{inv.status}</span>
                </div>
                <div className="inv-dept">{inv.department} • {inv.doctor}</div>
                <div className="inv-total-row">
                  <span>Total: <strong>₹{getTotal(inv).toLocaleString()}</strong></span>
                  {inv.insurance && <span className="ins-badge">🏦 Insured</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Detail */}
          {selected && (
            <div className="invoice-detail">
              <div className="inv-detail-header">
                <div>
                  <h2>Invoice #{selected.id}</h2>
                  <p>{selected.date} • {selected.department}</p>
                </div>
                <div className="inv-detail-actions">
                  <button className="inv-action-btn" onClick={() => setShowReceipt(!showReceipt)}>
                    {showReceipt ? '📋 Show Invoice' : '🖨️ Print Receipt'}
                  </button>
                  <button className="inv-action-btn primary">📧 Send Bill</button>
                </div>
              </div>

              {!showReceipt ? (
                <>
                  {/* Patient Info */}
                  <div className="inv-patient-info">
                    <div className="inv-info-row"><span>Patient</span><strong>{selected.patient}</strong></div>
                    <div className="inv-info-row"><span>Patient ID</span><strong>{selected.patientId}</strong></div>
                    <div className="inv-info-row"><span>Doctor</span><strong>{selected.doctor}</strong></div>
                    <div className="inv-info-row"><span>Department</span><strong>{selected.department}</strong></div>
                    {selected.insurance && (
                      <>
                        <div className="inv-info-row"><span>Insurance</span><strong>{selected.insurance.provider}</strong></div>
                        <div className="inv-info-row"><span>Policy No.</span><strong>{selected.insurance.policyNo}</strong></div>
                      </>
                    )}
                  </div>

                  {/* Items Table */}
                  <div className="inv-items-table-wrap">
                    <table className="inv-items-table">
                      <thead>
                        <tr><th>Description</th><th>Qty</th><th>Rate (₹)</th><th>Amount (₹)</th></tr>
                      </thead>
                      <tbody>
                        {selected.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.desc}</td>
                            <td>{item.qty}</td>
                            <td>{item.rate.toLocaleString()}</td>
                            <td><strong>{item.amount.toLocaleString()}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="inv-summary">
                    <div className="sum-row"><span>Subtotal</span><span>₹{getSubtotal(selected).toLocaleString()}</span></div>
                    <div className="sum-row"><span>GST (5%)</span><span>₹{getGST(selected).toLocaleString()}</span></div>
                    {selected.discount > 0 && <div className="sum-row discount"><span>Discount</span><span>- ₹{selected.discount}</span></div>}
                    <div className="sum-row total"><span>Gross Total</span><span>₹{getTotal(selected).toLocaleString()}</span></div>
                    {selected.insurance && <div className="sum-row insurance"><span>Insurance Coverage ({selected.insurance.provider})</span><span>- ₹{selected.insurance.covered.toLocaleString()}</span></div>}
                    <div className="sum-row net-payable"><span>Net Payable</span><span>₹{getNetPayable(selected).toLocaleString()}</span></div>
                  </div>

                  {/* Payment Actions */}
                  <div className="payment-actions">
                    <button className="pay-btn upi">📱 Pay via UPI</button>
                    <button className="pay-btn card">💳 Card Payment</button>
                    <button className="pay-btn cash">💵 Cash</button>
                    <button className="pay-btn insurance">🏦 Insurance Claim</button>
                  </div>
                </>
              ) : (
                /* RECEIPT VIEW */
                <div className="receipt-view">
                  <div className="receipt-header">
                    <div className="receipt-hospital-logo">🏥</div>
                    <h3>MahaLakshmi Multi Speciality Hospital</h3>
                    <p>Hyderabad, Telangana | Ph: +91-40-2345-6789</p>
                    <p>GSTIN: 36AABCM1234F1Z5</p>
                  </div>
                  <div className="receipt-divider">━━━━━ RECEIPT ━━━━━</div>
                  <div className="receipt-info">
                    <div><span>Invoice No:</span> {selected.id}</div>
                    <div><span>Date:</span> {selected.date}</div>
                    <div><span>Patient:</span> {selected.patient}</div>
                    <div><span>Doctor:</span> {selected.doctor}</div>
                  </div>
                  <div className="receipt-divider">─────────────────</div>
                  {selected.items.map((item, i) => (
                    <div key={i} className="receipt-item">
                      <span>{item.desc} × {item.qty}</span>
                      <span>₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="receipt-divider">─────────────────</div>
                  <div className="receipt-item"><span>Subtotal</span><span>₹{getSubtotal(selected).toLocaleString()}</span></div>
                  <div className="receipt-item"><span>GST (5%)</span><span>₹{getGST(selected).toLocaleString()}</span></div>
                  {selected.discount > 0 && <div className="receipt-item green"><span>Discount</span><span>-₹{selected.discount}</span></div>}
                  <div className="receipt-divider">─────────────────</div>
                  <div className="receipt-item grand-total"><span>NET PAYABLE</span><span>₹{getNetPayable(selected).toLocaleString()}</span></div>
                  <div className="receipt-divider">━━━━━━━━━━━━━━━━━━</div>
                  <div className="receipt-footer">
                    <p>Thank you for choosing MahaLakshmi Hospital!</p>
                    <p>Get well soon 💚</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="insurance-panel">
          <h2>Active Insurance Claims</h2>
          <div className="insurance-cards">
            {invoices.filter(inv => inv.insurance).map(inv => (
              <div key={inv.id} className="insurance-claim-card">
                <div className="claim-header">
                  <div className="claim-provider-icon">🏦</div>
                  <div>
                    <strong>{inv.insurance.provider}</strong>
                    <p>Policy: {inv.insurance.policyNo}</p>
                  </div>
                  <span className={`inv-status ${statusColors[inv.status]}`}>{inv.status}</span>
                </div>
                <div className="claim-patient">{inv.patient} • {inv.department}</div>
                <div className="claim-amounts">
                  <div className="claim-amt"><span>Billed</span><strong>₹{getTotal(inv).toLocaleString()}</strong></div>
                  <div className="claim-amt covered"><span>Covered</span><strong>₹{inv.insurance.covered.toLocaleString()}</strong></div>
                  <div className="claim-amt payable"><span>Net Payable</span><strong>₹{getNetPayable(inv).toLocaleString()}</strong></div>
                </div>
                <div className="claim-progress-wrap">
                  <div className="claim-progress-bar">
                    <div className="claim-progress-fill" style={{ width: `${(inv.insurance.covered / getTotal(inv)) * 100}%` }}></div>
                  </div>
                  <span>{Math.round((inv.insurance.covered / getTotal(inv)) * 100)}% covered</span>
                </div>
                <div className="claim-actions">
                  <button className="claim-btn primary">Submit Claim</button>
                  <button className="claim-btn secondary">View Documents</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="billing-analytics">
          <h2>Revenue Analytics</h2>
          <div className="analytics-grid">
            {['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'ENT', 'Gynecology'].map((dept, i) => {
              const revenues = [145000, 98000, 120000, 67000, 45000, 89000];
              const max = 145000;
              return (
                <div key={dept} className="analytics-bar-card">
                  <div className="analytics-dept">{dept}</div>
                  <div className="analytics-bar-wrap">
                    <div className="analytics-bar-fill" style={{ width: `${(revenues[i] / max) * 100}%` }}></div>
                  </div>
                  <div className="analytics-revenue">₹{revenues[i].toLocaleString()}</div>
                </div>
              );
            })}
          </div>

          <div className="payment-mode-section">
            <h3>Payment Modes (This Month)</h3>
            <div className="payment-modes">
              {[
                { mode: '📱 UPI', pct: 42, color: '#6366f1' },
                { mode: '💳 Card', pct: 28, color: '#3b82f6' },
                { mode: '🏦 Insurance', pct: 22, color: '#10b981' },
                { mode: '💵 Cash', pct: 8, color: '#f59e0b' },
              ].map(p => (
                <div key={p.mode} className="payment-mode-item">
                  <div className="pm-header"><span>{p.mode}</span><span>{p.pct}%</span></div>
                  <div className="pm-bar"><div className="pm-fill" style={{ width: `${p.pct}%`, background: p.color }}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
