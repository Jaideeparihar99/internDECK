import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];

/* ============ RECRUITER DASHBOARD ============ */
export function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudents().then(r => setStudents(r.students || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const byBranch = students.reduce((acc, s) => {
    acc[s.branch || 'Other'] = (acc[s.branch || 'Other'] || 0) + 1;
    return acc;
  }, {});

  const avgCgpa = students.length
    ? (students.reduce((a, s) => a + (s.cgpa || 0), 0) / students.length).toFixed(2)
    : '—';

  const topSkills = students.flatMap(s => s.skills || []).reduce((acc, sk) => {
    acc[sk] = (acc[sk] || 0) + 1;
    return acc;
  }, {});
  const sortedSkills = Object.entries(topSkills).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="page-sub">{user.company} · {user.designation}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-accent-blue"><div className="stat-value">{students.length}</div><div className="stat-label">Total Students</div></div>
          <div className="stat-card stat-accent-green"><div className="stat-value">{students.filter(s => s.cgpa >= 8).length}</div><div className="stat-label">CGPA ≥ 8.0</div></div>
          <div className="stat-card stat-accent-amber"><div className="stat-value">{avgCgpa}</div><div className="stat-label">Average CGPA</div></div>
          <div className="stat-card stat-accent-purple"><div className="stat-value">{students.filter(s => s.resumeUrl).length}</div><div className="stat-label">Resume Uploaded</div></div>
        </div>

        <div className="grid-2">
          {/* Branch breakdown */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>📊 Students by Branch</div>
            {loading ? <div className="loading"><div className="spinner" /></div> :
              Object.entries(byBranch).sort((a, b) => b[1] - a[1]).map(([branch, count]) => {
                const pct = Math.round((count / students.length) * 100);
                return (
                  <div key={branch} className="score-bar-wrap">
                    <div className="score-bar-label"><span>{branch}</span><span>{count} ({pct}%)</span></div>
                    <div className="score-bar-track"><div className="score-bar-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })
            }
          </div>

          {/* Top skills */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>💡 Top Skills in Pool</div>
            {loading ? <div className="loading"><div className="spinner" /></div> :
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {sortedSkills.map(([skill, count]) => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill}</span>
                    <span style={{ background: 'var(--blue)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>

        {/* Quick preview */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <span className="card-title">🌟 Top Students by CGPA</span>
          </div>
          {loading ? <div className="loading"><div className="spinner" /></div> :
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Branch</th><th>CGPA</th><th>Top Skills</th><th>Resume</th></tr></thead>
                <tbody>
                  {students.sort((a, b) => (b.cgpa || 0) - (a.cgpa || 0)).slice(0, 8).map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.branch}</td>
                      <td><span className={`badge ${s.cgpa >= 9 ? 'badge-green' : s.cgpa >= 7.5 ? 'badge-blue' : 'badge-amber'}`}>{s.cgpa}</span></td>
                      <td><div style={{ display: 'flex', gap: 4 }}>{(s.skills || []).slice(0, 2).map(sk => <span key={sk} className="tag">{sk}</span>)}</div></td>
                      <td>{s.resumeUrl ? <a href={s.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontSize: '0.8rem', fontWeight: 600 }}>View ↗</a> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}</td>
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

export default RecruiterDashboard;

/* ============ RECRUITER SEARCH ============ */
export function RecruiterSearch() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ branch: '', minCgpa: '', skills: '' });
  const [shortlisted, setShortlisted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shortlisted') || '[]'); } catch { return []; }
  });

  const search = async () => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams();
    if (filters.branch) params.set('branch', filters.branch);
    if (filters.minCgpa) params.set('minCgpa', filters.minCgpa);
    if (filters.skills) params.set('skills', filters.skills);
    try {
      const r = await api.getStudents(params.toString());
      setStudents(r.students || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const toggleShortlist = (id) => {
    const updated = shortlisted.includes(id) ? shortlisted.filter(s => s !== id) : [...shortlisted, id];
    setShortlisted(updated);
    localStorage.setItem('shortlisted', JSON.stringify(updated));
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Search Students</h1>
          <p className="page-sub">Filter and discover talent across branches</p>
        </div>

        {/* Search Panel */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>🔍 Search Filters</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0, minWidth: 160 }}>
              <label className="form-label">Branch</label>
              <select className="form-input" value={filters.branch} onChange={e => setFilters({ ...filters, branch: e.target.value })}>
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, minWidth: 140 }}>
              <label className="form-label">Min CGPA</label>
              <input className="form-input" type="number" step="0.1" min="0" max="10" value={filters.minCgpa} onChange={e => setFilters({ ...filters, minCgpa: e.target.value })} placeholder="e.g. 7.5" />
            </div>
            <div className="form-group" style={{ margin: 0, minWidth: 220 }}>
              <label className="form-label">Skills (comma-separated)</label>
              <input className="form-input" value={filters.skills} onChange={e => setFilters({ ...filters, skills: e.target.value })} placeholder="React, Python, SQL" />
            </div>
            <button className="btn btn-primary" onClick={search}>Search</button>
            <button className="btn btn-outline" onClick={() => { setFilters({ branch: '', minCgpa: '', skills: '' }); setStudents([]); setSearched(false); }}>Clear</button>
          </div>
        </div>

        {/* Shortlisted counter */}
        {shortlisted.length > 0 && (
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            ⭐ {shortlisted.length} student{shortlisted.length !== 1 ? 's' : ''} shortlisted this session
          </div>
        )}

        {/* Results */}
        {loading ? <div className="loading"><div className="spinner" /> Searching…</div> :
          !searched ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Use filters above to search</div>
              <div className="empty-sub">Filter by branch, CGPA, and skills to find the right candidates</div>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">😕</div><div className="empty-title">No students match your filters</div></div>
          ) : (
            <>
              <div style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{students.length} result{students.length !== 1 ? 's' : ''} found</div>
              <div className="companies-grid">
                {students.map(s => {
                  const isShortlisted = shortlisted.includes(s._id);
                  return (
                    <div key={s._id} className="company-card" style={{ position: 'relative' }}>
                      {isShortlisted && (
                        <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '1.1rem' }}>⭐</div>
                      )}
                      <div>
                        <div className="company-name">{s.name}</div>
                        <div className="company-role">{s.branch} · Roll: {s.rollNumber || '—'}</div>
                      </div>
                      <div className="company-meta">
                        <span className={`badge ${s.cgpa >= 9 ? 'badge-green' : s.cgpa >= 7.5 ? 'badge-blue' : 'badge-amber'}`}>CGPA: {s.cgpa}</span>
                        {s.resumeUrl && <span className="badge badge-purple">Resume ✓</span>}
                      </div>
                      {s.skills?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {s.skills.map(sk => <span key={sk} className="tag">{sk}</span>)}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        {s.resumeUrl && (
                          <a href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${s.resumeUrl}`} target="_blank" rel="noreferrer">
                            <button className="btn btn-outline btn-sm">📄 Resume</button>
                          </a>
                        )}
                        <button
                          className={`btn btn-sm ${isShortlisted ? 'btn-outline' : 'btn-primary'}`}
                          onClick={() => toggleShortlist(s._id)}
                        >
                          {isShortlisted ? '✓ Shortlisted' : '⭐ Shortlist'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        }
      </main>
    </div>
  );
}
