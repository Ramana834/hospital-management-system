import React, { useState, useEffect } from 'react';
import './Pharmacy.css';

const drugs = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', stock: 1240, price: 12, expiry: '2027-03', status: 'Available', manufacturer: 'Sun Pharma' },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', stock: 340, price: 85, expiry: '2026-11', status: 'Available', manufacturer: 'Cipla' },
  { id: 3, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 89, price: 45, expiry: '2026-08', status: 'Low Stock', manufacturer: 'Dr. Reddys' },
  { id: 4, name: 'Atorvastatin 10mg', category: 'Statin', stock: 560, price: 120, expiry: '2027-01', status: 'Available', manufacturer: 'Pfizer' },
  { id: 5, name: 'Omeprazole 20mg', category: 'PPI', stock: 22, price: 55, expiry: '2026-06', status: 'Critical', manufacturer: 'Zydus' },
  { id: 6, name: 'Amlodipine 5mg', category: 'CCB', stock: 410, price: 65, expiry: '2027-05', status: 'Available', manufacturer: 'Torrent' },
  { id: 7, name: 'Azithromycin 500mg', category: 'Antibiotic', stock: 150, price: 180, expiry: '2026-12', status: 'Available', manufacturer: 'Cipla' },
  { id: 8, name: 'Insulin Glargine', category: 'Insulin', stock: 12, price: 850, expiry: '2026-07', status: 'Critical', manufacturer: 'Sanofi' },
];

const recentOrders = [
  { id: 'RX-2024-001', patient: 'Ravi Kumar', doctor: 'Dr. Priya Sharma', drugs: 3, total: 342, status: 'Dispensed', time: '10 mins ago' },
  { id: 'RX-2024-002', patient: 'Lakshmi Devi', doctor: 'Dr. Arun Reddy', drugs: 2, total: 165, status: 'Pending', time: '25 mins ago' },
  { id: 'RX-2024-003', patient: 'Venkat Rao', doctor: 'Dr. Sunitha Nair', drugs: 5, total: 890, status: 'Processing', time: '1 hr ago' },
  { id: 'RX-2024-004', patient: 'Meena Iyer', doctor: 'Dr. Rajesh Kumar', drugs: 1, total: 850, status: 'Dispensed', time: '2 hrs ago' },
];

