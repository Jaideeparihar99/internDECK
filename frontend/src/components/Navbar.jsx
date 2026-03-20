import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

export default function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          CampusConnect
        </Link>
      </div>
      <div className="navbar-right">
        {userRole && (
          <div className="navbar-user">
            <span className="user-name">{userName}</span>
            <span className="role-badge">{userRole.toUpperCase()}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
