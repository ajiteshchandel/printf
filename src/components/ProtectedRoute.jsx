import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to appropriate login page
  if (!currentUser) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in, but unauthorized role -> Show 403 Access Denied
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6 text-slate-100 font-sans">
        <div className="w-full max-w-md bg-[#111827] border border-[#232d3f] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">403 - Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account ({currentUser.role}) does not have authorization to view this route.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={currentUser.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-purple-glow transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Authorized Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
