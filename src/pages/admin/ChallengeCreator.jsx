import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function ChallengeCreator() {
  const navigate = useNavigate();

  const [challengeNumber, setChallengeNumber] = useState(3);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPoints, setMaxPoints] = useState(100);
  const [penalty, setPenalty] = useState(5);
  const [challengeType, setChallengeType] = useState('JUMBLED_CODE');

  const defaultContent = `{\n  "blocks": [\n    { "id": "b1", "code": "def solve():" },\n    { "id": "b2", "code": "    return 42" }\n  ],\n  "harness": {\n    "python": "// __USER_CODE_HERE__\\nprint(solve())"\n  }\n}`;
  const defaultSolution = `{\n  "correct_order": ["b1", "b2"],\n  "hidden_test_cases": [\n    { "input": "", "expected_output": "42" }\n  ]\n}`;

  const [contentPayload, setContentPayload] = useState(defaultContent);
  const [solutionPayload, setSolutionPayload] = useState(defaultSolution);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let parsedContent;
    let parsedSolution;

    try {
      parsedContent = JSON.parse(contentPayload);
    } catch (_) {
      setError('Content Payload contains invalid JSON formatting.');
      return;
    }

    try {
      parsedSolution = JSON.parse(solutionPayload);
    } catch (_) {
      setError('Solution Payload contains invalid JSON formatting.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        challenge_number: Number(challengeNumber),
        title: title.trim(),
        description: description.trim(),
        challenge_type: challengeType,
        max_points: Number(maxPoints),
        penalty_per_resubmit: Number(penalty),
        supported_languages: ['python'],
        content_payload: parsedContent,
        solution_payload: parsedSolution,
      };

      await apiRequest('/admin/contests/1/challenges', 'POST', payload, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col">
      <Navbar role="admin" />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Dashboard</span>
        </button>

        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h1 className="text-xl font-bold text-content-primary">Create Round 2 Challenge</h1>
            <p className="text-xs text-content-muted mt-1">
              Add a new algorithmic debugging or jumbled code problem to Contest #1
            </p>
          </div>

          {error && (
            <div className="p-3 bg-status-failBg border border-status-fail/20 rounded-md text-status-fail text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-content-primary mb-1">
                  Challenge Number
                </label>
                <input
                  type="number"
                  required
                  value={challengeNumber}
                  onChange={(e) => setChallengeNumber(e.target.value)}
                  className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-content-primary mb-1">
                  Challenge Type
                </label>
                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                >
                  <option value="JUMBLED_CODE">Jumbled Code</option>
                  <option value="INVALID_TEST_CASE">Invalid Test Case</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-primary mb-1">
                  Max Points
                </label>
                <input
                  type="number"
                  required
                  value={maxPoints}
                  onChange={(e) => setMaxPoints(e.target.value)}
                  className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1">
                Challenge Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reverse Linked List Reorder"
                className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1">
                Description / Problem Statement
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the expected input, behavior, and output format..."
                className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1">
                Content Payload (JSON)
              </label>
              <textarea
                required
                rows={6}
                value={contentPayload}
                onChange={(e) => setContentPayload(e.target.value)}
                className="w-full bg-[#0a0e17] text-slate-200 border border-slate-800 rounded-md p-3 text-xs font-mono focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1">
                Solution Payload (JSON)
              </label>
              <textarea
                required
                rows={6}
                value={solutionPayload}
                onChange={(e) => setSolutionPayload(e.target.value)}
                className="w-full bg-[#0a0e17] text-slate-200 border border-slate-800 rounded-md p-3 text-xs font-mono focus:border-brand focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-md shadow-xs transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Persisting to Neon Database...' : 'Save Challenge'}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}