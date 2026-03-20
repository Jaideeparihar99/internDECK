import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    matchedRoles: 0,
    applications: 0,
    shortlisted: 0,
    interviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const applications = await api.getApplications();
        const shortlisted = applications.data.filter((app) => app.status === 'shortlisted').length;
        const interviews = applications.data.filter((app) => app.status === 'interview').length;

        setStats({
          matchedRoles: 15,
          applications: applications.data.length,
          shortlisted,
          interviews,
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
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'My Profile', path: '/student/profile' },
    { label: 'Matches', path: '/student/matches' },
    { label: 'Browse', path: '/student/browse' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Calendar', path: '/student/calendar' },
    { label: 'Certificates', path: '/student/certificates' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Dashboard</h1>
          <div className="stats-grid">
            <StatCard title="Matched Roles" value={stats.matchedRoles} />
            <StatCard title="Applications" value={stats.applications} />
            <StatCard title="Shortlisted" value={stats.shortlisted} />
            <StatCard title="Interviews This Week" value={stats.interviews} />
          </div>

          <div className="dashboard-section">
            <h2>Employability Score</h2>
            <div className="score-bar">
              <div className="score-dimension">
                <span>Technical</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="score-dimension">
                <span>Communication</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div className="score-dimension">
                <span>Teamwork</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div className="score-dimension">
                <span>Domain</span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Notifications</h2>
            <div className="notifications-list">
              <div className="notification">
                <p>Your application to TCS has been shortlisted</p>
                <span className="time">2 hours ago</span>
              </div>
              <div className="notification">
                <p>Interview scheduled with Google for tomorrow at 2 PM</p>
                <span className="time">1 day ago</span>
              </div>
              <div className="notification">
                <p>Mentor approved your application to Microsoft</p>
                <span className="time">3 days ago</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
