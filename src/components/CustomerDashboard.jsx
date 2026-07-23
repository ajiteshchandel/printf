import React, { useState } from 'react';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  ChevronRight, 
  ShoppingBag,
  Eye,
  RefreshCw,
  Search,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_STEPS = ['Order Confirmed', 'File Received', 'Printing', 'Ready for Collection', 'Completed'];

export const CustomerDashboard = ({ onOpenUploadModal, onViewInvoice }) => {
  const { currentUser } = useAuth();
  const { customerOrders, loadingOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Stats calculation
  const totalOrders = customerOrders.length;
  const activeOrders = customerOrders.filter(o => ['Order Confirmed', 'File Received', 'Printing'].includes(o.orderStatus)).length;
  const readyOrders = customerOrders.filter(o => o.orderStatus === 'Ready for Collection').length;
  const completedOrders = customerOrders.filter(o => o.orderStatus === 'Completed').length;

  const filteredOrders = customerOrders.filter(o => 
    o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Confirmed':
        return <span className="px-3 py-1 text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded-full">Order Confirmed</span>;
      case 'File Received':
        return <span className="px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">File Received</span>;
      case 'Printing':
        return <span className="px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1.5"><Printer className="w-3.5 h-3.5 animate-bounce text-amber-400" /> Printing</span>;
      case 'Ready for Collection':
        return <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full">Ready for Collection</span>;
      case 'Completed':
        return <span className="px-3 py-1 text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 rounded-full">Completed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-full">{status}</span>;
    }
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Heroic Customer Welcome Banner */}
      <div className="glass-panel-hero p-8 sm:p-10 rounded-3xl border border-emerald-500/20 shadow-glow-emerald flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-current" /> Customer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Welcome back, {currentUser?.name || 'Customer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track real-time printing orders, submit new files, and download invoices.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-7 py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 rounded-2xl border border-emerald-400/30 shadow-glow-emerald hover:shadow-emerald-500/40 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5 text-emerald-300 stroke-[2.5]" /> Upload New Document
        </button>
      </div>

      {/* Heroic Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card-violet p-6 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Printing</span>
          <div className="text-3xl font-black text-amber-400 mt-2">{activeOrders}</div>
        </div>

        <div className="glass-card-neon p-6 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Ready for Pickup</span>
          <div className="text-3xl font-black text-emerald-400 mt-2">{readyOrders}</div>
        </div>

        <div className="glass-card-violet p-6 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
          <div className="text-3xl font-black text-violet-300 mt-2">{completedOrders}</div>
        </div>

        <div className="glass-card-neon p-6 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Orders</span>
          <div className="text-3xl font-black text-slate-100 mt-2">{totalOrders}</div>
        </div>
      </div>

      {/* Main Order List Section */}
      <div className="glass-panel-hero p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Recent Printing Activity
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or File..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-cyber-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {loadingOrders ? (
          <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" /> Syncing real-time orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800/80 rounded-3xl space-y-3">
            <Printer className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-200 font-bold text-sm">No printing orders found</p>
            <p className="text-xs text-slate-400">Upload a document to get started with instant printing</p>
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-2.5 text-xs font-bold text-cyber-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-all"
            >
              Upload Document
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const stepIdx = getStepIndex(order.orderStatus);

              return (
                <div 
                  key={order.id}
                  className="bg-cyber-900/80 border border-slate-800/90 hover:border-slate-700 p-6 rounded-2xl transition-all space-y-5 shadow-xl"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-emerald-300 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        {order.orderId}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>

                  {/* Document & Specs info */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 flex items-center gap-3">
                      <div className="p-3.5 bg-cyber-950 rounded-xl text-emerald-400 border border-slate-800">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white max-w-[300px] truncate">{order.fileName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.copies} copies • {order.colorType} • {order.paperSize} • {order.printSides}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-5 flex justify-end gap-2">
                      <button
                        onClick={() => onViewInvoice(order)}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-cyber-950 border border-slate-800 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </div>
                  </div>

                  {/* Real-time Status Timeline */}
                  <div className="pt-2">
                    <div className="relative flex items-center justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= stepIdx;
                        const isCurrent = idx === stepIdx;

                        return (
                          <div key={step} className="flex-1 text-center relative z-10">
                            <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              isCurrent
                                ? 'bg-amber-400 text-cyber-950 ring-4 ring-amber-400/20 animate-pulse'
                                : isDone
                                ? 'bg-emerald-400 text-cyber-950'
                                : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[10px] mt-2 block font-semibold max-w-[80px] mx-auto truncate ${
                              isCurrent ? 'text-amber-400 font-bold' : isDone ? 'text-slate-200' : 'text-slate-500'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Remarks note if admin added */}
                  {order.adminRemarks && (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span><strong>Operator Remark:</strong> {order.adminRemarks}</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-cyber-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Order Details: {selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 bg-cyber-950 p-4 rounded-2xl border border-slate-800">
                <div><span className="text-slate-500 block">Document:</span> <p className="font-bold text-slate-100">{selectedOrder.fileName}</p></div>
                <div><span className="text-slate-500 block">Status:</span> <p className="font-bold text-amber-400">{selectedOrder.orderStatus}</p></div>
                <div><span className="text-slate-500 block">Print Options:</span> <p>{selectedOrder.copies} copies • {selectedOrder.colorType} • {selectedOrder.paperSize}</p></div>
                <div><span className="text-slate-500 block">Sides & Orientation:</span> <p>{selectedOrder.printSides} • {selectedOrder.orientation}</p></div>
              </div>

              <div className="p-3.5 bg-cyber-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Printing Instructions</span>
                <p className="italic">{selectedOrder.instructions || "None"}</p>
              </div>

              <div className="p-3.5 bg-cyber-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Collection Request</span>
                <p>{selectedOrder.collectionInstructions || "Pickup at central counter"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onViewInvoice(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10"
              >
                Download Receipt
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
