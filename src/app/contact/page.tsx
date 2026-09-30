'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Footer } from '@/components/common/Footer';

export default function ContactPage() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setIsSubmitting(false);
    setSubmitted(true);
    showToast('Message Received', 'Our campus support team will respond shortly!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
        {/* Header */}
        <div className="space-y-4 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
            <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
            <span>Campus Dining Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Contact & Support
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about an active order, hostel room delivery, canteen partnerships, or platform feedback? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900">Campus Office</h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <span>Central Food Court Admin Desk, Ground Floor, Swami Vivekanand Institute of Engineering & Technology (SVIET) Campus</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>+91 98765 43210 / Ext 402</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>support@canteenbites.sviet.ac.in</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>Daily: 7:30 AM – 10:30 PM</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs">
              <h4 className="font-bold text-indigo-900">Quick Resolution</h4>
              <p className="text-indigo-700 leading-relaxed">
                For live order delays or quick refund queries, you can also ask <strong>Bites AI 🤖</strong> directly in the floating chat button at any time.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              {submitted ? (
                <div className="py-12 text-center space-y-3 animate-scale-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8 animate-badge-bounce" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">Inquiry Submitted Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. A campus dining supervisor or support executive will review your request and get back to you promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', email: '', role: 'STUDENT', subject: '', message: '' });
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all active:scale-95"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-extrabold text-lg text-slate-900">Send an Inquiry or Feedback</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Campus Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav@sviet.ac.in"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Campus Role</label>
                      <select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none bg-white transition-all duration-200"
                      >
                        <option value="STUDENT">Student (Hosteller / Day Scholar)</option>
                        <option value="FACULTY">Faculty / Staff Member</option>
                        <option value="CANTEEN">Canteen Vendor / Staff</option>
                        <option value="OTHER">Other Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Question about hostel delivery"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Detailed Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your inquiry, order ID (if any), or canteen feedback..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 focus:shadow-glow-sm outline-none resize-none transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
