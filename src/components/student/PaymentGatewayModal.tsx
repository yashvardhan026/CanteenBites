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
  ChevronRight,
  RotateCcw,
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
  defaultUpiId?: string;
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
  defaultUpiId,
  onPaymentSuccess,
}) => {
  // Normalize initial tab
  const getInitialTab = (): string => {
    if (defaultMethod.startsWith('UPI')) return 'UPI';
    if (defaultMethod.startsWith('CASH')) return 'CASH';
    return defaultMethod;
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [selectedUpiApp, setSelectedUpiApp] = useState<'PAYTM' | 'GPAY' | 'PHONEPE' | 'QR' | 'CUSTOM'>(
    defaultMethod === 'UPI_PAYTM'
      ? 'PAYTM'
      : defaultMethod === 'UPI_GPAY'
      ? 'GPAY'
      : defaultMethod === 'UPI_PHONEPE'
      ? 'PHONEPE'
      : defaultMethod === 'UPI'
      ? 'QR'
      : defaultUpiApp
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [showMethodSwitcher, setShowMethodSwitcher] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState(defaultUpiId || '9876543210@paytm');
  const [timerSeconds, setTimerSeconds] = useState(299); // 5 minute countdown
  const [showPaytmQrInModal, setShowPaytmQrInModal] = useState(false);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 4410 7821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [cardName, setCardName] = useState('STUDENT CARDHOLDER');
  const [otpCode, setOtpCode] = useState('784920');

  // Net banking & Wallet state
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage(null);
    setTimerSeconds(299);
    setShowMethodSwitcher(false);
    setShowPaytmQrInModal(false);

    const initialTab = getInitialTab();
    setActiveTab(initialTab);

    if (defaultMethod === 'UPI_PAYTM') setSelectedUpiApp('PAYTM');
    else if (defaultMethod === 'UPI_GPAY') setSelectedUpiApp('GPAY');
    else if (defaultMethod === 'UPI_PHONEPE') setSelectedUpiApp('PHONEPE');
    else if (defaultMethod === 'UPI') setSelectedUpiApp('QR');
    else setSelectedUpiApp(defaultUpiApp);

    if (defaultUpiId) {
      setUpiId(defaultUpiId);
    } else if (defaultMethod === 'UPI_PAYTM') {
      setUpiId('9876543210@paytm');
    } else if (defaultMethod === 'UPI_GPAY') {
      setUpiId('student@okhdfcbank');
    } else if (defaultMethod === 'UPI_PHONEPE') {
      setUpiId('student@ybl');
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, defaultMethod, defaultUpiApp, defaultUpiId]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyVpa = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
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

    try {
      const txId = `TXN-${prefix}-${Date.now().toString(36).toUpperCase()}_${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      await onPaymentSuccess(txId, resolvedMethod);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed. Please check your details and retry.');
    }
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsProcessing(false);
      setErrorMessage(
        'Transaction declined by bank server: Insufficient funds or authorization timeout. Your order was NOT charged. Please retry or choose another payment method.'
      );
    }, 700);
  };

  // Determine gateway brand title & styling
  const getHeaderTheme = () => {
    if (activeTab === 'UPI' && selectedUpiApp === 'PAYTM') {
      return {
        bg: 'bg-gradient-to-r from-[#002E6E] via-[#003B8E] to-[#00BAF2]',
        badge: 'Paytm Verified Gateway',
        badgeColor: 'bg-[#00BAF2]/30 text-white border-[#00BAF2]/50',
        title: 'Paytm Instant UPI',
      };
    }
    if (activeTab === 'UPI' && selectedUpiApp === 'GPAY') {
      return {
        bg: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950',
        badge: 'Google Pay Verified',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        title: 'Google Pay UPI',
      };
    }
    if (activeTab === 'UPI' && selectedUpiApp === 'PHONEPE') {
      return {
        bg: 'bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950',
        badge: 'PhonePe Secure',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        title: 'PhonePe UPI Gateway',
      };
    }
    if (activeTab === 'CAMPUS_WALLET') {
      return {
        bg: 'bg-gradient-to-r from-indigo-950 via-brand-950 to-violet-950',
        badge: 'SVIET Campus Card',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        title: 'Campus Student Meal Card',
      };
    }
    return {
      bg: 'bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950',
      badge: '256-bit SSL Encrypted',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'CanteenBites Pay',
    };
  };

  const headerTheme = getHeaderTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 text-left flex flex-col max-h-[92vh]">
        {/* Gateway Branded Header */}
        <div className={`${headerTheme.bg} text-white p-4 sm:p-5 flex items-center justify-between transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center font-black shadow-md border border-white/20">
              {activeTab === 'UPI' && selectedUpiApp === 'PAYTM' ? (
                <span className="text-sm font-black text-[#00BAF2]">P</span>
              ) : activeTab === 'CAMPUS_WALLET' ? (
                <GraduationCap className="w-5 h-5 text-amber-300" />
              ) : (
                <Lock className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">{headerTheme.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${headerTheme.badgeColor}`}>
                  {headerTheme.badge}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5">
                Paying <strong className="text-white">{canteenName}</strong> • {orderType === 'HOSTEL_DELIVERY' ? 'Hostel Room Delivery' : 'Canteen Pickup'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-300 block font-medium">Total Payable</span>
            <span className="text-xl font-black text-amber-400">₹{totalAmount}</span>
          </div>
        </div>

        {/* Change Payment Method Bar Toggle */}
        <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <span>Payment Method:</span>
            <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
              {activeTab === 'UPI'
                ? selectedUpiApp === 'PAYTM'
                  ? 'Paytm UPI'
                  : selectedUpiApp === 'GPAY'
                  ? 'Google Pay'
                  : selectedUpiApp === 'PHONEPE'
                  ? 'PhonePe'
                  : 'Dynamic UPI QR'
                : activeTab === 'CASH'
                ? orderType === 'HOSTEL_DELIVERY'
                  ? 'Cash on Delivery'
                  : 'Pay Cash at Counter'
                : activeTab === 'CAMPUS_WALLET'
                ? 'Campus Student Card'
                : activeTab === 'CARD'
                ? 'Debit/Credit Card'
                : activeTab === 'NET_BANKING'
                ? 'Net Banking'
                : 'Digital Wallet'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMethodSwitcher(!showMethodSwitcher)}
            className="text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            <span>{showMethodSwitcher ? 'Hide Options' : 'Change Method'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showMethodSwitcher ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Optional Collapsible Method Switcher */}
        {showMethodSwitcher && (
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar p-1.5 gap-1 animate-in slide-in-from-top-2">
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
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Payment Error</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* 1. PAYTM SPECIFIC FLOW */}
          {activeTab === 'UPI' && selectedUpiApp === 'PAYTM' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002E6E]/10 via-[#00BAF2]/10 to-transparent border border-[#00BAF2]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-md bg-[#002E6E] text-white font-black text-xs">
                      Paytm
                    </div>
                    <span className="text-xs font-extrabold text-[#002E6E]">Paytm Instant UPI Request</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    ⚡ Zero Fee
                  </span>
                </div>

                {/* Status ping */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Payment Request Target:</span>
                    <span className="font-mono font-bold text-[#002E6E]">{upiId}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    A payment request of <strong className="text-slate-900">₹{totalAmount}</strong> has been prepared for your Paytm app. Approve the transaction or click below to authorize.
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-brand-700 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request expires in {formatTimer(timerSeconds)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPaytmQrInModal(!showPaytmQrInModal)}
                      className="font-bold text-[#00BAF2] hover:underline flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{showPaytmQrInModal ? 'Hide Paytm QR' : 'Scan Paytm QR'}</span>
                    </button>
                  </div>
                </div>

                {/* Optional Paytm QR Toggle */}
                {showPaytmQrInModal && (
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#00BAF2]/40 text-center space-y-2 animate-in fade-in">
                    <div className="w-36 h-36 mx-auto bg-slate-900 rounded-2xl p-2 relative shadow-md flex items-center justify-center">
                      <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded-xl">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-xs ${
                              i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                                ? 'bg-[#002E6E]'
                                : 'bg-[#00BAF2]'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="px-2 py-0.5 rounded bg-[#002E6E] text-white font-black text-[9px] shadow-md border border-[#00BAF2]">
                          Paytm UPI
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">Scan with any Paytm Scanner</span>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                      <span>VPA: <code className="font-mono font-bold text-slate-700">sviet.canteen@paytm</code></span>
                      <button
                        type="button"
                        onClick={() => handleCopyVpa('sviet.canteen@paytm')}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Copy VPA"
                      >
                        {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Mobile / UPI Option */}
                <div className="pt-1">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Paytm Linked Mobile or VPA:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9876543210@paytm"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyVpa(upiId)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DYNAMIC QR CODE FLOW */}
          {activeTab === 'UPI' && selectedUpiApp === 'QR' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-36 h-36 bg-white rounded-2xl p-2 border-2 border-indigo-300 shadow-md flex items-center justify-center relative flex-shrink-0">
                  <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-slate-50 rounded-xl">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                            ? 'bg-slate-900'
                            : 'bg-brand-500'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-brand-600 text-white font-black text-[9px] shadow-md border border-white/40">
                      UPI QR
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <span className="font-extrabold text-xs text-slate-900 block">
                    Scan with Paytm, GPay, PhonePe or CRED
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Point your camera or UPI scanner at the QR code above to authorize payment of <strong className="text-slate-900">₹{totalAmount}</strong>.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-700 justify-center sm:justify-start">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires in {formatTimer(timerSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 justify-center sm:justify-start">
                    <span>UPI ID: <code className="font-mono font-bold text-slate-800">sviet.canteen@paytm</code></span>
                    <button
                      type="button"
                      onClick={() => handleCopyVpa('sviet.canteen@paytm')}
                      className="p-1 hover:bg-white rounded text-slate-600 border border-slate-200"
                      title="Copy UPI ID"
                    >
                      {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. GOOGLE PAY / PHONEPE FLOW */}
          {activeTab === 'UPI' && (selectedUpiApp === 'GPAY' || selectedUpiApp === 'PHONEPE') && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {selectedUpiApp === 'GPAY' ? 'Google Pay UPI Authorization' : 'PhonePe UPI Authorization'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Instant Verification
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Virtual Payment Address (VPA):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder={selectedUpiApp === 'GPAY' ? 'student@okhdfcbank' : 'student@ybl'}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyVpa(upiId)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  An in-app payment mandate will be sent to your registered UPI device.
                </p>
              </div>
            </div>
          )}

          {/* 4. CASH CONFIRMATION */}
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
                  ? `Pay ₹${totalAmount} in exact cash directly to your delivery staff upon delivery at your hostel room.`
                  : `Pay ₹${totalAmount} in cash at the ${canteenName} collection counter when collecting your food.`}
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-amber-800 font-medium">
                💡 <strong>Hosteller Note:</strong> Please keep exact change ready to speed up order handover!
              </div>
            </div>
          )}

          {/* 5. CAMPUS MEAL CARD */}
          {activeTab === 'CAMPUS_WALLET' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-md space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center text-xs text-indigo-200">
                  <span className="font-mono flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-300" />
                    <span>SVIET STUDENT MEAL CARD</span>
                  </span>
                  <span className="font-bold text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded-full text-[10px]">
                    Active Balance
                  </span>
                </div>
                <div className="font-mono text-base tracking-widest font-black">
                  •••• •••• •••• 9842
                </div>
                <div className="flex justify-between text-[11px] text-indigo-200 pt-1 border-t border-white/10">
                  <span>Available Balance</span>
                  <span className="font-bold text-amber-300 text-sm">₹500.00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Zero OTP required on campus network. Instant 1-tap deduction.</span>
              </div>
            </div>
          )}

          {/* 6. CREDIT / DEBIT CARDS */}
          {activeTab === 'CARD' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white shadow-md space-y-2.5">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span className="font-mono">CAMPUS CARD 3D SECURE</span>
                  <span className="font-bold text-amber-400">RuPay / VISA / MasterCard</span>
                </div>
                <div className="font-mono text-base tracking-widest font-black">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>{cardName}</span>
                  <span>EXP: {cardExpiry}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  Enter Simulated Bank OTP:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="784920"
                    maxLength={6}
                    className="w-32 px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono font-bold tracking-widest text-center"
                  />
                  <span className="text-[10px] text-slate-500 self-center">
                    (Pre-filled demo OTP for instant authorization)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 7. NET BANKING */}
          {activeTab === 'NET_BANKING' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Bank for Authentication:</label>
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
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
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
                You will be securely authenticated via <strong>{selectedBank}</strong> portal.
              </p>
            </div>
          )}

          {/* 8. WALLETS */}
          {activeTab === 'WALLET' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Digital Wallet:</label>
              <div className="space-y-2">
                {[
                  { name: 'Paytm Wallet', balance: '₹450 available', badge: 'Popular' },
                  { name: 'PhonePe Wallet', balance: '₹80 available' },
                  { name: 'Amazon Pay', balance: '₹120 available' },
                ].map((w) => (
                  <div
                    key={w.name}
                    onClick={() => setSelectedWallet(w.name)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2.5">
          {/* Main Pay CTA */}
          <button
            onClick={handlePaySuccess}
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] ${
              activeTab === 'UPI' && selectedUpiApp === 'PAYTM'
                ? 'bg-[#002E6E] hover:bg-[#003B8E] shadow-[#00BAF2]/20'
                : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>
                  {activeTab === 'UPI' && selectedUpiApp === 'PAYTM'
                    ? 'Connecting to Paytm UPI...'
                    : 'Authorizing Transaction...'}
                </span>
              </span>
            ) : (
              <>
                <span>
                  {activeTab === 'CASH'
                    ? `Confirm Order (${orderType === 'HOSTEL_DELIVERY' ? 'COD' : 'Cash'}) • ₹${totalAmount}`
                    : activeTab === 'UPI' && selectedUpiApp === 'PAYTM'
                    ? `Approve & Pay ₹${totalAmount} via Paytm`
                    : activeTab === 'UPI' && selectedUpiApp === 'QR'
                    ? `I Have Paid ₹${totalAmount} via UPI`
                    : activeTab === 'CAMPUS_WALLET'
                    ? `Deduct ₹${totalAmount} from Meal Card`
                    : `Authorize & Pay ₹${totalAmount}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center justify-between pt-0.5">
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
              Cancel / Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
