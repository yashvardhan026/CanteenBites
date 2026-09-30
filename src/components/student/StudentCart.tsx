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
} from 'lucide-react';

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
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI');
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

  const handleCheckout = async () => {
    setIsPlacingOrder(true);
    const result = await placeOrder(selectedPayment);
    setIsPlacingOrder(false);
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
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingInstructionsId(ci.menuItem.id);
                      setInstructionText(ci.specialInstructions || '');
                    }}
                    className="text-[10px] font-medium text-brand-600 hover:underline block mt-0.5"
                  >
                    {ci.specialInstructions ? 'Edit instruction' : '+ Add cooking note'}
                  </button>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity - 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-black text-xs text-slate-900">
                {ci.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(ci.menuItem.id, ci.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Type Selection: Pickup vs Hostel Delivery */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">Choose Order Type</h3>
          <span className="text-[11px] font-semibold text-slate-500">
            {orderType === 'CANTEEN_PICKUP' ? 'Counter Pickup' : 'Hostel Delivery'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Pickup */}
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
                  🚶
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Canteen Pickup</h4>
                  <p className="text-[10px] text-slate-500">Collect directly from counter</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600">FREE</span>
            </div>
          </div>

          {/* Option 2: Hostel Delivery */}
          <div
            onClick={() => {
              if (isDayScholar) {
                showToast(
                  'Hostel Delivery Restricted',
                  'Hostel room delivery is only available for campus hostellers.',
                  'warning'
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

        {/* Hostel Delivery Information & Confirmation Notice */}
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

            {/* Quick chips */}
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

      {/* Payment Method Selector */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
        <h3 className="font-black text-sm text-slate-900">Select Payment Method</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'UPI', label: 'UPI / QR', icon: QrCode, desc: 'GPay, PhonePe, Paytm' },
            { id: 'CARD', label: 'Debit / Card', icon: CreditCard, desc: 'Visa, Master, RuPay' },
            { id: 'WALLET', label: 'Wallet', icon: Wallet, desc: 'Paytm, Amazon Pay' },
            { id: 'CASH_ON_PICKUP', label: 'Cash on Pickup', icon: Coins, desc: 'Pay at counter' },
          ].map((m) => {
            const Icon = m.icon;
            const isSelected = selectedPayment === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedPayment(m.id as PaymentMethod)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                <h5 className="font-bold text-xs text-slate-900 mt-2">{m.label}</h5>
                <p className="text-[10px] text-slate-500">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Billing Breakdown (Section 12 & 51) */}
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
          onClick={handleCheckout}
          disabled={isPlacingOrder}
          className="w-full mt-2 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Order...</span>
            </span>
          ) : (
            <>
              <span>Place Order • ₹{billingSummary.total}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-400 text-center">
          🔒 Secure 256-bit encrypted simulated checkout • No card data stored
        </p>
      </div>
    </div>
  );
};
