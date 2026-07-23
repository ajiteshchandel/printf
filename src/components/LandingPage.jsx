import React, { useState } from 'react';
import { 
  Upload, 
  Sliders, 
  ShoppingBag, 
  CheckCircle2, 
  Zap, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Lock,
  Cpu,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ onOpenUploadModal }) => {
  
  // Interactive Price Calculator state
  const [calcPages, setCalcPages] = useState(15);
  const [calcCopies, setCalcCopies] = useState(2);
  const [calcColor, setCalcColor] = useState('Color'); // 'BW' | 'Color'
  const [calcPaper, setCalcPaper] = useState('A4');
  const [calcSides, setCalcSides] = useState('Double');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Price Calculation
  const pageCost = calcColor === 'BW' ? 1.5 : 5.0;
  const paperMultiplier = calcPaper === 'A3' ? 1.8 : 1.0;
  const sidesDiscount = calcSides === 'Double' ? 0.85 : 1.0;
  const estimatedPrice = (calcPages * pageCost * paperMultiplier * sidesDiscount * calcCopies).toFixed(2);

  const faqs = [
    {
      q: "How does remote document printing work on Printf?",
      a: "Simply drag and drop your document (PDF, DOCX, PPT, JPG), configure your exact print requirements (copies, paper size, single/double sided), and submit your order. Authorized printing operators download your document from Cloud Storage and print it immediately!"
    },
    {
      q: "Do I need to pay online before printing?",
      a: "No! Payment requirement has been completely removed. Your document submits directly to the printing shop operator so it is printed and ready for your collection with zero waiting time."
    },
    {
      q: "Where are my uploaded documents stored?",
      a: "Your files are securely stored directly inside your Supabase Cloud Storage bucket (`printf`) with strict row-level security. Only authorized printing shop operators can access the file to spool your prints."
    },
    {
      q: "How do I track my printing order status?",
      a: "You can view your Customer Dashboard in real-time. The timeline updates instantly from 'Order Confirmed' ➔ 'File Received' ➔ 'Printing' ➔ 'Ready for Collection'."
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 mesh-bg overflow-hidden selection:bg-emerald-500 selection:text-cyber-950">
      
      {/* HERO SECTION - Full Viewport Immersive Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Floating Glowing Ambient Orbs */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-600/15 blur-[140px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full text-center space-y-8 py-8">
          
          {/* Top Heroic Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full badge-neon text-xs font-bold tracking-wide backdrop-blur-xl animate-float">
            <Zap className="w-4 h-4 text-emerald-400 fill-current animate-bounce" />
            <span>Next-Gen Remote Document Printing Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Hero Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]">
              Remote Printing, <br />
              <span className="gradient-hero-title">Redefined.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Upload documents remotely, customize your exact print preferences, and collect crisp printed pages from the shop counter without waiting in queues or transferring files via USB.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
            <button
              onClick={onOpenUploadModal}
              className="px-9 py-4.5 text-base font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 rounded-2xl border border-emerald-400/40 shadow-glow-emerald hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 group"
            >
              <Upload className="w-5 h-5 text-emerald-300 stroke-[2.5] group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform" />
              <span>Upload Document Now</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#calculator"
              className="px-8 py-4.5 text-base font-bold text-slate-200 hover:text-white bg-cyber-900/80 hover:bg-cyber-800 border border-slate-800 hover:border-slate-700 rounded-2xl backdrop-blur-xl transition-all flex items-center gap-2"
            >
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Calculate Price</span>
            </a>
          </div>

          {/* Sub-Hero Features Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Secure Cloud Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Real-Time Operator Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Zero Physical Waiting</span>
            </div>
          </div>

          {/* Hero Interactive Drag & Drop Box */}
          <div 
            onClick={onOpenUploadModal}
            className="max-w-2xl mx-auto mt-10 glass-panel-hero p-8 rounded-3xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <Upload className="w-7 h-7 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Click to Test Instant Upload
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Supports PDF, DOCX, PPTX, JPG, PNG (Max 25MB)</p>
                </div>
              </div>

              <span className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 rounded-xl group-hover:bg-emerald-300 transition-all flex items-center gap-1.5 shrink-0 shadow-lg">
                Select File <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* HEROIC 3-STEP PROCESS SECTION */}
      <section id="how-it-works" className="py-24 bg-cyber-900/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 rounded-full badge-violet text-xs font-bold uppercase tracking-wider">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              3 Steps to <span className="gradient-hero-violet">Instant Prints</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Skip queue hassles with an end-to-end cloud printing experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="glass-card-neon p-8 rounded-3xl space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-black border border-emerald-500/30 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> Upload Document
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Drag and drop your document file. Files upload directly to encrypted Cloud Storage with full security.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card-violet p-8 rounded-3xl space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-2xl font-black border border-violet-500/30 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-violet-400" /> Customize Options
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Select color vs B&W, copies, paper size (A4, A3, Letter), single or double-sided, page range, and special instructions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card-neon p-8 rounded-3xl space-y-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-black border border-cyan-500/30 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" /> Collect Printed File
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track live printing updates in real-time. The shop operator downloads, prints, and marks your order ready for instant pickup!
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE PRICE CALCULATOR SECTION */}
      <section id="calculator" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-hero p-8 sm:p-12 rounded-3xl border border-emerald-500/20 shadow-glow-emerald relative overflow-hidden space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full badge-neon text-xs font-bold uppercase tracking-wider">
              Interactive Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Live Print Cost Calculator</h2>
            <p className="text-slate-400 text-sm">Adjust settings below to estimate exact costs in real time</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pages Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Number of Pages:</span>
                  <span className="text-emerald-400 font-mono text-sm">{calcPages} Pages</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={calcPages} 
                  onChange={(e) => setCalcPages(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-cyber-850 h-2.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Copies Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-200">
                  <span>Number of Copies:</span>
                  <span className="text-emerald-400 font-mono text-sm">{calcCopies} Set{calcCopies > 1 ? 's' : ''}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={calcCopies} 
                  onChange={(e) => setCalcCopies(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-cyber-850 h-2.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Toggle Controls */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Color Mode</label>
                  <select
                    value={calcColor}
                    onChange={(e) => setCalcColor(e.target.value)}
                    className="w-full p-3 bg-cyber-900 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-400"
                  >
                    <option value="BW">Black & White (₹1.5/pg)</option>
                    <option value="Color">Full Color (₹5.0/pg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Paper Size</label>
                  <select
                    value={calcPaper}
                    onChange={(e) => setCalcPaper(e.target.value)}
                    className="w-full p-3 bg-cyber-900 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-400"
                  >
                    <option value="A4">Standard A4</option>
                    <option value="A3">Large A3 (+80%)</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Print Sides</label>
                  <select
                    value={calcSides}
                    onChange={(e) => setCalcSides(e.target.value)}
                    className="w-full p-3 bg-cyber-900 border border-slate-700 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-400"
                  >
                    <option value="Single">Single-Sided</option>
                    <option value="Double">Double-Sided (15% Off)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Calculated Output Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-cyber-900 via-cyber-850 to-cyber-900 p-8 rounded-3xl border border-emerald-500/30 text-center space-y-5 shadow-2xl relative">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Estimated Total</span>
              <div className="text-5xl font-black text-white flex items-center justify-center gap-1">
                <span className="text-emerald-400 text-3xl">₹</span>
                <span>{estimatedPrice}</span>
              </div>
              <p className="text-xs text-slate-400">Includes paper stock, laser printing & instant operator notifications</p>

              <button
                onClick={onOpenUploadModal}
                className="w-full py-4 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 rounded-xl border border-emerald-400/30 shadow-glow-emerald hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-emerald-300 stroke-[2.5]" /> Start Order With This Spec
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 bg-cyber-900/40 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about Printf</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-panel-hero rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