export default function Pharmacy() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({ drugs: 0, orders: 0, revenue: 0, alerts: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        drugs: Math.min(prev.drugs + 84, 8420),
        orders: Math.min(prev.orders + 4, 347),
        revenue: Math.min(prev.revenue + 1250, 124580),
        alerts: 5,
      }));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const categories = ['All', ...new Set(drugs.map(d => d.category))];
  const filtered = drugs.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'All' || d.category === filterCategory)
  );

  const addToCart = (drug) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === drug.id);
      if (existing) return prev.map(c => c.id === drug.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...drug, qty: 1 }];
    });
  };

  const totalCart = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div className="pharmacy-page">
      {/* Header */}
      <div className="pharmacy-header">
        <div className="pharmacy-header-content">
          <div className="pharmacy-title-group">
            <div className="pharmacy-icon-badge">💊</div>
            <div>
              <h1>Smart Pharmacy</h1>
              <p>Drug Inventory & Prescription Management System</p>
            </div>
          </div>
          <div className="pharmacy-live-badge">
            <span className="live-dot"></span> LIVE SYSTEM
          </div>
        </div>

        {/* Stats */}
        <div className="pharmacy-stats">
          <div className="pharm-stat-card blue">
            <div className="pharm-stat-icon">🏷️</div>
            <div className="pharm-stat-value">{animatedStats.drugs.toLocaleString()}</div>
            <div className="pharm-stat-label">Total Drug Units</div>
          </div>
          <div className="pharm-stat-card green">
            <div className="pharm-stat-icon">📋</div>
            <div className="pharm-stat-value">{animatedStats.orders}</div>
            <div className="pharm-stat-label">Today's Orders</div>
          </div>
          <div className="pharm-stat-card purple">
            <div className="pharm-stat-icon">💰</div>
            <div className="pharm-stat-value">₹{animatedStats.revenue.toLocaleString()}</div>
            <div className="pharm-stat-label">Today's Revenue</div>
          </div>
          <div className="pharm-stat-card red">
            <div className="pharm-stat-icon">⚠️</div>
            <div className="pharm-stat-value">{animatedStats.alerts}</div>
            <div className="pharm-stat-label">Stock Alerts</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pharmacy-tabs">
        {['inventory', 'orders', 'dispense'].map(tab => (
          <button
            key={tab}
            className={`pharm-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'inventory' ? '📦 Inventory' : tab === 'orders' ? '📋 Recent Orders' : '🛒 Dispense Counter'}
          </button>
        ))}
      </div>

      <div className="pharmacy-body">
        {activeTab === 'inventory' && (
          <div className="pharm-inventory">
            <div className="pharm-filters">
              <input
                type="text"
                className="pharm-search"
                placeholder="🔍 Search drugs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="pharm-category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`pharm-cat-btn ${filterCategory === cat ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>

            <div className="pharm-drug-grid">
              {filtered.map(drug => (
                <div key={drug.id} className={`pharm-drug-card ${drug.status === 'Critical' ? 'critical' : drug.status === 'Low Stock' ? 'low' : ''}`}>
                  <div className="drug-card-header">
                    <div className="drug-icon">💊</div>
                    <span className={`drug-status-badge ${drug.status.replace(' ', '-').toLowerCase()}`}>{drug.status}</span>
                  </div>
                  <h3>{drug.name}</h3>
                  <p className="drug-category">{drug.category}</p>
                  <p className="drug-manufacturer">by {drug.manufacturer}</p>
                  <div className="drug-details">
                    <div className="drug-detail"><span>Stock</span><strong>{drug.stock} units</strong></div>
                    <div className="drug-detail"><span>Price</span><strong>₹{drug.price}</strong></div>
                    <div className="drug-detail"><span>Expiry</span><strong>{drug.expiry}</strong></div>
                  </div>
                  {drug.stock > 0 && (
                    <div className="stock-bar">
                      <div className="stock-fill" style={{ width: `${Math.min((drug.stock / 1500) * 100, 100)}%`, background: drug.status === 'Critical' ? '#ef4444' : drug.status === 'Low Stock' ? '#f59e0b' : '#10b981' }}></div>
                    </div>
                  )}
                  <button className="add-to-cart-btn" onClick={() => addToCart(drug)}>+ Add to Prescription</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="pharm-orders">
            <h2>Recent Prescription Orders</h2>
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Rx ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Drugs</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td><code>{order.id}</code></td>
                      <td>{order.patient}</td>
                      <td>{order.doctor}</td>
                      <td>{order.drugs} items</td>
                      <td>₹{order.total}</td>
                      <td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td>{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'dispense' && (
          <div className="pharm-dispense">
            <div className="dispense-left">
              <h2>🛒 Dispensing Cart</h2>
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">💊</div>
                  <p>No drugs added. Go to Inventory to add drugs.</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <strong>{item.name}</strong>
                        <p>₹{item.price} × {item.qty}</p>
                      </div>
                      <div className="cart-item-total">₹{item.price * item.qty}</div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <strong>Grand Total</strong>
                    <strong>₹{totalCart}</strong>
                  </div>
                  <button className="dispense-btn" onClick={() => setCart([])}>✅ Dispense & Print Bill</button>
                </>
              )}
            </div>
            <div className="dispense-right">
              <h2>📋 Patient Info</h2>
              <form className="dispense-form">
                <input type="text" placeholder="Patient Name" className="pharm-input" />
                <input type="text" placeholder="Patient ID / Mobile" className="pharm-input" />
                <input type="text" placeholder="Doctor Name" className="pharm-input" />
                <textarea placeholder="Prescription Notes" className="pharm-textarea" rows={4}></textarea>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
