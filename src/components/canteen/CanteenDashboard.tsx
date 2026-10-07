'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MenuItem, Order, OrderStatus } from '@/types';
import { ORDER_STATUS_DETAILS } from '@/lib/constants';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bike,
  Plus,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Search,
  Check,
  X,
} from 'lucide-react';

export const CanteenDashboard: React.FC = () => {
  const { user, canteens, showToast, refreshCanteens } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'queue' | 'menu' | 'history'>('pending');
  const [canteenOrders, setCanteenOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [acceptModalOrder, setAcceptModalOrder] = useState<Order | null>(null);
  const [selectedPrepMins, setSelectedPrepMins] = useState(15);

  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen capacity full at peak hour');

  const [delayModalOrder, setDelayModalOrder] = useState<Order | null>(null);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayReason, setDelayReason] = useState('High rush at cooking stations');

  const [assignDeliveryOrder, setAssignDeliveryOrder] = useState<Order | null>(null);

  // New Menu Item form
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    category: 'FAST_FOOD',
    price: 80,
    isVeg: true,
    prepTimeMinutes: 10,
    description: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  });

  const myCanteenId = user?.canteenId || 'canteen-main';
  const myCanteen = canteens.find((c) => c.id === myCanteenId) || canteens[0];

  const fetchCanteenData = () => {
    setLoading(true);
    // Fetch orders for this canteen
    fetch(`/api/orders?canteenId=${myCanteenId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setCanteenOrders(data.orders);
        }
      })
      .catch(console.error);

    // Fetch menu
    fetch(`/api/menu?canteenId=${myCanteenId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items) {
          setMenuItems(data.items);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCanteenData();
    const interval = setInterval(fetchCanteenData, 6000);
    return () => clearInterval(interval);
  }, [myCanteenId]);

  // Operational toggles
  const handleUpdateCanteenStatus = async (status: 'OPEN' | 'CLOSED' | 'BUSY') => {
    try {
      const res = await fetch('/api/canteens', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: myCanteenId,
          updates: { status },
          adminUserId: user?.id,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Canteen Status Updated', `Status changed to ${status}`, 'success');
        refreshCanteens();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleToggleHostelDelivery = async () => {
    if (!myCanteen) return;
    try {
      const res = await fetch('/api/canteens', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: myCanteenId,
          updates: { hostelDeliveryEnabled: !myCanteen.hostelDeliveryEnabled },
          adminUserId: user?.id,
          adminName: user?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          'Hostel Delivery Toggled',
          `Hostel Delivery is now ${!myCanteen.hostelDeliveryEnabled ? 'ON' : 'OFF'}`,
          'info'
        );
        refreshCanteens();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Order Actions
  const handleAcceptOrder = async () => {
    if (!acceptModalOrder) return;
    try {
      const res = await fetch(`/api/orders/${acceptModalOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ACCEPT',
          payload: { prepTimeMinutes: selectedPrepMins },
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order Accepted ✅', `Assigned ${selectedPrepMins} mins prep time.`, 'success');
        setAcceptModalOrder(null);
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleRejectOrder = async () => {
    if (!rejectModalOrder) return;
    try {
      const res = await fetch(`/api/orders/${rejectModalOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          payload: { reason: rejectReason },
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order Rejected ❌', `Refund of ₹${rejectModalOrder.totalAmount} initiated.`, 'info');
        setRejectModalOrder(null);
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleDelayOrder = async () => {
    if (!delayModalOrder) return;
    try {
      const res = await fetch(`/api/orders/${delayModalOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELAY',
          payload: { extraMinutes: delayMinutes, reason: delayReason },
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Delay Notified', `Added ${delayMinutes} minutes to estimated time.`, 'info');
        setDelayModalOrder(null);
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  const handleSimpleAction = async (orderId: string, action: string, payload?: any) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload, user }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Success', `Action ${action} executed.`, 'success');
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Queue priority manual adjust (Up / Down)
  const handleShiftQueue = async (orderId: string, direction: 'UP' | 'DOWN') => {
    const activeQueueOrders = canteenOrders
      .filter((o) => ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING'].includes(o.status))
      .sort((a, b) => a.queuePosition - b.queuePosition);

    const index = activeQueueOrders.findIndex((o) => o.id === orderId);
    if (index === -1) return;

    if (direction === 'UP' && index === 0) return;
    if (direction === 'DOWN' && index === activeQueueOrders.length - 1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    const temp = activeQueueOrders[index];
    activeQueueOrders[index] = activeQueueOrders[targetIndex];
    activeQueueOrders[targetIndex] = temp;

    const newOrderIds = activeQueueOrders.map((o) => o.id);

    try {
      const res = await fetch('/api/orders/queue-reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canteenId: myCanteenId,
          orderIds: newOrderIds,
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Queue Adjusted', 'New priority logged to system audit trail.', 'success');
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Menu Availability toggle
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          updates: { isAvailable: !item.isAvailable },
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !item.isAvailable } : i))
        );
        showToast(
          'Menu Updated',
          `${item.name} is now ${!item.isAvailable ? 'Available' : 'Currently Unavailable'}`,
          'info'
        );
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Add Menu Item
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMenuForm,
          canteenId: myCanteenId,
          user,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Item Added', `${newMenuForm.name} added to menu!`, 'success');
        setIsAddMenuOpen(false);
        fetchCanteenData();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    }
  };

  // Filter lists
  const pendingOrders = canteenOrders.filter((o) => o.status === 'PENDING_ACCEPTANCE');
  const activeQueue = canteenOrders
    .filter((o) => ['ACCEPTED', 'PREPARING', 'READY'].includes(o.status))
    .sort((a, b) => a.queuePosition - b.queuePosition);
  const historyOrders = canteenOrders.filter((o) =>
    ['OUT_FOR_DELIVERY', 'DELIVERED', 'PICKED_UP', 'COMPLETED', 'REJECTED', 'CANCELLED'].includes(
      o.status
    )
  );

  // Revenue calculation for today
  const todayRevenue = canteenOrders
    .filter((o) => !['REJECTED', 'CANCELLED'].includes(o.status))
    .reduce((acc, curr) => acc + curr.foodSubtotal, 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left pb-24">
      {/* Canteen Top Banner & Status Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {myCanteen?.name || 'Main Campus Canteen'}
              </h2>
              <span className="text-xs text-slate-500">
                Managed by {user?.name || 'Canteen Staff'} • {user?.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Operational Controls: Status & Hostel Delivery */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['OPEN', 'BUSY', 'CLOSED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateCanteenStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  myCanteen?.status === st
                    ? st === 'OPEN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : st === 'BUSY'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Hostel Delivery Toggle (Section 49) */}
          <button
            onClick={handleToggleHostelDelivery}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              myCanteen?.hostelDeliveryEnabled
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Hostel Delivery: {myCanteen?.hostelDeliveryEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Canteen Summary Metrics (Section 22) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Pending Orders</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">{pendingOrders.length}</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 text-xs">🔔 Action</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Active Cooking</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-brand-600">{activeQueue.length}</span>
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 text-xs">🍳 Kitchen</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Total Orders Today</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{canteenOrders.length}</span>
            <span className="p-2 rounded-xl bg-slate-50 text-slate-700 text-xs">📦 Total</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs text-slate-400 font-medium">Today's Revenue</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600">₹{todayRevenue}</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs">₹ Sales</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'pending', label: `New Orders (${pendingOrders.length})`, icon: AlertCircle },
          { id: 'queue', label: `Live Queue (${activeQueue.length})`, icon: Layers },
          { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: ChefHat },
          { id: 'history', label: `Completed History`, icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
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

      {/* TAB 1: NEW ORDERS (PENDING ACCEPTANCE) */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No Pending Orders</h4>
              <p className="text-xs text-slate-400">
                You have addressed all incoming student orders. New incoming orders will alert in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border-2 border-amber-300 shadow-md space-y-4"
                >
                  <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-mono font-black text-sm text-slate-900">
                        {order.id}
                      </span>
                      <h4 className="font-bold text-xs text-slate-700 mt-0.5">
                        {order.studentName} ({order.studentRoll})
                      </h4>
                      <span className="text-[10px] text-slate-400">📞 {order.studentPhone}</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {order.paymentMethod?.startsWith('CASH') ? '💵 Cash' : '📱 Online'} ({order.paymentMethod?.replace(/_/g, ' ') || 'UPI'})
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${order.paymentStatus === 'PENDING' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'}`}>
                          {order.paymentStatus === 'PENDING' ? 'Collect Cash' : '✓ Paid'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-base text-slate-900">
                        ₹{order.totalAmount}
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold block bg-amber-50 px-2 py-0.5 rounded-full mt-0.5 border border-amber-200">
                        PENDING ACCEPTANCE
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-medium">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="font-semibold">₹{it.subtotal}</span>
                      </div>
                    ))}
                    {order.items.some((i) => i.specialInstructions) && (
                      <div className="p-2 rounded-xl bg-amber-50 text-[11px] text-amber-800 italic border border-amber-200">
                        <strong>Student Note:</strong>{' '}
                        {order.items
                          .filter((i) => i.specialInstructions)
                          .map((i) => `"${i.specialInstructions}"`)
                          .join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Order Type & Room Delivery Confirmation (Section 19) */}
                  {order.orderType === 'HOSTEL_DELIVERY' && order.deliveryDetails && (
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900">
                          <Bike className="w-4 h-4 text-purple-600" />
                          <span>Hostel Room Delivery Requested</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                          {order.deliveryDetails.deliveryStatus}
                        </span>
                      </div>
                      <p className="text-xs text-purple-800">
                        {order.deliveryDetails.hostelName}, {order.deliveryDetails.block}, Room{' '}
                        <strong>{order.deliveryDetails.roomNumber}</strong>
                      </p>

                      {order.deliveryDetails.deliveryStatus === 'PENDING_CANTEEN_CONFIRMATION' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleSimpleAction(order.id, 'ACCEPT_DELIVERY')}
                            className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                          >
                            Accept Delivery
                          </button>
                          <button
                            onClick={() => handleSimpleAction(order.id, 'REJECT_DELIVERY')}
                            className="flex-1 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                          >
                            Reject Delivery (Counter Pickup)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Acceptance Action Buttons (Section 14 & 15) */}
                  <div className="flex gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setAcceptModalOrder(order)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Order</span>
                    </button>
                    <button
                      onClick={() => setRejectModalOrder(order)}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE QUEUE & ACTIVE ORDERS (Section 23 & 24) */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span className="font-bold text-xs text-slate-800">
                Live Kitchen Queue & Priority Re-ordering
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Changes are logged automatically in system audit trail
            </span>
          </div>

          {activeQueue.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-6">
              <span className="text-3xl block mb-2">🍽️</span>
              <h4 className="font-bold text-sm text-slate-800">Queue is Clear</h4>
              <p className="text-xs text-slate-400">No active orders cooking right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeQueue.map((order, idx) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Queue Priority Badging with Reorder Arrows */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-50 border border-indigo-200 min-w-[56px]">
                      <button
                        onClick={() => handleShiftQueue(order.id, 'UP')}
                        disabled={idx === 0}
                        className="p-0.5 text-indigo-700 hover:bg-indigo-100 rounded disabled:opacity-20"
                        title="Move Up in Queue Priority"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-sm text-indigo-900 leading-none my-1">
                        #{order.queuePosition}
                      </span>
                      <button
                        onClick={() => handleShiftQueue(order.id, 'DOWN')}
                        disabled={idx === activeQueue.length - 1}
                        className="p-0.5 text-indigo-700 hover:bg-indigo-100 rounded disabled:opacity-20"
                        title="Move Down in Queue Priority"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {order.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            ORDER_STATUS_DETAILS[order.status]?.bg || 'bg-slate-100'
                          } ${ORDER_STATUS_DETAILS[order.status]?.color || 'text-slate-700'}`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        {order.orderType === 'HOSTEL_DELIVERY' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                            🛵 Hostel Room {order.deliveryDetails?.roomNumber}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        {order.studentName} • {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-amber-700">
                          <Clock className="w-3 h-3" />
                          <span>
                            ETA:{' '}
                            {new Date(order.estimatedReadyTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                        {order.delayMinutes && (
                          <span className="text-rose-600 font-bold">
                            (+{order.delayMinutes}m delay)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kitchen Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleSimpleAction(order.id, 'PREPARE')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                      >
                        Start Preparing 🍳
                      </button>
                    )}

                    {['ACCEPTED', 'PREPARING'].includes(order.status) && (
                      <button
                        onClick={() => handleSimpleAction(order.id, 'READY')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        Mark Ready 🛎️
                      </button>
                    )}

                    {['ACCEPTED', 'PREPARING'].includes(order.status) && (
                      <button
                        onClick={() => setDelayModalOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200"
                      >
                        Delay Order ⏳
                      </button>
                    )}

                    {order.status === 'READY' && order.orderType === 'CANTEEN_PICKUP' && (
                      <button
                        onClick={() => handleSimpleAction(order.id, 'PICKUP')}
                        className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
                      >
                        Hand Over to Student ✨
                      </button>
                    )}

                    {order.status === 'READY' &&
                      order.orderType === 'HOSTEL_DELIVERY' &&
                      order.deliveryDetails?.deliveryStatus !== 'ASSIGNED' && (
                        <button
                          onClick={() =>
                            handleSimpleAction(order.id, 'ASSIGN_DELIVERY', {
                              staffId: 'user-delivery-staff',
                              staffName: 'Suresh Yadav',
                              staffPhone: '+91 98222 33445',
                            })
                          }
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                        >
                          Assign Suresh (Agent) 🛵
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MENU MANAGEMENT (Section 7) */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900">Canteen Menu Inventory</h3>
            <button
              onClick={() => setIsAddMenuOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Food Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl bg-white border border-slate-200 shadow-card flex gap-3 text-left relative ${
                  !item.isAvailable ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1">
                    <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    <span className="font-black text-xs text-brand-600">₹{item.price}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ⏱️ {item.prepTimeMinutes}m prep
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETED ORDERS HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h3 className="font-black text-sm text-slate-900">Today's Completed & Past Orders</h3>
          <div className="space-y-2">
            {historyOrders.map((o) => (
              <div
                key={o.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-900">{o.id}</span>
                  <p className="text-slate-600 mt-0.5">
                    {o.studentName} • {o.items.length} items • ₹{o.totalAmount}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    ORDER_STATUS_DETAILS[o.status]?.bg || 'bg-slate-100'
                  } ${ORDER_STATUS_DETAILS[o.status]?.color || 'text-slate-700'}`}
                >
                  {o.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACCEPT ORDER MODAL (Section 15) */}
      {acceptModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-4">
            <h4 className="font-black text-base text-slate-900">Accept Order & Set Prep Time</h4>
            <p className="text-xs text-slate-500">
              Order #{acceptModalOrder.id} ({acceptModalOrder.items.length} items for{' '}
              {acceptModalOrder.studentName})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Estimated Preparation Time (Minutes)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedPrepMins(mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPrepMins === mins
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Expected ready by:{' '}
              <strong>
                {new Date(Date.now() + selectedPrepMins * 60000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAcceptModalOrder(null)}
                className="w-1/3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptOrder}
                className="w-2/3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Acceptance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT ORDER MODAL (Section 14) */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-4">
            <h4 className="font-black text-base text-rose-700">Reject Order #{rejectModalOrder.id}</h4>
            <p className="text-xs text-slate-500">
              Rejecting will notify {rejectModalOrder.studentName} and automatically initiate a full
              refund of <strong>₹{rejectModalOrder.totalAmount}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Rejection
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="w-1/3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectOrder}
                className="w-2/3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Confirm Rejection & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELAY ORDER MODAL (Section 36) */}
      {delayModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-4">
            <h4 className="font-black text-base text-amber-800">Delay Notice: #{delayModalOrder.id}</h4>
            <p className="text-xs text-slate-500">
              Send an updated estimated ready time notification to {delayModalOrder.studentName}.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Extra Minutes Required
              </label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDelayMinutes(m)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      delayMinutes === m ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Delay</label>
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDelayModalOrder(null)}
                className="w-1/3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelayOrder}
                className="w-2/3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md"
              >
                Send Delay Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MENU ITEM MODAL */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-black text-base text-slate-900">Add New Menu Item</h4>
              <button
                onClick={() => setIsAddMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMenuItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schezwan Fried Rice"
                  value={newMenuForm.name}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMenuForm.price}
                    onChange={(e) =>
                      setNewMenuForm({ ...newMenuForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    required
                    value={newMenuForm.prepTimeMinutes}
                    onChange={(e) =>
                      setNewMenuForm({ ...newMenuForm, prepTimeMinutes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newMenuForm.category}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="FAST_FOOD">Fast Food</option>
                    <option value="PIZZA">Pizza</option>
                    <option value="SNACKS">Snacks</option>
                    <option value="MEALS">Meals</option>
                    <option value="BEVERAGES">Beverages</option>
                    <option value="CHINESE">Chinese</option>
                    <option value="TEA_COFFEE">Tea/Coffee</option>
                    <option value="DESSERTS">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dietary</label>
                  <select
                    value={newMenuForm.isVeg ? 'VEG' : 'NON_VEG'}
                    onChange={(e) =>
                      setNewMenuForm({ ...newMenuForm, isVeg: e.target.value === 'VEG' })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="VEG">Vegetarian (Veg)</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short appetizing description..."
                  value={newMenuForm.description}
                  onChange={(e) =>
                    setNewMenuForm({ ...newMenuForm, description: e.target.value })
                  }
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
              >
                Save Food Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
