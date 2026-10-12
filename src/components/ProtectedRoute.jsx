import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ role = 'team' }) {
  const tokenKey = role === 'admin' ? 'admin_token' : 'team_token';
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  return <Outlet />;
}