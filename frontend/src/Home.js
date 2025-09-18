import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
// Import VANTA and THREE
import * as THREE from 'three';
import BIRDS from 'vanta/src/vanta.birds';

const Home = () => {
  const vantaRef = useRef(null);
  useEffect(() => {
    let vantaEffect;
    if (vantaRef.current) {
      vantaEffect = BIRDS({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color1: 0xfc0000,
        color2: 0x292996
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div ref={vantaRef} className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
      <header className="home-header" style={{ width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ textAlign: 'center', margin: 0 , color: 'mediumSeaGreen'}}>Therapist Client Management System</h1>
      </header>

      <div className="dashboard-cards" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <Link to="/therapists" className="dashboard-card therapist-card" style={{ background: '#f5f5f5', borderRadius: '12px', padding: '2rem', minWidth: '220px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textDecoration: 'none', color: 'inherit' }}>
          <div className="card-content">
            <div className="card-icon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
            <h2 style={{ margin: '1rem 0 0.5rem' }}>Therapists</h2>
            <p>Manage therapist profiles and availability</p>
          </div>
        </Link>

        <Link to="/clients" className="dashboard-card client-card" style={{ background: '#f5f5f5', borderRadius: '12px', padding: '2rem', minWidth: '220px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textDecoration: 'none', color: 'inherit' }}>
          <div className="card-content">
            <div className="card-icon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
            <h2 style={{ margin: '1rem 0 0.5rem' }}>Clients</h2>
            <p>View and update client information</p>
          </div>
        </Link>

        <Link to="/sessions" className="dashboard-card session-card" style={{ background: '#f5f5f5', borderRadius: '12px', padding: '2rem', minWidth: '220px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textDecoration: 'none', color: 'inherit' }}>
          <div className="card-content">
            <div className="card-icon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <h2 style={{ margin: '1rem 0 0.5rem' }}>Sessions</h2>
            <p>Schedule and track therapy sessions</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;