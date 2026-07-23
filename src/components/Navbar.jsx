import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Zap, 
  User, 
  LogOut, 
  ShieldAlert, 
  PlusCircle, 
  LayoutDashboard, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal, onOpenUploadModal }) => {
  const { currentUser, logout, switchRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      // Hide navbar when scrolling down past 60px, show when scrolling up
      if (currentScrollPos > prevScrollPos && currentScrollPos > 60) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800/80 bg-cyber-950/90 backdrop-blur-2xl transition-transform duration-300 ease-in-out ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Printer className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Printf
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Online Printing Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'landing' 
                  ? 'bg-slate-800 text-white shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('customer_dashboard')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'customer_dashboard' 
                  ? 'bg-slate-800 text-white shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Customer Dashboard
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin_operator')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'admin_operator' 
                    ? 'bg-slate-800 text-amber-300 shadow-inner' 
                    : 'text-slate-400 hover:text-amber-200 hover:bg-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Admin Operator
              </button>
            )}
          </nav>

          {/* Actions & User */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 rounded-xl border border-emerald-400/30 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>Upload Document</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-medium text-slate-200"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="mt-1 inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
