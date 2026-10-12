import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Terminal, 
  Users, 
  Trophy, 
  ArrowRight, 
  Clock, 
  Cpu, 
  LockKeyhole,
  CheckCircle2,
  Code2
} from 'lucide-react';
import genoraLogo from '../assets/genora-logo.png'; // Adjust path if needed

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden selection:bg-purple-600 selection:text-white">
      
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-purple-200/50 via-indigo-100/30 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-purple-100/60 blur-3xl pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src={genoraLogo} 
            alt="GENORA '26 Logo" 
            className="w-9 h-9 object-contain drop-shadow-sm" 
          />
          <div>
            <div className="font-mono font-bold tracking-tight text-base text-slate-900 leading-none flex items-center gap-1">
              CODE<span className="text-purple-600 font-extrabold">VOLT</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold uppercase tracking-wider ml-1">
                Round 2
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              GENORA '26 Symposium
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-purple-300 text-xs font-mono text-slate-600 hover:text-purple-700 transition bg-white shadow-2xs"
          >
            <LockKeyhole className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition"
          >
            <span>Team Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center justify-center">
        
        {/* Symposium Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200 bg-white/90 shadow-2xs mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span className="text-xs font-mono font-medium tracking-wide text-purple-900">
            National Level Technical Symposium • Department of CSE
          </span>
        </div>

        {/* Hero Logo with Subtle Elevation */}
        <div className="relative mb-5 group">
          <div className="absolute inset-0 bg-purple-300/30 blur-2xl rounded-full scale-75 group-hover:scale-90 transition-all duration-500" />
          <img 
            src={genoraLogo} 
            alt="GENORA '26 Emblem" 
            className="relative w-36 md:w-44 h-auto mx-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 font-mono uppercase">
          CODE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">VOLT</span>
        </h1>
        
        <p className="mt-3 text-base md:text-lg font-medium text-slate-700 max-w-xl">
          Algorithmic Speed, Jumbled Code & Test Case Debugging Arena
        </p>

        <p className="mt-3 text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Rearrange scrambled logic statements into execution order, isolate defective test suites, 
          and track live scoring on the symposium hall projector.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Register Your Team</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-purple-400 text-slate-700 hover:text-purple-700 font-semibold text-xs md:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-purple-600" />
            <span>Enter Contest Room</span>
          </Link>
        </div>

        {/* Key Event Highlights Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          
          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition">
            <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">Interactive Jumbled Code</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Drag-and-drop live code statements into valid execution order with instant automated validation.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">15-Minute Countdown</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Real-time countdown synchronization per team, auto-submission on timeout, and live timer monitoring.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">Auditorium Projector Board</h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Sub-second live rankings with tie-breaking rules and points calculation broadcast directly to the stage.
            </p>
          </div>

        </div>

        {/* Contest Guidelines Checklist */}
        <div className="mt-10 w-full max-w-2xl bg-white/80 border border-slate-200 rounded-xl p-4 shadow-2xs text-left">
          <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-2.5">
            Round Rules & Format
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span>2 Members per Team</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span>No external compilers permitted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span>Deductions on incorrect attempts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span>Time-based tie breaker ranking</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono">
        <p>GENORA '26 Symposium • Code-Volt Platform • Department of Computer Science & Engineering</p>
      </footer>
    </div>
  );
}