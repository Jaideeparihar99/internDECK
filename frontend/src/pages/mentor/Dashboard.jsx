import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function MentorDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const approvals = await api.getPendingApprovals();
        setStats({
          pending: approvals.data.length,
          students: 150,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', path: '/mentor/dashboard' },
    { label: 'Pending Approvals', path: '/mentor/approvals' },
    { label: 'Students', path: '/mentor/students' },
    { label: 'Feedback', path: '/mentor/feedback' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Mentor Dashboard</h1>

          <div className="stats-grid">
            <StatCard title="Pending Approvals" value={stats.pending} />
            <StatCard title="Students Mentored" value={stats.students} />
          </div>

          <div className="dashboard-section">
            <h2>Recent Student Applications</h2>
            <p>Navigate to Pending Approvals to review student applications.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
