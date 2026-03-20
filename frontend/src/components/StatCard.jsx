import React from 'react';
import '../styles/global.css';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}
