import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  Eye, 
  Edit3, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_LIST = ['All', 'Order Confirmed', 'File Received', 'Printing', 'Ready for Collection', 'Completed', 'Cancelled'];

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { orders, loadingOrders, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminRemarkInput, setAdminRemarkInput] = useState('');
  const [updating, setUpdating] = useState(false);

  // Authorization Check
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">403 - Access Denied</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You do not have permission to view the Shop Operator Terminal. This section is restricted exclusively to authorized Printing Shop Admins.
          </p>
        </div>
      </div>
    );
  }

  // Operator stats
  const totalCount = orders.length;
  const newCount = orders.filter(o => o.orderStatus === 'Order Confirmed').length;
  const printingCount = orders.filter(o => o.orderStatus === 'Printing').length;
  const readyCount = orders.filter(o => o.orderStatus === 'Ready for Collection').length;
  const completedCount = orders.filter(o => o.orderStatus === 'Completed').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Payment Successful')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    .toFixed(2);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus, adminRemarkInput);
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, adminRemarks: adminRemarkInput || selectedOrder.adminRemarks });
      }
    } catch (err) {}
    setUpdating(false);
  };

  const handlePrintDocument = (order) => {
    // Trigger browser print dialog for document or mockup window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>Printing ${order.fileName} - Printf Operator</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
              .box { border: 2px border #333; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 600px; text-align: left; }
            </style>
          </head>
          <body>
            <h2>Printf Master Operator Spooler</h2>
            <div class="box">
              <h3>Document: ${order.fileName}</h3>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
              <p><strong>Print Specs:</strong> ${order.copies} copies | ${order.colorType} | ${order.paperSize} | ${order.printSides} | ${order.orientation}</p>
              <p><strong>Page Range:</strong> ${order.pageRange}</p>
              <p><strong>Instructions:</strong> ${order.instructions || 'Standard'}</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Confirmed':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">New Order</span>;
      case 'File Received':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">File Received</span>;
      case 'Printing':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1"><Printer className="w-3 h-3 animate-pulse" /> Printing</span>;
      case 'Ready for Collection':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">Ready for Collection</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 rounded-full">Completed</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Operator Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Printing Shop Operator Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Spooler & Management</h1>
          <p className="text-xs text-slate-400 mt-1">Download documents, trigger prints, and update customer order status in real time.</p>
        </div>

        <div className="bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800 text-right">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Revenue Collected</span>
          <span className="text-2xl font-black text-emerald-400">₹{totalRevenue}</span>
        </div>
      </div>

      {/* Operator Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div 
          onClick={() => setStatusFilter('Order Confirmed')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Order Confirmed' ? 'bg-indigo-600/20 border-indigo-500' : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">New Orders</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{newCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Printing')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Printing' ? 'bg-amber-600/20 border-amber-500' : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Currently Printing</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{printingCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Ready for Collection')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Ready for Collection' ? 'bg-emerald-600/20 border-emerald-500' : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Ready for Pickup</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{readyCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('Completed')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Completed' ? 'bg-slate-800/80 border-slate-700' : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Completed</span>
          <div className="text-2xl font-extrabold text-slate-200 mt-1">{completedCount}</div>
        </div>

        <div 
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'All' ? 'bg-indigo-600/20 border-indigo-500' : 'glass-card border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 font-medium">Total Orders</span>
          <div className="text-2xl font-extrabold text-white mt-1">{totalCount}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {STATUS_LIST.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer, ID, File..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                      {order.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-200">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-100 max-w-[150px] truncate">{order.fileName}</p>
                      <p className="text-[11px] text-slate-400">₹{order.totalAmount}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <span>{order.copies} copies • {order.colorType} • {order.paperSize}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                        Paid
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setAdminRemarkInput(order.adminRemarks || '');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
                      >
                        Manage & Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Order Details & Status Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                  Operator Management Drawer
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                  Order ID: <span className="font-mono text-indigo-400">{selectedOrder.orderId}</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={selectedOrder.fileUrl}
                  download={selectedOrder.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download File
                </a>
                <button
                  onClick={() => handlePrintDocument(selectedOrder)}
                  className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Spool Print
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Current Status: {getStatusBadge(selectedOrder.orderStatus)}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Customer */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-400" /> Customer Info
                </h4>
                <p className="text-sm font-extrabold text-slate-100">{selectedOrder.customerName}</p>
                <p className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedOrder.customerEmail}</p>
                <p className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedOrder.customerPhone || 'Not provided'}</p>
              </div>

              {/* Specifications */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" /> Print Requirements Checklist
                </h4>
                <div className="grid grid-cols-2 gap-1 text-slate-300">
                  <p><strong>Copies:</strong> {selectedOrder.copies}</p>
                  <p><strong>Color:</strong> {selectedOrder.colorType}</p>
                  <p><strong>Paper Size:</strong> {selectedOrder.paperSize}</p>
                  <p><strong>Print Sides:</strong> {selectedOrder.printSides}</p>
                  <p><strong>Orientation:</strong> {selectedOrder.orientation}</p>
                  <p><strong>Page Range:</strong> {selectedOrder.pageRange}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs space-y-2">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider">Customer Instructions</h4>
              <p className="text-slate-200 italic bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                "{selectedOrder.instructions || "No special instructions."}"
              </p>
              <p className="text-slate-400 mt-2">
                <strong>Retrieval Request:</strong> {selectedOrder.collectionInstructions || "Pickup at shop"}
              </p>
            </div>

            {/* Admin Remarks Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Add Operator Remark / Note for Customer</label>
              <input
                type="text"
                value={adminRemarkInput}
                onChange={(e) => setAdminRemarkInput(e.target.value)}
                placeholder="e.g., Printed cleanly. Ready at Counter #2."
                className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Transition Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300">Advance Real-Time Order Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedOrder.orderId, 'File Received')}
                  className="px-3 py-2 text-xs font-semibold bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30 rounded-xl transition-all"
                >
                  Mark "File Received"
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedOrder.orderId, 'Printing')}
                  className="px-3 py-2 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl transition-all"
                >
                  Mark "Printing"
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedOrder.orderId, 'Ready for Collection')}
                  className="px-3 py-2 text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl transition-all"
                >
                  Mark "Ready for Collection"
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedOrder.orderId, 'Completed')}
                  className="px-3 py-2 text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl transition-all"
                >
                  Mark "Completed"
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusChange(selectedOrder.orderId, 'Cancelled')}
                  className="px-3 py-2 text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl transition-all"
                >
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 text-xs font-bold bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
