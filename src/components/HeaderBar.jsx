import React from 'react';
import { Bell, ChevronDown, Sparkles, User, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HeaderBar = ({ onOpenAuthModal, onOpenSupabaseModal }) => {
  const { currentUser, switchRole, isSupabaseActive } = useAuth();

  return (
    <header className="h-20 bg-[#111827] border-b border-[#232d3f] px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Quick Role & Mode Switcher */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Mode:
        </span>
        <div className="flex items-center bg-[#161e2e] p-1 rounded-xl border border-[#232d3f]">
          <button
            onClick={() => switchRole('customer')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentUser?.role === 'customer'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3 h-3" /> Customer View
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentUser?.role === 'admin'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3 h-3" /> Admin View
          </button>
        </div>

        {isSupabaseActive && (
          <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full flex items-center gap-1 border border-emerald-500/30">
            <Zap className="w-3 h-3 fill-current" /> Supabase Live
          </span>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-5">
        
        {/* Notification Bell */}
        <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-[#111827]" />
        </button>

        {/* User Profile Dropdown */}
        {currentUser ? (
          <div className="flex items-center gap-3 pl-2 border-l border-[#232d3f]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-[#161e2e] flex items-center justify-center font-bold text-brand-500 text-sm">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div className="hidden sm:block text-left">
              <span className="text-sm font-extrabold text-white block leading-tight">{currentUser.name}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {currentUser.role}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-purple-glow transition-all"
          >
            Sign In
          </button>
        )}

      </div>

    </header>
  );
};
