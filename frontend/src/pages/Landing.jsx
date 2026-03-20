import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-hero">
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 900, margin: '0 auto' }}>
        <div className="landing-logo">🎓 CampusConnect</div>
        <p className="landing-tagline">
          The smart campus placement portal — connecting students, mentors, companies, and placement teams in one unified platform.
        </p>
        <div className="landing-btns">
          <button className="landing-btn-primary" onClick={() => navigate('/register')}>
            Get Started
          </button>
          <button className="landing-btn-outline" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>

        <div className="landing-features">
          {[
            { icon: '🤖', title: 'AI Recommendations', desc: 'Personalized job matches based on skills and CGPA' },
            { icon: '✅', title: 'Mentor Workflow', desc: 'Streamlined approval process with mentor oversight' },
            { icon: '📊', title: 'Placement Analytics', desc: 'Real-time stats, branch-wise tracking, and insights' },
            { icon: '🏆', title: 'Auto Certificates', desc: 'Auto-generated verifiable internship certificates' },
          ].map(f => (
            <div key={f.title} className="landing-feature">
              <div className="landing-feature-icon">{f.icon}</div>
              <div className="landing-feature-title">{f.title}</div>
              <div className="landing-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
