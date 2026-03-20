import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.getCertificates();
        setCertificates(response.data);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
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
          <h1>My Certificates</h1>

          {loading ? (
            <p>Loading certificates...</p>
          ) : (
            <div>
              <div className="certificates-grid">
                {certificates.map((cert) => (
                  <div key={cert._id} className="certificate-card">
                    <h3>{cert.companyId?.name}</h3>
                    <p>Role: {cert.companyId?.roleName}</p>
                    <p>Verification Code: {cert.verificationCode}</p>
                    <p>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    {cert.certificateUrl && (
                      <a href={cert.certificateUrl} className="btn btn-primary" download>
                        Download Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <table className="feedback-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Punctuality</th>
                    <th>Technical</th>
                    <th>Teamwork</th>
                    <th>Communication</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert._id}>
                      <td>{cert.companyId?.name}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
