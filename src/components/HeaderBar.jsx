import React from 'react';
import { Bell, ChevronDown, Sparkles, User, ShieldAlert, Zap, Menu, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HeaderBar = ({ onOpenAuthModal, onOpenSupabaseModal, onToggleMobileMenu }) => {
  const { currentUser, switchRole, isSupabaseActive } = useAuth();

  return (
    <header className="h-16 sm:h-20 bg-[#111827] border-b border-[#232d3f] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Menu Toggle & Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Hamburger Menu button on Mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-300 hover:text-white bg-[#161e2e] border border-[#232d3f] rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Brand */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-purple-glow">
            <Printer className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">Printf<span className="text-brand-500">.</span></span>
        </div>

        {/* Quick Role Switcher (Hidden on tiny screens or condensed) */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden md:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Mode:
          </span>
          <div className="flex items-center bg-[#161e2e] p-1 rounded-xl border border-[#232d3f]">
            <button
              onClick={() => switchRole('customer')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'customer'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> Customer
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        {isSupabaseActive && (
          <span className="hidden xl:flex px-2.5 py-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full items-center gap-1 border border-emerald-500/30">
            <Zap className="w-3 h-3 fill-current" /> Live
          </span>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-[#111827]" />
        </button>

        {/* User Profile Avatar */}
        {currentUser ? (
          <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-[#232d3f]">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-[#161e2e] flex items-center justify-center font-bold text-brand-500 text-xs sm:text-sm">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div className="hidden sm:block text-left max-w-[120px] truncate">
              <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight truncate">{currentUser.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                {currentUser.role}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3 py-1.5 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-purple-glow transition-all"
          >
            Sign In
          </button>
        )}

      </div>

    </header>
  );
};
