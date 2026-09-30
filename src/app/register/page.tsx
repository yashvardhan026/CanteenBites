'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  Building,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Footer } from '@/components/common/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const { switchRole, showToast } = useApp();

  const [studentType, setStudentType] = useState<'HOSTELLER' | 'DAY_SCHOLAR'>('HOSTELLER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: 'Swami Vivekanand Institute of Engineering & Technology',
    studentId: '',
    hostelName: 'J-Block Boys Hostel',
    block: 'Block A',
    floor: '2nd Floor',
    roomNumber: '',
  });

  const [otpStep, setOtpStep] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState('');
  const [otpInput, setOtpInput] = useState('123456');
  const [demoOtp, setDemoOtp] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.studentId) {
      showToast('Missing Fields', 'Please complete all required student details.', 'warning');
      return;
    }

    if (studentType === 'HOSTELLER' && !formData.roomNumber) {
      showToast('Missing Room Number', 'Please enter your hostel room number for delivery.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          studentId: formData.studentId,
          studentType,
          hostelName: formData.hostelName,
          block: formData.block,
          floor: formData.floor,
          roomNumber: formData.roomNumber,
        }),
      });

      const data = await res.json();
      if (data.success && data.userId) {
        setRegisteredUserId(data.userId);
        setDemoOtp(data.demoOtp || '123456');
        setOtpStep(true);
        showToast('OTP Sent', `Verification code sent to ${formData.phone}`, 'info');
      } else {
        showToast('Registration Error', data.error || 'Failed to register account', 'error');
      }
    } catch (err: any) {
      showToast('Network Error', err.message, 'error');
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
        body: JSON.stringify({
          userId: registeredUserId,
          otp: otpInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        showToast('Account Verified 🎉', 'Welcome to CanteenBites!', 'success');
        await switchRole(data.user.id);
        router.push('/');
      } else {
        showToast('Invalid OTP', data.error || 'Please enter code 123456.', 'error');
      }
    } catch (err: any) {
      showToast('Verification Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="md" showTagline />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Skip the physical queue, order food online, and track kitchen queues live.
          </p>
        </div>

        <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-sm">
          {!otpStep ? (
            <form onSubmit={handleSubmitRegistration} className="space-y-5">
              {/* Student Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Student Residency Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStudentType('HOSTELLER')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      studentType === 'HOSTELLER'
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Hosteller</div>
                      <div className="text-[11px] text-slate-500">Hostel room delivery</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentType('DAY_SCHOLAR')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      studentType === 'DAY_SCHOLAR'
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Day Scholar</div>
                      <div className="text-[11px] text-slate-500">Canteen pickup only</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Student Roll / ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22BCSE104"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Campus Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav@sviet.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mobile Number (for OTP) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">College / Institution</label>
                  <input
                    type="text"
                    disabled
                    value={formData.college}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Hosteller Conditional Fields */}
              {studentType === 'HOSTELLER' && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-brand-700">
                    <Building className="w-3.5 h-3.5" />
                    <span>Hostel Room Delivery Information</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Hostel Name</label>
                    <select
                      value={formData.hostelName}
                      onChange={(e) => setFormData({ ...formData, hostelName: e.target.value, block: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none"
                    >
                      <option value="J-Block Boys Hostel">J-Block Boys Hostel</option>
                      <option value="D-Block Boys Hostel">D-Block Boys Hostel</option>
                      <option value="Girls Hostel I-Block">Girls Hostel I-Block</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Floor</label>
                      <select
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none"
                      >
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="1st Floor">1st Floor</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Room Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 204 or B-12"
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing registration...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to OTP Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-6 h-6 animate-badge-bounce" />
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Verify Mobile Number</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a 6-digit verification code to <strong>{formData.phone}</strong>.
                </p>
                <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                  Demo Code: <strong>{demoOtp}</strong>
                </div>
              </div>

              <div className="max-w-xs mx-auto space-y-1">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-black py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:shadow-glow-sm outline-none transition-all duration-200"
                  placeholder="123456"
                />
                <span className="text-[10px] text-slate-400 block">Enter code above</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify & Finish Registration</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-600 hover:text-brand-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
