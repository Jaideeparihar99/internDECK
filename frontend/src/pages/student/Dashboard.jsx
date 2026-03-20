import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyApplications(),
      api.getMyInterviews(),
      api.getRecommended()
    ]).then(([a, i, r]) => {
      setApps(a);
      setInterviews(i);
      setRecommended(r);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const score = user.employabilityScore || {};
  const avgScore = Object.values(score).length
    ? Math.round(Object.values(score).reduce((a, b) => a + b, 0) / Object.values(score).length * 10)
    : 0;

  const statusColor = { approved: 'green', rejected: 'red', pending_mentor: 'amber', offered: 'purple', shortlisted: 'blue' };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Welcome back, {user.name?.split(' ')[0]} 👋</h1>
          <p className="page-sub">{user.branch} · {user.rollNumber} · CGPA: {user.cgpa}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-accent-blue">
            <div className="stat-value">{apps.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card stat-accent-green">
            <div className="stat-value">{apps.filter(a => a.status === 'approved' || a.status === 'offered').length}</div>
            <div className="stat-label">Approved / Offered</div>
          </div>
          <div className="stat-card stat-accent-purple">
            <div className="stat-value">{interviews.length}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
          <div className="stat-card stat-accent-amber">
            <div className="stat-value">{avgScore}%</div>
            <div className="stat-label">Employability Score</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Employability Score */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">📊 Employability Scores</span>
            </div>
            {Object.entries({ technical: 'Technical', communication: 'Communication', teamwork: 'Teamwork', problemSolving: 'Problem Solving' }).map(([key, label]) => (
              <div className="score-bar-wrap" key={key}>
                <div className="score-bar-label">
                  <span>{label}</span>
                  <span>{(score[key] || 0) * 10}%</span>
                </div>
                <div className="score-bar-track">
                  <div className="score-bar-fill" style={{ width: `${(score[key] || 0) * 10}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Top Recommendations */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">🤖 Top Recommendations</span>
            </div>
            {loading ? <div className="loading"><div className="spinner" /></div> :
              recommended.slice(0, 3).length === 0
                ? <div className="empty-state"><div className="empty-title">No recommendations yet</div></div>
                : recommended.slice(0, 3).map(({ company, score: s }) => (
                  <div key={company._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{company.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{company.role}</div>
                    </div>
                    <span className="badge badge-blue">{s}/100</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <span className="card-title">📋 Recent Applications</span>
          </div>
          {apps.length === 0
            ? <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">No applications yet</div><div className="empty-sub">Browse companies to get started</div></div>
            : <div className="table-wrap">
              <table>
                <thead><tr><th>Company</th><th>Role</th><th>Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {apps.slice(0, 5).map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 500 }}>{a.companyId?.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{a.companyId?.role}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                      <td><span className={`badge badge-${statusColor[a.status] || 'gray'}`}>{a.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>
    </div>
  );
}
