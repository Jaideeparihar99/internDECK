import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import MatchCard from '../../components/MatchCard';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentMatches() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.getRecommended();
        setRecommendations(response.data);
      } catch (err) {
        setError('Failed to fetch recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleApply = async (companyId) => {
    try {
      await api.applyToCompany(companyId);
      alert('Application submitted successfully!');
      // Refresh the page or update the state
    } catch (err) {
      alert('Failed to apply: ' + err.message);
    }
  };

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
          <h1>AI Matched Roles</h1>

          {error && <div className="error-message">{error}</div>}
          {loading && <p>Loading matches...</p>}

          <div className="matches-grid">
            {recommendations.map((rec) => (
              <MatchCard
                key={rec.company._id}
                company={rec.company}
                score={rec.score}
                breakdown={rec.breakdown}
                onApply={() => handleApply(rec.company._id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
