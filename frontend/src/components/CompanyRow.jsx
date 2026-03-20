import React from 'react';
import '../styles/global.css';

export default function CompanyRow({ company, onSelect }) {
  return (
    <tr className="company-row" onClick={onSelect}>
      <td>{company.name}</td>
      <td>{company.roleName}</td>
      <td>₹{company.stipend}/mo</td>
      <td>{company.type}</td>
      <td>{company.minCgpa}</td>
      <td>{company.isOpen ? 'Open' : 'Closed'}</td>
    </tr>
  );
}
