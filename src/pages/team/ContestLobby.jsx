import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Trophy } from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ContestLobby() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLobby() {
      try {
        const data = await apiRequest('/team/challenges');
        const list = Array.isArray(data) ? data : (data.challenges || []);
        setChallenges(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLobby();
  }, []);

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="team" />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-content-primary">Round 2 Challenge Suite</h1>
            <p className="text-xs text-content-muted">
              Complete the challenges within your team's 15-minute global round window. Resubmission penalties apply.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-content-secondary bg-canvas-subtle px-3 py-1.5 rounded-md border border-border-subtle">
              <Clock className="w-3.5 h-3.5 text-brand" />
              <span>15 Minutes Timer</span>
            </div>
            <div className="flex items-center gap-1.5 text-content-secondary bg-canvas-subtle px-3 py-1.5 rounded-md border border-border-subtle">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Testsuite Pass</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-status-failBg border border-status-fail/20 text-status-fail rounded-lg text-xs">
            {error}
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-content-primary uppercase tracking-wider mb-3">
            Available Problems ({challenges.length})
          </h2>

          {loading ? (
            <div className="p-8 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl">
              Retrieving contest problems...
            </div>
          ) : challenges.length === 0 ? (
            <div className="p-8 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl">
              No challenges have been published yet. Please wait for the round coordinator.
            </div>
          ) : (
            <div className="grid gap-3.5">
              {challenges.map((c) => (
                <div
                  key={c.id}
                  className="bg-canvas-panel border border-border-subtle hover:border-border-active rounded-xl p-5 shadow-card transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-subtle text-brand border border-brand/20">
                        {c.challenge_type === 'JUMBLED_CODE' ? 'Jumbled Code' : 'Invalid Test Case'}
                      </span>
                      <h3 className="text-base font-bold text-content-primary">{c.title}</h3>
                    </div>
                    <p className="text-xs text-content-secondary line-clamp-2 max-w-2xl">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-content-muted pt-1">
                      <span>Max Points: <strong className="text-status-pass font-mono">{c.max_points}</strong></span>
                      <span>Penalty / Retry: <strong className="text-status-fail font-mono">-{c.penalty_per_resubmit || 5}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/workspace/${c.id}`)}
                    className="self-start sm:self-center shrink-0 flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}