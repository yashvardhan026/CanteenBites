'use client';

import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '@/types';
import {
  X,
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  foodSubtotal: number;
  platformFee: number;
  deliveryCharge: number;
  discount: number;
  tax: number;
  canteenName: string;
  orderType: string;
  defaultMethod?: PaymentMethod;
  onPaymentSuccess: (transactionId: string, method: PaymentMethod) => Promise<void>;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  foodSubtotal,
  platformFee,
  deliveryCharge,
  discount,
  tax,
  canteenName,
  orderType,
  defaultMethod = 'UPI',
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentMethod>(defaultMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UPI State
  const [upiId, setUpiId] = useState('student@okhdfcbank');
  const [timerSeconds, setTimerSeconds] = useState(299); // 5 minute countdown

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 4410 7821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardName, setCardName] = useState('STUDENT CARDHOLDER');

  // Net banking & Wallet state
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);
    setTimerSeconds(299);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate realistic gateway network roundtrip (800ms)
    setTimeout(async () => {
      try {
        const txId = `pay_CB_${Date.now().toString(36).toUpperCase()}_${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        await onPaymentSuccess(txId, activeTab);
        setIsProcessing(false);
      } catch (err: any) {
        setIsProcessing(false);
        setErrorMessage(err.message || 'Payment processing failed');
      }
    }, 850);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsProcessing(false);
      setErrorMessage(
        'Transaction declined: Insufficient balance / UPI network timed out. Your order has not been placed. Please retry or choose another payment method.'
      );
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 text-left flex flex-col max-h-[90vh]">
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black shadow-md">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">CanteenBites Pay</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  256-bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Paying <strong className="text-white">{canteenName}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
            <span className="text-xl font-black text-amber-400">₹{totalAmount}</span>
          </div>
        </div>

        {/* Payment Methods Sidebar / Top Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
          {[
            { id: 'UPI', label: 'UPI / QR', icon: QrCode },
            { id: 'CARD', label: 'Cards', icon: CreditCard },
            { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
            { id: 'WALLET', label: 'Wallets', icon: Wallet },
            { id: 'CASH_ON_PICKUP', label: 'Cash on Counter', icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as PaymentMethod);
                  setErrorMessage(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                  isSelected
                    ? 'border-brand-600 text-brand-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Payment Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* TAB 1: UPI & QR CODE */}
          {activeTab === 'UPI' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                {/* Simulated SVG QR Code */}
                <div className="w-32 h-32 p-2 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm flex flex-col items-center justify-center relative flex-shrink-0">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 opacity-90">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          i % 3 === 0 || i === 0 || i === 3 || i === 12 || i === 15
                            ? 'bg-slate-900'
                            : 'bg-indigo-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-1.5 py-0.5 rounded bg-brand-600 text-white font-black text-[9px] shadow">
                      UPI
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="text-xs font-bold text-slate-800">
                    Scan with any UPI App to Pay
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Google Pay, PhonePe, Paytm, CRED, BHIM
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-700 font-bold justify-center sm:justify-start">
                    <Clock className="w-3.5 h-3.5" />
                    <span>QR Code expires in {formatTimer(timerSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Instant App buttons */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Or Pay using Popular UPI Apps
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <button
                      key={app}
                      onClick={() => setUpiId(`student@${app.toLowerCase().replace(/\s/g, '')}`)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-[11px] font-bold text-slate-700 transition-all text-center"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter UPI ID (VPA)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARD */}
          {activeTab === 'CARD' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white shadow-md space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-mono">STUDENT CAMPUS CARD</span>
                  <span className="font-bold text-amber-400">RuPay / VISA</span>
                </div>
                <div className="font-mono text-base tracking-widest font-black">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>{cardName || 'YOUR NAME'}</span>
                  <span>EXP: {cardExpiry || 'MM/YY'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 8920 4410 7821"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 uppercase font-semibold"
                />
              </div>

              <p className="text-[10px] text-slate-400">
                🔒 Safe & encrypted. Raw card credentials are never saved on the server.
              </p>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {activeTab === 'NET_BANKING' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Select Your College Campus Bank
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'State Bank of India (SBI)',
                  'HDFC Bank',
                  'ICICI Bank',
                  'Punjab National Bank',
                  'Axis Bank',
                  'Canara Bank',
                ].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedBank === bank
                        ? 'border-brand-600 bg-brand-50/60 text-brand-700 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                You will be securely redirected to <strong>{selectedBank}</strong> gateway to authorize
                payment.
              </p>
            </div>
          )}

          {/* TAB 4: WALLETS */}
          {activeTab === 'WALLET' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Digital Wallet</label>
              <div className="space-y-2">
                {[
                  { name: 'Paytm Wallet', balance: '₹450 available' },
                  { name: 'Amazon Pay', balance: '₹120 available' },
                  { name: 'PhonePe Wallet', balance: '₹80 available' },
                ].map((w) => (
                  <div
                    key={w.name}
                    onClick={() => setSelectedWallet(w.name)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedWallet === w.name
                        ? 'border-brand-600 bg-brand-50/60 text-brand-800 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-bold">{w.name}</span>
                    <span className="text-[11px] text-slate-500">{w.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CASH ON PICKUP */}
          {activeTab === 'CASH_ON_PICKUP' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <Coins className="w-5 h-5 text-amber-600" />
                <span>Pay at Canteen Counter</span>
              </div>
              <p className="leading-relaxed">
                You can pay cash directly to the cashier when collecting your food at{' '}
                <strong>{canteenName}</strong>. Please carry exact change (₹{totalAmount}) if
                possible to speed up the counter queue!
              </p>
            </div>
          )}

          {/* Summary Breakdown */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>
              Food: ₹{foodSubtotal} • Platform: ₹{platformFee}{' '}
              {deliveryCharge > 0 && `• Delivery: ₹${deliveryCharge}`}
            </span>
            <span className="font-black text-slate-900">Total: ₹{totalAmount}</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
          {/* Main Pay CTA */}
          <button
            onClick={handlePaySuccess}
            disabled={isProcessing}
            className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authorizing with Bank...</span>
              </span>
            ) : (
              <>
                <span>Pay ₹{totalAmount} Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Testing Failure Simulator Button (Section 38 & 46) */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              title="Test payment failure handling"
            >
              ⚠️ Test Bank Decline / Network Timeout
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
