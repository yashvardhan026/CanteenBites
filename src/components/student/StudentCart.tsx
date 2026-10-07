'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OrderType, PaymentMethod } from '@/types';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Bike,
  Building,
  CheckCircle2,
  ShieldCheck,
  Tag,
  CreditCard,
  QrCode,
  Wallet,
  Coins,
  AlertCircle,
  Clock,
  ArrowRight,
  GraduationCap,
  Building2,
  Lock,
  Copy,
  Check,
  Smartphone,
} from 'lucide-react';
import { PaymentGatewayModal } from './PaymentGatewayModal';

export const StudentCart: React.FC = () => {
  const {
    user,
    cart,
    removeFromCart,
    updateCartQuantity,
    updateSpecialInstructions,
    clearCart,
    orderType,
    setOrderType,
    hostelDetails,
    setHostelDetails,
    selectedCanteen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    billingSummary,
    placeOrder,
    setActiveNavTab,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Payment Selection States
  const [selectedCategory, setSelectedCategory] = useState<'UPI' | 'CASH' | 'CAMPUS_WALLET' | 'CARD' | 'NET_BANKING' | 'WALLET'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'PAYTM' | 'GPAY' | 'PHONEPE' | 'QR'>('PAYTM');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI_PAYTM');
  const [upiId, setUpiId] = useState('student@paytm');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 8920 4410 7821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');

  // Modal & Processing state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Quick instructions edit state
  const [editingInstructionsId, setEditingInstructionsId] = useState<string | null>(null);
  const [instructionText, setInstructionText] = useState('');

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;
    setIsApplyingCoupon(true);
    const res = await applyCoupon(code);
    setIsApplyingCoupon(false);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleInitiatePayment = () => {
    // If Cash is selected, place order directly with zero extra clicks
    if (selectedCategory === 'CASH') {
      const cashMethod: PaymentMethod =
        orderType === 'HOSTEL_DELIVERY' ? 'CASH_ON_DELIVERY' : 'CASH_ON_PICKUP';
      handleDirectOrder(cashMethod);
      return;
    }

    // Open Payment Gateway Modal for simulated authorization
    setIsGatewayOpen(true);
  };

  const handleDirectOrder = async (method: PaymentMethod, txId?: string) => {
    setIsPlacingOrder(true);
    try {
      const result = await placeOrder(method, txId);
      setIsPlacingOrder(false);
      if (result.success) {
        setIsGatewayOpen(false);
      }
    } catch (e) {
      setIsPlacingOrder(false);
    }
  };

  const handlePaymentSuccessFromGateway = async (transactionId: string, method: PaymentMethod) => {
    await handleDirectOrder(method, transactionId);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-lg mx-auto shadow-card animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl shadow-inner animate-float-gentle">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Your cart is hungry.</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Add something delicious! Browse meals, snacks, and chilled beverages from{' '}
          <strong className="text-brand-600">{selectedCanteen?.name || 'campus canteens'}</strong>.
        </p>
        <button
          onClick={() => setActiveNavTab('home')}
          className="btn-primary shadow-soft hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isHostelDisabledForCanteen = selectedCanteen && !selectedCanteen.hostelDeliveryEnabled;
  const isDayScholar = user?.studentType === 'DAY_SCHOLAR';

  return (
    <div className="space-y-6 pb-24 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Checkout</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ordering from <strong className="text-brand-600">{selectedCanteen?.name}</strong>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {cart.map((ci) => (
          <div
            key={ci.menuItem.id}
            className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-card flex gap-3 items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={ci.menuItem.image}
                  alt={ci.menuItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1">
                  <span className={ci.menuItem.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {ci.menuItem.name}
                </h4>
                <span className="font-black text-xs text-slate-800">
                  ₹{ci.menuItem.price * ci.quantity}
                </span>

                {/* Special instructions display / edit */}
                {ci.specialInstructions ? (
                  <p className="text-[11px] text-amber-700 italic mt-0.5">
                    Note: "{ci.specialInstructions}"
                  </p>
                ) : null}

                {editingInstructionsId === ci.menuItem.id ? (
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Less spicy..."
                      value={instructionText}
                      onChange={(e) => setInstructionText(e.target.value)}
                      className="px-2 py-0.5 text-xs rounded border border-slate-300"
                    />
                    <button
                      onClick={() => {
                        updateSpecialInstructions(ci.menuItem.id, instructionText);
                        setEditingInstructionsId(null);
                        setInstructionText('');
                      }}
                      className="px-2 py-0.5 bg-brand-600 text-white rounded text-[10px] font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingInstructionsId(null)}
                      className="text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingInstructionsId(ci.menuItem.id);
                      setInstructionText(ci.specialInstructions || '');
                    }}
                    className="block text-[10px] text-brand-600 hover:underline mt-0.5"
                  >
                    {ci.specialInstructions ? 'Edit instruction' : '+ Add custom cooking note'}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity - 1)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-xs text-slate-800 w-4 text-center">
                {ci.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center hover:bg-brand-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Type: Pickup vs Hostel Delivery */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
        <h3 className="font-black text-sm text-slate-900">Choose Order Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Canteen Pickup */}
          <div
            onClick={() => setOrderType('CANTEEN_PICKUP')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              orderType === 'CANTEEN_PICKUP'
                ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                  🏬
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Canteen Express Pickup</h4>
                  <p className="text-[10px] text-slate-500">Collect fresh from the counter</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600">FREE</span>
            </div>
          </div>

          {/* Hostel Room Delivery */}
          <div
            onClick={() => {
              if (isDayScholar) {
                showToast(
                  'Day Scholar Notice',
                  'Hostel room delivery is reserved for hostellers. Please choose Canteen Pickup.',
                  'info'
                );
                return;
              }
              if (isHostelDisabledForCanteen) {
                showToast(
                  'Delivery Unavailable',
                  `${selectedCanteen?.name} does not offer hostel room delivery.`,
                  'warning'
                );
                return;
              }
              setOrderType('HOSTEL_DELIVERY');
            }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              orderType === 'HOSTEL_DELIVERY'
                ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                : isDayScholar || isHostelDisabledForCanteen
                ? 'border-slate-200 opacity-60 cursor-not-allowed bg-slate-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  🛵
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Hostel Room Delivery</h4>
                  <p className="text-[10px] text-slate-500">Delivered right to your room</p>
                </div>
              </div>
              <span className="text-xs font-black text-brand-600">
                {billingSummary.deliveryCharge === 0 ? 'FREE' : `+₹${billingSummary.deliveryCharge}`}
              </span>
            </div>
          </div>
        </div>

        {/* Hostel Delivery Information Notice */}
        {orderType === 'HOSTEL_DELIVERY' && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Room delivery request will be confirmed by the canteen.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Hostel</label>
                <input
                  type="text"
                  value={hostelDetails.hostelName}
                  onChange={(e) =>
                    setHostelDetails({
                      ...hostelDetails,
                      hostelName: e.target.value,
                      block: e.target.value,
                    })
                  }
                  placeholder="e.g. J-Block Boys Hostel"
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Floor</label>
                <input
                  type="text"
                  value={hostelDetails.floor}
                  onChange={(e) => setHostelDetails({ ...hostelDetails, floor: e.target.value })}
                  placeholder="e.g. 2nd Floor"
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Room Number</label>
                <input
                  type="text"
                  value={hostelDetails.roomNumber}
                  onChange={(e) => setHostelDetails({ ...hostelDetails, roomNumber: e.target.value })}
                  placeholder="e.g. 204"
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Coupons & Promo Codes */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-brand-600" />
          <h3 className="font-black text-sm text-slate-900">Coupons & Offers</h3>
        </div>

        {appliedCoupon ? (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-black text-xs text-emerald-900">{appliedCoupon.code}</span>
                <p className="text-[11px] text-emerald-700">
                  Applied! You save ₹{billingSummary.discount}
                </p>
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. WELCOME20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => handleApplyCoupon()}
                disabled={isApplyingCoupon || !couponInput}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm disabled:opacity-50"
              >
                {isApplyingCoupon ? '...' : 'Apply'}
              </button>
            </div>

            {/* Quick promo code chips */}
            <div className="flex gap-2 text-[10px]">
              <button
                onClick={() => handleApplyCoupon('WELCOME20')}
                className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-brand-700 font-bold border border-indigo-200"
              >
                ⚡ WELCOME20 (20% off)
              </button>
              <button
                onClick={() => handleApplyCoupon('BITES50')}
                className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-brand-700 font-bold border border-indigo-200"
              >
                ⚡ BITES50 (₹50 off)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE PAYMENT METHOD SELECTOR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <h3 className="font-black text-sm text-slate-900">Select Payment Method</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            🔒 256-bit Secure
          </span>
        </div>

        {/* Primary Payment Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* 1. UPI & PAYTM */}
          <div
            onClick={() => {
              setSelectedCategory('UPI');
              setSelectedPayment('UPI_PAYTM');
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left relative ${
              selectedCategory === 'UPI'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="absolute -top-1.5 -right-1 text-[8px] font-black bg-[#00BAF2] text-white px-1.5 py-0.2 rounded-full shadow-2xs">
              Paytm / UPI
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-brand-700 flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">UPI / QR</h5>
                <p className="text-[10px] text-slate-500">Paytm, GPay, PhonePe</p>
              </div>
            </div>
          </div>

          {/* 2. CASH */}
          <div
            onClick={() => {
              setSelectedCategory('CASH');
              setSelectedPayment(
                orderType === 'HOSTEL_DELIVERY' ? 'CASH_ON_DELIVERY' : 'CASH_ON_PICKUP'
              );
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              selectedCategory === 'CASH'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">
                  {orderType === 'HOSTEL_DELIVERY' ? 'Cash on Delivery' : 'Pay at Counter'}
                </h5>
                <p className="text-[10px] text-slate-500">Cash in hand</p>
              </div>
            </div>
          </div>

          {/* 3. CAMPUS MEAL CARD */}
          <div
            onClick={() => {
              setSelectedCategory('CAMPUS_WALLET');
              setSelectedPayment('CAMPUS_WALLET');
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              selectedCategory === 'CAMPUS_WALLET'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">Campus Card</h5>
                <p className="text-[10px] text-emerald-600 font-semibold">₹500 Balance</p>
              </div>
            </div>
          </div>

          {/* 4. CARDS */}
          <div
            onClick={() => {
              setSelectedCategory('CARD');
              setSelectedPayment('CARD');
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              selectedCategory === 'CARD'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">Debit / Card</h5>
                <p className="text-[10px] text-slate-500">RuPay, Visa, Master</p>
              </div>
            </div>
          </div>

          {/* 5. NET BANKING */}
          <div
            onClick={() => {
              setSelectedCategory('NET_BANKING');
              setSelectedPayment('NET_BANKING');
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              selectedCategory === 'NET_BANKING'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">Net Banking</h5>
                <p className="text-[10px] text-slate-500">SBI, HDFC, ICICI</p>
              </div>
            </div>
          </div>

          {/* 6. WALLETS */}
          <div
            onClick={() => {
              setSelectedCategory('WALLET');
              setSelectedPayment('WALLET');
            }}
            className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
              selectedCategory === 'WALLET'
                ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-slate-900">Wallets</h5>
                <p className="text-[10px] text-slate-500">Paytm, Amazon Pay</p>
              </div>
            </div>
          </div>
        </div>

        {/* EXPANDED INTERACTIVE DETAILS FOR CHOSEN PAYMENT OPTION */}
        {/* 1. UPI Sub-Options with Paytm Highlighted */}
        {selectedCategory === 'UPI' && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 block">Select UPI App:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Paytm */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUpiApp('PAYTM');
                  setSelectedPayment('UPI_PAYTM');
                  setUpiId('student@paytm');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedUpiApp === 'PAYTM'
                    ? 'border-[#00BAF2] bg-[#00BAF2]/10 ring-2 ring-[#00BAF2]/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#002E6E] text-white text-[9px] font-black flex items-center justify-center">
                    P
                  </span>
                  <span className="text-xs font-black text-[#002E6E]">Paytm</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">⚡ Recommended</span>
              </button>

              {/* GPay */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUpiApp('GPAY');
                  setSelectedPayment('UPI_GPAY');
                  setUpiId('student@okhdfcbank');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedUpiApp === 'GPAY'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                    G
                  </span>
                  <span className="text-xs font-black text-slate-800">Google Pay</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">@okaxis / @okhdfc</span>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUpiApp('PHONEPE');
                  setSelectedPayment('UPI_PHONEPE');
                  setUpiId('student@ybl');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedUpiApp === 'PHONEPE'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-black flex items-center justify-center">
                    Pe
                  </span>
                  <span className="text-xs font-black text-slate-800">PhonePe</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">@ybl / @ibl</span>
              </button>

              {/* Dynamic QR */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUpiApp('QR');
                  setSelectedPayment('UPI');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedUpiApp === 'QR'
                    ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-black text-slate-800">Dynamic QR</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Scan to Pay</span>
              </button>
            </div>

            {/* Input field for selected UPI option */}
            {selectedUpiApp === 'PAYTM' ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#002E6E] flex items-center gap-1.5">
                    <span>Paytm Mobile / VPA</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ⚡ Instant Checkout
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 9876543210@paytm"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
                  />
                  <span className="px-3 py-2 rounded-xl bg-[#002E6E] text-white text-xs font-bold flex items-center gap-1">
                    Paytm UPI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Payment authorization will be verified with your registered Paytm app.
                </p>
              </div>
            ) : selectedUpiApp === 'QR' ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-brand-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Dynamic UPI QR Code</span>
                    <span className="text-[11px] text-slate-500">
                      Scan with Paytm, GPay, PhonePe, or CRED at checkout
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg border border-brand-200">
                  Ready
                </span>
              </div>
            ) : (
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Enter {selectedUpiApp === 'GPAY' ? 'Google Pay' : 'PhonePe'} UPI ID (VPA):
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={selectedUpiApp === 'GPAY' ? 'student@okhdfcbank' : 'student@ybl'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>
        )}

        {/* 2. Cash Details */}
        {selectedCategory === 'CASH' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>
                {orderType === 'HOSTEL_DELIVERY' ? 'Cash on Delivery (COD)' : 'Pay Cash at Counter'}
              </span>
            </div>
            <p className="leading-relaxed text-amber-900">
              {orderType === 'HOSTEL_DELIVERY'
                ? `Pay ₹${billingSummary.total} in cash directly to your delivery partner when food arrives at your hostel room.`
                : `Pay ₹${billingSummary.total} in cash directly at the ${selectedCanteen?.name || 'canteen'} express collection counter.`}
            </p>
            <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-amber-800">
              💡 <strong>Tip:</strong> Please keep exact change ready to speed up order handover!
            </div>
          </div>
        )}

        {/* 3. Campus Card Details */}
        {selectedCategory === 'CAMPUS_WALLET' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 to-indigo-900 text-white space-y-2.5 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono flex items-center gap-1.5 text-indigo-200">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>SVIET STUDENT MEAL CARD</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Balance
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-[10px] text-indigo-300 block">Cardholder</span>
                <span className="font-bold text-sm">{user?.name || 'STUDENT'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-indigo-300 block">Available Balance</span>
                <span className="font-black text-lg text-amber-300">₹500.00</span>
              </div>
            </div>
            <p className="text-[10px] text-indigo-200 pt-1 border-t border-white/10">
              ✨ Instant 1-tap deduction on campus network without OTP or PIN.
            </p>
          </div>
        )}

        {/* 4. Cards Details */}
        {selectedCategory === 'CARD' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Enter Card Details</span>
              <span className="text-[10px] font-bold text-slate-500">RuPay • Visa • MasterCard</span>
            </div>
            <div>
              <input
                type="text"
                placeholder="Card Number (4532 •••• •••• 7821)"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
              />
              <input
                type="password"
                maxLength={3}
                placeholder="CVV (•••)"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        )}

        {/* 5. Net Banking Details */}
        {selectedCategory === 'NET_BANKING' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Select Your Bank:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                'State Bank of India (SBI)',
                'HDFC Bank',
                'ICICI Bank',
                'Punjab National Bank (PNB)',
                'Axis Bank',
                'Canara Bank',
              ].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBank(b)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    selectedBank === b
                      ? 'border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. Wallets Details */}
        {selectedCategory === 'WALLET' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Select Digital Wallet:</span>
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
                      ? 'border-brand-600 bg-brand-50/70 text-brand-800 ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{w.name}</span>
                    {w.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#00BAF2] text-white">
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
      </div>

      {/* Transparent Billing Breakdown */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
        <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-2">
          Bill Details
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Food Subtotal</span>
            <span className="font-semibold text-slate-900">₹{billingSummary.subtotal}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1">
              <span>Platform Fee</span>
              <span className="text-[10px] text-slate-400">(Maintenance)</span>
            </span>
            <span className="font-semibold text-slate-900">₹{billingSummary.platformFee}</span>
          </div>

          {orderType === 'HOSTEL_DELIVERY' && (
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <span>Hostel Room Delivery</span>
                {billingSummary.deliveryCharge === 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold">(Free tier)</span>
                )}
              </span>
              <span className="font-semibold text-slate-900">
                {billingSummary.deliveryCharge === 0 ? 'FREE' : `₹${billingSummary.deliveryCharge}`}
              </span>
            </div>
          )}

          {billingSummary.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount ({appliedCoupon?.code})</span>
              <span>-₹{billingSummary.discount}</span>
            </div>
          )}

          {billingSummary.tax > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Taxes / GST</span>
              <span className="font-semibold text-slate-900">₹{billingSummary.tax}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
            <span>To Pay</span>
            <span className="text-lg text-brand-600">₹{billingSummary.total}</span>
          </div>
        </div>

        {/* Place Order CTA Button */}
        <button
          onClick={handleInitiatePayment}
          disabled={isPlacingOrder}
          className="w-full mt-2 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5 text-white font-black text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Order...</span>
            </span>
          ) : (
            <>
              <span>
                {selectedCategory === 'CASH'
                  ? `Confirm Order (${orderType === 'HOSTEL_DELIVERY' ? 'COD' : 'Pay at Counter'}) • ₹${billingSummary.total}`
                  : selectedCategory === 'UPI' && selectedUpiApp === 'PAYTM'
                  ? `Pay ₹${billingSummary.total} via Paytm`
                  : `Proceed to Pay • ₹${billingSummary.total}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-400 text-center">
          🔒 Secure 256-bit encrypted checkout • Zero hidden costs
        </p>
      </div>

      {/* Interactive Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        totalAmount={billingSummary.total}
        foodSubtotal={billingSummary.subtotal}
        platformFee={billingSummary.platformFee}
        deliveryCharge={billingSummary.deliveryCharge}
        discount={billingSummary.discount}
        tax={billingSummary.tax}
        canteenName={selectedCanteen?.name || 'Campus Canteen'}
        orderType={orderType}
        defaultMethod={selectedPayment}
        defaultUpiApp={selectedUpiApp}
        onPaymentSuccess={handlePaymentSuccessFromGateway}
      />
    </div>
  );
};
