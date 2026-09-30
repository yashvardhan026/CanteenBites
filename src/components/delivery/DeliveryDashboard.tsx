'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';
import { ORDER_STATUS_DETAILS } from '@/lib/constants';
import {
  Bike,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  RotateCcw,
  Package,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const DeliveryDashboard: React.FC = () => {
  const { user, showToast, triggerCelebration } = useApp();
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeliveryOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          const all: Order[] = data.orders;
          // Delivery orders are hostel deliveries that are ready, assigned, or in transit
          const pending = all.filter(
            (o) =>
              o.orderType === 'HOSTEL_DELIVERY' &&
              ['READY', 'OUT_FOR_DELIVERY'].includes(o.status)
          );
          const done = all.filter(
            (o) =>
              o.orderType === 'HOSTEL_DELIVERY' &&
              ['DELIVERED', 'COMPLETED'].includes(o.status)
          );
          setAssignedOrders(pending);
          setCompletedOrders(done);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveryOrders();
    const interval = setInterval(fetchDeliveryOrders, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDeliveryAction = async (orderId: string, action: 'OUT_FOR_DELIVERY' | 'DELIVERED') => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, user }),
      });
      const data = await res.json();
      if (data.success) {
        if (action === 'DELIVERED') {
          triggerCelebration();
          showToast('Delivery Completed! 🎉', `Order ${orderId} marked as delivered.`, 'success');
        } else {
          showToast('Out for Delivery', `Order ${orderId} is now out for delivery.`, 'info');
        }
        fetchDeliveryOrders();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left pb-24">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-elevated flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Hostel Delivery Agent Portal
            </h2>
            <p className="text-xs text-slate-500">
              Logged in as <strong>{user?.name || 'Suresh Yadav'}</strong> • Delivery Staff
            </p>
          </div>
        </div>

        <button
          onClick={fetchDeliveryOrders}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Refresh assignments"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Assigned / In-Transit</span>
          <span className="text-2xl font-black text-purple-700 block mt-1">
            {assignedOrders.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Deliveries Completed</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">
            {completedOrders.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium">Average Delivery Time</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">~8 mins</span>
        </div>
      </div>

      {/* Active Delivery Orders to Deliver */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900">Current Assigned Deliveries</h3>
          <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            {assignedOrders.length} pending delivery
          </span>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800">No Pending Deliveries</h4>
            <p className="text-xs text-slate-400">
              All hostel room delivery requests have been dropped off. Check back once canteens mark orders as ready.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {assignedOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-white border-2 border-purple-200 shadow-md space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-black text-sm text-slate-900">
                      {order.id}
                    </span>
                    <span className="text-xs text-brand-600 font-bold block mt-0.5">
                      Pickup from: {order.canteenName}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      ORDER_STATUS_DETAILS[order.status]?.bg || 'bg-slate-100'
                    } ${ORDER_STATUS_DETAILS[order.status]?.color || 'text-slate-700'}`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Delivery Location Card (Hostel, Block, Room) */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-purple-950">
                        {order.deliveryDetails?.hostelName || 'Hostel'}
                      </h4>
                      <p className="text-xs text-purple-800 font-bold">
                        {order.deliveryDetails?.block}, {order.deliveryDetails?.floor} • Room{' '}
                        <span className="underline decoration-purple-500 underline-offset-2">
                          {order.deliveryDetails?.roomNumber}
                        </span>
                      </p>
                      <span className="text-[11px] text-slate-600 mt-1 block">
                        Student: <strong>{order.studentName}</strong> ({order.studentRoll})
                      </span>
                    </div>
                  </div>

                  {/* Call Student Button */}
                  <a
                    href={`tel:${order.studentPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-purple-700 font-bold text-xs shadow-sm border border-purple-200 hover:bg-purple-100 transition-colors w-fit"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                    <span>Call Student</span>
                  </a>
                </div>

                {/* Order Items */}
                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block mb-1">Food Items:</span>
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {i.quantity}x {i.name}
                      </span>
                      <span className="font-semibold">₹{i.subtotal}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleDeliveryAction(order.id, 'OUT_FOR_DELIVERY')}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Start Out for Delivery</span>
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleDeliveryAction(order.id, 'DELIVERED')}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivered to Room 🎉</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deliveries History */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="font-black text-sm text-slate-900">Completed Deliveries</h3>
        <div className="space-y-2">
          {completedOrders.map((o) => (
            <div
              key={o.id}
              className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-mono font-bold text-slate-900">{o.id}</span>
                <p className="text-slate-600 mt-0.5">
                  Delivered to {o.deliveryDetails?.roomNumber} ({o.studentName}) • ₹{o.totalAmount}
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Delivered
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
