import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

const statusColor = { approved: 'green', rejected: 'red', pending_mentor: 'amber', offered: 'purple', shortlisted: 'blue', withdrawn: 'gray' };

export function StudentApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyApplications().then(setApps).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Applications</h1>
          <p className="page-sub">Track all your internship applications</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          apps.length === 0
            ? <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">No applications yet</div><div className="empty-sub">Apply to companies to see them here</div></div>
            : <div className="card">
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Company</th><th>Role</th><th>Stipend</th><th>Applied</th><th>Mentor</th><th>Status</th></tr></thead>
                  <tbody>
                    {apps.map(a => (
                      <tr key={a._id}>
                        <td style={{ fontWeight: 600 }}>{a.companyId?.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{a.companyId?.role}</td>
                        <td>{a.companyId?.stipend ? `₹${a.companyId.stipend?.toLocaleString()}` : '—'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(a.appliedAt).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${a.mentorApproval?.status === 'approved' ? 'green' : a.mentorApproval?.status === 'rejected' ? 'red' : 'amber'}`}>{a.mentorApproval?.status}</span></td>
                        <td><span className={`badge badge-${statusColor[a.status] || 'gray'}`}>{a.status.replace('_', ' ')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        }
      </main>
    </div>
  );
}

export function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyInterviews().then(setInterviews).catch(console.error).finally(() => setLoading(false));
  }, []);

  const outcomeColor = { pending: 'amber', cleared: 'green', rejected: 'red', no_show: 'gray' };

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Interviews</h1>
          <p className="page-sub">Upcoming and past interview schedule</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          interviews.length === 0
            ? <div className="empty-state"><div className="empty-icon">📅</div><div className="empty-title">No interviews scheduled</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {interviews.map(i => (
                <div key={i._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{i.companyId?.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{i.type} · Round {i.round}</div>
                    </div>
                    <span className={`badge badge-${outcomeColor[i.outcome]}`}>{i.outcome}</span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>📅 {new Date(i.scheduledAt).toLocaleString()}</span>
                    <span>⏱ {i.duration} min</span>
                    <span>📍 {i.mode}</span>
                    {i.meetingLink && <a href={i.meetingLink} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>Join Link</a>}
                  </div>
                  {i.feedback && <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Feedback: {i.feedback}</div>}
                </div>
              ))}
            </div>
        }
      </main>
    </div>
  );
}

export function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getMyProfile().then(p => { setProfile(p); setForm({ name: p.name, cgpa: p.cgpa, skills: (p.skills || []).join(', ') }); }).catch(console.error);
  }, []);

  const save = async () => {
    try {
      const updates = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), cgpa: parseFloat(form.cgpa) };
      const updated = await api.updateProfile(updates);
      localStorage.setItem('user', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('resume', resumeFile);
    try {
      await api.uploadResume(fd);
      alert('Resume uploaded!');
    } catch (err) { alert(err.message); } finally { setUploading(false); }
  };

  if (!profile) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Update your details and resume</p>
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Personal Information</div>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">CGPA</label><input className="form-input" type="number" value={form.cgpa || ''} onChange={e => setForm({ ...form, cgpa: e.target.value })} min="0" max="10" step="0.1" /></div>
            <div className="form-group"><label className="form-label">Skills (comma-separated)</label><input className="form-input" value={form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Python, SQL" /></div>
            <button className="btn btn-primary" onClick={save}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>Resume Upload</div>
            {profile.resumeUrl && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ Resume uploaded — <a href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${profile.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>View</a></div>}
            <div className="form-group"><label className="form-label">Upload New Resume (PDF only, max 5MB)</label><input type="file" accept=".pdf" className="form-input" onChange={e => setResumeFile(e.target.files[0])} /></div>
            <button className="btn btn-primary" onClick={uploadResume} disabled={!resumeFile || uploading}>{uploading ? 'Uploading…' : 'Upload Resume'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export function StudentCertificates() {
  const [data, setData] = useState({ feedbacks: [], certificates: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeedback().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Certificates</h1>
          <p className="page-sub">Download your earned internship certificates</p>
        </div>
        {loading ? <div className="loading"><div className="spinner" /></div> :
          data.certificates.length === 0
            ? <div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">No certificates yet</div><div className="empty-sub">Complete an internship and get mentor feedback to earn certificates</div></div>
            : <div className="companies-grid">
              {data.certificates.map(c => (
                <div key={c._id} className="card">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                  <div className="company-name">{c.companyId?.name}</div>
                  <div className="company-role">{c.role}</div>
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued: {new Date(c.issuedAt).toLocaleDateString()}</div>
                  <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>Code: {c.verificationCode}</div>
                  {c.pdfUrl && (
                    <a href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}${c.pdfUrl}`} target="_blank" rel="noreferrer">
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>⬇ Download PDF</button>
                    </a>
                  )}
                </div>
              ))}
            </div>
        }
      </main>
    </div>
  );
}
