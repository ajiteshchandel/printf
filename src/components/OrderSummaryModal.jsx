import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Send, 
  ArrowLeft, 
  ShieldCheck,
  Printer,
  Clock
} from 'lucide-react';

export const OrderSummaryModal = ({ configData, onBack, onSubmitOrder, isSubmitting }) => {
  if (!configData) return null;

  // Calculate pricing breakdown display (optional reference or zero cost)
  const pagesEstimate = 10;
  const baseRate = configData.colorType === 'Color' ? 5.0 : 1.5;
  const paperMultiplier = configData.paperSize === 'A3' ? 1.8 : 1.0;
  const sidesDiscount = configData.printSides === 'Double-Sided' ? 0.85 : 1.0;
  const estimatedPrice = (pagesEstimate * baseRate * paperMultiplier * sidesDiscount * configData.copies).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Step 3 of 3</span>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
              <FileText className="w-6 h-6 text-indigo-400" /> Review & Submit Order
            </h2>
            <p className="text-xs text-slate-400">Verify print preferences before sending document directly to the printing operator</p>
          </div>
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Preferences
          </button>
        </div>

        {/* Specifications grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Info */}
          <div className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">File Name:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[180px]">{configData.fileName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Copies:</span>
                <span className="font-semibold text-indigo-400">{configData.copies} Copy/Sets</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Page Selection:</span>
                <span className="font-semibold text-slate-200">{configData.pageRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Color Mode:</span>
                <span className={`font-semibold ${configData.colorType === 'Color' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {configData.colorType}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Paper Size:</span>
                <span className="font-semibold text-amber-300">{configData.paperSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Sides & Orientation:</span>
                <span className="font-semibold text-slate-200">{configData.printSides} ({configData.orientation})</span>
              </div>
            </div>
          </div>

          {/* Retrieval Info */}
          <div className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retrieval & Collection</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Pickup Hub:</span>
                <span className="font-semibold text-slate-200">Printf Central Printing Shop</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Pickup Schedule:</span>
                <span className="font-semibold text-amber-300">{configData.collectionDate} at {configData.collectionTime}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Printing Instructions:</span>
                <span className="italic text-slate-300 bg-slate-900 p-2 rounded-lg block">
                  {configData.instructions || "Standard printing protocol."}
                </span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Collection Instructions:</span>
                <span className="italic text-slate-300 bg-slate-900 p-2 rounded-lg block">
                  {configData.collectionInstructions || "Self-collection at shop."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Direct File Submission Enabled
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Document uploads directly to Firebase Cloud Storage and notifies the printing operator.
            </p>
          </div>

          <button
            onClick={() => onSubmitOrder({ ...configData, totalAmount: 0 })}
            disabled={isSubmitting}
            className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Uploading to Firebase...</span>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Order to Printing Shop
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
