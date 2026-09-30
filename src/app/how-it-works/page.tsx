import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Bike,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Utensils,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'How It Works — CanteenBites College Food Platform',
  description: 'Understand the simple 4-step process of ordering from college canteens and tracking your food in real-time.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Browse Canteen & Menu',
      description:
        'Select from Main Canteen, Hostel Canteen, or Campus Food Court. Explore categories like Burgers, Dosa, Meals, Chinese, Beverages, and Desserts with real-time availability and live pricing.',
      color: 'from-blue-600 to-indigo-600',
      icon: Utensils,
      points: [
        'Real-time item availability indicators',
        'Veg / Non-veg badges and calorie counts',
        'Clear preparation times shown for every item',
      ],
    },
    {
      step: '02',
      title: 'Add to Cart & Customize',
      description:
        'Select quantities and add custom cooking instructions like "less spicy", "no onions", or "extra chutney". Select Canteen Pickup or Hostel Room Delivery.',
      color: 'from-brand-600 to-violet-600',
      icon: Smartphone,
      points: [
        'Add custom preparation instructions per food item',
        'Transparent billing breakdown: Food + Platform fee + Delivery charge',
        'Redeem student promo codes for instant discounts',
      ],
    },
    {
      step: '03',
      title: 'Real-Time Kitchen Queue & Prep Tracking',
      description:
        'Once the canteen staff accepts your order with custom prep time, watch your live queue position update automatically (#7 → #5 → #2 → READY) without manual refreshing.',
      color: 'from-amber-500 to-orange-600',
      icon: Clock,
      points: [
        'Exact live queue position display (#3: 2 orders ahead)',
        'Smart ETA calculated based on kitchen backlog and capacity',
        'Instant notifications if canteen adjusts preparation time',
      ],
    },
    {
      step: '04',
      title: 'Pickup Hot or Enjoy Hostel Delivery',
      description:
        'Collect your meal effortlessly at the designated pickup counter, or receive it right at your hostel room door from our campus delivery agents.',
      color: 'from-emerald-500 to-teal-600',
      icon: Bike,
      points: [
        'Instant OTP/Roll Number collection verification',
        'Hostel room delivery tracking with delivery agent assignment',
        'Post-order rating and feedback for food, canteen, and delivery',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4 max-w-3xl text-center sm:text-left mx-auto sm:mx-0 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Order. Track. Enjoy.</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How CanteenBites Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From craving to collection in 4 transparent, crowd-free steps. Designed specifically to work smoothly around tight college class schedules.
          </p>
        </div>

        {/* 4 Steps Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 space-y-4 text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                    Step {st.step}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${st.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.description}</p>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {st.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hostel Delivery & Pickup FAQs */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                Is Hostel Room Delivery guaranteed?
              </h4>
              <p className="leading-relaxed">
                Hostel room delivery requires canteen confirmation. When kitchen staff accept your order, they also accept or reject the delivery request based on delivery agent availability and weather conditions. If delivery is rejected, you can pick up at counter or cancel.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                What if the canteen rejects my order?
              </h4>
              <p className="leading-relaxed">
                If kitchen capacity is full during peak lecture breaks, canteen staff may decline the order. If you paid online, an instant refund is triggered automatically according to our campus policy.
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                How does the live queue algorithm work?
              </h4>
              <p className="leading-relaxed">
                Your queue position is dynamically calculated based on pending accepted orders ahead of you at the same canteen. As previous orders are marked ready, your queue index automatically moves up (#3 → #2 → #1 → Ready).
              </p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">
                Can I ask Bites AI for help?
              </h4>
              <p className="leading-relaxed">
                Yes! Bites AI 🤖 can check your active order status, tell you how many people are ahead in queue, recommend fast meals under ₹100, and add items directly to your cart.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
