import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../styles/global.css';

export default function MentorStudents() {
  const [students] = useState([
    { id: 1, name: 'Raj Kumar', email: 'raj@college.edu', cgpa: 8.5, branch: 'CSE' },
    { id: 2, name: 'Priya Singh', email: 'priya@college.edu', cgpa: 9.1, branch: 'ECE' },
    { id: 3, name: 'Amit Patel', email: 'amit@college.edu', cgpa: 7.8, branch: 'CSE' },
  ]);

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
          <h1>My Students</h1>

          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
