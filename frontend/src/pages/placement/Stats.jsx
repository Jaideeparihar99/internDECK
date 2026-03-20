import React from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../styles/global.css';

export default function PlacementStats() {
  const branches = [
    { name: 'CSE', total: 120, placed: 115, percentage: 96 },
    { name: 'ECE', total: 90, placed: 82, percentage: 91 },
    { name: 'MECH', total: 85, placed: 76, percentage: 89 },
    { name: 'CIVIL', total: 60, placed: 50, percentage: 83 },
  ];

  const topRecruiters = [
    { company: 'TCS', count: 45 },
    { company: 'Infosys', count: 38 },
    { company: 'Google', count: 25 },
    { company: 'Microsoft', count: 20 },
    { company: 'Amazon', count: 18 },
  ];

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
          <h1>Placement Statistics</h1>

          <div className="stats-section">
            <h2>Branch-wise Placement</h2>
            <div className="branch-bars">
              {branches.map((branch) => (
                <div key={branch.name} className="branch-bar">
                  <p>{branch.name}</p>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${branch.percentage}%` }}
                    >
                      {branch.percentage}%
                    </div>
                  </div>
                  <p className="bar-label">
                    {branch.placed}/{branch.total}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Top Recruiters</h2>
            <table className="recruiters-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Students Hired</th>
                </tr>
              </thead>
              <tbody>
                {topRecruiters.map((recruiter) => (
                  <tr key={recruiter.company}>
                    <td>{recruiter.company}</td>
                    <td>{recruiter.count}</td>
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
