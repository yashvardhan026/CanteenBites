import { AppSettings, Coupon, FoodCategory, OrderStatus } from "@/types";

export const APP_NAME = "CanteenBites";
export const TAGLINE = "Order. Track. Enjoy.";

export const FOOD_CATEGORIES: { id: FoodCategory; label: string; icon: string; emoji: string }[] = [
  { id: 'FAST_FOOD', label: 'Fast Food', icon: 'Utensils', emoji: '🍔' },
  { id: 'PIZZA', label: 'Pizza', icon: 'Pizza', emoji: '🍕' },
  { id: 'SNACKS', label: 'Snacks', icon: 'Cookie', emoji: '🥪' },
  { id: 'MEALS', label: 'Meals', icon: 'Soup', emoji: '🍛' },
  { id: 'BEVERAGES', label: 'Beverages', icon: 'GlassWater', emoji: '🥤' },
  { id: 'CHINESE', label: 'Chinese', icon: 'UtensilsCrossed', emoji: '🍜' },
  { id: 'TEA_COFFEE', label: 'Tea & Coffee', icon: 'Coffee', emoji: '☕' },
  { id: 'DESSERTS', label: 'Desserts', icon: 'Cake', emoji: '🍰' },
];

export const ORDER_STATUS_DETAILS: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING_ACCEPTANCE: { label: 'Pending Acceptance', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  ACCEPTED: { label: 'Accepted', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  REJECTED: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  PREPARING: { label: 'Preparing', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  READY: { label: 'Ready for Pickup', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  PICKED_UP: { label: 'Picked Up', color: 'text-teal-800', bg: 'bg-teal-100', border: 'border-teal-300' },
  COMPLETED: { label: 'Completed', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  REFUND_INITIATED: { label: 'Refund Initiated', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  REFUNDED: { label: 'Refunded', color: 'text-cyan-800', bg: 'bg-cyan-50', border: 'border-cyan-200' },
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  platformFee: {
    model: 'FIXED',
    fixedFee: 5, // ₹5 per order
    percentage: 2, // 2%
    fixedBase: 3, // ₹3 + 1% in hybrid
  },
  deliveryPricingRules: [
    { id: 'tier-1', minAmount: 0, maxAmount: 99, charge: 20 },
    { id: 'tier-2', minAmount: 100, maxAmount: 199, charge: 15 },
    { id: 'tier-3', minAmount: 200, maxAmount: 299, charge: 10 },
    { id: 'tier-4', minAmount: 300, maxAmount: null, charge: 0 }, // ₹300+ free
  ],
  cancellationPolicy: {
    allowBeforeAcceptance: true,
    allowAfterAcceptance: true,
    cancellationFee: 10,
    refundPercentage: 90,
    disableAfterPreparingStarts: true,
  },
  taxGstPercentage: 5,
  allowCashOnPickup: true,
  serviceTaxEnabled: false,
  minOrderAmount: 20,
  maxOrderAmount: 3000,
  autoRefundOnReject: true,
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 150,
    maxDiscountAmount: 40,
    description: '20% off up to ₹40 on orders above ₹150',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    code: 'BITES50',
    discountType: 'FIXED',
    discountValue: 50,
    minOrderAmount: 250,
    maxDiscountAmount: 50,
    description: 'Flat ₹50 off on orders above ₹250',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
  },
  {
    code: 'EXAMFUEL',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderAmount: 100,
    maxDiscountAmount: 30,
    description: '15% off up to ₹30 on study snacks',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z',
  },
];
