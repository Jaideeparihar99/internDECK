import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CompanyRow from '../../components/CompanyRow';
import * as api from '../../utils/api';
import '../../styles/global.css';

export default function StudentBrowse() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [stipendFilter, setStipendFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.getCompanies();
        setCompanies(response.data);
        setFilteredCompanies(response.data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.roleName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter((c) => c.type === departmentFilter);
    }

    if (stipendFilter) {
      const [min, max] = stipendFilter.split('-').map(Number);
      filtered = filtered.filter((c) => c.stipend >= min && c.stipend <= max);
    }

    setFilteredCompanies(filtered);
  }, [search, departmentFilter, stipendFilter, companies]);

  const sidebarItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'My Profile', path: '/student/profile' },
    { label: 'Matches', path: '/student/matches' },
    { label: 'Browse', path: '/student/browse' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Calendar', path: '/student/calendar' },
    { label: 'Certificates', path: '/student/certificates' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Browse Companies</h1>

          <div className="filters-section">
            <input
              type="text"
              placeholder="Search companies or roles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="Core">Core</option>
              <option value="Government">Government</option>
              <option value="Startup">Startup</option>
              <option value="PSU">PSU</option>
            </select>

            <select
              value={stipendFilter}
              onChange={(e) => setStipendFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Stipends</option>
              <option value="0-20000">0 - 20k</option>
              <option value="20000-50000">20k - 50k</option>
              <option value="50000-100000">50k - 100k</option>
              <option value="100000-500000">100k+</option>
            </select>
          </div>

          {loading ? (
            <p>Loading companies...</p>
          ) : (
            <table className="companies-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Stipend</th>
                  <th>Type</th>
                  <th>Min CGPA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <CompanyRow key={company._id} company={company} />
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
