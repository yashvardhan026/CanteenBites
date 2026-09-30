'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  GraduationCap,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Award,
  LogOut,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, orders, switchRole, showToast } = useApp();

  const totalSpent = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const [displayOrdersCount, setDisplayOrdersCount] = useState(0);
  const [displayTotalSpent, setDisplayTotalSpent] = useState(0);

  useEffect(() => {
    const targetOrders = orders.length;
    const targetSpent = totalSpent;

    const steps = 12;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setDisplayOrdersCount(Math.round(targetOrders * progress));
      setDisplayTotalSpent(Math.round(targetSpent * progress));
      if (step >= steps) {
        clearInterval(interval);
        setDisplayOrdersCount(targetOrders);
        setDisplayTotalSpent(targetSpent);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [orders.length, totalSpent]);

  return (
    <div className="space-y-5 pb-24 text-left max-w-lg mx-auto animate-fade-in">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card flex items-center gap-4 animate-slide-up hover:shadow-card-hover transition-all">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 leading-tight">{user?.name}</h3>
          <span className="text-xs font-bold text-brand-600 block mt-0.5">
            {user?.studentType === 'HOSTELLER' ? 'Campus Hosteller' : 'Day Scholar'}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">
            Roll: {user?.studentId || '22BCSE104'}
          </span>
        </div>
      </div>

      {/* College & Hostel Details Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Academic & Residence Information
        </h4>

        <div className="group flex items-center gap-3 text-xs text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-medium">{user?.collegeName}</span>
        </div>

        <div className="group flex items-center gap-3 text-xs text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0 group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-medium">{user?.email}</span>
        </div>

        <div className="group flex items-center gap-3 text-xs text-slate-700 p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="font-medium">{user?.phone}</span>
        </div>

        {user?.studentType === 'HOSTELLER' && user.hostelDetails && (
          <div className="mt-3 pt-3 border-t border-slate-100 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 transition-all hover:bg-indigo-50">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Building className="w-4 h-4 text-brand-600" />
              <span>Room Delivery Address</span>
            </div>
            <p className="text-xs text-indigo-700 mt-1">
              {user.hostelDetails.hostelName}, {user.hostelDetails.block}, {user.hostelDetails.floor},{' '}
              <strong className="text-indigo-950 font-black">Room {user.hostelDetails.roomNumber}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card text-left card-interactive hover:shadow-card-hover transition-all">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center mb-2">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Orders Placed</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">{displayOrdersCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card text-left card-interactive hover:shadow-card-hover transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Total Spent</span>
          <span className="text-xl font-black text-slate-900 mt-0.5 block">₹{displayTotalSpent}</span>
        </div>
      </div>

      {/* Switch to Another Demo Account CTA */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2 shadow-md">
        <h5 className="font-bold text-xs text-indigo-200">Testing Multiple Roles?</h5>
        <p className="text-xs text-slate-300 leading-relaxed">
          Switch to Canteen Staff, Delivery Staff, or Campus Admin to view live dashboard actions.
        </p>
        <button
          onClick={() => switchRole('user-canteen-staff')}
          className="mt-2 w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
        >
          <span>Switch to Canteen Staff Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
