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
  Smartphone,
  Copy,
  Check,
  GraduationCap,
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
  defaultUpiApp?: 'PAYTM' | 'GPAY' | 'PHONEPE' | 'QR' | 'CUSTOM';
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
  defaultMethod = 'UPI_PAYTM',
  defaultUpiApp = 'PAYTM',
  onPaymentSuccess,
}) => {
  // Normalize default tab
  const getInitialTab = (): string => {
    if (defaultMethod.startsWith('UPI')) return 'UPI';
    if (defaultMethod.startsWith('CASH')) return 'CASH';
    return defaultMethod;
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [selectedUpiApp, setSelectedUpiApp] = useState<'PAYTM' | 'GPAY' | 'PHONEPE' | 'QR' | 'CUSTOM'>(
    defaultMethod === 'UPI_PAYTM' ? 'PAYTM' : defaultMethod === 'UPI_GPAY' ? 'GPAY' : defaultMethod === 'UPI_PHONEPE' ? 'PHONEPE' : defaultUpiApp
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);

  // UPI State
  const [paytmMobile, setPaytmMobile] = useState('9876543210');
  const [upiId, setUpiId] = useState('student@paytm');
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
    setActiveTab(getInitialTab());
    if (defaultMethod === 'UPI_PAYTM') setSelectedUpiApp('PAYTM');
    else if (defaultMethod === 'UPI_GPAY') setSelectedUpiApp('GPAY');
    else if (defaultMethod === 'UPI_PHONEPE') setSelectedUpiApp('PHONEPE');
    
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, defaultMethod]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const getResolvedPaymentMethod = (): PaymentMethod => {
    if (activeTab === 'UPI') {
      if (selectedUpiApp === 'PAYTM') return 'UPI_PAYTM';
      if (selectedUpiApp === 'GPAY') return 'UPI_GPAY';
      if (selectedUpiApp === 'PHONEPE') return 'UPI_PHONEPE';
      return 'UPI';
    }
    if (activeTab === 'CASH') {
      return orderType === 'HOSTEL_DELIVERY' ? 'CASH_ON_DELIVERY' : 'CASH_ON_PICKUP';
    }
    if (activeTab === 'CAMPUS_WALLET') return 'CAMPUS_WALLET';
    if (activeTab === 'CARD') return 'CARD';
    if (activeTab === 'NET_BANKING') return 'NET_BANKING';
    if (activeTab === 'WALLET') return 'WALLET';
    return 'UPI_PAYTM';
  };

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const resolvedMethod = getResolvedPaymentMethod();
    const prefix = resolvedMethod.replace(/_/g, '-');

    setTimeout(async () => {
      try {
        const txId = `TXN-${prefix}-${Date.now().toString(36).toUpperCase()}_${Math.floor(
          1000 + Math.random() * 9000
        )}`;
        await onPaymentSuccess(txId, resolvedMethod);
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
        'Transaction declined: Bank server did not respond or insufficient balance. Your order has not been placed. Please retry or choose another payment method.'
      );
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 text-left flex flex-col max-h-[92vh]">
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between">
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

        {/* Payment Methods Top Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
          {[
            { id: 'UPI', label: 'UPI / Paytm', icon: QrCode },
            { id: 'CASH', label: orderType === 'HOSTEL_DELIVERY' ? 'Cash on Delivery' : 'Pay at Counter', icon: Coins },
            { id: 'CAMPUS_WALLET', label: 'Campus Card', icon: GraduationCap },
            { id: 'CARD', label: 'Cards', icon: CreditCard },
            { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
            { id: 'WALLET', label: 'Wallets', icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMessage(null);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
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
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
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

          {/* TAB 1: UPI & PAYTM */}
          {activeTab === 'UPI' && (
            <div className="space-y-4">
              {/* UPI Sub-App Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Your Preferred UPI Option:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Paytm */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUpiApp('PAYTM');
                      setUpiId(`${paytmMobile}@paytm`);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                      selectedUpiApp === 'PAYTM'
                        ? 'border-[#00BAF2] bg-[#00BAF2]/10 ring-2 ring-[#00BAF2]/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="absolute -top-1.5 -right-1 text-[9px] font-black bg-[#00BAF2] text-white px-1.5 py-0.2 rounded-full shadow-2xs">
                      Popular
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#002E6E] text-white font-black text-[10px] flex items-center justify-center">
                        P
                      </span>
                      <span className="font-extrabold text-xs text-[#002E6E]">Paytm</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">@paytm UPI</span>
                  </button>

                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUpiApp('GPAY');
                      setUpiId('student@okhdfcbank');
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedUpiApp === 'GPAY'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
                        G
                      </span>
                      <span className="font-extrabold text-xs text-slate-900">Google Pay</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">@okaxis / @okhdfc</span>
                  </button>

                  {/* PhonePe */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUpiApp('PHONEPE');
                      setUpiId('student@ybl');
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedUpiApp === 'PHONEPE'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center">
                        Pe
                      </span>
                      <span className="font-extrabold text-xs text-slate-900">PhonePe</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">@ybl / @ibl</span>
                  </button>

                  {/* QR Code */}
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('QR')}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedUpiApp === 'QR'
                        ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-brand-600" />
                      <span className="font-extrabold text-xs text-slate-900">Scan QR</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">Any UPI App</span>
                  </button>
                </div>
              </div>

              {/* PAYTM SPECIFIC FORM */}
              {selectedUpiApp === 'PAYTM' && (
                <div className="p-4 rounded-2xl bg-[#00BAF2]/5 border border-[#00BAF2]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded-md bg-[#002E6E] text-white font-black text-xs tracking-tight">
                        Paytm
                      </div>
                      <span className="text-xs font-bold text-slate-800">Paytm Instant UPI</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ⚡ Zero Fee
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Enter Paytm Linked Mobile Number or UPI ID:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. 9876543210@paytm"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                        title="Copy VPA"
                      >
                        {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      A payment request of <strong>₹{totalAmount}</strong> will be sent to your Paytm app.
                    </p>
                  </div>
                </div>
              )}

              {/* OTHER UPI APPS (GPay / PhonePe / Custom) */}
              {(selectedUpiApp === 'GPAY' || selectedUpiApp === 'PHONEPE' || selectedUpiApp === 'CUSTOM') && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {selectedUpiApp === 'GPAY' ? 'Google Pay VPA' : selectedUpiApp === 'PHONEPE' ? 'PhonePe VPA' : 'Custom UPI ID'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Instant Verification
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Virtual Payment Address (VPA):
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              {/* DYNAMIC QR CODE DISPLAY */}
              {selectedUpiApp === 'QR' && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
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
                      Scan with Paytm, GPay, PhonePe or CRED
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Open any UPI app on your mobile and scan to authorize payment of <strong>₹{totalAmount}</strong>.
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-700 font-bold justify-center sm:justify-start">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Expires in {formatTimer(timerSeconds)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CASH ON DELIVERY / PICKUP */}
          {activeTab === 'CASH' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                <Coins className="w-5 h-5 text-amber-600" />
                <span>
                  {orderType === 'HOSTEL_DELIVERY' ? 'Cash on Delivery (COD)' : 'Pay Cash at Counter'}
                </span>
              </div>
              <p className="leading-relaxed text-amber-900">
                {orderType === 'HOSTEL_DELIVERY'
                  ? `You can pay ₹${totalAmount} in cash directly to your delivery partner upon delivery at your hostel room.`
                  : `You can pay ₹${totalAmount} in cash at the ${canteenName} collection counter upon pickup.`}
              </p>
              <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200 text-[11px] text-amber-800 font-medium">
                💡 <strong>Tip for Hostellers:</strong> Please keep exact change ready to speed up order handover!
              </div>
            </div>
          )}

          {/* TAB 3: CAMPUS STUDENT MEAL CARD */}
          {activeTab === 'CAMPUS_WALLET' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs text-indigo-200">
                  <span className="font-mono flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>SVIET STUDENT MEAL CARD</span>
                  </span>
                  <span className="font-bold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full text-[10px]">
                    Active
                  </span>
                </div>
                <div className="font-mono text-base tracking-widest font-black">
                  •••• •••• •••• 9842
                </div>
                <div className="flex justify-between text-[11px] text-indigo-200 pt-1 border-t border-white/10">
                  <span>Available Meal Balance</span>
                  <span className="font-bold text-amber-300 text-sm">₹500.00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Zero OTP required on campus Wi-Fi network. Instant 1-tap deduction.</span>
              </div>
            </div>
          )}

          {/* TAB 4: CREDIT / DEBIT CARDS */}
          {activeTab === 'CARD' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white shadow-md space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-mono">CAMPUS DEBIT / CREDIT CARD</span>
                  <span className="font-bold text-amber-400">RuPay / VISA / MasterCard</span>
                </div>
                <div className="font-mono text-base tracking-widest font-black">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>{cardName || 'STUDENT NAME'}</span>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
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
            </div>
          )}

          {/* TAB 5: NET BANKING */}
          {activeTab === 'NET_BANKING' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Your Bank:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'State Bank of India (SBI)',
                  'HDFC Bank',
                  'ICICI Bank',
                  'Punjab National Bank (PNB)',
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
                You will be securely redirected to <strong>{selectedBank}</strong> net banking to authenticate.
              </p>
            </div>
          )}

          {/* TAB 6: DIGITAL WALLETS */}
          {activeTab === 'WALLET' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Digital Wallet:</label>
              <div className="space-y-2">
                {[
                  { name: 'Paytm Wallet', balance: '₹450 available', badge: 'Popular' },
                  { name: 'PhonePe Wallet', balance: '₹80 available' },
                  { name: 'Amazon Pay', balance: '₹120 available' },
                  { name: 'Mobikwik', balance: '₹50 available' },
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{w.name}</span>
                      {w.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#00BAF2] text-white">
                          {w.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">{w.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Summary Breakdown */}
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
                <span>Processing Payment...</span>
              </span>
            ) : (
              <>
                <span>
                  {activeTab === 'CASH'
                    ? `Confirm Order (${orderType === 'HOSTEL_DELIVERY' ? 'COD' : 'Cash'}) • ₹${totalAmount}`
                    : activeTab === 'UPI' && selectedUpiApp === 'PAYTM'
                    ? `Pay ₹${totalAmount} via Paytm`
                    : `Pay ₹${totalAmount} Now`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Testing Failure Simulator & Close */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              title="Test payment failure handling"
            >
              ⚠️ Test Bank Decline
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
