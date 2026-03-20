import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../styles/global.css';

export default function AllStudents() {
  const [students] = useState([
    { id: 1, name: 'Raj Kumar', branch: 'CSE', cgpa: 8.5, placed: false },
    { id: 2, name: 'Priya Singh', branch: 'ECE', cgpa: 9.1, placed: true },
    { id: 3, name: 'Amit Patel', branch: 'CSE', cgpa: 7.8, placed: false },
    { id: 4, name: 'Sanjana Gupta', branch: 'MECH', cgpa: 8.2, placed: true },
  ]);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = !branchFilter || s.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

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
          <h1>All Students</h1>

          <div className="filters-section">
            <input
              type="text"
              placeholder="Search students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.branch}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.placed ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
