import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function MentorFeedback() {
  const [formData, setFormData] = useState({
    studentId: '',
    companyId: '',
    score: 0,
    punctuality: 'Good',
    technical: 'Good',
    teamwork: 'Good',
    communication: 'Good',
    remarks: '',
    isComplete: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.submitFeedback(formData);
      setSuccess('Feedback submitted successfully!');
      setFormData({
        studentId: '',
        companyId: '',
        score: 0,
        punctuality: 'Good',
        technical: 'Good',
        teamwork: 'Good',
        communication: 'Good',
        remarks: '',
        isComplete: false,
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to submit feedback: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', path: '/mentor/dashboard' },
    { label: 'Pending Approvals', path: '/mentor/approvals' },
    { label: 'Students', path: '/mentor/students' },
    { label: 'Feedback', path: '/mentor/feedback' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Submit Feedback</h1>

          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyId">Company ID</label>
              <input
                id="companyId"
                type="text"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                placeholder="Enter company ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="score">Overall Score (0-100)</label>
              <input
                id="score"
                type="number"
                name="score"
                min="0"
                max="100"
                value={formData.score}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="punctuality">Punctuality</label>
              <select
                id="punctuality"
                name="punctuality"
                value={formData.punctuality}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs improvement">Needs improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="technical">Technical Skills</label>
              <select
                id="technical"
                name="technical"
                value={formData.technical}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs improvement">Needs improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teamwork">Teamwork</label>
              <select
                id="teamwork"
                name="teamwork"
                value={formData.teamwork}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs improvement">Needs improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="communication">Communication</label>
              <select
                id="communication"
                name="communication"
                value={formData.communication}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs improvement">Needs improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Additional remarks"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isComplete"
                  checked={formData.isComplete}
                  onChange={handleChange}
                />
                Mark as Complete (will generate certificate)
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
