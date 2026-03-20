import React from 'react';
import '../styles/global.css';

export default function ApplicationRow({ application }) {
  const getStatusColor = (status) => {
    if (status === 'offer') return '#1D9E75';
    if (status === 'rejected') return '#A32D2D';
    if (status === 'mentor_approved') return '#185FA5';
    return '#BA7517';
  };

  return (
    <tr className="application-row">
      <td>{application.companyId?.name}</td>
      <td>{application.companyId?.roleName}</td>
      <td>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(application.status) }}
        >
          {application.status.replace(/_/g, ' ')}
        </span>
      </td>
      <td>{application.mentorApproved ? 'Approved' : 'Pending'}</td>
      <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
    </tr>
  );
}
