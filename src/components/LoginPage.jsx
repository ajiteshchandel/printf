import React, { useState, Suspense, lazy } from 'react';
import { 
  Printer, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  UploadCloud, 
  Zap, 
  ArrowRight,
  User,
  Phone,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Lazy load 3D Spline Scene
const Spline = lazy(() => import('@splinetool/react-spline'));

export const LoginPage = ({ onLoginSuccess, onOpenSupabaseModal }) => {
  const { login, register, loginWithGoogle, loading, authError, isSupabaseActive } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('customer@printf.com');
  const [password, setPassword] = useState('demo12345');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        await register({ name, email, password, phone, role });
      } else {
        await login(email, password);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      // Error handled in auth context
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {}
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-brand-500 selection:text-white">
      
      {/* LEFT PANEL - Brand & Spline 3D Showcase */}
      <div className="lg:w-1/2 bg-[#111827] border-b lg:border-b-0 lg:border-r border-[#232d3f] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-purple-glow">
            <Printer className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Printf<span className="text-brand-500">.</span>
          </span>
        </div>

        {/* Hero Content */}
        <div className="my-8 space-y-6 max-w-lg relative z-10 text-left">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Print Smarter. <br />
            <span className="text-brand-500">Upload. Print.</span> Done.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Upload your documents, choose your preferences and collect your prints hassle-free.
          </p>

          {/* 3D Spline Scene Container (Watermark Cropped) */}
          <div className="relative w-full h-64 sm:h-72 my-6 flex items-center justify-center overflow-hidden rounded-3xl border border-indigo-500/20 bg-slate-950/60 shadow-2xl">
            <div className="w-full h-full scale-[1.08] relative overflow-hidden flex items-center justify-center">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                  <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading Interactive 3D Spline Scene...</span>
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
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/40 text-brand-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Secure & Safe</h4>
            <p className="text-[10px] text-slate-400">Your documents are always protected.</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/40 text-brand-500 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Easy Upload</h4>
            <p className="text-[10px] text-slate-400">Upload in any format within seconds.</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/40 text-brand-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Fast & Reliable</h4>
            <p className="text-[10px] text-slate-400">Quick printing with real-time updates.</p>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL - Dark Theme Form Card & Authentication */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between items-center relative">
        
        {/* Top Bar: Connection & Mode indicator */}
        <div className="w-full flex justify-between items-center pb-6">
          <button
            onClick={onOpenSupabaseModal}
            className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5 hover:bg-emerald-500/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>{isSupabaseActive ? 'Connected to Supabase' : 'Offline Demo Mode (Click to Settings)'}</span>
          </button>
        </div>

        {/* Form Card (Elevated Dark Card matching reference screenshot) */}
        <div className="w-full max-w-md saas-card p-8 sm:p-10 space-y-6 shadow-2xl relative my-auto">
          
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white">
              {isRegisterMode ? 'Create Account' : 'Welcome Back!'}
            </h2>
            <p className="text-xs text-slate-400">
              {isRegisterMode ? 'Register to start remote document printing' : 'Login to your Printf account'}
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full text-xs pl-10 pr-4 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                {!isRegisterMode && (
                  <button type="button" className="text-[11px] font-bold text-brand-500 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs pl-10 pr-10 py-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-brand-500 transition-colors"
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
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs p-3 bg-[#111827] border border-[#232d3f] rounded-xl text-white outline-none focus:border-brand-500"
                >
                  <option value="customer">Customer (Upload & Order Prints)</option>
                  <option value="admin">Printing Shop Operator (Print & Spool Docs)</option>
                </select>
              </div>
            )}

            {/* Remember me checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-brand-500 rounded bg-[#111827] border-slate-700 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-semibold text-slate-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Login Button matching screenshot */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-extrabold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-purple-glow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating with Supabase...</span>
              ) : isRegisterMode ? (
                <span>Create Account</span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 text-center text-xs text-slate-500">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#232d3f]" /></div>
            <span className="relative bg-[#161e2e] px-3 font-semibold">or continue with</span>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-3 border border-[#232d3f] bg-[#111827] hover:bg-[#1d273a] rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Toggle Register / Login */}
          <div className="pt-2 text-center text-xs text-slate-400">
            {isRegisterMode ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegisterMode(false)} className="text-brand-500 font-extrabold hover:underline">
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsRegisterMode(true)} className="text-brand-500 font-extrabold hover:underline">
                  Sign up
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-6">
          © 2026 Printf. All rights reserved.
        </div>

      </div>

    </div>
  );
};
