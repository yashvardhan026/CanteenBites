'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_DETAILS } from '@/lib/constants';
import {
  Package,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Star,
  ChevronRight,
  Bike,
  MapPin,
  XCircle,
  HelpCircle,
  X,
} from 'lucide-react';

export const StudentOrders: React.FC = () => {
  const {
    orders,
    activeOrder,
    setActiveOrder,
    addToCart,
    setActiveNavTab,
    showToast,
    refreshOrders,
  } = useApp();

  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [foodRating, setFoodRating] = useState(5);
  const [canteenRating, setCanteenRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [isCancelling, setIsCancelling] = useState(false);

  // Selected order to view details (default to activeOrder or latest order)
  const currentViewOrder = activeOrder || (orders.length > 0 ? orders[0] : null);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      // Rebuild item
      addToCart(
        {
          id: item.menuItemId,
          canteenId: order.canteenId,
          canteenName: order.canteenName,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          isAvailable: true,
          prepTimeMinutes: 10,
          category: 'FAST_FOOD',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          rating: 4.8,
          description: '',
        },
        item.specialInstructions
      );
    });
    showToast('Reorder Added', 'Items added to your cart!', 'success');
    setActiveNavTab('cart');
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', payload: { reason: 'Student cancelled from app' } }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Order Cancelled', 'Your order was cancelled and refund initiated.', 'info');
        refreshOrders();
      } else {
        showToast('Cancellation Error', data.error || 'Cannot cancel order', 'error');
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingOrder) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`/api/orders/${ratingOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RATE',
          payload: {
            foodRating,
            canteenRating,
            deliveryRating: ratingOrder.orderType === 'HOSTEL_DELIVERY' ? deliveryRating : undefined,
            reviewText,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Thank You!', 'Your review has been submitted.', 'success');
        setRatingOrder(null);
        refreshOrders();
      }
    } catch (e: any) {
      showToast('Error', e.message, 'error');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">No Orders Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't placed any orders yet. Try out the snacks, meals, and beverages from your college canteens!
        </p>
        <button
          onClick={() => setActiveNavTab('home')}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          Explore Canteens
        </button>
      </div>
    );
  }

  // Visual status step indices
  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_ACCEPTANCE':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'PREPARING':
        return 3;
      case 'READY':
        return 4;
      case 'OUT_FOR_DELIVERY':
      case 'PICKED_UP':
        return 5;
      case 'DELIVERED':
      case 'COMPLETED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStep = currentViewOrder ? getStepProgress(currentViewOrder.status) : 1;
  const isTerminated = currentViewOrder && ['REJECTED', 'CANCELLED', 'REFUNDED'].includes(currentViewOrder.status);

  return (
    <div className="space-y-6 pb-24 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Orders</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live tracking, past orders & receipts</p>
        </div>
        <button
          onClick={refreshOrders}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          title="Refresh orders"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Live Tracking Card (Section 16, 17, 18, 35) */}
      {currentViewOrder && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-elevated space-y-5 relative overflow-hidden">
          {/* Top Order ID & Canteen */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-slate-900 tracking-tight">
                  {currentViewOrder.id}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 shadow-2xs ${
                    ORDER_STATUS_DETAILS[currentViewOrder.status]?.bg || 'bg-slate-100'
                  } ${ORDER_STATUS_DETAILS[currentViewOrder.status]?.color || 'text-slate-700'} ${
                    ORDER_STATUS_DETAILS[currentViewOrder.status]?.border || 'border-slate-300'
                  }`}
                >
                  {['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(currentViewOrder.status) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  <span>{ORDER_STATUS_DETAILS[currentViewOrder.status]?.label || currentViewOrder.status}</span>
                </span>
              </div>
              <p className="text-xs text-brand-600 font-bold mt-0.5">
                {currentViewOrder.canteenName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-slate-900">
                ₹{currentViewOrder.totalAmount}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {new Date(currentViewOrder.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Visual Timeline (Section 18 & 35) */}
          {!isTerminated ? (
            <div className="py-3">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 z-0 transition-all duration-500"
                  style={{ width: `${Math.min(100, ((currentStep - 1) / 4) * 100)}%` }}
                />

                {[
                  { step: 1, label: 'Order Confirmed', icon: '✓' },
                  { step: 2, label: 'Accepted by Canteen', icon: '✓' },
                  { step: 3, label: 'Preparing', icon: '●' },
                  { step: 4, label: 'Ready', icon: '○' },
                  {
                    step: 5,
                    label: currentViewOrder.orderType === 'HOSTEL_DELIVERY' ? 'Delivered' : 'Picked Up',
                    icon: '○',
                  },
                ].map((s) => {
                  const isDone = currentStep > s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div key={s.step} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-brand-600 text-white shadow-md ring-4 ring-brand-500/25 scale-110 pulse-active'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : isCurrent ? '●' : '○'}
                      </div>
                      <span
                        className={`text-[10px] mt-2 font-bold text-center max-w-[70px] leading-tight ${
                          isCurrent
                            ? 'text-brand-700 font-black'
                            : isDone
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Kitchen Status Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-brand-50/70 border border-brand-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
                  </span>
                  <div className="text-xs">
                    <span className="text-slate-500 font-medium">Kitchen Status: </span>
                    <strong className="text-brand-900 font-extrabold">
                      {currentViewOrder.status === 'PREPARING'
                        ? 'Preparing your order'
                        : currentViewOrder.status === 'READY'
                        ? 'Food is ready for collection'
                        : currentViewOrder.status === 'OUT_FOR_DELIVERY'
                        ? 'Delivery partner is on the way to your hostel'
                        : currentViewOrder.status === 'ACCEPTED'
                        ? 'Order accepted by kitchen'
                        : currentViewOrder.status === 'DELIVERED' || currentViewOrder.status === 'COMPLETED'
                        ? 'Order delivered & completed'
                        : 'Order placed & awaiting confirmation'}
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-brand-700 bg-white px-2 py-0.5 rounded-lg border border-brand-200 shadow-2xs">
                  Active
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-rose-900">
                  {currentViewOrder.status === 'REJECTED'
                    ? 'Order Rejected by Canteen'
                    : 'Order Cancelled'}
                </h5>
                <p className="text-xs text-rose-700 mt-0.5">
                  {currentViewOrder.rejectionReason || currentViewOrder.cancellationReason || 'Order terminated.'}
                </p>
                {currentViewOrder.refundAmount && currentViewOrder.refundAmount > 0 ? (
                  <span className="text-[11px] font-bold text-rose-900 mt-1 inline-block bg-rose-100 px-2 py-0.5 rounded">
                    Refund of ₹{currentViewOrder.refundAmount} {currentViewOrder.refundStatus?.toLowerCase()}
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Live Queue Position & Smart Ready Time (Section 16 & 17) */}
          {!isTerminated && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Queue Position Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-[9px] uppercase font-bold tracking-wider">Queue</span>
                  <span className="text-lg font-black leading-none">
                    #{currentViewOrder.queuePosition > 0 ? currentViewOrder.queuePosition : '—'}
                  </span>
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-indigo-950">
                    Live Position in Queue
                  </h5>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    {currentViewOrder.queuePosition > 1
                      ? `${currentViewOrder.queuePosition - 1} order(s) ahead of you`
                      : currentViewOrder.queuePosition === 1
                      ? 'Cooking now / Next in line'
                      : 'Order is ready for collection!'}
                  </p>
                </div>
              </div>

              {/* Smart Ready Time Box */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-black leading-none">ETA</span>
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-amber-950">Estimated Ready Time</h5>
                  <p className="text-xs text-amber-800 font-bold mt-0.5">
                    {new Date(currentViewOrder.estimatedReadyTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <span className="text-[10px] text-amber-700">
                    (~{currentViewOrder.prepTimeMinutes} mins preparation)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Delay Notification Notice (Section 36) */}
          {currentViewOrder.delayReason && (
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> Your order is taking slightly longer than expected due to{' '}
                <em>{currentViewOrder.delayReason}</em>. Thank you for your patience!
              </div>
            </div>
          )}

          {/* Hostel Delivery Status Card (Section 19) */}
          {currentViewOrder.orderType === 'HOSTEL_DELIVERY' && currentViewOrder.deliveryDetails && (
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <Bike className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs text-purple-950">Hostel Room Delivery</h5>
                  <p className="text-xs text-purple-700 mt-0.5">
                    {currentViewOrder.deliveryDetails.hostelName}, {currentViewOrder.deliveryDetails.block}, Room {currentViewOrder.deliveryDetails.roomNumber}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                      {currentViewOrder.deliveryDetails.deliveryStatus.replace(/_/g, ' ')}
                    </span>
                    {currentViewOrder.deliveryDetails.deliveryStaffName && (
                      <span className="text-[10px] text-purple-800 font-semibold">
                        Agent: {currentViewOrder.deliveryDetails.deliveryStaffName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items Summary in this Order */}
          <div className="border-t border-slate-100 pt-3">
            <h5 className="font-bold text-xs text-slate-700 mb-2">Ordered Items</h5>
            <div className="space-y-1.5">
              {currentViewOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className={item.isVeg ? 'veg-indicator' : 'non-veg-indicator'}></span>
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    {item.specialInstructions && (
                      <span className="text-[10px] text-slate-400 italic">
                        ({item.specialInstructions})
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs: Cancel, Reorder, Rate */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            {['PENDING_ACCEPTANCE', 'ACCEPTED'].includes(currentViewOrder.status) && (
              <button
                onClick={() => handleCancelOrder(currentViewOrder.id)}
                disabled={isCancelling}
                className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

            <button
              onClick={() => handleReorder(currentViewOrder)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
              <span>Reorder Items</span>
            </button>

            {['PICKED_UP', 'DELIVERED', 'COMPLETED'].includes(currentViewOrder.status) && !currentViewOrder.rating && (
              <button
                onClick={() => setRatingOrder(currentViewOrder)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate & Review</span>
              </button>
            )}

            {currentViewOrder.rating && (
              <div className="text-xs text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Rated {currentViewOrder.rating.foodRating}/5</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Past Orders List */}
      <div className="space-y-3">
        <h3 className="font-black text-sm text-slate-900">All Orders History</h3>
        <div className="space-y-2.5">
          {orders.map((o) => {
            const isLive = ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status);

            return (
              <div
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`p-3.5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-card-hover ${
                  activeOrder?.id === o.id
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{o.id}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                        ORDER_STATUS_DETAILS[o.status]?.bg || 'bg-slate-100'
                      } ${ORDER_STATUS_DETAILS[o.status]?.color || 'text-slate-700'}`}
                    >
                      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      <span>{ORDER_STATUS_DETAILS[o.status]?.label || o.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {o.canteenName} • {o.items.length} item(s) • ₹{o.totalAmount}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    at {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating & Review Modal (Section 29) */}
      {ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-left space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-black text-base text-slate-900">How was your order? ⭐</h4>
              <button
                onClick={() => setRatingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Food Quality ({foodRating}/5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFoodRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= foodRating ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Canteen Service ({canteenRating}/5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCanteenRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= canteenRating ? 'fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {ratingOrder.orderType === 'HOSTEL_DELIVERY' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Experience ({deliveryRating}/5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setDeliveryRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= deliveryRating ? 'fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review & Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what you liked..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRating}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
