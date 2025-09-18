import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/therapists" className="nav-link">Therapists</Link>
      <Link to="/Clients" className="nav-link">Clients</Link>
      <Link to="/sessions" className="nav-link">Sessions</Link>
    </nav>
  );
};

export default Navbar;ClientsPage