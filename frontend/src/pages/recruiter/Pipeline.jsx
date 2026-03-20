import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../styles/global.css';

export default function RecruiterPipeline() {
  const [pipeline] = useState([
    { stage: 'Viewed', count: 148 },
    { stage: 'Interested', count: 92 },
    { stage: 'Shortlisted', count: 42 },
    { stage: 'Interviewed', count: 28 },
    { stage: 'Offered', count: 15 },
  ]);

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
          <h1>Recruitment Pipeline</h1>

          <div className="pipeline-visualization">
            {pipeline.map((stage, index) => (
              <div key={index} className="pipeline-stage">
                <div className="stage-box">
                  <h3>{stage.stage}</h3>
                  <p className="stage-count">{stage.count}</p>
                </div>
                {index < pipeline.length - 1 && <div className="stage-arrow">→</div>}
              </div>
            ))}
          </div>

          <div className="pipeline-details">
            <h2>Pipeline Statistics</h2>
            <p>Conversion Rate: {parseFloat((15 / 148) * 100).toFixed(2)}%</p>
            <p>Average Time to Offer: 3 weeks</p>
          </div>
        </main>
      </div>
    </div>
  );
}
