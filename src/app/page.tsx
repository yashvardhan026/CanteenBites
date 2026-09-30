'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StudentView } from '@/components/student/StudentView';
import { CanteenDashboard } from '@/components/canteen/CanteenDashboard';
import { DeliveryDashboard } from '@/components/delivery/DeliveryDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PublicLanding } from '@/components/public/PublicLanding';
import { Footer } from '@/components/common/Footer';
import {
  GraduationCap,
  ChefHat,
  Bike,
  ShieldCheck,
  Globe,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { user, switchRole } = useApp();
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('landing');

  return (
    <div>
      {/* Top Quick Bar: Mode Selector & 1-Click Role Switcher */}
      <div className="bg-slate-900/95 text-white py-2 px-4 text-xs font-semibold backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Active Mode indicator + Public/App Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 hidden sm:inline">Active Mode:</span>
              <span className="font-extrabold text-amber-400">
                {viewMode === 'landing'
                  ? '🌐 Public Website & Info'
                  : user?.role === 'STUDENT'
                  ? `Student (${user.studentType === 'HOSTELLER' ? 'Hostel Room 204' : 'Day Scholar'})`
                  : user?.role === 'CANTEEN_STAFF'
                  ? 'Canteen Kitchen Dashboard'
                  : user?.role === 'DELIVERY_STAFF'
                  ? 'Hostel Delivery Agent'
                  : 'Platform Administrator'}
              </span>
            </div>

            {/* View Mode Toggle Pill */}
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => setViewMode('app')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'app'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-300" />
                <span>Campus App</span>
              </button>
              <button
                onClick={() => setViewMode('landing')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'landing'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Public Site</span>
              </button>
            </div>
          </div>

          {/* Quick 1-Click Role Switch buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">Quick Switch:</span>
            <button
              onClick={() => {
                setViewMode('app');
                switchRole('user-student-hosteller');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                user?.id === 'user-student-hosteller' && viewMode === 'app'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Hosteller</span>
            </button>
            <button
              onClick={() => {
                setViewMode('app');
                switchRole('user-student-dayscholar');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                user?.id === 'user-student-dayscholar' && viewMode === 'app'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Day Scholar</span>
            </button>
            <button
              onClick={() => {
                setViewMode('app');
                switchRole('user-canteen-staff');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                user?.role === 'CANTEEN_STAFF' && viewMode === 'app'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <ChefHat className="w-3 h-3" />
              <span>Canteen</span>
            </button>
            <button
              onClick={() => {
                setViewMode('app');
                switchRole('user-delivery-staff');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                user?.role === 'DELIVERY_STAFF' && viewMode === 'app'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Bike className="w-3 h-3" />
              <span>Delivery</span>
            </button>
            <button
              onClick={() => {
                setViewMode('app');
                switchRole('user-admin');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                user?.role === 'ADMIN' && viewMode === 'app'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'landing' ? (
        <div className="pt-8">
          <PublicLanding onEnterApp={() => setViewMode('app')} />
          <Footer />
        </div>
      ) : (
        <>
          {user?.role === 'STUDENT' && <StudentView />}
          {user?.role === 'CANTEEN_STAFF' && <CanteenDashboard />}
          {user?.role === 'DELIVERY_STAFF' && <DeliveryDashboard />}
          {user?.role === 'ADMIN' && <AdminDashboard />}
        </>
      )}
    </div>
  );
}
