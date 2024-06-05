import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  User, 
  HelpCircle, 
  LogOut, 
  Printer,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, onOpenUploadModal, onOpenSupabaseModal }) => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#232d3f] flex flex-col justify-between shrink-0 min-h-screen p-6 select-none">
      
      <div className="space-y-8">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group px-2"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-purple-glow group-hover:scale-105 transition-transform">
            <Printer className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Printf<span className="text-brand-500">.</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'sidebar-item-active'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => setActiveTab('my_orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'my_orders'
                ? 'sidebar-item-active'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_operator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'admin_operator'
                ? 'sidebar-item-active'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Operator Terminal</span>
          </button>

          <button
            onClick={onOpenSupabaseModal}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Supabase Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'sidebar-item-active'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'support'
                ? 'sidebar-item-active'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>

        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-6 border-t border-[#232d3f]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};
