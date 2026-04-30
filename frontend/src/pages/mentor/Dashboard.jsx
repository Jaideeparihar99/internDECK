import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

/* ============ MENTOR DASHBOARD ============ */
export function MentorDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [pending, setPending] = useState([]);
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    Promise.all([api.getPendingMentor(), api.getMentoredStudents(), api.getFeedback()])
      .then(([p, s, f]) => { setPending(p); setStudents(s); setFeedbacks(f.feedbacks || []); })
      .catch(console.error);
  }, []);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Mentor Dashboard</h1>
          <p className="page-sub">Welcome, {user.name}</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card stat-accent-amber"><div className="stat-value">{pending.length}</div><div className="stat-label">Pending Approvals</div></div>
          <div className="stat-card stat-accent-blue"><div className="stat-value">{students.length}</div><div className="stat-label">Mentored Students</div></div>
          <div className="stat-card stat-accent-green"><div className="stat-value">{feedbacks.length}</div><div className="stat-label">Feedbacks Given</div></div>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>⏳ Pending Approvals</div>
          {pending.length === 0
            ? <div className="empty-state"><div className="empty-title">All caught up!</div></div>
            : pending.slice(0, 5).map(a => (
              <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{a.studentId?.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 8 }}>→ {a.companyId?.name} ({a.companyId?.role})</span>
                </div>
                <span className="badge badge-amber">Pending</span>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  );
}

export default MentorDashboard;

/* ============ MENTOR APPROVALS ============ */
export function MentorApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => api.getPendingMentor().then(setPending).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const decide = async (id, status) => {
    try {
      await api.mentorDecision(id, { status, remarks });
      setMsg(`Application ${status}!`);
      setDeciding(null);
      setRemarks('');
      load();
    } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Pending Approvals</h1>
          <p className="page-sub">Review and approve student applications</p>
        </div>
        {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}
        {loading ? <div className="loading"><div className="spinner" /></div> :
          pending.length === 0
            ? <div className="empty-state"><div className="empty-icon">✅</div><div className="empty-title">No pending approvals</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pending.map(a => (
                <div key={a._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.studentId?.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{a.studentId?.branch} · CGPA: {a.studentId?.cgpa}</div>
                      <div style={{ marginTop: 6, fontSize: '0.875rem' }}>Applying to: <strong>{a.companyId?.name}</strong> — {a.companyId?.role}</div>
                      {a.coverLetter && <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.coverLetter}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-success btn-sm" onClick={() => setDeciding({ id: a._id, action: 'approve' })}>✓ Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeciding({ id: a._id, action: 'reject' })}>✗ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        }

        {deciding && (
          <div className="modal-overlay" onClick={() => setDeciding(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{deciding.action === 'approve' ? '✓ Approve' : '✗ Reject'} Application</div>
              <div className="form-group">
                <label className="form-label">Remarks (optional)</label>
                <textarea className="form-input" rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add any notes for the student…" />
              </div>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setDeciding(null)}>Cancel</button>
                <button className={`btn ${deciding.action === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={() => decide(deciding.id, deciding.action === 'approve' ? 'approved' : 'rejected')}>
                  Confirm {deciding.action}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ============ MENTOR STUDENTS ============ */
export function MentorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getMentoredStudents().then(setStudents).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Students</h1>
          <p className="page-sub">{students.length} student{students.length !== 1 ? 's' : ''} under your mentorship</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          students.length === 0
            ? <div className="empty-state"><div className="empty-icon">👥</div><div className="empty-title">No students assigned yet</div></div>
            : <div className="card"><div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Roll No.</th><th>Branch</th><th>CGPA</th><th>Skills</th><th>Resume</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.rollNumber}</td>
                      <td>{s.branch}</td>
                      <td>{s.cgpa}</td>
                      <td>{(s.skills || []).slice(0, 3).map(sk => <span key={sk} className="tag" style={{ marginRight: 4 }}>{sk}</span>)}</td>
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

/* ============ MENTOR FEEDBACK ============ */
export function MentorFeedback() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ studentId: '', companyId: '', ratings: { technical: 7, communication: 7, teamwork: 7, problemSolving: 7 }, remarks: '', isComplete: false, period: { from: '', to: '' } });
  const [msg, setMsg] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    Promise.all([api.getMentoredStudents(), api.getCompanies(), api.getFeedback()])
      .then(([s, c, f]) => { setStudents(s); setCompanies(c); setFeedbacks(f.feedbacks || []); })
      .catch(console.error);
  }, []);

  const setRating = (key, val) => setForm(f => ({ ...f, ratings: { ...f.ratings, [key]: parseInt(val) } }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.submitFeedback(form);
      setMsg(form.isComplete ? '🏆 Feedback submitted! Certificate generated.' : '✓ Feedback saved.');
      setForm(f => ({ ...f, studentId: '', companyId: '', remarks: '' }));
    } catch (err) { setMsg(err.message); }
  };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Submit Feedback</h1>
          <p className="page-sub">Rate student performance and generate certificates</p>
        </div>
        {msg && <div className="alert alert-success" onClick={() => setMsg('')}>{msg}</div>}
        <div className="grid-2">
          <div className="card">
            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <select className="form-input" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <select className="form-input" value={form.companyId} onChange={e => setForm({ ...form, companyId: e.target.value })} required>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.name} — {c.role}</option>)}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">From</label><input type="date" className="form-input" value={form.period.from} onChange={e => setForm(f => ({ ...f, period: { ...f.period, from: e.target.value } }))} /></div>
                <div className="form-group"><label className="form-label">To</label><input type="date" className="form-input" value={form.period.to} onChange={e => setForm(f => ({ ...f, period: { ...f.period, to: e.target.value } }))} /></div>
              </div>

              {[['technical', 'Technical'], ['communication', 'Communication'], ['teamwork', 'Teamwork'], ['problemSolving', 'Problem Solving']].map(([key, label]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label} — {form.ratings[key]}/10</label>
                  <input type="range" min="1" max="10" value={form.ratings[key]} onChange={e => setRating(key, e.target.value)} style={{ width: '100%' }} />
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">Remarks</label>
                <textarea className="form-input" rows={3} value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} placeholder="Overall feedback…" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <input type="checkbox" id="complete" checked={form.isComplete} onChange={e => setForm({ ...form, isComplete: e.target.checked })} />
                <label htmlFor="complete" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                  🏆 Mark as complete (auto-generate certificate)
                </label>
              </div>

              <button className="btn btn-primary" type="submit">Submit Feedback</button>
            </form>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Recent Feedbacks</div>
            {feedbacks.length === 0
              ? <div className="empty-state"><div className="empty-title">No feedbacks yet</div></div>
              : feedbacks.slice(0, 5).map(f => (
                <div key={f._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{f.studentId?.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{f.companyId?.name}</div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
                    {f.isComplete && <span className="badge badge-green">Complete</span>}
                    <span className="badge badge-blue">Tech: {f.ratings?.technical}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  );
}
