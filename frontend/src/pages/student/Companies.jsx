import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../utils/api';

export default function StudentCompanies() {
  const [companies, setCompanies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [tab, setTab] = useState('all');
  const [applying, setApplying] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([api.getCompanies(), api.getRecommended()])
      .then(([c, r]) => { setCompanies(c); setRecommended(r); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (companyId) => {
    try {
      await api.apply(companyId, { coverLetter });
      setMsg('Applied successfully! Awaiting mentor approval.');
      setApplying(null);
      setCoverLetter('');
    } catch (err) {
      setMsg(err.message);
    }
  };

  const displayed = tab === 'recommended'
    ? recommended.map(r => r.company)
    : companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Browse Opportunities</h1>
          <p className="page-sub">Find and apply to internships and placements</p>
        </div>

        {msg && <div className="alert alert-info" onClick={() => setMsg('')}>{msg}</div>}

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'recommended'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'} btn-sm`}>
                {t === 'all' ? '🏢 All Jobs' : '🤖 Recommended'}
              </button>
            ))}
          </div>
          {tab === 'all' && (
            <input className="form-input" style={{ maxWidth: 280 }} placeholder="Search companies or roles…"
              value={search} onChange={e => setSearch(e.target.value)} />
          )}
        </div>

        {loading ? <div className="loading"><div className="spinner" /> Loading…</div> :
          displayed.length === 0
            ? <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">No companies found</div></div>
            : <div className="companies-grid">
              {displayed.map(c => {
                const rec = recommended.find(r => r.company._id === c._id);
                return (
                  <div key={c._id} className="company-card">
                    <div>
                      <div className="company-name">{c.name}</div>
                      <div className="company-role">{c.role}</div>
                    </div>
                    {c.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{c.description}</p>}
                    <div className="company-meta">
                      {c.stipend > 0 && <span className="badge badge-green">₹{c.stipend?.toLocaleString()}/mo</span>}
                      {c.mode && <span className="badge badge-gray">{c.mode}</span>}
                      {c.duration && <span className="badge badge-blue">{c.duration}</span>}
                      {rec && <span className="badge badge-purple">Match: {rec.score}/100</span>}
                    </div>
                    {c.requiredSkills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.requiredSkills.map(s => <span key={s} className="tag">{s}</span>)}
                      </div>
                    )}
                    {c.minCgpa > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min CGPA: {c.minCgpa}</div>}
                    <div className="company-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => setApplying(c)}>Apply Now</button>
                    </div>
                  </div>
                );
              })}
            </div>
        }

        {/* Apply Modal */}
        {applying && (
          <div className="modal-overlay" onClick={() => setApplying(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Apply to {applying.name}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>Role: {applying.role}</p>
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea className="form-input" rows={5} placeholder="Tell them why you're a great fit…"
                  value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setApplying(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => handleApply(applying._id)}>Submit Application</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
