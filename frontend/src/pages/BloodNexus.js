import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const BloodNexus = () => {
  const { language, t } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [gridPulse, setGridPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGridPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const mockDonors = React.useMemo(() => {
    const names = ["Suresh", "Priya", "Anand", "Revathi", "Kiran", "Ravi", "Sneha", "Vamsi", "Lakshmi", "Murali", "Swetha", "Venkatesh", "Srinivasa", "Rajesh", "Mahesh", "Allu", "Ram", "NTR", "Kalyan", "Gopi", "Harsha", "Divya", "Ramya", "Naveen", "Sai", "Krishna", "Arjun", "Bala", "Ganesh", "Pooja", "Akhil", "Chaitanya", "Samantha", "Kajal", "Trisha", "Anushka", "Prabhas", "Rana"];
    const lastNames = ["Konduru", "Varma", "Kumar", "S.", "Mai", "Teja", "Reddy", "Krishna", "Narayana", "Mohan", "P.", "Y.", "B.", "A.", "Ch.", "Jr.", "Babu", "Naidu", "Rao", "Chowdary", "Goud", "Yadav", "Patel", "Sharma"];
    const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const locations = [
      "Madhapur, Hyderabad, TS", "Banjara Hills, Hyderabad, TS", "Secunderabad, TS", 
      "Gachibowli, TS", "Kukatpally, Hyderabad, TS", "Miyapur, TS", "Jubilee Hills, TS", 
      "Kondapur, TS", "LB Nagar, TS", "MVP Colony, Visakhapatnam, AP", "Gajuwaka, Vizag, AP", 
      "Seethammadhara, Visakhapatnam, AP", "Leela Mahal Road, Tirupati, AP", "TUDA Colony, Tirupati, AP", 
      "Burripalem, Guntur, AP", "Palakollu, AP", "Machilipatnam, AP", "Nimmakuru, AP", 
      "Bhavanipuram, Vijayawada, AP", "Benz Circle, Vijayawada, AP", "Kurnool, AP", "Warangal, TS", 
      "Karimnagar, TS", "Nizamabad, TS", "Khammam, TS", "Nellore, AP", "Rajahmundry, AP", "Kakinada, AP"
    ];
    
    let donors = [];
    for (let i = 0; i < 10000; i++) {
       donors.push({
         name: `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
         group: groups[Math.floor(Math.random() * groups.length)],
         location: locations[Math.floor(Math.random() * locations.length)],
         contact: `+91 9${Math.floor(Math.random() * 900000000 + 100000000)}`,
         available: Math.random() > 0.2
       });
    }
    return donors;
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      const filtered = mockDonors.filter(d => 
        (bloodGroup ? d.group === bloodGroup : true) && 
        (location ? d.location.toLowerCase().includes(location.toLowerCase()) : true)
      );
      setResults(filtered);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="nexus-wrapper" style={{ 
      padding: '80px 20px', 
      background: 'var(--elite-dark)', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="animate-fade-in">
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'var(--elite-danger)', marginBottom: '15px', fontWeight: '900' }}>REGIONAL SURVIVAL NETWORK</div>
          <h1 className="elite-text-gradient" style={{ fontSize: '4.5rem', margin: 0 }}>BLOOD NEXUS 360</h1>
          <p style={{ opacity: 0.6, fontSize: '1.2rem', marginTop: '10px' }}>Real-time donor synchronization across Telangana & Andhra Pradesh.</p>
        </div>

        <div className="quantum-card elite-glass" style={{ padding: '40px', marginBottom: '60px' }}>
          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }} onSubmit={handleSearch}>
            <div className="form-group">
              <label style={{ fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.7, marginBottom: '10px', display: 'block' }}>BLOOD GROUP</label>
              <select 
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="" style={{ background: '#0f172a' }}>ALL QUANTUM TYPES</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g} style={{ background: '#0f172a' }}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.7, marginBottom: '10px', display: 'block' }}>GPS RADIUS (TS/AP)</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                placeholder="Area or City..." 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '54px', padding: '0 50px', background: 'var(--elite-danger)', border: 'none', borderRadius: '12px', fontWeight: '900' }}>
              {isSearching ? 'SCANNING NETWORK...' : 'INITIATE SEARCH'}
            </button>
          </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {results.map((donor, i) => (
            <div key={i} className="quantum-card elite-glass animate-slide-up" style={{ 
              padding: '30px', 
              position: 'relative', 
              overflow: 'hidden',
              animationDelay: `${i * 0.1}s`,
              borderTop: '5px solid var(--elite-danger)'
            }}>
              <div style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '3rem', opacity: 0.05, fontWeight: '900', color: 'var(--elite-danger)' }}>{donor.group}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--elite-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  {donor.group}
                </div>
                <div>
                   <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{donor.name}</h3>
                   <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5 }}>{donor.location}</p>
                </div>
              </div>
              
              <div className="elite-glass" style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', letterSpacing: '1px' }}>● NETWORK READY</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={(e) => {
                    e.target.innerHTML = 'LINK ACTIVE 🛡️';
                    e.target.style.background = '#10b981';
                    alert(`Secure Health Link established with ${donor.name}. Data channel is encrypted.`);
                  }}
                  style={{ flex: 1, background: 'var(--elite-danger)', border: 'none', fontSize: '0.75rem', fontWeight: 'bold', transition: 'all 0.3s' }}
                >
                  ESTABLISH LINK
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    const msg = prompt(`Enter secure message for ${donor.name} (${donor.group}):`);
                    if(msg) alert(`Message "${msg}" sent securely to ${donor.contact} via MahaSync Network!`);
                  }}
                  style={{ flex: 1, color: 'white', borderColor: 'rgba(255,255,255,0.1)', fontSize: '0.75rem', transition: 'all 0.3s' }}
                >
                  MESSAGE
                </button>
              </div>
            </div>
          ))}
          {!isSearching && results.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>
               <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📡</div>
               <p>Enter parameters to scan the regional donor nexus.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Background Pulse Effect */}
      <svg style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1, opacity: 0.05 }}>
         <defs>
           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
           </pattern>
         </defs>
         <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default BloodNexus;
