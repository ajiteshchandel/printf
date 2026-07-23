import React, { Suspense, lazy } from 'react';
import { 
  Upload, 
  Play, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Printer, 
  ShoppingBag, 
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

// Lazy load 3D Spline Scene
const Spline = lazy(() => import('@splinetool/react-spline'));

export const DashboardView = ({ onOpenUploadModal, onViewInvoice, setActiveTab }) => {
  const { currentUser } = useAuth();
  const { customerOrders } = useOrders();

  // Calculate statistics matching strictly the logged-in customer's orders
  const totalOrdersCount = customerOrders.length;
  const activeOrdersCount = customerOrders.filter(o => ['Order Confirmed', 'File Received', 'Printing'].includes(o.orderStatus)).length;
  const completedOrdersCount = customerOrders.filter(o => o.orderStatus === 'Completed').length;
  const pendingOrdersCount = customerOrders.filter(o => o.orderStatus === 'Ready for Collection').length;

  const getFileBadge = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <div className="w-8 h-8 rounded-lg file-badge-pdf flex items-center justify-center font-bold text-[10px]">PDF</div>;
    } else if (['doc', 'docx'].includes(ext)) {
      return <div className="w-8 h-8 rounded-lg file-badge-doc flex items-center justify-center font-bold text-[10px]">DOC</div>;
    } else if (['ppt', 'pptx'].includes(ext)) {
      return <div className="w-8 h-8 rounded-lg file-badge-ppt flex items-center justify-center font-bold text-[10px]">PPT</div>;
    } else {
      return <div className="w-8 h-8 rounded-lg file-badge-jpg flex items-center justify-center font-bold text-[10px]">IMG</div>;
    }
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Printing':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 rounded-md">Printing</span>;
      case 'Ready for Collection':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/50 rounded-md">Ready for Collection</span>;
      case 'Order Confirmed':
      case 'File Received':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50 rounded-md">Order Confirmed</span>;
      case 'Completed':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 rounded-md">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded-md">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[11px] font-bold bg-slate-800 text-slate-400 rounded-md">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-[1500px] mx-auto text-slate-100">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT / MIDDLE MAIN COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* 1. HERO BANNER CARD WITH INTERACTIVE 3D SPLINE SCENE */}
          <div className="hero-banner-card p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 sm:space-y-4 max-w-md text-left z-10 w-full">
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Print Smarter. <br />
                <span className="text-brand-500">Upload. Print.</span> Done.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Upload your documents, choose your preferences, submit order and collect your prints easily.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenUploadModal}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-purple-glow transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
                
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-200 hover:text-white bg-[#111827]/80 hover:bg-[#111827] border border-slate-700/80 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-slate-400" /> How It Works
                </a>
              </div>
            </div>

            {/* 3D Spline Interactive Scene Container (Watermark Cropped & Responsive Width) */}
            <div className="relative shrink-0 w-full max-w-sm sm:w-96 h-56 sm:h-64 flex items-center justify-center overflow-hidden rounded-2xl border border-indigo-500/30 bg-slate-950/40 shadow-2xl">
              <div className="w-64 h-64 rounded-full bg-brand-500/20 absolute blur-3xl pointer-events-none" />
              <div className="w-full h-full scale-[1.08] relative overflow-hidden flex items-center justify-center">
                <Suspense fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 gap-2 p-4 text-center">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading Interactive 3D Spline Scene...</span>
                  </div>
                }>
                  <Spline scene="https://prod.spline.design/TIx60IAu7k0Iyrpv/scene.splinecode" />
                </Suspense>
              </div>
            </div>

          </div>

          {/* 2. HOW IT WORKS CARD */}
          <div id="how-it-works" className="saas-card p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-extrabold text-white">How It Works</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative">
              <div className="bg-[#111827] p-5 sm:p-6 rounded-2xl border border-[#232d3f] text-center space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-indigo-950 text-brand-500 font-bold text-xs flex items-center justify-center mx-auto border border-indigo-800/40">
                  1
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white mx-auto flex items-center justify-center shadow-purple-glow">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Upload</h4>
                <p className="text-xs text-slate-400">Upload your documents in any format.</p>
              </div>

              <div className="bg-[#111827] p-5 sm:p-6 rounded-2xl border border-[#232d3f] text-center space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-indigo-950 text-brand-500 font-bold text-xs flex items-center justify-center mx-auto border border-indigo-800/40">
                  2
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white mx-auto flex items-center justify-center shadow-purple-glow">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Customize</h4>
                <p className="text-xs text-slate-400">Choose your printing preferences and instructions.</p>
              </div>

              <div className="bg-[#111827] p-5 sm:p-6 rounded-2xl border border-[#232d3f] text-center space-y-3 relative">
                <div className="w-7 h-7 rounded-full bg-indigo-950 text-brand-500 font-bold text-xs flex items-center justify-center mx-auto border border-indigo-800/40">
                  3
                </div>
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white mx-auto flex items-center justify-center shadow-purple-glow">
                  <Printer className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Collect</h4>
                <p className="text-xs text-slate-400">Collect your prints from the shop at your convenience.</p>
              </div>
            </div>

          </div>

          {/* 3. WHY CHOOSE PRINTF? CARD */}
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-extrabold text-white">Why Choose Printf?</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#232d3f] space-y-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Secure & Safe</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Your documents are securely uploaded and stored.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#232d3f] space-y-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/40 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Multiple Formats</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Supports PDF, DOC, DOCX, JPG, PNG and more.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#232d3f] space-y-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/40 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Direct Cloud Upload</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Synced directly to encrypted Cloud storage.</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-[#232d3f] space-y-2 text-left">
                <div className="w-9 h-9 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/40 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Fast & Reliable</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Quick printing with real-time order updates.</p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR WIDGETS COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          
          <div className="saas-card p-5 sm:p-6 space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Welcome back, {currentUser?.name || 'Ajitesh'}! 👋
              </h2>
              <p className="text-xs text-slate-400 mt-1">Here's what's happening with your orders today.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-950/60 border border-purple-800/40 text-center space-y-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-900/60 text-purple-300 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{totalOrdersCount}</div>
                <span className="text-[10px] font-bold text-slate-400">Total Orders</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-center space-y-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-900/60 text-emerald-300 mx-auto flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{activeOrdersCount}</div>
                <span className="text-[10px] font-bold text-slate-400">Active Orders</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-950/60 border border-amber-800/40 text-center space-y-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-900/60 text-amber-300 mx-auto flex items-center justify-center">
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{completedOrdersCount}</div>
                <span className="text-[10px] font-bold text-slate-400">Completed</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-950/60 border border-rose-800/40 text-center space-y-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-900/60 text-rose-300 mx-auto flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{pendingOrdersCount}</div>
                <span className="text-[10px] font-bold text-slate-400">Pending</span>
              </div>
            </div>
          </div>

          <div className="saas-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white">Recent Orders</h3>
              <button 
                onClick={() => setActiveTab('my_orders')}
                className="text-xs font-bold text-brand-500 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 divide-y divide-slate-800/80">
              {customerOrders.length > 0 ? (
                customerOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {getFileBadge(order.fileName)}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[140px]">{order.fileName}</p>
                        <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      {getStatusPill(order.orderStatus)}
                      <p className="text-xs font-black text-white">₹{order.totalAmount || 40}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400">No print orders submitted yet for {currentUser?.name || 'your account'}.</p>
                  <button
                    onClick={onOpenUploadModal}
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload First Document
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-700/50 p-5 sm:p-6 rounded-2xl text-white shadow-purple-glow relative overflow-hidden flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black">
                %
              </div>
              <h4 className="text-xs font-extrabold leading-snug">Get 10% Off on your first order!</h4>
              <p className="text-[10px] font-semibold text-purple-200 bg-white/10 px-2.5 py-1 rounded-md inline-block border border-white/20">
                Use code: <span className="font-mono text-white font-bold">PRINTF10</span>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
