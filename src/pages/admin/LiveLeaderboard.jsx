import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, RefreshCw, Radio, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../services/api';

export default function LiveLeaderboard() {
  const [standings, setStandings] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const data = await apiRequest('/admin/leaderboard?contest_id=1', 'GET', null, 'admin');
      const list = data.leaderboard || data.standings || [];
      setStandings(list);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Leaderboard poll error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (idx) => {
    if (idx === 0) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs shadow-xs">
          1
        </span>
      );
    }
    if (idx === 1) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400 text-white font-bold text-xs shadow-xs">
          2
        </span>
      );
    }
    if (idx === 2) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs shadow-xs">
          3
        </span>
      );
    }
    return <span className="text-content-muted pl-2 font-mono">{idx + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-content-primary tracking-tight">
                Sparzo '26: Live Leaderboard
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] font-mono text-status-pass font-semibold">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE POLLING (5s)
                </span>
                <span className="text-[11px] text-content-muted font-mono">
                  • Refreshed {lastRefreshed.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchScores}
              className="p-1.5 bg-white border border-border-subtle hover:border-border-active rounded-md text-content-muted hover:text-content-primary shadow-xs transition cursor-pointer"
              title="Refresh now"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary px-3 py-1.5 rounded-md border border-border-subtle bg-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>

        {/* Board Table */}
        <div className="bg-canvas-panel border border-border-subtle rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border-subtle text-content-muted uppercase tracking-wider font-mono">
              <tr>
                <th className="p-4 w-16">Rank</th>
                <th className="p-4">Team</th>
                <th className="p-4">College</th>
                <th className="p-4 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {standings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-content-muted font-mono">
                    {loading ? 'Fetching scores...' : 'Waiting for initial team submissions...'}
                  </td>
                </tr>
              ) : (
                standings.map((team, idx) => {
                  const points = team.total_points ?? team.total_score ?? 0;
                  const isFirst = idx === 0 && points > 0;

                  return (
                    <tr
                      key={team.team_id || team.team_name || idx}
                      className={
                        isFirst
                          ? 'bg-amber-50/60 font-semibold'
                          : 'hover:bg-slate-50/50 transition'
                      }
                    >
                      <td className="p-4 font-mono">{getRankBadge(idx)}</td>
                      <td className="p-4 font-bold text-content-primary text-sm">
                        {team.team_name}
                      </td>
                      <td className="p-4 text-content-secondary">{team.college || '—'}</td>
                      <td className="p-4 text-right font-mono font-bold text-status-pass text-sm">
                        {points} pts
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}