import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const ROLE_HOME = {
  student: '/student',
  mentor: '/mentor',
  placement_cell: '/placement',
  recruiter: '/recruiter'
};

const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'Other'];
const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'Machine Learning', 'Data Science', 'Flutter', 'AWS'];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', branch: '', cgpa: '', rollNumber: '', skills: [], company: '', designation: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.cgpa) payload.cgpa = parseFloat(form.cgpa);
      const { token, user } = await api.register(payload);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(ROLE_HOME[user.role] || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">🎓 CampusConnect</div>
        <p className="auth-sub">Create your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="Your Name" value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" name="role" value={form.role} onChange={handle}>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="placement_cell">Placement Cell</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@college.edu" value={form.email} onChange={handle} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required minLength={6} />
          </div>

          {form.role === 'student' && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input className="form-input" name="rollNumber" placeholder="21CS001" value={form.rollNumber} onChange={handle} />
                </div>
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <select className="form-input" name="branch" value={form.branch} onChange={handle}>
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">CGPA</label>
                <input className="form-input" type="number" name="cgpa" placeholder="8.5" min="0" max="10" step="0.1" value={form.cgpa} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (select all that apply)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                  {SKILLS_LIST.map(skill => (
                    <button type="button" key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '4px 12px', borderRadius: 20, border: '1.5px solid',
                        fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                        background: form.skills.includes(skill) ? 'var(--blue)' : 'transparent',
                        color: form.skills.includes(skill) ? '#fff' : 'var(--text-muted)',
                        borderColor: form.skills.includes(skill) ? 'var(--blue)' : 'var(--border)'
                      }}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {form.role === 'recruiter' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" name="company" placeholder="Company Name" value={form.company} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input className="form-input" name="designation" placeholder="HR Manager" value={form.designation} onChange={handle} />
              </div>
            </div>
          )}

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
