import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ApplicationRow from '../../components/ApplicationRow';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.getApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
          <h1>My Applications</h1>

          {loading ? (
            <p>Loading applications...</p>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Mentor Approval</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <ApplicationRow key={application._id} application={application} />
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
