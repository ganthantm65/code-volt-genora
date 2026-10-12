import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Play, 
  Clock, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  Layers, 
  X,
  Trophy
} from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ContestManager() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create Contest Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAccessCode, setNewAccessCode] = useState('VOLT2026');
  const [newDuration, setNewDuration] = useState(15);
  const [creating, setCreating] = useState(false);

  const [startingId, setStartingId] = useState(null);
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      const data = await apiRequest('/admin/contests', 'GET', null, 'admin');
      setContests(data.contests || []);
    } catch (err) {
      setError(err.message || 'Failed to load contests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // Handle Starting a Contest
  const handleStartContest = async (e, contestId) => {
    e.stopPropagation(); // Avoid triggering navigation to challenges
    setStartingId(contestId);
    setError('');
    setSuccess('');

    try {
      await apiRequest(`/admin/contests/${contestId}/start`, 'PATCH', {}, 'admin');
      setSuccess(`Contest #${contestId} is now LIVE! Teams can join and start.`);
      await fetchContests();
    } catch (err) {
      setError(err.message || 'Failed to activate contest.');
    } finally {
      setStartingId(null);
    }
  };

  // Handle Creating a Contest
  const handleCreateContest = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const payload = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        access_code: newAccessCode.trim().toUpperCase(),
        duration_minutes: Number(newDuration) || 15
      };

      await apiRequest('/admin/contests', 'POST', payload, 'admin');
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setNewAccessCode('VOLT2026');
      setNewDuration(15);
      setSuccess('New contest created successfully.');
      await fetchContests();
    } catch (err) {
      setError(err.message || 'Error creating contest.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="admin" />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-content-primary">Contest Orchestration</h1>
            <p className="text-xs text-content-muted mt-1">
              Create rounds, publish access codes, trigger timers, and configure problem sets.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Contest</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3.5 bg-status-failBg border border-status-fail/20 text-status-fail rounded-md text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-status-passBg border border-status-pass/20 text-status-pass rounded-md text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Contest List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand" />
            <span>Loading symposium rounds...</span>
          </div>
        ) : contests.length === 0 ? (
          <div className="p-12 text-center text-xs text-content-muted font-mono bg-canvas-panel border border-border-subtle rounded-xl">
            No contests created yet. Click "Create New Contest" to get started.
          </div>
        ) : (
          <div className="grid gap-3.5">
            {contests.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/contests/${c.id}/challenges`)}
                className="group bg-canvas-panel border border-border-subtle hover:border-border-active rounded-xl p-5 shadow-card transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                        c.is_active
                          ? 'bg-status-passBg text-status-pass border-status-pass/20'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {c.is_active ? '● LIVE / ACTIVE' : 'PENDING START'}
                    </span>
                    <h2 className="text-base font-bold text-content-primary group-hover:text-brand transition">
                      {c.title}
                    </h2>
                  </div>

                  <p className="text-xs text-content-secondary line-clamp-1 max-w-xl">
                    {c.description || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-content-muted pt-1">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-brand" />
                      Code: <strong className="text-content-primary">{c.access_code}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {c.duration_minutes || 15} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      {c.challenge_count || 0} Challenges
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {!c.is_active ? (
                    <button
                      onClick={(e) => handleStartContest(e, c.id)}
                      disabled={startingId === c.id}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition disabled:opacity-60 cursor-pointer"
                    >
                      {startingId === c.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>Start Contest</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-status-pass px-2.5 py-1 bg-status-passBg rounded-md">
                      Started
                    </span>
                  )}

                  <div className="flex items-center text-xs font-medium text-brand group-hover:translate-x-0.5 transition gap-1">
                    <span>Manage Problems</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Create Contest */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-canvas-panel border border-border-subtle rounded-xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-content-primary transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-content-primary mb-1">Create New Contest</h2>
            <p className="text-xs text-content-muted mb-4">Set up round credentials and duration.</p>

            <form onSubmit={handleCreateContest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-content-primary mb-1">
                  Contest Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Code-Volt Round 2"
                  className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm text-content-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-content-primary mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Algorithmic debugging and jumbled code reordering..."
                  className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm text-content-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Access Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccessCode}
                    onChange={(e) => setNewAccessCode(e.target.value.toUpperCase())}
                    placeholder="VOLT2026"
                    className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm font-mono uppercase text-content-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm font-mono text-content-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-content-muted hover:text-content-primary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{creating ? 'Creating...' : 'Create Contest'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}