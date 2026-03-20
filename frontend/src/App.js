import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student
import StudentDashboard from './pages/student/Dashboard';
import StudentCompanies from './pages/student/Companies';
import StudentApplications from './pages/student/Applications';
import StudentInterviews from './pages/student/Interviews';
import StudentProfile from './pages/student/Profile';
import StudentCertificates from './pages/student/Certificates';

// Mentor
import MentorDashboard from './pages/mentor/Dashboard';
import MentorApprovals from './pages/mentor/Approvals';
import MentorStudents from './pages/mentor/Students';
import MentorFeedback from './pages/mentor/Feedback';

// Placement Cell
import PlacementDashboard from './pages/placement/Dashboard';
import PlacementCompanies from './pages/placement/Companies';
import PlacementStudents from './pages/placement/Students';
import PlacementInterviews from './pages/placement/Interviews';

// Recruiter
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterSearch from './pages/recruiter/Search';

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/companies" element={<ProtectedRoute roles={['student']}><StudentCompanies /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><StudentApplications /></ProtectedRoute>} />
        <Route path="/student/interviews" element={<ProtectedRoute roles={['student']}><StudentInterviews /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/certificates" element={<ProtectedRoute roles={['student']}><StudentCertificates /></ProtectedRoute>} />

        {/* Mentor */}
        <Route path="/mentor" element={<ProtectedRoute roles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
        <Route path="/mentor/approvals" element={<ProtectedRoute roles={['mentor']}><MentorApprovals /></ProtectedRoute>} />
        <Route path="/mentor/students" element={<ProtectedRoute roles={['mentor']}><MentorStudents /></ProtectedRoute>} />
        <Route path="/mentor/feedback" element={<ProtectedRoute roles={['mentor']}><MentorFeedback /></ProtectedRoute>} />

        {/* Placement Cell */}
        <Route path="/placement" element={<ProtectedRoute roles={['placement_cell']}><PlacementDashboard /></ProtectedRoute>} />
        <Route path="/placement/companies" element={<ProtectedRoute roles={['placement_cell']}><PlacementCompanies /></ProtectedRoute>} />
        <Route path="/placement/students" element={<ProtectedRoute roles={['placement_cell']}><PlacementStudents /></ProtectedRoute>} />
        <Route path="/placement/interviews" element={<ProtectedRoute roles={['placement_cell']}><PlacementInterviews /></ProtectedRoute>} />

        {/* Recruiter */}
        <Route path="/recruiter" element={<ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/search" element={<ProtectedRoute roles={['recruiter']}><RecruiterSearch /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
