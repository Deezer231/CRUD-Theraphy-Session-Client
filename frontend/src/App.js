import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import TherapistsPage from './pages/TherapistsPage';
import ClientsPage from './pages/ClientsPage';
import SessionsPage from './pages/SessionsPage';
import './App.css';

function App() {
  return (
    <Router>
      <nav className="main-nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/therapists" className="nav-link">Therapists</Link>
        <Link to="/clients" className="nav-link">Clients</Link>
        <Link to="/sessions" className="nav-link">Sessions</Link>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/therapists" element={<TherapistsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;