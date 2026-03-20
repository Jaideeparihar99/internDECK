import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function RecruiterSearch() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Raj Kumar', branch: 'CSE', cgpa: 8.5, skills: ['JavaScript', 'React'] },
    { id: 2, name: 'Priya Singh', branch: 'ECE', cgpa: 9.1, skills: ['Python', 'Machine Learning'] },
  ]);
  const [skillFilter, setSkillFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    let filtered = students;

    if (skillFilter) {
      filtered = filtered.filter((s) =>
        s.skills.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    if (cgpaFilter) {
      filtered = filtered.filter((s) => s.cgpa >= parseFloat(cgpaFilter));
    }

    if (branchFilter) {
      filtered = filtered.filter((s) => s.branch === branchFilter);
    }

    setFilteredStudents(filtered);
  }, [skillFilter, cgpaFilter, branchFilter, students]);

  const sidebarItems = [
    { label: 'Dashboard', path: '/recruiter/dashboard' },
    { label: 'Search', path: '/recruiter/search' },
    { label: 'Pipeline', path: '/recruiter/pipeline' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Search Students</h1>

          <div className="filters-section">
            <input
              type="text"
              placeholder="Filter by skill"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="search-input"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Minimum CGPA"
              value={cgpaFilter}
              onChange={(e) => setCgpaFilter(e.target.value)}
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
            </select>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.branch}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.skills.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
