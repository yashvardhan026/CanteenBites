'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  UserCheck,
  UserPlus,
  ShieldCheck,
  ChefHat,
  Bike,
  GraduationCap,
  Building,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { StudentType } from '@/types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, switchRole, showToast, setUser } = useApp();
  const [activeTab, setActiveTab] = useState<'switch' | 'register'>('switch');

  // Register Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    studentType: 'HOSTELLER' as StudentType,
    hostelName: 'J-Block Boys Hostel',
    block: 'Block A',
    floor: '1st Floor',
    roomNumber: '',
  });

  const [otpStep, setOtpStep] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState('');
  const [otpInput, setOtpInput] = useState('123456');
  const [demoOtpCode, setDemoOtpCode] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      id: 'user-student-hosteller',
      role: 'STUDENT',
      name: 'Aarav Sharma',
      badge: 'Student (Hosteller)',
      desc: 'Room 204, J-Block Boys Hostel. Can request room delivery.',
      icon: GraduationCap,
      color: 'bg-indigo-500 text-white',
    },
    {
      id: 'user-student-dayscholar',
      role: 'STUDENT',
      name: 'Priya Patel',
      badge: 'Student (Day Scholar)',
      desc: 'Roll: 22BEC042. Canteen pickup orders.',
      icon: Building,
      color: 'bg-blue-500 text-white',
    },
    {
      id: 'user-canteen-staff',
      role: 'CANTEEN_STAFF',
      name: 'Ramesh Kumar',
      badge: 'Canteen Staff',
      desc: 'Main Canteen Manager. Accept/Reject, Prep time, Queue adjustments.',
      icon: ChefHat,
      color: 'bg-amber-500 text-white',
    },
    {
      id: 'user-delivery-staff',
      role: 'DELIVERY_STAFF',
      name: 'Suresh Yadav',
      badge: 'Delivery Staff',
      desc: 'Campus Delivery Agent. Pickup, Out for delivery, Delivered.',
      icon: Bike,
      color: 'bg-emerald-500 text-white',
    },
    {
      id: 'user-admin',
      role: 'ADMIN',
      name: 'Yash Vardhan',
      badge: 'Campus Admin',
      desc: 'Revenue, Platform fees, Delivery tiers, Analytics & Settings.',
      icon: ShieldCheck,
      color: 'bg-purple-600 text-white',
    },
  ];

  const handleQuickSwitch = async (userId: string) => {
    await switchRole(userId);
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredUserId(data.userId);
        setDemoOtpCode(data.demoOtp || '123456');
        setOtpStep(true);
        showToast('OTP Sent', `Verification code sent to ${formData.phone}`, 'info');
      } else {
        showToast('Registration Error', data.error || 'Failed to register', 'error');
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: registeredUserId, otp: otpInput }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast('Account Activated', `Welcome to CanteenBites, ${data.user.name}!`, 'success');
        onClose();
      } else {
        showToast('Verification Failed', data.error || 'Invalid OTP', 'error');
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === 'switch' ? 'Select User Role' : 'Student Registration'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTab === 'switch'
                ? 'Test different roles across the CanteenBites workflow'
                : 'Create a new student account with OTP verification'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 flex gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => {
              setActiveTab('switch');
              setOtpStep(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'switch'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch Role (Demo)</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student Sign Up</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {activeTab === 'switch' ? (
            <div className="space-y-3">
              {demoAccounts.map((acc) => {
                const isCurrent = user?.id === acc.id;
                const Icon = acc.icon;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleQuickSwitch(acc.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${acc.color} shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{acc.name}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {acc.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{acc.desc}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    ) : (
                      <button className="text-xs font-semibold text-brand-600 px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors">
                        Select
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !otpStep ? (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Varma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID / Roll No</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BCE091"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Type</label>
                  <select
                    value={formData.studentType}
                    onChange={(e) =>
                      setFormData({ ...formData, studentType: e.target.value as StudentType })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="HOSTELLER">Hosteller (Campus Resident)</option>
                    <option value="DAY_SCHOLAR">Day Scholar (Commuter)</option>
                  </select>
                </div>
              </div>

              {/* Conditional Hostel Fields */}
              {formData.studentType === 'HOSTELLER' ? (
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hostel Room Details (Required for Room Delivery)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hostel</label>
                    <select
                      value={formData.hostelName}
                      onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="J-Block Boys Hostel">J-Block Boys Hostel</option>
                      <option value="D-Block Boys Hostel">D-Block Boys Hostel</option>
                      <option value="Girls Hostel I-Block">Girls Hostel I-Block</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Floor</label>
                      <input
                        type="text"
                        placeholder="2nd Floor"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Room No</label>
                      <input
                        type="text"
                        placeholder="204"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  ℹ️ Day scholars collect food directly from canteen pickup counters. Hostel information is not required.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Continue to OTP Verification'}
              </button>
            </form>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Enter Verification OTP</h4>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit verification code to <strong>{formData.phone}</strong>.
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  Demo OTP: <strong>{demoOtpCode}</strong>
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center text-2xl font-black tracking-widest py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex gap-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-1/3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Activate'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
