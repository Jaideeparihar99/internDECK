import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function PostCompany() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'IT',
    roleName: '',
    description: '',
    stipend: 0,
    minCgpa: 0,
    requiredSkills: [],
    eligibleBranches: [],
    placementPotential: 'Medium',
    lastDateToApply: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const branches = prev.eligibleBranches || [];
      if (branches.includes(branch)) {
        return { ...prev, eligibleBranches: branches.filter((b) => b !== branch) };
      } else {
        return { ...prev, eligibleBranches: [...branches, branch] };
      }
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map((s) => s.trim());
    setFormData((prev) => ({
      ...prev,
      requiredSkills: skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.postCompany(formData);
      setSuccess('Company posted successfully!');
      setFormData({
        name: '',
        type: 'IT',
        roleName: '',
        description: '',
        stipend: 0,
        minCgpa: 0,
        requiredSkills: [],
        eligibleBranches: [],
        placementPotential: 'Medium',
        lastDateToApply: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert('Failed to post company: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', path: '/placement/dashboard' },
    { label: 'Post Company', path: '/placement/post-company' },
    { label: 'All Students', path: '/placement/all-students' },
    { label: 'Statistics', path: '/placement/stats' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Post New Company</h1>

          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="company-form">
            <div className="form-group">
              <label htmlFor="name">Company Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Company Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="IT">IT</option>
                <option value="Core">Core</option>
                <option value="Government">Government</option>
                <option value="Startup">Startup</option>
                <option value="PSU">PSU</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roleName">Role Name</label>
              <input
                id="roleName"
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job description"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="stipend">Monthly Stipend</label>
              <input
                id="stipend"
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="Enter stipend amount"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minCgpa">Minimum CGPA</label>
              <input
                id="minCgpa"
                type="number"
                step="0.1"
                name="minCgpa"
                value={formData.minCgpa}
                onChange={handleChange}
                placeholder="Minimum CGPA required"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requiredSkills">Required Skills (comma separated)</label>
              <input
                id="requiredSkills"
                type="text"
                value={formData.requiredSkills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>

            <div className="form-group">
              <label>Eligible Branches</label>
              <div className="branches-container">
                {['CSE', 'ECE', 'MECH', 'CIVIL', 'ELECTRICAL'].map((branch) => (
                  <label key={branch} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.eligibleBranches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                    />
                    {branch}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="placementPotential">Placement Potential</label>
              <select
                id="placementPotential"
                name="placementPotential"
                value={formData.placementPotential}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lastDateToApply">Last Date to Apply</label>
              <input
                id="lastDateToApply"
                type="date"
                name="lastDateToApply"
                value={formData.lastDateToApply}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Company'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
