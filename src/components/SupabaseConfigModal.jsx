import React, { useState } from 'react';
import { X, Database, Check, AlertCircle, RefreshCw, Key, HelpCircle, Zap } from 'lucide-react';
import { 
  getStoredSupabaseConfig, 
  saveCustomSupabaseConfig, 
  clearCustomSupabaseConfig, 
  isSupabaseActive 
} from '../services/supabaseConfig';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const currentConfig = getStoredSupabaseConfig() || {};
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.supabaseAnonKey || '');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setErrorMsg('Supabase URL and Anon Key are required!');
      return;
    }

    saveCustomSupabaseConfig({
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
  };

  const handleReset = () => {
    clearCustomSupabaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Supabase Setup & Connection
                {isSupabaseActive ? (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Live Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                    Offline Demo Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Connect Printf to your Supabase Auth, Database & Storage Bucket</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl text-xs text-slate-300 leading-relaxed flex gap-3">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300 mb-1">How to find your Supabase credentials:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-400 underline hover:text-emerald-300">Supabase Dashboard</a> and select your project.</li>
                <li>Go to <strong>Project Settings</strong> ➔ <strong>API</strong>.</li>
                <li>Copy your <strong>Project URL</strong> and <strong>`anon` `public` key</strong>.</li>
              </ol>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL *</label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzabcdefg.supabase.co"
                required
                className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Anon / Public Key *</label>
              <input
                type="text"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                required
                className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Revert to Demo Mode
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Connect Supabase
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
