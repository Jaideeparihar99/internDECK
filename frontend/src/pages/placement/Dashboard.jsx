import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function PlacementDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    unplaced: 0,
    interviews: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getPlacementStats();
        setStats({
          total: response.data.totalStudents,
          placed: response.data.placedCount,
          unplaced: response.data.unplacedCount,
          interviews: 12,
          offers: 8,
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
    { label: 'Dashboard', path: '/placement/dashboard' },
    { label: 'Post Company', path: '/placement/post-company' },
    { label: 'All Students', path: '/placement/all-students' },
    { label: 'Statistics', path: '/placement/stats' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Placement Dashboard</h1>

          <div className="stats-grid">
            <StatCard title="Total Students" value={stats.total} />
            <StatCard title="Placed" value={stats.placed} />
            <StatCard title="Unplaced" value={stats.unplaced} />
            <StatCard title="Interviews Today" value={stats.interviews} />
            <StatCard title="Offers This Week" value={stats.offers} />
          </div>

          <div className="dashboard-section">
            <h2>Unplaced Students</h2>
            <table className="unplaced-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vikram Singh</td>
                  <td>CSE</td>
                  <td>7.5</td>
                  <td><button className="btn btn-small">Nudge</button></td>
                </tr>
                <tr>
                  <td>Neha Sharma</td>
                  <td>ECE</td>
                  <td>8.2</td>
                  <td><button className="btn btn-small">Nudge</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
