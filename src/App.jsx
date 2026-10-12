import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Landing View
import LandingPage from './pages/LandingPage';

// Team Views
import TeamLogin from './pages/team/TeamLogin';
import TeamRegister from './pages/team/TeamRegsiter'; // Fixed typo
import ContestList from './pages/team/ContestList';
import ContestLobby from './pages/team/ContestLobby';
import ChallengeWorkspace from './pages/team/ChallengeWorkspace';

// Admin Views
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContestManager from './pages/admin/ContestManager';
import ContestChallenges from './pages/admin/ContestChallenges';
import ChallengeCreator from './pages/admin/ChallengeCreator';
import LiveLeaderboard from './pages/admin/LiveLeaderboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<TeamLogin />} />
        <Route path="/register" element={<TeamRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Team Protected Routes */}
        <Route element={<ProtectedRoute role="team" />}>
          <Route path="/contests" element={<ContestList />} />
          <Route path="/lobby" element={<ContestLobby />} />
          <Route path="/workspace/:id" element={<ChallengeWorkspace />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/contests" element={<ContestManager />} />
          <Route path="/admin/contests/:contestId/challenges" element={<ContestChallenges />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/challenges/new" element={<ChallengeCreator />} />
          <Route path="/admin/leaderboard" element={<LiveLeaderboard />} />
        </Route>

        {/* Fallback to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}