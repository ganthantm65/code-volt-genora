import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock, Users, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../services/api';

export default function TeamLogin() {
  const [teamName, setTeamName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const codeTrimmed = passcode.trim();
      const nameTrimmed = teamName.trim();

      const data = await apiRequest('/team/login', 'POST', {
        team_name: nameTrimmed,
        access_code: codeTrimmed,
        passcode: codeTrimmed,
      });

      // In src/pages/team/TeamLogin.jsx (inside handleSubmit)
      if (data.token) {
        localStorage.setItem('team_token', data.token);
        localStorage.setItem(
          'team_info',
          JSON.stringify(data.team || { team_name: nameTrimmed })
        );

        // Navigate to contests dashboard listing first:
        navigate('/contests');
      } else {
        throw new Error('Server returned an invalid authentication response.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 bg-brand-subtle text-brand rounded-xl border border-brand/20 mb-3 shadow-xs">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-content-primary tracking-tight">
            Code-Volt Contest Arena
          </h1>
          <p className="text-xs text-content-muted mt-1">
            Round 2: Algorithmic Debugging & Jumbled Code
          </p>
        </div>

        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-6 shadow-card">
          {error && (
            <div className="mb-4 p-3 bg-status-failBg border border-status-fail/20 rounded-md text-status-fail text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-content-primary mb-1.5">
                Team Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. VoltMasters"
                  className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-content-primary mb-1.5">
                Contest Access Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition font-mono uppercase"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-md shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Authenticating...' : 'Enter Contest Arena'}</span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-content-muted mt-6">
          Sparzo '26 Technical Symposium • Anna University
        </p>
      </div>
    </div>
  );
}