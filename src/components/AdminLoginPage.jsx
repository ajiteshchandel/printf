import React, { useState, Suspense, lazy } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Printer, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UploadCloud, 
  Zap, 
  User, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Lazy load 3D Spline Scene
const Spline = lazy(() => import('@splinetool/react-spline'));

export const AdminLoginPage = () => {
  const { currentUser, login, register, loading, authError } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@printf.com');
  const [password, setPassword] = useState('demo12345');
  const [phone, setPhone] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // If user is already logged in, redirect automatically to their authorized dashboard
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    try {
      if (isRegisterMode) {
        if (adminPasscode !== 'admin123' && adminPasscode !== 'PRINTF_ADMIN_2026') {
          setPasscodeError('Invalid Admin Security Passcode! Operator key required.');
          return;
        }
        await register({ name, email, password, phone, role: 'admin' });
      } else {
        await login(email, password);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* LEFT PANEL - Brand & Spline 3D Showcase */}
      <div className="lg:w-1/2 bg-[#111827] border-b lg:border-b-0 lg:border-r border-[#232d3f] p-6 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Printer className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Printf <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg uppercase tracking-wider font-extrabold">Operator Portal</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="my-6 sm:my-8 space-y-4 sm:space-y-6 max-w-lg relative z-10 text-left">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Shop Operator <br />
            <span className="text-amber-400">Control Center.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Manage live spooling queues, print document requests, process customer jobs, and track printing shop operations.
          </p>

          {/* 3D Spline Scene Container */}
          <div className="relative w-full max-w-sm mx-auto h-52 sm:h-72 my-4 sm:my-6 flex items-center justify-center overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-950/60 shadow-2xl">
            <div className="w-full h-full scale-[1.08] relative overflow-hidden flex items-center justify-center">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading Interactive 3D Scene...</span>
                </div>
              }>
                <Spline scene="https://prod.spline.design/TIx60IAu7k0Iyrpv/scene.splinecode" />
              </Suspense>
            </div>
          </div>
        </div>

        {/* 3 Feature Badges at Bottom */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#232d3f] text-left relative z-10">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Protected Portal</h4>
            <p className="text-[10px] text-slate-400">Authorized shop operator access only.</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Live Spooling</h4>
            <p className="text-[10px] text-slate-400">Download and process print files instantly.</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Order Control</h4>
            <p className="text-[10px] text-slate-400">Update status timeline in real-time.</p>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL - Dedicated Admin / Operator Login Card */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between items-center relative overflow-y-auto">
        
        <div className="w-full max-w-md saas-card p-8 sm:p-10 space-y-6 shadow-2xl relative my-auto border border-amber-500/30 bg-gradient-to-b from-[#111827] via-[#111827] to-amber-950/20">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white">
              Printing Shop Operator
            </h2>
            <p className="text-xs text-amber-400 font-medium">
              Admin Portal & Order Control Center
            </p>
          </div>

          {(authError || passcodeError) && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passcodeError || authError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Operator Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Master Printer Admin"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@printf.com"
                  className="w-full text-xs pl-10 pr-4 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-10 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1.5">Admin Security Passcode *</label>
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter operator passcode (admin123)"
                  className="w-full text-xs p-3 bg-[#111827] border border-amber-500/40 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating Admin...</span>
              ) : isRegisterMode ? (
                <span>Register Operator Account</span>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            {isRegisterMode ? (
              <p>
                Existing operator account?{' '}
                <button onClick={() => setIsRegisterMode(false)} className="text-amber-400 font-extrabold hover:underline">
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                New shop operator?{' '}
                <button onClick={() => setIsRegisterMode(true)} className="text-amber-400 font-extrabold hover:underline">
                  Register operator account
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-6">
          © 2026 Printf. Operator Portal. All rights reserved.
        </div>

      </div>

    </div>
  );
};
