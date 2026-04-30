import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

/* ============ PLACEMENT DASHBOARD ============ */
export function PlacementDashboard() {
  const [stats, setStats] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCompanyStats(), api.getAllApplications()])
      .then(([s, a]) => { setStats(s); setApps(a.applications || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Placement Cell Dashboard</h1>
          <p className="page-sub">Overview of campus placement activities</p>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <>
            <div className="stats-grid">
              <div className="stat-card stat-accent-blue"><div className="stat-value">{stats?.totalCompanies || 0}</div><div className="stat-label">Total Companies</div></div>
              <div className="stat-card stat-accent-green"><div className="stat-value">{stats?.openCompanies || 0}</div><div className="stat-label">Open Positions</div></div>
              <div className="stat-card stat-accent-amber"><div className="stat-value">{stats?.totalApplications || 0}</div><div className="stat-label">Total Applications</div></div>
              <div className="stat-card stat-accent-purple"><div className="stat-value">{stats?.offered || 0}</div><div className="stat-label">Offers Made</div></div>
            </div>

            <div className="grid-2">
              {/* Application Status Breakdown */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: 20 }}>📊 Application Status</div>
                {Object.entries(statusCounts).map(([status, count]) => {
                  const colors = { approved: 'green', rejected: 'red', pending_mentor: 'amber', offered: 'purple', shortlisted: 'blue' };
                  const pct = Math.round((count / apps.length) * 100);
                  return (
                    <div key={status} className="score-bar-wrap">
                      <div className="score-bar-label">
                        <span style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{ width: `${pct}%`, background: `var(--${colors[status] || 'blue'})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top Recruiters */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: 20 }}>🏆 Top Companies by Applications</div>
                {(stats?.topCompanies || []).length === 0
                  ? <div className="empty-state"><div className="empty-title">No data yet</div></div>
                  : (stats?.topCompanies || []).map((c, i) => (
                    <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-muted)', width: 20 }}>#{i + 1}</span>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                      <span className="badge badge-blue">{c.count} apps</span>
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
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Student</th><th>Branch</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead>
                  <tbody>
                    {apps.slice(0, 10).map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 600 }}>{a.studentId?.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{a.studentId?.branch}</td>
                        <td>{a.companyId?.name}</td>
                        <td><span className={`badge badge-${a.status === 'offered' ? 'purple' : a.status === 'approved' ? 'green' : a.status === 'rejected' ? 'red' : 'amber'}`}>{a.status.replace('_', ' ')}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(a.appliedAt || a.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PlacementDashboard;

/* ============ PLACEMENT COMPANIES ============ */
const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];

export function PlacementCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', description: '', industry: '', website: '', stipend: '', duration: '', location: '', mode: 'onsite', requiredSkills: '', minCgpa: '', eligibleBranches: [], openings: 1, placementType: 'internship', applicationDeadline: '' });
  const [msg, setMsg] = useState('');

  const load = () => api.getCompanies().then(setCompanies).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggleBranch = (b) => setForm(f => ({ ...f, eligibleBranches: f.eligibleBranches.includes(b) ? f.eligibleBranches.filter(x => x !== b) : [...f.eligibleBranches, b] }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        stipend: form.stipend ? parseInt(form.stipend) : 0,
        minCgpa: form.minCgpa ? parseFloat(form.minCgpa) : 0,
        openings: parseInt(form.openings),
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.postCompany(payload);
      setMsg('Company posted successfully!');
      setShowForm(false);
      load();
    } catch (err) { setMsg(err.message); }
  };

  const toggleOpen = async (id, current) => {
    try { await api.updateCompany(id, { isOpen: !current }); load(); } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Manage Companies</h1>
            <p className="page-sub">Post and manage company opportunities</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Post Company</button>
        </div>

        {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

        {loading ? <div className="loading"><div className="spinner" /></div> :
          companies.length === 0
            ? <div className="empty-state"><div className="empty-icon">🏢</div><div className="empty-title">No companies yet</div><div className="empty-sub">Post your first opportunity</div></div>
            : <div className="companies-grid">
              {companies.map(c => (
                <div key={c._id} className="company-card">
                  <div>
                    <div className="company-name">{c.name}</div>
                    <div className="company-role">{c.role}</div>
                  </div>
                  <div className="company-meta">
                    {c.stipend > 0 && <span className="badge badge-green">₹{c.stipend?.toLocaleString()}/mo</span>}
                    <span className="badge badge-gray">{c.mode}</span>
                    <span className={`badge ${c.isOpen ? 'badge-blue' : 'badge-red'}`}>{c.isOpen ? 'Open' : 'Closed'}</span>
                    <span className="badge badge-amber">{c.openings} opening{c.openings !== 1 ? 's' : ''}</span>
                  </div>
                  {c.applicationDeadline && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {new Date(c.applicationDeadline).toLocaleDateString()}</div>}
                  <div className="company-actions">
                    <button className={`btn btn-sm ${c.isOpen ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleOpen(c._id, c.isOpen)}>
                      {c.isOpen ? 'Close' : 'Re-open'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
        }

        {/* Post Company Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div className="modal-title">Post New Company</div>
              <form onSubmit={submit}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Company Name *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Role *</label><input className="form-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Industry</label><input className="form-input" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Website</label><input className="form-input" type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Stipend (₹/month)</label><input className="form-input" type="number" value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Duration</label><input className="form-input" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 months" /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Mode</label>
                    <select className="form-input" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                      <option value="onsite">Onsite</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Openings</label><input className="form-input" type="number" min="1" value={form.openings} onChange={e => setForm({ ...form, openings: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Min CGPA</label><input className="form-input" type="number" step="0.1" min="0" max="10" value={form.minCgpa} onChange={e => setForm({ ...form, minCgpa: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Required Skills (comma-separated)</label><input className="form-input" value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, Python" /></div>
                <div className="form-group">
                  <label className="form-label">Eligible Branches</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {BRANCHES.map(b => (
                      <button type="button" key={b} onClick={() => toggleBranch(b)}
                        style={{ padding: '3px 12px', borderRadius: 20, border: '1.5px solid', fontSize: '0.8rem', cursor: 'pointer', background: form.eligibleBranches.includes(b) ? 'var(--blue)' : 'transparent', color: form.eligibleBranches.includes(b) ? '#fff' : 'var(--text-muted)', borderColor: form.eligibleBranches.includes(b) ? 'var(--blue)' : 'var(--border)' }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Type</label>
                    <select className="form-input" value={form.placementType} onChange={e => setForm({ ...form, placementType: e.target.value })}>
                      <option value="internship">Internship</option><option value="fulltime">Full-time</option><option value="both">Both</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Application Deadline</label><input className="form-input" type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} /></div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Post Company</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ============ PLACEMENT STUDENTS ============ */
export function PlacementStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ branch: '', minCgpa: '' });

  const load = (params = '') => {
    setLoading(true);
    api.getStudents(params).then(r => setStudents(r.students || [])).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.branch) params.set('branch', filters.branch);
    if (filters.minCgpa) params.set('minCgpa', filters.minCgpa);
    load(params.toString());
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">All Students</h1>
          <p className="page-sub">{students.length} students registered</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 24 }}>
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
            <button className="btn btn-primary" onClick={applyFilters}>Apply Filters</button>
            <button className="btn btn-outline" onClick={() => { setFilters({ branch: '', minCgpa: '' }); load(); }}>Reset</button>
          </div>
        </div>

        {loading ? <div className="loading"><div className="spinner" /></div> :
          students.length === 0
            ? <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No students found</div></div>
            : <div className="card"><div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Roll No.</th><th>Branch</th><th>CGPA</th><th>Skills</th><th>Mentor</th><th>Resume</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.rollNumber}</td>
                      <td>{s.branch}</td>
                      <td><span className={`badge ${s.cgpa >= 8 ? 'badge-green' : s.cgpa >= 6.5 ? 'badge-blue' : 'badge-amber'}`}>{s.cgpa}</span></td>
                      <td><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{(s.skills || []).slice(0, 3).map(sk => <span key={sk} className="tag">{sk}</span>)}{s.skills?.length > 3 && <span className="tag">+{s.skills.length - 3}</span>}</div></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.mentorId?.name || '—'}</td>
                      <td>{s.resumeUrl ? <a href={s.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>View ↗</a> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></div>
        }
      </main>
    </div>
  );
}

/* ============ PLACEMENT INTERVIEWS ============ */
export function PlacementInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentId: '', companyId: '', applicationId: '', scheduledAt: '', duration: 60, mode: 'online', meetingLink: '', location: '', round: 1, type: 'technical' });
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.getAllInterviews(), api.getCompanies(), api.getStudents()])
      .then(([i, c, s]) => { setInterviews(i); setCompanies(c); setStudents(s.students || []); })
      .catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.scheduleInterview(form);
      setMsg('Interview scheduled!');
      setShowForm(false);
      load();
    } catch (err) { setMsg(err.message); }
  };

  const updateOutcome = async (id, outcome) => {
    try { await api.updateOutcome(id, { outcome }); load(); } catch (err) { setMsg(err.message); }
  };

  const outcomeColor = { pending: 'amber', cleared: 'green', rejected: 'red', no_show: 'gray' };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Interviews</h1>
            <p className="page-sub">Schedule and manage student interviews</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Schedule Interview</button>
        </div>

        {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

        {loading ? <div className="loading"><div className="spinner" /></div> :
          interviews.length === 0
            ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No interviews scheduled</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {interviews.map(i => (
                <div key={i._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{i.studentId?.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>→</span> {i.companyId?.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{i.type} · Round {i.round} · {i.mode}</div>
                      <div style={{ marginTop: 6, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        📅 {new Date(i.scheduledAt).toLocaleString()} · ⏱ {i.duration} min
                        {i.meetingLink && <> · <a href={i.meetingLink} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>Join</a></>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`badge badge-${outcomeColor[i.outcome]}`}>{i.outcome}</span>
                      {i.outcome === 'pending' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => updateOutcome(i._id, 'cleared')}>Cleared</button>
                          <button className="btn btn-danger btn-sm" onClick={() => updateOutcome(i._id, 'rejected')}>Rejected</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
              <div className="modal-title">Schedule Interview</div>
              <form onSubmit={submit}>
                <div className="form-group"><label className="form-label">Student *</label>
                  <select className="form-input" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                    <option value="">Select Student</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Company *</label>
                  <select className="form-input" value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} required>
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.name} — {c.role}</option>)}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Date & Time *</label><input className="form-input" type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} required /></div>
                  <div className="form-group"><label className="form-label">Duration (min)</label><input className="form-input" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Mode</label>
                    <select className="form-input" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                      <option value="online">Online</option><option value="offline">Offline</option><option value="phone">Phone</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Type</label>
                    <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="technical">Technical</option><option value="hr">HR</option><option value="group_discussion">Group Discussion</option><option value="aptitude">Aptitude</option>
                    </select>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Round</label><input className="form-input" type="number" min="1" value={form.round} onChange={e => setForm({ ...form, round: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Meeting Link</label><input className="form-input" type="url" value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} placeholder="https://meet.google.com/..." /></div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
