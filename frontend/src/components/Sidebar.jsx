import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navConfigs = {
  student: [
    { to: '/student', label: 'Dashboard', icon: '🏠' },
    { to: '/student/companies', label: 'Browse Jobs', icon: '🏢' },
    { to: '/student/applications', label: 'Applications', icon: '📋' },
    { to: '/student/interviews', label: 'Interviews', icon: '📅' },
    { to: '/student/certificates', label: 'Certificates', icon: '🏆' },
    { to: '/student/profile', label: 'Profile', icon: '👤' },
  ],
  mentor: [
    { to: '/mentor', label: 'Dashboard', icon: '🏠' },
    { to: '/mentor/approvals', label: 'Pending Approvals', icon: '✅' },
    { to: '/mentor/students', label: 'My Students', icon: '👥' },
    { to: '/mentor/feedback', label: 'Give Feedback', icon: '📝' },
  ],
  placement_cell: [
    { to: '/placement', label: 'Dashboard', icon: '🏠' },
    { to: '/placement/companies', label: 'Companies', icon: '🏢' },
    { to: '/placement/students', label: 'Students', icon: '👥' },
    { to: '/placement/interviews', label: 'Interviews', icon: '📅' },
  ],
  recruiter: [
    { to: '/recruiter', label: 'Dashboard', icon: '🏠' },
    { to: '/recruiter/search', label: 'Search Students', icon: '🔍' },
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return null;

  const links = navConfigs[user.role] || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎓 CampusConnect</div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="sidebar-user-name">{user.name}</div>
        <div className="sidebar-user-role">{user.role.replace('_', ' ')}</div>
        <button className="logout-btn" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );
}
