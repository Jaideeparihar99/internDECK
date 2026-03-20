import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentMatches from './pages/student/Matches';
import StudentBrowse from './pages/student/Browse';
import StudentApplications from './pages/student/Applications';
import StudentCalendar from './pages/student/Calendar';
import StudentCertificates from './pages/student/Certificates';

// Mentor pages
import MentorDashboard from './pages/mentor/Dashboard';
import MentorApprovals from './pages/mentor/Approvals';
import MentorStudents from './pages/mentor/Students';
import MentorFeedback from './pages/mentor/Feedback';

// Placement Cell pages
import PlacementDashboard from './pages/placement/Dashboard';
import PostCompany from './pages/placement/PostCompany';
import AllStudents from './pages/placement/AllStudents';
import PlacementStats from './pages/placement/Stats';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterSearch from './pages/recruiter/Search';
import RecruiterPipeline from './pages/recruiter/Pipeline';

import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/matches"
          element={
            <ProtectedRoute>
              <StudentMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/browse"
          element={
            <ProtectedRoute>
              <StudentBrowse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute>
              <StudentApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/calendar"
          element={
            <ProtectedRoute>
              <StudentCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/certificates"
          element={
            <ProtectedRoute>
              <StudentCertificates />
            </ProtectedRoute>
          }
        />

        {/* Mentor routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/approvals"
          element={
            <ProtectedRoute>
              <MentorApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/students"
          element={
            <ProtectedRoute>
              <MentorStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/feedback"
          element={
            <ProtectedRoute>
              <MentorFeedback />
            </ProtectedRoute>
          }
        />

        {/* Placement Cell routes */}
        <Route
          path="/placement/dashboard"
          element={
            <ProtectedRoute>
              <PlacementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/post-company"
          element={
            <ProtectedRoute>
              <PostCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/all-students"
          element={
            <ProtectedRoute>
              <AllStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement/stats"
          element={
            <ProtectedRoute>
              <PlacementStats />
            </ProtectedRoute>
          }
        />

        {/* Recruiter routes */}
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/search"
          element={
            <ProtectedRoute>
              <RecruiterSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/pipeline"
          element={
            <ProtectedRoute>
              <RecruiterPipeline />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
