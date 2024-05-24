import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const InvoiceModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:bg-white print:text-black print:w-full print:max-w-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-black">
          <div>
            <span className="text-xl font-black tracking-tight text-white print:text-black">Printf</span>
            <p className="text-xs text-slate-400 print:text-gray-600">Online Document Printing Service</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrintReceipt}
              className="px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between text-xs">
          <div>
            <span className="text-slate-400 block print:text-gray-600">Billed To:</span>
            <p className="font-bold text-slate-100 print:text-black">{order.customerName}</p>
            <p className="text-slate-400 print:text-gray-600">{order.customerEmail}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block print:text-gray-600">Invoice Ref:</span>
            <p className="font-mono font-bold text-indigo-400 print:text-black">{order.orderId}</p>
            <p className="text-slate-400 print:text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Invoice Items table */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden print:border-gray-300">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 print:bg-gray-100 print:text-black print:border-gray-300">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3">Copies</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-300">
              <tr>
                <td className="p-3">
                  <p className="font-bold text-slate-200 print:text-black">{order.fileName}</p>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    {order.colorType} • {order.paperSize} • {order.printSides} • Range: {order.pageRange}
                  </p>
                </td>
                <td className="p-3 font-semibold text-slate-300 print:text-black">{order.copies}</td>
                <td className="p-3 text-right font-bold text-slate-100 print:text-black">₹{order.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs print:text-emerald-700">
            <CheckCircle2 className="w-4 h-4" /> Paid via {order.paymentStatus}
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block print:text-gray-600">Total Amount</span>
            <span className="text-xl font-extrabold text-white print:text-black">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 print:text-gray-500 pt-2 border-t border-slate-800 print:border-gray-300">
          Thank you for choosing Printf Online Printing Services! Keep this receipt for pickup verification.
        </div>

      </div>
    </div>
  );
};
