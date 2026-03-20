import React from 'react';
import '../styles/global.css';

export default function MatchCard({ company, score, breakdown, onApply }) {
  const matchPercentage = score;
  const getScoreColor = (score) => {
    if (score >= 80) return '#1D9E75';
    if (score >= 60) return '#BA7517';
    return '#A32D2D';
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <h3>{company.name}</h3>
        <div className="match-score" style={{ backgroundColor: getScoreColor(matchPercentage) }}>
          {matchPercentage}%
        </div>
      </div>
      <p className="match-role">{company.roleName}</p>
      <p className="match-stipend">₹{company.stipend}/month</p>
      <div className="match-bar">
        <div
          className="match-bar-fill"
          style={{
            width: `${matchPercentage}%`,
            backgroundColor: getScoreColor(matchPercentage),
          }}
        ></div>
      </div>
      <div className="match-skills">
        {company.requiredSkills?.map((skill, i) => (
          <span key={i} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
      <button onClick={onApply} className="apply-btn">
        Apply Now
      </button>
    </div>
  );
}
