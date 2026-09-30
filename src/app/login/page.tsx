'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  ChefHat,
  Bike,
  ShieldCheck,
  Building,
  KeyRound,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Footer } from '@/components/common/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    {
      id: 'user-student-hosteller',
      name: 'Aarav Sharma',
      role: 'Student (Hosteller)',
      desc: 'Room 204, J-Block Boys Hostel. Delivery & Pickup.',
      icon: GraduationCap,
      color: 'bg-indigo-600 text-white',
    },
    {
      id: 'user-student-dayscholar',
      name: 'Priya Patel',
      role: 'Student (Day Scholar)',
      desc: 'Roll: 22BEC042. Counter pickup ordering.',
      icon: Building,
      color: 'bg-blue-600 text-white',
    },
    {
      id: 'user-canteen-staff',
      name: 'Ramesh Kumar',
      role: 'Canteen Kitchen Staff',
      desc: 'Main Canteen Manager. Accept/reject & queue.',
      icon: ChefHat,
      color: 'bg-amber-600 text-white',
    },
    {
      id: 'user-delivery-staff',
      name: 'Suresh Yadav',
      role: 'Delivery Agent',
      desc: 'Campus Delivery Staff. Room order delivery.',
      icon: Bike,
      color: 'bg-emerald-600 text-white',
    },
    {
      id: 'user-admin',
      name: 'Yash Vardhan',
      role: 'Platform Administrator',
      desc: 'Financial analytics, WAF, fees & system rules.',
      icon: ShieldCheck,
      color: 'bg-purple-600 text-white',
    },
  ];

  const handleQuickLogin = async (userId: string) => {
    setIsSubmitting(true);
    await switchRole(userId);
    setIsSubmitting(false);
    showToast('Logged In Successfully', 'Welcome back to CanteenBites!', 'success');
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      showToast('Missing details', 'Please enter your email or phone number', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        await switchRole(data.user.id);
        showToast('Login Successful', `Welcome, ${data.user.name}!`, 'success');
        router.push('/');
      } else {
        showToast('Account Not Found', data.error || 'Please register or try demo accounts.', 'error');
      }
    } catch (err: any) {
      showToast('Error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-left">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="md" showTagline />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            Sign In to CanteenBites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your student cart, track live orders, or log in to staff & admin dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Credentials Form */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 animate-fade-in">
            <h2 className="font-extrabold text-base text-slate-900">Sign in with Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Campus Email or Mobile</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. aarav@sviet.ac.in or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => showToast('Forgot Password', 'In demo mode, use 1-click accounts or OTP verification.', 'info')}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Register as Student
              </Link>
            </div>
          </div>

          {/* Quick 1-Click Role Switcher */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 animate-fade-in">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Instant Demo Login</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch instantly between pre-configured campus roles to experience full-stack features.
              </p>
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleQuickLogin(acc.id)}
                    disabled={isSubmitting}
                    className="w-full p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/90 hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-2xs transition-all duration-200 text-left flex items-center justify-between gap-3 group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${acc.color} flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500">({acc.role})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{acc.desc}</p>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
