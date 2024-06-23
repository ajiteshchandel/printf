import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Loader2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal = ({ isOpen, orderPayload, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [upiId, setUpiId] = useState('alex@upi');

  if (!isOpen || !orderPayload) return null;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate backend payment gateway processing delay & verification
    await new Promise(r => setTimeout(r, 1500));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setProcessing(false);
    onPaymentSuccess(orderPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Printf Secure Checkout
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-semibold">256-bit Encrypted</span>
              </h3>
              <p className="text-xs text-slate-400">Total Amount: <strong className="text-emerald-400 font-bold">₹{orderPayload.totalAmount}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePayNow} className="mt-6 space-y-6">
          
          {/* Payment Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'card'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[11px] font-semibold">Credit/Debit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'upi'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-[11px] font-semibold">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                paymentMethod === 'netbanking'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-[11px] font-semibold">Net Banking</span>
            </button>
          </div>

          {/* Form Fields */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expires (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">VPA / UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okaxis"
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">You will receive a payment request on your UPI mobile application.</p>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Bank</label>
              <select className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500">
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India</option>
                <option>Axis Bank</option>
              </select>
            </div>
          )}

          {/* Submit Pay button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment Status...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Pay ₹{orderPayload.totalAmount} & Confirm Order
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
