import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import '../styles/global.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Connecting students to real opportunities</h1>
        <p>
          CampusConnect is your gateway to internships and placements with top companies
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">
            Student Login
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Admin Login
          </Link>
        </div>
      </div>

      <div className="stats-section">
        <StatCard title="Students Placed" value="2,547" />
        <StatCard title="Partner Companies" value="150+" />
        <StatCard title="Placement Rate" value="94%" />
      </div>

      <div className="roles-section">
        <div className="role-card">
          <h3>For Students</h3>
          <p>
            Browse opportunities tailored to your skills, apply seamlessly, and get mentor support
            throughout the interview process.
          </p>
        </div>
        <div className="role-card">
          <h3>For Mentors</h3>
          <p>
            Guide students through applications, approve opportunities, and provide valuable
            feedback to boost their employability.
          </p>
        </div>
        <div className="role-card">
          <h3>For Placement Cell</h3>
          <p>
            Manage the entire placement process, invite companies, track student progress, and
            generate placement statistics.
          </p>
        </div>
      </div>
    </div>
  );
}
