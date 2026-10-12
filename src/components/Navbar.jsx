import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, LogOut, Shield } from 'lucide-react';

export default function Navbar({ role = 'team', extraContent = null }) {
  const navigate = useNavigate();
  const teamInfo = role === 'team' ? JSON.parse(localStorage.getItem('team_info') || '{}') : null;

  const handleLogout = () => {
    if (role === 'admin') {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    } else {
      localStorage.removeItem('team_token');
      localStorage.removeItem('team_info');
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-canvas-panel border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link to={role === 'admin' ? '/admin/dashboard' : '/lobby'} className="flex items-center gap-2 text-content-primary hover:opacity-90">
          <div className="p-1.5 bg-brand-subtle text-brand rounded-md border border-brand/20">
            {role === 'admin' ? <Shield className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
          </div>
          <span className="font-mono font-bold text-sm tracking-tight">CODE-VOLT</span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-content-muted border border-border-subtle uppercase">
            {role === 'admin' ? 'Orchestrator' : 'Round 2'}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {extraContent}

        {role === 'team' && teamInfo?.team_name && (
          <div className="hidden sm:flex items-center text-xs text-content-secondary border-l border-border-subtle pl-4">
            <span className="font-medium text-content-primary">{teamInfo.team_name}</span>
            {teamInfo.college && <span className="text-content-muted ml-1.5">({teamInfo.college})</span>}
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary px-2.5 py-1.5 rounded-md hover:bg-slate-100 border border-transparent hover:border-border-subtle transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}