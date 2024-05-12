import React, { useState } from 'react';
import { 
  Sliders, 
  Copy, 
  FileText, 
  Palette, 
  FileCheck, 
  Layers, 
  MessageSquare, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Info
} from 'lucide-react';

export const PrintConfigurator = ({ uploadedFileData, onBack, onProceedToSummary }) => {
  const [copies, setCopies] = useState(1);
  const [pageSelectionType, setPageSelectionType] = useState('all'); // 'all' | 'custom'
  const [customPageRange, setCustomPageRange] = useState('1-5');
  const [colorType, setColorType] = useState('Black & White'); // 'Black & White' | 'Color'
  const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'A3' | 'Letter' | 'Legal'
  const [printSides, setPrintSides] = useState('Double-Sided'); // 'Single-Sided' | 'Double-Sided'
  const [orientation, setOrientation] = useState('Portrait'); // 'Portrait' | 'Landscape'
  const [instructions, setInstructions] = useState('');
  
  // Retrieval & Collection
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().slice(0,10));
  const [collectionTime, setCollectionTime] = useState('17:00');
  const [collectionInstructions, setCollectionInstructions] = useState('Will collect after 5 PM');

  const handleSubmit = (e) => {
    e.preventDefault();
    const configData = {
      ...uploadedFileData,
      copies: Number(copies),
      colorType,
      paperSize,
      pageRange: pageSelectionType === 'all' ? 'All Pages' : customPageRange,
      printSides,
      orientation,
      instructions,
      collectionDate,
      collectionTime,
      collectionInstructions
    };
    onProceedToSummary(configData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Step 2 of 4</span>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Sliders className="w-6 h-6 text-indigo-400" /> Configure Printing Options
            </h2>
            <p className="text-xs text-slate-400">File: <span className="text-indigo-300 font-semibold">{uploadedFileData.fileName}</span></p>
          </div>
          <button
            onClick={onBack}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Change File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Grid Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Number of Copies */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Copy className="w-4 h-4 text-indigo-400" /> Number of Copies
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-lg hover:bg-slate-800 transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-extrabold text-white min-w-[30px] text-center">{copies}</span>
                <button
                  type="button"
                  onClick={() => setCopies(copies + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-lg hover:bg-slate-800 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Page Range Selection */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" /> Page Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPageSelectionType('all')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    pageSelectionType === 'all'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  All Pages
                </button>
                <button
                  type="button"
                  onClick={() => setPageSelectionType('custom')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    pageSelectionType === 'custom'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Specific Range
                </button>
              </div>
              {pageSelectionType === 'custom' && (
                <input
                  type="text"
                  value={customPageRange}
                  onChange={(e) => setCustomPageRange(e.target.value)}
                  placeholder="e.g. 1-5, 8, 11-14"
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              )}
            </div>

            {/* Color Type */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" /> Color Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setColorType('Black & White')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    colorType === 'Black & White'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Black & White
                </button>
                <button
                  type="button"
                  onClick={() => setColorType('Color')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    colorType === 'Color'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Full Color
                </button>
              </div>
            </div>

            {/* Paper Size */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" /> Paper Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['A4', 'A3', 'Letter', 'Legal'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPaperSize(size)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      paperSize === size
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Print Sides */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Print Sides
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintSides('Single-Sided')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    printSides === 'Single-Sided'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Single-Sided
                </button>
                <button
                  type="button"
                  onClick={() => setPrintSides('Double-Sided')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    printSides === 'Double-Sided'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Double-Sided
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" /> Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('Portrait')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    orientation === 'Portrait'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('Landscape')}
                  className={`py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    orientation === 'Landscape'
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

          </div>

          {/* Additional Printing Instructions */}
          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> Special Printing Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Please staple top left corner and use thick cover paper."
              className="w-full text-xs p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Retrieval & Collection Details */}
          <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pickup & Retrieval Preferences
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preferred Pickup Date</label>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preferred Pickup Time</label>
                <input
                  type="time"
                  value={collectionTime}
                  onChange={(e) => setCollectionTime(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Collection Instructions / Notes</label>
              <input
                type="text"
                value={collectionInstructions}
                onChange={(e) => setCollectionInstructions(e.target.value)}
                placeholder="e.g. I will collect after 5 PM."
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <span>Review Order Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
