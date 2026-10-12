import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../services/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/admin/login', 'POST', {
        username: username.trim(),
        password: password.trim(),
      }, 'admin');

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Authentication succeeded but no authorization token was received.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 bg-slate-900 text-amber-400 rounded-xl mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-content-primary tracking-tight">Code-Volt Administration</h1>
          <p className="text-xs text-content-muted mt-1">Sparzo '26 Contest Management Console</p>
        </div>

        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-6 shadow-card">
          {error && (
            <div className="mb-4 p-3 bg-status-failBg border border-status-fail/20 rounded-md text-status-fail text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-content-primary mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-md shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}