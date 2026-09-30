export type Role = 'STUDENT' | 'CANTEEN_STAFF' | 'DELIVERY_STAFF' | 'ADMIN';

export type StudentType = 'HOSTELLER' | 'DAY_SCHOLAR';

export interface HostelDetails {
  hostelId: string;
  hostelName: string;
  block: string;
  floor: string;
  roomNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  collegeId: string;
  collegeName: string;
  studentId?: string;
  studentType?: StudentType;
  hostelDetails?: HostelDetails;
  canteenId?: string; // For Canteen Staff
  canteenName?: string;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  campus: string;
  isActive: boolean;
}

export interface Hostel {
  id: string;
  collegeId: string;
  name: string;
  blocks: string[];
  floors: number;
  totalRooms: number;
}

export type CanteenStatus = 'OPEN' | 'CLOSED' | 'BUSY';

export interface Canteen {
  id: string;
  collegeId: string;
  name: string;
  tagline: string;
  image: string;
  openTime: string;
  closeTime: string;
  status: CanteenStatus;
  avgPrepTimeMinutes: number;
  rating: number;
  totalReviews: number;
  hostelDeliveryEnabled: boolean;
  deliveryTimings: string;
  maxDeliveryDistanceMeters: number;
  currentQueueCount: number;
}

export type FoodCategory =
  | 'FAST_FOOD'
  | 'PIZZA'
  | 'SNACKS'
  | 'MEALS'
  | 'BEVERAGES'
  | 'CHINESE'
  | 'TEA_COFFEE'
  | 'DESSERTS';

export interface MenuItem {
  id: string;
  canteenId: string;
  canteenName?: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  category: FoodCategory;
  image: string;
  rating: number;
  calories?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions: string;
}

export type OrderType = 'CANTEEN_PICKUP' | 'HOSTEL_DELIVERY';

export type OrderStatus =
  | 'PENDING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PICKED_UP'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_INITIATED'
  | 'REFUNDED';

export type DeliveryStatus =
  | 'NONE'
  | 'PENDING_CANTEEN_CONFIRMATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_PICKUP';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  isVeg: boolean;
  subtotal: number;
}

export interface OrderDeliveryDetails {
  hostelName: string;
  block: string;
  floor: string;
  roomNumber: string;
  deliveryStatus: DeliveryStatus;
  deliveryStaffId?: string;
  deliveryStaffName?: string;
  deliveryStaffPhone?: string;
  deliveredAt?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderRating {
  foodRating: number;
  canteenRating: number;
  deliveryRating?: number;
  reviewText?: string;
  createdAt: string;
}

export interface Order {
  id: string; // e.g. CB-20260929-00125
  userId: string;
  studentName: string;
  studentPhone: string;
  studentRoll: string;
  studentType: StudentType;
  collegeId: string;
  canteenId: string;
  canteenName: string;
  items: OrderItem[];
  foodSubtotal: number;
  platformFee: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  tax: number;
  totalAmount: number;
  orderType: OrderType;
  deliveryDetails?: OrderDeliveryDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  queuePosition: number;
  prepTimeMinutes: number;
  estimatedReadyTime: string;
  delayReason?: string;
  delayMinutes?: number;
  rejectionReason?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: 'NONE' | 'INITIATED' | 'COMPLETED';
  rating?: OrderRating;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export interface DeliveryPricingRule {
  id: string;
  minAmount: number;
  maxAmount: number | null; // null means and above
  charge: number;
}

export interface PlatformFeeConfig {
  model: 'FIXED' | 'PERCENTAGE' | 'HYBRID';
  fixedFee: number; // e.g. 5
  percentage: number; // e.g. 2%
  fixedBase: number; // e.g. 3
}

export interface CancellationPolicy {
  allowBeforeAcceptance: boolean;
  allowAfterAcceptance: boolean;
  cancellationFee: number; // Fixed amount or 0
  refundPercentage: number; // 100 or 80 etc
  disableAfterPreparingStarts: boolean;
}

export interface AppSettings {
  platformFee: PlatformFeeConfig;
  deliveryPricingRules: DeliveryPricingRule[];
  cancellationPolicy: CancellationPolicy;
  taxGstPercentage: number;
  allowCashOnPickup: boolean;
  serviceTaxEnabled: boolean;
  minOrderAmount: number;
  maxOrderAmount: number;
  autoRefundOnReject: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  description: string;
  isActive: boolean;
  expiresAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: Role;
  orderId?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'ALERT' | 'INFO';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  details: string;
  timestamp: string;
}
