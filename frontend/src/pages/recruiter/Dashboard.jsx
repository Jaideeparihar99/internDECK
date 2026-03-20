import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import '../../styles/global.css';

export default function RecruiterDashboard() {
  const [stats] = useState({
    viewed: 148,
    shortlisted: 42,
    offers: 15,
  });

  const auditLog = [
    { date: '2024-03-20', action: 'Viewed profile', student: 'Raj Kumar' },
    { date: '2024-03-20', action: 'Added to shortlist', student: 'Priya Singh' },
    { date: '2024-03-19', action: 'Sent offer', student: 'Amit Patel' },
  ];

  const sidebarItems = [
    { label: 'Dashboard', path: '/recruiter/dashboard' },
    { label: 'Search', path: '/recruiter/search' },
    { label: 'Pipeline', path: '/recruiter/pipeline' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Recruiter Dashboard</h1>

          <div className="stats-grid">
            <StatCard title="Profiles Viewed" value={stats.viewed} />
            <StatCard title="Shortlisted" value={stats.shortlisted} />
            <StatCard title="Offers Sent" value={stats.offers} />
          </div>

          <div className="dashboard-section">
            <h2>Access Audit Log</h2>
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Student</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log, index) => (
                  <tr key={index}>
                    <td>{log.date}</td>
                    <td>{log.action}</td>
                    <td>{log.student}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
