import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export const Toast = () => {
  const { activeToast } = useOrders();

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md text-xs font-semibold ${
        activeToast.type === 'error'
          ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          : activeToast.type === 'success'
          ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
          : 'bg-slate-900/90 text-slate-100 border-slate-700'
      }`}>
        {activeToast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        <span>{activeToast.message}</span>
      </div>
    </div>
  );
};
