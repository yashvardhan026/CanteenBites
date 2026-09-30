'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { INITIAL_COUPONS } from '@/lib/constants';
import { Tag, Sparkles, Copy, Check, ArrowRight, Gift, Percent } from 'lucide-react';
import { Footer } from '@/components/common/Footer';

export default function OffersPage() {
  const { showToast } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Code Copied! 🎉', `Coupon ${code} copied to clipboard`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
        {/* Header */}
        <div className="space-y-4 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <Tag className="w-3.5 h-3.5 text-indigo-600" />
            <span>Student Savings</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Exclusive Deals & Offers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Save on your daily meals, snacks, and exam fuel with exclusive promo codes for students at Swami Vivekanand Institute of Engineering & Technology (SVIET).
          </p>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {INITIAL_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 space-y-4 relative overflow-hidden text-left flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-brand-700 font-black text-sm tracking-wider">
                    <span>{coupon.code}</span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900">
                  {coupon.discountType === 'PERCENTAGE'
                    ? `${coupon.discountValue}% OFF on Orders`
                    : `Flat ₹${coupon.discountValue} Instant Discount`}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {coupon.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    Min Order: ₹{coupon.minOrderAmount}
                  </span>
                  {coupon.maxDiscountAmount && (
                    <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                      Max Discount: ₹{coupon.maxDiscountAmount}
                    </span>
                  )}
                  <span className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-semibold">
                    Expires: Dec 31, 2026
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white animate-badge-bounce" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <Link
                  href="/"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group/link"
                >
                  <span>Apply in Cart</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Delivery Savings Tier Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black">Free Hostel Delivery Tiers</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Hostel delivery charges scale down as your order value grows! Orders above ₹300 receive 100% Free Room Delivery.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center hover:bg-white/15 transition-colors">
              <div className="text-xs text-slate-400 font-medium">₹0 – ₹99</div>
              <div className="text-base font-black text-amber-300 mt-0.5">₹20 delivery</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center hover:bg-white/15 transition-colors">
              <div className="text-xs text-slate-400 font-medium">₹100 – ₹199</div>
              <div className="text-base font-black text-amber-300 mt-0.5">₹15 delivery</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center hover:bg-white/15 transition-colors">
              <div className="text-xs text-slate-400 font-medium">₹200 – ₹299</div>
              <div className="text-base font-black text-amber-300 mt-0.5">₹10 delivery</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-center hover:bg-emerald-500/30 transition-colors">
              <div className="text-xs text-emerald-300 font-medium">₹300+</div>
              <div className="text-base font-black text-emerald-300 mt-0.5">FREE Delivery 🎉</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
