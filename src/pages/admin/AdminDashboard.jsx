import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  PlusCircle, 
  Trophy, 
  RotateCcw, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Filter,
  UserX
} from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');
  const [resettingId, setResettingId] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTeams = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError('');
    try {
      let data;
      try {
        data = await apiRequest('/admin/teams', 'GET', null, 'admin');
      } catch (_) {
        data = await apiRequest('/admin/contests/1/teams', 'GET', null, 'admin');
      }
      setTeams(data.teams || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch teams.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams(true);
  }, []);

  // 10s Live Polling
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTeams(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleResetTimer = async (teamId, teamName) => {
    if (!window.confirm(`Grant +15 minutes extension to ${teamName} (Team #${teamId})?`)) return;
    setResettingId(teamId);
    setActionMsg('');
    setError('');

    try {
      await apiRequest(`/admin/teams/${teamId}/reset-timer`, 'POST', {}, 'admin');
      setActionMsg(`Timer for "${teamName}" was extended by 15 minutes.`);
      await fetchTeams(false);
    } catch (err) {
      setError(`Reset action failed: ${err.message}`);
    } finally {
      setResettingId(null);
    }
  };

  // Helper to format remaining time
  const getRemainingTimeBadge = (startTime, endTime, isFinished, isDisqualified) => {
    if (isDisqualified) {
      return (
        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
          Disqualified
        </span>
      );
    }
    if (isFinished) {
      return (
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
          Finished
        </span>
      );
    }
    if (!startTime || !endTime) {
      return <span className="text-content-muted font-mono">Not Joined</span>;
    }

    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) {
      return (
        <span className="px-2 py-0.5 rounded bg-status-failBg text-status-fail border border-status-fail/20 font-medium">
          Time Expired
        </span>
      );
    }

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const formatted = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

    return (
      <span className={`px-2 py-0.5 rounded font-mono border ${
        mins < 3 
          ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}>
        {formatted} left
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="admin" />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <h1 className="text-xl font-bold text-content-primary">Symposium Control & Team Monitor</h1>
            <p className="text-xs text-content-muted mt-1">
              Live tracking of registered teams, active timers, and administrative session overrides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/contests"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-subtle hover:border-border-active text-content-primary text-xs font-semibold rounded-md shadow-xs transition"
            >
              <Layers className="w-3.5 h-3.5 text-brand" />
              <span>Contest Manager</span>
            </Link>

            <Link
              to="/admin/challenges/new"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Challenge</span>
            </Link>

            <Link
              to="/admin/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-subtle hover:border-border-active text-content-primary text-xs font-semibold rounded-md shadow-xs transition"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Projector Leaderboard</span>
            </Link>

            <button
              onClick={() => fetchTeams(true)}
              className="p-2 bg-white border border-border-subtle hover:border-border-active rounded-md text-content-muted hover:text-content-primary shadow-xs transition cursor-pointer"
              title="Refresh table"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {actionMsg && (
          <div className="p-3 bg-status-passBg border border-status-pass/20 text-status-pass text-xs rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionMsg}</span>
            </div>
            <button onClick={() => setActionMsg('')} className="text-status-pass hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-status-failBg border border-status-fail/20 text-status-fail text-xs rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-status-fail hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Operational Toolbar */}
        <div className="flex items-center justify-between text-xs text-content-muted px-1">
          <div className="flex items-center gap-2 font-mono">
            <span>Total Registered Teams: <strong className="text-content-primary">{teams.length}</strong></span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-300 text-brand focus:ring-brand h-3.5 w-3.5"
            />
            <span>Auto-refresh (10s)</span>
          </label>
        </div>

        {/* Data Table */}
        <div className="bg-canvas-panel border border-border-subtle rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border-subtle text-content-muted uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Institution / College</th>
                  <th className="p-4">Timer Window</th>
                  <th className="p-4">Live Status</th>
                  <th className="p-4 text-right">Timer Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-content-muted font-mono">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-brand" />
                          <span>Fetching symposium teams...</span>
                        </div>
                      ) : (
                        'No registered teams found. Direct participants to /register.'
                      )}
                    </td>
                  </tr>
                ) : (
                  teams.map((t) => {
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-mono text-content-muted font-medium">#{t.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-content-primary">{t.team_name}</div>
                          <div className="text-[11px] text-content-muted mt-0.5">
                            {t.member_one_name && t.member_two_name 
                              ? `${t.member_one_name} & ${t.member_two_name}` 
                              : '2 Members Registered'}
                          </div>
                        </td>
                        <td className="p-4 text-content-secondary">{t.college || '—'}</td>
                        <td className="p-4 font-mono text-content-muted">
                          {t.end_time ? (
                            <span>Until {new Date(t.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          ) : (
                            <span>Timer Uninitialized</span>
                          )}
                        </td>
                        <td className="p-4">
                          {getRemainingTimeBadge(t.start_time, t.end_time, t.is_finished, t.is_disqualified)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleResetTimer(t.id, t.team_name)}
                            disabled={resettingId === t.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-border-subtle hover:border-brand text-content-primary hover:text-brand font-medium rounded text-xs transition shadow-xs disabled:opacity-60 cursor-pointer"
                          >
                            {resettingId === t.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-brand" />
                            ) : (
                              <RotateCcw className="w-3 h-3 text-brand" />
                            )}
                            <span>+15m Reset</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}