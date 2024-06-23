import React, { useState } from 'react';
import { X, Flame, Check, AlertCircle, RefreshCw, Key, HelpCircle } from 'lucide-react';
import { getStoredFirebaseConfig, saveCustomFirebaseConfig, clearCustomFirebaseConfig, isFirebaseActive } from '../services/firebaseConfig';

export const FirebaseConfigModal = ({ isOpen, onClose }) => {
  const currentConfig = getStoredFirebaseConfig() || {};
  const [jsonInput, setJsonInput] = useState('');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');
  const [parseError, setParseError] = useState('');
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' | 'json'

  if (!isOpen) return null;

  const handleParseJson = (text) => {
    setJsonInput(text);
    setParseError('');
    if (!text.trim()) return;
    
    try {
      // Clean up string if user pasted firebaseConfig object from Firebase Console
      let clean = text.replace(/const firebaseConfig =/g, '').replace(/;/g, '').trim();
      // Add quotes around unquoted keys if necessary
      clean = clean.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
      // Fix trailing commas
      clean = clean.replace(/,\s*}/g, '}');

      const parsed = JSON.parse(clean);
      if (parsed.apiKey) setApiKey(parsed.apiKey);
      if (parsed.authDomain) setAuthDomain(parsed.authDomain);
      if (parsed.projectId) setProjectId(parsed.projectId);
      if (parsed.storageBucket) setStorageBucket(parsed.storageBucket);
      if (parsed.messagingSenderId) setMessagingSenderId(parsed.messagingSenderId);
      if (parsed.appId) setAppId(parsed.appId);
    } catch (e) {
      setParseError('Could not auto-parse JSON. Please check format or fill fields manually.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setParseError('API Key and Project ID are required!');
      return;
    }

    const config = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };

    saveCustomFirebaseConfig(config);
  };

  const handleReset = () => {
    clearCustomFirebaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Firebase Setup & Connection
                {isFirebaseActive ? (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Live Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                    Offline Mock Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Connect Printf to your Firebase Authentication, Firestore, and Cloud Storage</p>
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
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl text-xs text-slate-300 leading-relaxed flex gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-indigo-300 mb-1">How to connect your Firebase Project:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>Go to your <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">Firebase Console</a> and select your project.</li>
                <li>Go to <strong>Project Settings</strong> ➔ <strong>General</strong> ➔ Scroll to <strong>Your apps</strong> ➔ Copy web config object.</li>
                <li>Paste the config object below or enter the fields individually. Credentials save safely to your browser session.</li>
              </ol>
            </div>
          </div>

          {/* Mode Switcher tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('fields')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'fields' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manual Form Fields
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'json' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Config JSON Object
            </button>
          </div>

          {parseError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {activeTab === 'json' ? (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Paste `firebaseConfig` snippet from Firebase Console</label>
              <textarea
                value={jsonInput}
                onChange={(e) => handleParseJson(e.target.value)}
                placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "myproject.firebaseapp.com",\n  projectId: "myproject",\n  storageBucket: "myproject.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:abcdef"\n};`}
                rows={7}
                className="w-full font-mono text-xs p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">API Key *</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  required
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project ID *</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-printf-project"
                  required
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="my-printf-project.firebaseapp.com"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="my-printf-project.appspot.com"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  value={messagingSenderId}
                  onChange={(e) => setMessagingSenderId(e.target.value)}
                  placeholder="123456789"
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">App ID</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abc..."
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </form>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Disconnect & Revert to Demo Mode
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
                onClick={handleSave}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4" /> Connect Firebase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
