// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your page components
import Home from './Home';
import TherapistsPage from './pages/TherapistsPage';
import ClientsPage from './pages/ClientsPage';
import SessionsPage from './pages/SessionsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="app-container">
        {/* Simple Navigation */}
        <nav style={{ padding: '1rem', background: '#333' }}>
          <a href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</a>
          <a href="/therapists" style={{ color: 'white', marginRight: '1rem' }}>Therapists</a>
          <a href="/clients" style={{ color: 'white', marginRight: '1rem' }}>Clients</a>
          <a href="/sessions" style={{ color: 'white' }}>Sessions</a>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/therapists" element={<TherapistsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);