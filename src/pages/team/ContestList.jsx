import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, ArrowRight, Play, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ContestList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadContests() {
      try {
        const data = await apiRequest('/team/contests');
        setContests(data.contests || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadContests();
  }, []);

  const handleJoin = async (contestId) => {
    if (!window.confirm("Joining will start your team's countdown timer immediately. Ready to proceed?")) {
      return;
    }

    setJoiningId(contestId);
    setError('');

    try {
      // Calls your existing backend: POST /api/team/join
      const data = await apiRequest('/team/join', 'POST', { contest_id: contestId });
      
      // Save joined contest ID and team timer metadata
      localStorage.setItem('contest_id', contestId);
      if (data.team) {
        localStorage.setItem('team_info', JSON.stringify(data.team));
      }

      // Navigate to challenge listing after successful join
      navigate(`/lobby`);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="team" />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-content-primary">Contest Arena Dashboard</h1>
          <p className="text-xs text-content-muted mt-1">
            Select an active symposium contest to join. Once joined, your countdown begins and challenges will unlock.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-status-failBg border border-status-fail/20 text-status-fail rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand" />
            <span>Loading active contests...</span>
          </div>
        ) : contests.length === 0 ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl">
            No active contests available right now. Please wait for the event administrator.
          </div>
        ) : (
          <div className="grid gap-4">
            {contests.map((c) => (
              <div
                key={c.id}
                className="bg-canvas-panel border border-border-subtle hover:border-border-active rounded-xl p-6 shadow-card transition flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Round
                    </span>
                    <h2 className="text-base font-bold text-content-primary">{c.title || `Contest #${c.id}`}</h2>
                  </div>

                  <p className="text-xs text-content-secondary max-w-xl">
                    {c.description || 'Algorithmic debugging and jumbled code reordering challenge.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-content-muted pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand" />
                      {c.duration_minutes || 15} Minutes Time Limit
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoin(c.id)}
                  disabled={joiningId === c.id}
                  className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition disabled:opacity-60 cursor-pointer"
                >
                  {joiningId === c.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Starting Timer...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Join Contest</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}