'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Star,
  Users,
  Bike,
  ArrowRight,
  Sparkles,
  MapPin,
  ChefHat,
  Search,
} from 'lucide-react';
import { Footer } from '@/components/common/Footer';

export default function CanteensPage() {
  const { canteens, setSelectedCanteen, setActiveNavTab } = useApp();

  const handleSelectCanteen = (canteen: any) => {
    setSelectedCanteen(canteen);
    setActiveNavTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
        {/* Header */}
        <div className="space-y-4 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Dining Hubs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Explore College Canteens
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            All registered canteens across Swami Vivekanand Institute of Engineering & Technology (SVIET) campus. Monitor live queue loads, operating hours, and order your favorite foods.
          </p>
        </div>

        {/* Canteens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {canteens.map((canteen) => (
            <div
              key={canteen.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={canteen.image}
                    alt={canteen.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
                        canteen.status === 'OPEN'
                          ? 'bg-emerald-500 text-white'
                          : canteen.status === 'BUSY'
                          ? 'bg-amber-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {canteen.status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      {canteen.status === 'BUSY' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      <span>{canteen.status === 'OPEN' ? 'Open Now' : canteen.status === 'BUSY' ? 'Busy Rush' : 'Closed'}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-300" />
                    <span>{canteen.openTime} – {canteen.closeTime}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 group-hover:text-brand-600 transition-colors">
                        {canteen.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">{canteen.tagline}</p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{canteen.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({canteen.totalReviews})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 text-xs text-slate-600">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Prep Time</div>
                      <div className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1 text-sm">
                        <Clock className="w-3.5 h-3.5 text-brand-500" />
                        <span>~{canteen.avgPrepTimeMinutes} mins</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <div className="text-[10px] text-indigo-500 font-semibold uppercase">Active Queue</div>
                      <div className="font-extrabold text-indigo-800 mt-0.5 flex items-center gap-1 text-sm">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{canteen.currentQueueCount} orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Bike className={`w-4 h-4 ${canteen.hostelDeliveryEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={canteen.hostelDeliveryEnabled ? 'text-emerald-700' : 'text-slate-400'}>
                        {canteen.hostelDeliveryEnabled ? 'Hostel Delivery Available' : 'Counter Pickup Only'}
                      </span>
                    </div>
                    {canteen.hostelDeliveryEnabled && (
                      <span className="text-[10px] text-slate-400">{canteen.deliveryTimings}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/"
                  onClick={() => handleSelectCanteen(canteen)}
                  className="w-full py-3 rounded-2xl bg-brand-600 text-white hover:bg-brand-700 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 group-hover:bg-brand-700 active:scale-[0.98]"
                >
                  <span>View Canteen Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
