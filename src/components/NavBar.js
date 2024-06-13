import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/chat" className="nav-logo">
        <img src="./logo.jpg" width="100" height="60" alt="logo"/>
      </Link>
      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/chat">Chat</Link>
          </li>
          <li className="nav-item">
            <Link to="/text-to-speech-translate">Translate</Link>
          </li>
          <li className="nav-item">
            <Link to="/speech-to-text">Speech to Text</Link>
          </li>          
          <li className="nav-item">
            <Link to="/change-password">Change Password</Link>
          </li>
        </ul>
      </div>
      <div className="sign-menu">
        {isAuthenticated ? (
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login"></Link>
        )}
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
    </nav>
  );
};

export default NavBar;
