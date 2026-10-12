import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, User, School, Calendar, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../services/api';

export default function TeamRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    team_name: '',
    member_one_name: '',
    member_two_name: '',
    college: '',
    year: '3',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        team_name: formData.team_name.trim(),
        member_one_name: formData.member_one_name.trim(),
        member_two_name: formData.member_two_name.trim(),
        college: formData.college.trim(),
        year: Number(formData.year) || null,
      };

      const res = await apiRequest('/team/register', 'POST', payload, 'team');

      setSuccess(`Team "${res.team?.team_name || payload.team_name}" registered successfully! Redirecting to login...`);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-lg">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 bg-brand-subtle text-brand rounded-xl border border-brand/20 mb-3 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-content-primary tracking-tight">
            Register Contest Team
          </h1>
          <p className="text-xs text-content-muted mt-1">
            Sparzo '26 • Code-Volt Round 2 (2 Members per Team)
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-5 p-3.5 bg-status-failBg border border-status-fail/20 rounded-md text-status-fail text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 bg-status-passBg border border-status-pass/20 rounded-md text-status-pass text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Name */}
            <div>
              <label className="block text-xs font-medium text-content-primary mb-1.5">
                Team Name <span className="text-status-fail">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="team_name"
                  required
                  value={formData.team_name}
                  onChange={handleChange}
                  placeholder="e.g. VoltMasters"
                  className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Member One & Member Two */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-content-primary mb-1.5">
                  Member 1 Name <span className="text-status-fail">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="member_one_name"
                    required
                    value={formData.member_one_name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-primary mb-1.5">
                  Member 2 Name <span className="text-status-fail">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="member_two_name"
                    required
                    value={formData.member_two_name}
                    onChange={handleChange}
                    placeholder="e.g. Jane Smith"
                    className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* College Name & Academic Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-content-primary mb-1.5">
                  College Name <span className="text-status-fail">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. GCE Tirunelveli"
                    className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  />
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-content-primary mb-1.5">
                  Academic Year
                </label>
                <div className="relative">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-white border border-border-subtle rounded-md pl-9 pr-3 py-2 text-sm text-content-primary focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-md shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Registering Team...' : 'Register Team'}</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 pt-4 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-content-muted">Already registered your team?</span>
            <Link
              to="/login"
              className="font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-content-muted mt-6">
          Sparzo '26 Technical Symposium • Anna University
        </p>
      </div>
    </div>
  );
}