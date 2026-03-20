import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/global.css';

export default function Sidebar({ items }) {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
