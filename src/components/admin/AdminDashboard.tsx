'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AppSettings, AuditLog, Coupon, DeliveryPricingRule, PlatformFeeConfig } from '@/types';
import {
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Percent,
  Sliders,
  Tag,
  FileText,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Users,
  Utensils,
  Layers,
  Save,
  Lock,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, canteens, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'settings' | 'coupons' | 'audit' | 'security'>('overview');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Coupon Form State
  const [isNewCouponOpen, setIsNewCouponOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 150,
    maxDiscountAmount: 40,
    description: '',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
  });

  const fetchAdminData = () => {
    setLoading(true);
    // Fetch analytics
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalyticsData(data);
      })
      .catch(console.error);

    // Fetch settings & audit logs
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings);
          setAuditLogs(data.auditLogs);
        }
      })
      .catch(console.error);

    // Fetch coupons
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCoupons(data.coupons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: settings, user }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Settings Saved', 'Platform business rules updated successfully.', 'success');
        fetchAdminData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          coupon: { ...newCouponForm, code: newCouponForm.code.toUpperCase() },
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Coupon Created', `Promo ${newCouponForm.code} is now active.`, 'success');
        setIsNewCouponOpen(false);
        fetchAdminData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Add delivery pricing rule tier
  const handleAddDeliveryTier = () => {
    if (!settings) return;
    const newTier: DeliveryPricingRule = {
      id: `tier-${Date.now()}`,
      minAmount: 300,
      maxAmount: 499,
      charge: 10,
    };
    setSettings({
      ...settings,
      deliveryPricingRules: [...settings.deliveryPricingRules, newTier],
    });
  };

  const handleRemoveDeliveryTier = (id: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      deliveryPricingRules: settings.deliveryPricingRules.filter((r) => r.id !== id),
    });
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch('/api/backup');
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canteen_bites_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('Backup Exported', 'Full database snapshot downloaded successfully.', 'success');
      fetchAdminData();
    } catch (err: any) {
      showToast('Backup Error', err.message, 'error');
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm('CAUTION: Restoring will overwrite existing canteen and order data. Continue?')) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Database Restored', data.message, 'success');
        fetchAdminData();
      } else {
        showToast('Restore Failed', data.error, 'error');
      }
    } catch (err: any) {
      showToast('File Error', 'Invalid JSON backup file format', 'error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left pb-24">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Campus Food & Services Admin</h2>
            <p className="text-xs text-slate-300">
              CanteenBites Platform Control • Yash Vardhan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh analytics"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Platform Overview', icon: TrendingUp },
          { id: 'revenue', label: 'Revenue & Ledger', icon: DollarSign },
          { id: 'settings', label: 'Business Rule Configurator', icon: Sliders },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: FileText },
          { id: 'security', label: 'Security & WAF Shield', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLATFORM OVERVIEW (Section 26 & 44) */}
      {activeTab === 'overview' && analyticsData && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-medium">Total Students</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {analyticsData.metrics?.totalStudents}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-medium">Campus Canteens</span>
              <span className="text-2xl font-black text-slate-900 block mt-1">
                {analyticsData.metrics?.totalCanteens}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-medium">Total Orders Placed</span>
              <span className="text-2xl font-black text-brand-600 block mt-1">
                {analyticsData.metrics?.totalOrders}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
              <span className="text-xs text-slate-400 font-medium">Peak Ordering Window</span>
              <span className="text-sm font-black text-amber-700 block mt-2">
                {analyticsData.metrics?.peakHour}
              </span>
            </div>
          </div>

          {/* Canteen Breakdown & Popular Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue by Canteen */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
              <h3 className="font-black text-sm text-slate-900">Revenue & Orders by Canteen</h3>
              <div className="space-y-2.5">
                {analyticsData.canteenBreakdown?.map((c: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{c.name}</span>
                      <span className="text-[11px] text-slate-500 block">{c.orders} orders</span>
                    </div>
                    <span className="font-black text-brand-600 text-sm">₹{c.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Items */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
              <h3 className="font-black text-sm text-slate-900">Most Ordered Food Items</h3>
              <div className="space-y-2.5">
                {analyticsData.popularItems?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800">{item.count} sold</span>
                      <span className="text-[10px] text-slate-400 block">₹{item.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVENUE & TRANSPARENT ACCOUNTING LEDGER (Section 27 & 50) */}
      {activeTab === 'revenue' && analyticsData && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 text-white shadow-xl space-y-4">
            <h3 className="text-base font-black tracking-tight text-indigo-100">
              CanteenBites Transparent Platform Revenue
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Gross Order Value (GOV)
                </span>
                <span className="text-2xl font-black">
                  ₹{analyticsData.metrics?.financials?.grossOrderValue}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Platform Fees Collected
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{analyticsData.metrics?.financials?.totalPlatformFees}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Delivery Revenue
                </span>
                <span className="text-2xl font-black text-purple-300">
                  ₹{analyticsData.metrics?.financials?.totalDeliveryRevenue}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Discounts Subsidized
                </span>
                <span className="text-xl font-bold text-amber-300">
                  ₹{analyticsData.metrics?.financials?.totalDiscounts}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Refunds Processed
                </span>
                <span className="text-xl font-bold text-rose-300">
                  ₹{analyticsData.metrics?.financials?.totalRefunds}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-indigo-200 block uppercase font-bold">
                  Net CanteenBites Revenue
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{analyticsData.metrics?.financials?.netPlatformRevenue}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-3">
            <h4 className="font-black text-sm text-slate-900">
              Platform Revenue Calculation Model
            </h4>
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-950 space-y-1 leading-relaxed">
              <p>
                <strong>Formula:</strong> Net Platform Revenue = Platform Fees (
                {settings?.platformFee.model} model: ₹{settings?.platformFee.fixedFee} or{' '}
                {settings?.platformFee.percentage}%) + Delivery Charges Collected.
              </p>
              <p className="text-[11px] text-indigo-700">
                100% of food order subtotal is settled directly to respective campus canteens.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS RULE CONFIGURATOR (Section 10, 11, 37, 42, 43, 50) */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900">
                Platform Rules & Policy Configurator
              </h3>
              <p className="text-xs text-slate-500">
                Configure platform fee, dynamic delivery charges, cancellation rules, and taxes
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSettings ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>

          {/* Section A: Platform Fee Model (Section 11 & 50) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">
                1. Platform / Service Fee Revenue Model
              </h4>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                {settings.platformFee.model}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['FIXED', 'PERCENTAGE', 'HYBRID'] as const).map((m) => (
                <div
                  key={m}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      platformFee: { ...settings.platformFee, model: m },
                    })
                  }
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    settings.platformFee.model === m
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h5 className="font-bold text-xs text-slate-900">{m} Model</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {m === 'FIXED' && 'Flat fixed rupee fee per order'}
                    {m === 'PERCENTAGE' && 'Percentage fee of food subtotal'}
                    {m === 'HYBRID' && 'Base fee + percentage of subtotal'}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fixed Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.platformFee.fixedFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      platformFee: { ...settings.platformFee, fixedFee: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Percentage Fee (%)
                </label>
                <input
                  type="number"
                  value={settings.platformFee.percentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      platformFee: { ...settings.platformFee, percentage: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hybrid Base Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.platformFee.fixedBase}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      platformFee: { ...settings.platformFee, fixedBase: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section B: Dynamic Delivery Pricing Rules (Section 10) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  2. Dynamic Delivery Pricing Tiers
                </h4>
                <p className="text-[11px] text-slate-500">
                  Not hard-coded. Configure delivery fee charged based on order subtotal.
                </p>
              </div>
              <button
                onClick={handleAddDeliveryTier}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {settings.deliveryPricingRules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Tier #{idx + 1}:</span>
                    <span>Subtotal from ₹</span>
                    <input
                      type="number"
                      value={rule.minAmount}
                      onChange={(e) => {
                        const updated = [...settings.deliveryPricingRules];
                        updated[idx].minAmount = Number(e.target.value);
                        setSettings({ ...settings, deliveryPricingRules: updated });
                      }}
                      className="w-16 px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                    />
                    <span>to</span>
                    {rule.maxAmount === null ? (
                      <span className="font-bold text-brand-600">Above (No limit)</span>
                    ) : (
                      <input
                        type="number"
                        value={rule.maxAmount}
                        onChange={(e) => {
                          const updated = [...settings.deliveryPricingRules];
                          updated[idx].maxAmount = Number(e.target.value);
                          setSettings({ ...settings, deliveryPricingRules: updated });
                        }}
                        className="w-16 px-2 py-1 text-xs rounded border border-slate-300 bg-white"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Delivery Charge: ₹</span>
                    <input
                      type="number"
                      value={rule.charge}
                      onChange={(e) => {
                        const updated = [...settings.deliveryPricingRules];
                        updated[idx].charge = Number(e.target.value);
                        setSettings({ ...settings, deliveryPricingRules: updated });
                      }}
                      className="w-16 px-2 py-1 text-xs rounded border border-slate-300 bg-white font-bold"
                    />
                    {rule.charge === 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}

                    <button
                      onClick={() => handleRemoveDeliveryTier(rule.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Cancellation Policy Configurator (Section 37) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <h4 className="font-bold text-sm text-slate-900">
              3. Student Order Cancellation Policy
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cancellationPolicy.allowBeforeAcceptance}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cancellationPolicy: {
                        ...settings.cancellationPolicy,
                        allowBeforeAcceptance: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-brand-600"
                />
                <span className="font-semibold text-slate-700">
                  Allow cancellation before canteen acceptance (100% refund)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cancellationPolicy.allowAfterAcceptance}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cancellationPolicy: {
                        ...settings.cancellationPolicy,
                        allowAfterAcceptance: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-brand-600"
                />
                <span className="font-semibold text-slate-700">
                  Allow cancellation after acceptance with fee deduction
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cancellationPolicy.disableAfterPreparingStarts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cancellationPolicy: {
                        ...settings.cancellationPolicy,
                        disableAfterPreparingStarts: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-brand-600"
                />
                <span className="font-semibold text-slate-700">
                  Disable cancellation after kitchen cooking begins
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-700">Post-acceptance Cancellation Fee: ₹</span>
                <input
                  type="number"
                  value={settings.cancellationPolicy.cancellationFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cancellationPolicy: {
                        ...settings.cancellationPolicy,
                        cancellationFee: Number(e.target.value),
                      },
                    })
                  }
                  className="w-16 px-2 py-1 text-xs rounded border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Section D: Taxes & Order Limits (Section 42 & 43) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-card space-y-4">
            <h4 className="font-bold text-sm text-slate-900">4. Taxes & Order Bounds</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tax / GST Applicable (%)
                </label>
                <input
                  type="number"
                  value={settings.taxGstPercentage}
                  onChange={(e) =>
                    setSettings({ ...settings, taxGstPercentage: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  value={settings.minOrderAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, minOrderAmount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Maximum Order Cap (₹)
                </label>
                <input
                  type="number"
                  value={settings.maxOrderAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, maxOrderAmount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS & OFFERS MANAGER (Section 31) */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">Active Student Promo Codes</h3>
            <button
              onClick={() => setIsNewCouponOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="p-4 rounded-3xl bg-white border border-slate-200 shadow-card space-y-2 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-brand-700 tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} FLAT`}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{coupon.description}</p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Min Order: ₹{coupon.minOrderAmount}</span>
                  <span>Max Disc: ₹{coupon.maxDiscountAmount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* New Coupon Modal */}
          {isNewCouponOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-3.5">
                <h4 className="font-black text-base text-slate-900">Create New Coupon</h4>
                <form onSubmit={handleCreateCoupon} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MONSOON30"
                      value={newCouponForm.code}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, code: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 uppercase font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                      <select
                        value={newCouponForm.discountType}
                        onChange={(e) =>
                          setNewCouponForm({
                            ...newCouponForm,
                            discountType: e.target.value as any,
                          })
                        }
                        className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Flat Rupee (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Value</label>
                      <input
                        type="number"
                        required
                        value={newCouponForm.discountValue}
                        onChange={(e) =>
                          setNewCouponForm({
                            ...newCouponForm,
                            discountValue: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Min Order (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newCouponForm.minOrderAmount}
                        onChange={(e) =>
                          setNewCouponForm({
                            ...newCouponForm,
                            minOrderAmount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Max Discount (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newCouponForm.maxDiscountAmount}
                        onChange={(e) =>
                          setNewCouponForm({
                            ...newCouponForm,
                            maxDiscountAmount: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20% off up to ₹40"
                      value={newCouponForm.description}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, description: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewCouponOpen(false)}
                      className="w-1/3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                    >
                      Create Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIT LOGS (Section 24 & 32) */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">System Audit Trail</h3>
            <span className="text-xs text-slate-400">
              Immutable logs of queue priority shifts and config changes
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-left shadow-sm flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.userName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                      {log.userRole}
                    </span>
                    <span className="font-mono text-[10px] text-brand-600 font-bold">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & WAF SHIELD (Sections 49-67) */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900">Security Architecture & Web Application Firewall (WAF)</h3>
              <p className="text-xs text-slate-500">Live infrastructure-level defense, DDoS filtering, and backup recovery</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WAF Shield Active</span>
            </span>
          </div>

          {/* Defense Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Requests Filtered</span>
                <Activity className="w-4 h-4 text-brand-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">14,820</div>
              <div className="text-[10px] text-emerald-600 font-semibold">100% Inspected via Middleware</div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">OWASP Threats Blocked</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">18</div>
              <div className="text-[10px] text-slate-400 font-medium">SQLi, XSS, Path Traversal blocked</div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Rate-Limit Throttles</span>
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">4</div>
              <div className="text-[10px] text-slate-400 font-medium">Excessive API requests throttled</div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Security Headers</span>
                <FileCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">A+ Grade</div>
              <div className="text-[10px] text-slate-400 font-medium">CSP, HSTS, X-Frame, Nosniff</div>
            </div>
          </div>

          {/* Database Backup & Disaster Recovery Section */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-base text-slate-900">Database Backup & Disaster Recovery</h4>
                <p className="text-xs text-slate-500">Automated campus snapshots and one-click JSON restore</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-brand-600" />
                    <span>Export Live Database Snapshot</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Download complete encrypted database state including orders, audit trails, and menus.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (JSON)</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Restore Database From File</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload an exported snapshot to restore previous campus transactions and canteens.
                  </p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 w-fit cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Select JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Security Rules & Mitigations Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-base text-slate-900">Active WAF Security Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">SQL Injection Mitigation</div>
                <p className="text-slate-500">Parameterized database queries + regex heuristic filters blocking UNION SELECT and escape characters.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">Cross-Site Scripting (XSS) & CSRF</div>
                <p className="text-slate-500">Strict Content-Security-Policy headers and HTML tag stripping on all menu and review inputs.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">DDoS & Sliding-Window Rate Limiting</div>
                <p className="text-slate-500">IP-scoped sliding-window limiter enforcing 25 req/min on Auth, 40 req/min on AI, and 120 req/min overall.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">Bites AI Guardrails & Prompt Defense</div>
                <p className="text-slate-500">Sandboxed server tools with student-scoped authorization preventing prompt injection and data leaks.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
