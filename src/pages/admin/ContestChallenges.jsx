import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ContestChallenges() {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // src/pages/admin/ContestChallenges.jsx

useEffect(() => {
  async function loadChallenges() {
    setLoading(true);
    setError('');
    try {
      // Use the admin endpoint with contestId parameter
      const data = await apiRequest(`/admin/contests/${contestId}/challenges`, 'GET', null, 'admin');
      const list = Array.isArray(data) ? data : (data.challenges || []);
      setChallenges(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (contestId) {
    loadChallenges();
  }
}, [contestId]);

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="admin" />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <button
          onClick={() => navigate('/admin/contests')}
          className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Contests</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-content-primary">
              Contest #{contestId} Challenges
            </h1>
            <p className="text-xs text-content-muted mt-1">
              Problem suite assigned to this round.
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/challenges/new?contest_id=${contestId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Challenge</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-status-failBg border border-status-fail/20 text-status-fail rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand" />
            <span>Loading problem suite...</span>
          </div>
        ) : challenges.length === 0 ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl">
            No challenges added yet for this contest. Click "Add New Challenge" to populate questions.
          </div>
        ) : (
          <div className="grid gap-3.5">
            {challenges.map((c) => (
              <div
                key={c.id}
                className="bg-canvas-panel border border-border-subtle rounded-xl p-5 shadow-card flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-subtle text-brand border border-brand/20">
                      #{c.challenge_number} • {c.challenge_type}
                    </span>
                    <h2 className="text-base font-bold text-content-primary">{c.title}</h2>
                  </div>
                  <p className="text-xs text-content-secondary line-clamp-2 max-w-2xl">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-mono text-content-muted pt-1">
                    <span>Points: <strong className="text-status-pass">{c.max_points}</strong></span>
                    <span>Penalty: <strong className="text-status-fail">-{c.penalty_per_resubmit || 5}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}