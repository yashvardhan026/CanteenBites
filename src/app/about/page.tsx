import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Users, Clock, Award, Coffee } from 'lucide-react';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'About CanteenBites — Smart College Food Ecosystem',
  description: 'Learn about CanteenBites, the mission to eliminate physical canteen queues and empower college campus dining.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Empowering Campus Dining</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Redefining How College Campuses Eat.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            CanteenBites was founded with a single mission: to eliminate the chaotic, time-wasting physical queues at college canteens so students can spend more time learning, collaborating, and relaxing.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-200">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Zero Wait Queues</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time kitchen order sequencing lets students monitor live cooking progress and arrive at the counter right when food is ready.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-200">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Hostel Ecosystem</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Seamless delivery coordination connecting student rooms across blocks and floors with verified student delivery staff.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900">Kitchen Operational Flow</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides canteen owners with digital queue management, live capacity control, dynamic preparation times, and instant revenue tracking.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Story</h2>
          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              Every college student knows the pain of the 15-minute recess rush: sprinting across campus to the canteen, fighting through a crowded counter, shouting order numbers, and often ending up late for the next lecture with cold snacks or no food at all.
            </p>
            <p>
              CanteenBites transformed this chaos into a seamless digital workflow. Now, students browse live canteens, customize special cooking instructions (like &quot;less spicy&quot; or &quot;extra chutney&quot;), track live cooking progress from their classrooms or library benches, and walk up for a zero-wait pickup.
            </p>
            <p>
              For hostellers burning the midnight oil before semester examinations, CanteenBites bridges the distance by enabling canteen-confirmed room delivery right to their hostel block and door.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore CanteenBites App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-all"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
