import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function MentorApprovals() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalNotes, setApprovalNotes] = useState({});

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        const response = await api.getPendingApprovals();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, []);

  const handleApprove = async (applicationId) => {
    try {
      await api.respondToApproval(
        applicationId,
        true,
        approvalNotes[applicationId] || '',
        'mentor_approved'
      );
      setApplications(applications.filter((a) => a._id !== applicationId));
      alert('Application approved successfully!');
    } catch (error) {
      alert('Failed to approve: ' + error.message);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await api.respondToApproval(
        applicationId,
        false,
        approvalNotes[applicationId] || '',
        'rejected'
      );
      setApplications(applications.filter((a) => a._id !== applicationId));
      alert('Application rejected');
    } catch (error) {
      alert('Failed to reject: ' + error.message);
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
          <h1>Pending Approvals</h1>

          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p>No pending approvals</p>
          ) : (
            <div className="approvals-list">
              {applications.map((app) => (
                <div key={app._id} className="approval-card">
                  <div className="approval-header">
                    <h3>{app.studentId?.name}</h3>
                    <p className="approval-company">{app.companyId?.name}</p>
                  </div>

                  <div className="approval-details">
                    <p><strong>Email:</strong> {app.studentId?.email}</p>
                    <p><strong>CGPA:</strong> {app.studentId?.cgpa}</p>
                    <p><strong>Branch:</strong> {app.studentId?.branch}</p>
                  </div>

                  <div className="form-group">
                    <label>Approval Notes</label>
                    <textarea
                      value={approvalNotes[app._id] || ''}
                      onChange={(e) =>
                        setApprovalNotes({
                          ...approvalNotes,
                          [app._id]: e.target.value,
                        })
                      }
                      placeholder="Add notes for this application"
                    ></textarea>
                  </div>

                  <div className="approval-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(app._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(app._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
