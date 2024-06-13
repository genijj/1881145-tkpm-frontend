import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBarBootstrap.css';

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link to="/chat" className="navbar-brand">
          <img src="./logo.jpg" alt="Logo" width="100" height="60" className="d-inline-block align-top" />
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/chat" className="nav-link">Chat</Link>
            </li>
            <li className="nav-item">
              <Link to="/text-to-speech-translate" className="nav-link">Translator</Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/speech-to-text" className="nav-link">Speech to Text</Link>
            </li>*/}
          </ul>
          {isAuthenticated && (
            <ul className="navbar-nav ms-auto user-dropdown">
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hello, {username}
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><Link to="/update-user-info" className="dropdown-item">Edit Profile</Link></li>
                  <li><Link to="/change-password" className="dropdown-item">Change Password</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
