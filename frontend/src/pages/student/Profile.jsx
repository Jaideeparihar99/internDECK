import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const skills = prev.skills || [];
      if (skills.includes(skill)) {
        return { ...prev, skills: skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...skills, skill] };
      }
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await api.uploadResume(file);
        setProfile(response.data);
        setResumeFile(null);
      } catch (err) {
        setError('Failed to upload resume');
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'My Profile', path: '/student/profile' },
    { label: 'Matches', path: '/student/matches' },
    { label: 'Browse', path: '/student/browse' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Calendar', path: '/student/calendar' },
    { label: 'Certificates', path: '/student/certificates' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>My Profile</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="profile-card">
            <div className="profile-header">
              <h2>{profile?.name}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={profile?.email} disabled />
            </div>

            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId || ''}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch || ''}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.1"
                value={formData.cgpa || ''}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <div className="skills-container">
                {['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'AWS'].map((skill) => (
                  <button
                    key={skill}
                    className={`skill-tag ${
                      formData.skills?.includes(skill) ? 'selected' : ''
                    }`}
                    onClick={() => editing && handleSkillToggle(skill)}
                    disabled={!editing}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter || ''}
                onChange={handleInputChange}
                disabled={!editing}
                rows="5"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Resume</label>
              {profile?.resumeUrl && (
                <p>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Current Resume
                  </a>
                </p>
              )}
              {editing && (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                />
              )}
            </div>

            {editing && (
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
