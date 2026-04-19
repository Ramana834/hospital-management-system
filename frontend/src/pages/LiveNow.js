import React, { useState, useEffect, useRef } from 'react';

// Road network nodes for Hyderabad/Vizag region (percentage-based coords)
const ROUTES = [
  { id: 'AMB-101', color: '#f43f5e', status: 'EMERGENCY', from: 'Madhapur', to: 'MahaLakshmi Hospital',
    waypoints: [{x:15,y:20},{x:22,y:28},{x:30,y:35},{x:38,y:42},{x:45,y:48},{x:52,y:50}] },
  { id: 'AMB-204', color: '#f59e0b', status: 'EN-ROUTE',  from: 'HITEC City', to: 'MahaLakshmi Hospital',
    waypoints: [{x:70,y:75},{x:65,y:68},{x:60,y:60},{x:58,y:55},{x:55,y:52},{x:52,y:50}] },
  { id: 'AMB-098', color: '#10b981', status: 'STANDBY',   from: 'Base Station', to: 'Standby',
    waypoints: [{x:80,y:30},{x:80,y:30},{x:80,y:30}] },
];

const HOSPITAL_POS = { x: 52, y: 50 };

const LiveNow = () => {
  const [positions, setPositions] = useState(ROUTES.map(r => ({ id: r.id, wpIdx: 0, cur: r.waypoints[0] })));
  const [selected, setSelected] = useState(null);
  const [elapsed, setElapsed] = useState({ 'AMB-101': 0, 'AMB-204': 0 });
  const tickRef = useRef(0);

  // Animate ambulances along their waypoints
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      setPositions(prev => prev.map(pos => {
        const route = ROUTES.find(r => r.id === pos.id);
        if (!route || route.status === 'STANDBY') return pos;
        const nextIdx = Math.min(pos.wpIdx + 1, route.waypoints.length - 1);
        const target = route.waypoints[nextIdx];
        // Smooth interpolation toward next waypoint
        const speed = 0.08;
        const newX = pos.cur.x + (target.x - pos.cur.x) * speed;
        const newY = pos.cur.y + (target.y - pos.cur.y) * speed;
        const arrived = Math.abs(newX - target.x) < 0.5 && Math.abs(newY - target.y) < 0.5;
        return { ...pos, wpIdx: arrived ? nextIdx : pos.wpIdx, cur: { x: newX, y: newY } };
      }));
      // Update ETA
      if (tickRef.current % 5 === 0) {
        setElapsed(prev => ({ 'AMB-101': prev['AMB-101'] + 5, 'AMB-204': prev['AMB-204'] + 5 }));
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const getETA = (id) => {
    const pos = positions.find(p => p.id === id);
    const route = ROUTES.find(r => r.id === id);
    if (!route || !pos) return '-';
    const remaining = route.waypoints.length - 1 - pos.wpIdx;
    const mins = Math.max(0, remaining * 2);
    return mins === 0 ? 'ARRIVED' : `~${mins} min`;
  };

  const getProgress = (id) => {
    const pos = positions.find(p => p.id === id);
    const route = ROUTES.find(r => r.id === id);
    if (!route) return 0;
    return Math.round((pos.wpIdx / (route.waypoints.length - 1)) * 100);
  };

  return (
    <div style={{ padding: '100px 20px 60px', background: 'var(--elite-dark)', minHeight: '100vh', color: 'white' }}>
      <style>{`
        @keyframes amb-pulse {
          0%,100% { box-shadow: 0 0 8px currentColor, 0 0 20px currentColor; transform: translate(-50%,-50%) scale(1); }
          50% { box-shadow: 0 0 14px currentColor, 0 0 35px currentColor; transform: translate(-50%,-50%) scale(1.3); }
        }
        @keyframes hospital-ping {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(3); }
        }
        .amb-dot { animation: amb-pulse 1.2s infinite ease-in-out; }
        .route-card { transition: all 0.3s ease; cursor: pointer; }
        .route-card:hover { transform: translateX(4px); }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '5px', color: '#f43f5e', marginBottom: '12px', fontWeight: '900' }}>
            🚨 LIVE EMERGENCY DISPATCH
          </div>
          <h1 style={{ fontSize: '3.5rem', margin: 0, fontWeight: '900', background: 'linear-gradient(135deg, #f43f5e, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LIVE OPS 360
          </h1>
          <p style={{ opacity: 0.5, fontSize: '1rem', marginTop: '10px' }}>Real-time Ambulance Tracking — Hyderabad & Vizag Region</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px' }}>

          {/* Map Panel */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {/* Map header status bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem' }}>
                <span style={{ opacity: 0.5 }}>📍 LIVE TRACKING</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>● SIGNAL STRONG</span>
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                {new Date().toLocaleTimeString('en-IN')} IST
              </div>
            </div>

            {/* SVG Map */}
            <div style={{ position: 'relative', height: '500px', background: '#060d1e', overflow: 'hidden' }}>

              {/* Grid */}
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                {/* Background grid */}
                {[...Array(16)].map((_, i) => (
                  <React.Fragment key={i}>
                    <line x1={`${i * 6.25}%`} y1="0" x2={`${i * 6.25}%`} y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="0" y1={`${i * 6.25}%`} x2="100%" y2={`${i * 6.25}%`} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </React.Fragment>
                ))}

                {/* Road network */}
                {[
                  'M 10% 15% Q 30% 20% 52% 50%',
                  'M 70% 10% Q 65% 30% 52% 50%',
                  'M 85% 25% Q 75% 38% 52% 50%',
                  'M 20% 80% Q 38% 65% 52% 50%',
                  'M 52% 50% Q 55% 65% 60% 85%',
                  'M 5% 50% Q 25% 48% 52% 50%',
                ].map((d, i) => (
                  <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                ))}

                {/* Route paths for active ambulances */}
                {ROUTES.filter(r => r.status !== 'STANDBY').map(route => (
                  <polyline
                    key={route.id}
                    points={route.waypoints.map(w => `${w.x}% ${w.y}%`).join(' ')}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    opacity="0.35"
                  />
                ))}

                {/* Progress trail for each ambulance */}
                {ROUTES.filter(r => r.status !== 'STANDBY').map((route, ri) => {
                  const pos = positions.find(p => p.id === route.id);
                  if (!pos) return null;
                  const trailPts = [...route.waypoints.slice(0, pos.wpIdx + 1), pos.cur];
                  return (
                    <polyline
                      key={`trail-${route.id}`}
                      points={trailPts.map(w => `${w.x}% ${w.y}%`).join(' ')}
                      fill="none"
                      stroke={route.color}
                      strokeWidth="2.5"
                      opacity="0.7"
                    />
                  );
                })}

                {/* Waypoint dots */}
                {ROUTES.filter(r => r.status !== 'STANDBY').map(route =>
                  route.waypoints.map((w, i) => (
                    <circle key={`${route.id}-wp-${i}`} cx={`${w.x}%`} cy={`${w.y}%`} r="3" fill={route.color} opacity="0.3" />
                  ))
                )}
              </svg>

              {/* Hospital marker */}
              <div style={{ position: 'absolute', left: HOSPITAL_POS.x + '%', top: HOSPITAL_POS.y + '%', zIndex: 20 }}>
                <div style={{
                  position: 'absolute',
                  width: '50px', height: '50px',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,242,254,0.4)',
                  transform: 'translate(-50%,-50%)',
                  animationName: 'hospital-ping',
                  animationDuration: '2s',
                  animationIterationCount: 'infinite',
                }} />
                <div style={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,10,30,0.9)',
                  border: '2px solid var(--neon-blue)',
                  borderRadius: '10px',
                  padding: '5px 10px',
                  textAlign: 'center',
                  zIndex: 21,
                  whiteSpace: 'nowrap',
                }}>
                  <div style={{ fontSize: '1rem' }}>🏥</div>
                  <div style={{ fontSize: '0.55rem', fontWeight: 'bold', color: 'var(--neon-blue)', letterSpacing: '0.5px' }}>MAHALAKSHMI</div>
                </div>
              </div>

              {/* Ambulance markers */}
              {positions.map(pos => {
                const route = ROUTES.find(r => r.id === pos.id);
                if (!route) return null;
                return (
                  <div
                    key={pos.id}
                    style={{
                      position: 'absolute',
                      left: pos.cur.x + '%',
                      top: pos.cur.y + '%',
                      zIndex: 30,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelected(selected === pos.id ? null : pos.id)}
                  >
                    {/* Pulsing glow dot */}
                    <div className={route.status !== 'STANDBY' ? 'amb-dot' : ''} style={{
                      width: '16px', height: '16px',
                      borderRadius: '50%',
                      background: route.color,
                      position: 'absolute',
                      transform: 'translate(-50%,-50%)',
                      color: route.color,
                      border: '2px solid rgba(255,255,255,0.6)',
                    }} />
                    {/* Label */}
                    <div style={{
                      position: 'absolute',
                      left: '14px',
                      top: '-10px',
                      background: 'rgba(0,0,0,0.85)',
                      border: `1px solid ${route.color}`,
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      color: route.color,
                    }}>
                      🚑 {pos.id}
                    </div>

                    {/* Popup on click */}
                    {selected === pos.id && (
                      <div style={{
                        position: 'absolute',
                        left: '14px', top: '10px',
                        background: 'rgba(0,5,20,0.95)',
                        border: `1px solid ${route.color}`,
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '0.7rem',
                        zIndex: 50,
                        minWidth: '160px',
                      }}>
                        <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: route.color }}>{pos.id}</p>
                        <p style={{ margin: '2px 0', opacity: 0.7 }}>From: {route.from}</p>
                        <p style={{ margin: '2px 0', opacity: 0.7 }}>To: {route.to}</p>
                        <p style={{ margin: '2px 0', color: '#10b981', fontWeight: 'bold' }}>ETA: {getETA(pos.id)}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Zone labels */}
              <div style={{ position: 'absolute', top: '8%', left: '8%', fontSize: '0.6rem', opacity: 0.25, fontWeight: 'bold', letterSpacing: '2px' }}>MADHAPUR</div>
              <div style={{ position: 'absolute', top: '5%', right: '15%', fontSize: '0.6rem', opacity: 0.25, fontWeight: 'bold', letterSpacing: '2px' }}>HITEC CITY</div>
              <div style={{ position: 'absolute', bottom: '12%', left: '15%', fontSize: '0.6rem', opacity: 0.25, fontWeight: 'bold', letterSpacing: '2px' }}>BANJARA HILLS</div>
              <div style={{ position: 'absolute', bottom: '8%', right: '8%', fontSize: '0.6rem', opacity: 0.25, fontWeight: 'bold', letterSpacing: '2px' }}>GACHIBOWLI</div>

              {/* Legend */}
              <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.6rem', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#f43f5e' }}>● Emergency</span>
                <span style={{ color: '#f59e0b' }}>● En-Route</span>
                <span style={{ color: '#10b981' }}>● Standby</span>
              </div>
            </div>
          </div>

          {/* Right: Ambulance cards + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {ROUTES.map(route => {
              const pos = positions.find(p => p.id === route.id);
              const progress = getProgress(route.id);
              const eta = getETA(route.id);
              return (
                <div
                  key={route.id}
                  className="route-card"
                  onClick={() => setSelected(selected === route.id ? null : route.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: selected === route.id ? `rgba(${route.color === '#f43f5e' ? '244,63,94' : route.color === '#f59e0b' ? '245,158,11' : '16,185,129'},0.08)` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selected === route.id ? route.color : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: '900', fontSize: '1rem' }}>🚑 {route.id}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.7rem', opacity: 0.5 }}>
                        {route.from} → {route.to}
                      </p>
                    </div>
                    <span style={{
                      background: route.color,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: '900',
                      letterSpacing: '1px',
                    }}>
                      {route.status}
                    </span>
                  </div>

                  {route.status !== 'STANDBY' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '6px', opacity: 0.7 }}>
                        <span>Route Progress</span>
                        <span style={{ color: route.color, fontWeight: 'bold' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', marginBottom: '10px' }}>
                        <div style={{ height: '100%', width: progress + '%', background: route.color, borderRadius: '3px', transition: 'width 0.5s ease', boxShadow: `0 0 8px ${route.color}` }} />
                      </div>
                      <div style={{ display: 'flex', gap: '15px', fontSize: '0.72rem' }}>
                        <div>
                          <span style={{ opacity: 0.5 }}>ETA </span>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{eta}</span>
                        </div>
                        <div>
                          <span style={{ opacity: 0.5 }}>Speed </span>
                          <span style={{ fontWeight: 'bold' }}>~{Math.floor(60 + Math.random() * 20)} km/h</span>
                        </div>
                      </div>
                    </>
                  )}

                  {route.status === 'STANDBY' && (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#10b981' }}>✔ Ready for dispatch</p>
                  )}
                </div>
              );
            })}

            {/* Stats */}
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h4 style={{ margin: '0 0 15px', fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.6 }}>REGIONAL LOAD</h4>
              {[
                { region: 'Telangana Hub', load: 88, color: '#f43f5e' },
                { region: 'Andhra Pradesh Hub', load: 71, color: '#f59e0b' },
                { region: 'Available Fleet', load: 34, color: '#10b981' },
              ].map(item => (
                <div key={item.region} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px', opacity: 0.8 }}>
                    <span>{item.region}</span>
                    <span style={{ color: item.color, fontWeight: 'bold' }}>{item.load}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: item.load + '%', background: item.color, borderRadius: '2px', boxShadow: `0 0 6px ${item.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveNow;
