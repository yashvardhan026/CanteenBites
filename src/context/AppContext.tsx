'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  AppSettings,
  Canteen,
  CartItem,
  Coupon,
  MenuItem,
  Notification,
  Order,
  OrderType,
  PaymentMethod,
  Role,
  User,
} from '@/types';
import { DEFAULT_APP_SETTINGS } from '@/lib/constants';
import {
  calculateCouponDiscount,
  calculateDeliveryCharge,
  calculatePlatformFee,
} from '@/lib/calculations';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (roleOrUserId: string) => Promise<void>;
  canteens: Canteen[];
  selectedCanteen: Canteen | null;
  setSelectedCanteen: (canteen: Canteen | null) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  hostelDetails: {
    hostelName: string;
    block: string;
    floor: string;
    roomNumber: string;
  };
  setHostelDetails: React.Dispatch<
    React.SetStateAction<{
      hostelName: string;
      block: string;
      floor: string;
      roomNumber: string;
    }>
  >;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  notifications: Notification[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  settings: AppSettings;
  refreshSettings: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCanteens: () => Promise<void>;
  placeOrder: (paymentMethod: PaymentMethod) => Promise<{ success: boolean; order?: Order; error?: string }>;
  toasts: Toast[];
  showToast: (title: string, message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  activeNavTab: 'home' | 'search' | 'cart' | 'orders' | 'profile';
  setActiveNavTab: (tab: 'home' | 'search' | 'cart' | 'orders' | 'profile') => void;
  billingSummary: {
    subtotal: number;
    platformFee: number;
    deliveryCharge: number;
    discount: number;
    tax: number;
    total: number;
  };
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('CANTEEN_PICKUP');
  const [hostelDetails, setHostelDetails] = useState({
    hostelName: 'J-Block Boys Hostel',
    block: 'Block B',
    floor: '2nd Floor',
    roomNumber: '204',
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'search' | 'cart' | 'orders' | 'profile'>('home');

  const showToast = useCallback((title: string, message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  }, []);

  // Fetch Canteens
  const refreshCanteens = useCallback(async () => {
    try {
      const res = await fetch('/api/canteens');
      const data = await res.json();
      if (data.success && data.canteens) {
        setCanteens(data.canteens);
        if (!selectedCanteen && data.canteens.length > 0) {
          setSelectedCanteen(data.canteens[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load canteens', err);
    }
  }, [selectedCanteen]);

  // Fetch Settings
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  }, []);

  // Fetch Orders
  const refreshOrders = useCallback(async () => {
    try {
      let url = '/api/orders';
      if (user) {
        if (user.role === 'STUDENT') url += `?userId=${user.id}`;
        else if (user.role === 'CANTEEN_STAFF' && user.canteenId) url += `?canteenId=${user.canteenId}`;
        else if (user.role === 'DELIVERY_STAFF') url += `?deliveryStaffId=${user.id}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
        // If there's an active tracked order, keep it fresh
        if (activeOrder) {
          const match = data.orders.find((o: Order) => o.id === activeOrder.id);
          if (match) setActiveOrder(match);
        }
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, [user, activeOrder]);

  // Fetch Notifications
  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}&role=${user.role}`);
      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  }, [user]);

  // Switch role / Quick Login
  const switchRole = useCallback(
    async (roleOrUserId: string) => {
      try {
        const body = roleOrUserId.startsWith('user-')
          ? { userId: roleOrUserId }
          : { role: roleOrUserId as Role };

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.hostelDetails) {
            setHostelDetails({
              hostelName: data.user.hostelDetails.hostelName,
              block: data.user.hostelDetails.block,
              floor: data.user.hostelDetails.floor,
              roomNumber: data.user.hostelDetails.roomNumber,
            });
            setOrderType('HOSTEL_DELIVERY');
          } else {
            setOrderType('CANTEEN_PICKUP');
          }
          showToast(`Switched Role`, `Logged in as ${data.user.name} (${data.user.role})`, 'success');
        }
      } catch (err) {
        showToast('Login Error', 'Failed to switch user account', 'error');
      }
    },
    [showToast]
  );

  // Initialize initial user & data
  useEffect(() => {
    refreshCanteens();
    refreshSettings();
    // Default to Aarav Sharma (Hosteller)
    switchRole('user-student-hosteller');
  }, []);

  // When user changes, reload user-specific data
  useEffect(() => {
    if (user) {
      refreshOrders();
      refreshNotifications();
    }
  }, [user]);

  // Live SSE listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const { type, payload } = parsed;

          if (type === 'ORDER_CREATED' || type === 'ORDER_UPDATED' || type === 'QUEUE_REORDERED') {
            refreshOrders();
            refreshCanteens();
            if (type === 'ORDER_UPDATED' && payload?.id) {
              if (activeOrder && activeOrder.id === payload.id) {
                setActiveOrder(payload);
              }
              showToast(
                `Order Update: ${payload.id}`,
                `Status: ${payload.status?.replace('_', ' ')}`,
                'info'
              );
            }
          }

          if (type === 'NOTIFICATION_CREATED') {
            if (user && (payload.userId === user.id || payload.role === user.role)) {
              setNotifications((prev) => [payload, ...prev]);
              showToast(payload.title, payload.message, 'info');
            }
          }

          if (type === 'SETTINGS_UPDATED') {
            setSettings(payload);
          }

          if (type === 'CANTEEN_UPDATED') {
            refreshCanteens();
          }
        } catch (e) {
          // ignore heartbeat / ping
        }
      };

      eventSource.onerror = () => {
        // Fallback polling if SSE is closed
        eventSource?.close();
      };
    } catch (e) {
      console.warn('SSE connection failed, falling back to interval polling');
    }

    // Polling backup every 8 seconds
    const interval = setInterval(() => {
      refreshOrders();
      refreshCanteens();
    }, 8000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
    };
  }, [user, activeOrder, refreshOrders, refreshCanteens, showToast]);

  // Cart operations
  const addToCart = useCallback(
    (item: MenuItem, specialInstructions: string = '') => {
      // If adding from a different canteen, prompt or clear
      if (selectedCanteen && selectedCanteen.id !== item.canteenId) {
        const targetCanteen = canteens.find((c) => c.id === item.canteenId);
        if (targetCanteen) setSelectedCanteen(targetCanteen);
        setCart([{ menuItem: item, quantity: 1, specialInstructions }]);
        showToast('Cart Updated', `Switched to ${item.canteenName || 'canteen'}. Added ${item.name}`, 'info');
        return;
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex((ci) => ci.menuItem.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += 1;
          if (specialInstructions) {
            updated[existingIndex].specialInstructions = specialInstructions;
          }
          return updated;
        } else {
          return [...prev, { menuItem: item, quantity: 1, specialInstructions }];
        }
      });
      showToast('Added to Cart', `${item.name} added`, 'success');
    },
    [selectedCanteen, canteens, showToast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        return prev.filter((ci) => ci.menuItem.id !== itemId);
      }
      return prev.map((ci) => (ci.menuItem.id === itemId ? { ...ci, quantity: qty } : ci));
    });
  }, []);

  const updateSpecialInstructions = useCallback((itemId: string, instructions: string) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, specialInstructions: instructions } : ci
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  // Coupon
  const applyCoupon = useCallback(
    async (code: string) => {
      const subtotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
      try {
        const res = await fetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'VALIDATE', code, subtotal }),
        });
        const data = await res.json();
        if (data.success && data.coupon) {
          setAppliedCoupon(data.coupon);
          showToast('Coupon Applied 🎉', data.message, 'success');
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.error || 'Failed to apply coupon' };
        }
      } catch (err: any) {
        return { success: false, message: 'Network error validating coupon' };
      }
    },
    [cart, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount removed from cart', 'info');
  }, [showToast]);

  // Billing Calculations
  const billingSummary = useMemo(() => {
    const subtotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
    const platformFee = subtotal > 0 ? calculatePlatformFee(subtotal, settings.platformFee) : 0;
    const isDelivery = orderType === 'HOSTEL_DELIVERY';
    const deliveryCharge =
      subtotal > 0
        ? calculateDeliveryCharge(subtotal, settings.deliveryPricingRules, isDelivery)
        : 0;

    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      const res = calculateCouponDiscount(subtotal, appliedCoupon);
      discount = res.discount;
    }

    let tax = 0;
    if (settings.serviceTaxEnabled && settings.taxGstPercentage > 0 && subtotal > 0) {
      tax = Math.round((subtotal * settings.taxGstPercentage) / 100);
    }

    const total = Math.max(0, subtotal + platformFee + deliveryCharge + tax - discount);

    return {
      subtotal,
      platformFee,
      deliveryCharge,
      discount,
      tax,
      total,
    };
  }, [cart, orderType, settings, appliedCoupon]);

  // Place order
  const placeOrder = useCallback(
    async (paymentMethod: PaymentMethod) => {
      if (!user) {
        return { success: false, error: 'Please log in to place an order.' };
      }
      if (cart.length === 0) {
        return { success: false, error: 'Cart is empty.' };
      }
      if (!selectedCanteen) {
        return { success: false, error: 'Please select a canteen.' };
      }

      try {
        const orderPayload = {
          userId: user.id,
          studentName: user.name,
          studentPhone: user.phone,
          studentRoll: user.studentId || '22BCSE104',
          studentType: user.studentType || 'HOSTELLER',
          collegeId: user.collegeId,
          canteenId: selectedCanteen.id,
          items: cart,
          orderType,
          deliveryDetails:
            orderType === 'HOSTEL_DELIVERY'
              ? {
                  hostelName: hostelDetails.hostelName,
                  block: hostelDetails.block,
                  floor: hostelDetails.floor,
                  roomNumber: hostelDetails.roomNumber,
                }
              : undefined,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          idempotencyKey: `${user.id}-${Date.now()}`,
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();
        if (data.success && data.order) {
          triggerCelebration();
          clearCart();
          setActiveOrder(data.order);
          refreshOrders();
          setActiveNavTab('orders');
          showToast('Order Placed Successfully 🎉', `Order ID: ${data.order.id}`, 'success');
          return { success: true, order: data.order };
        } else {
          showToast('Order Failed', data.error || 'Failed to place order', 'error');
          return { success: false, error: data.error };
        }
      } catch (err: any) {
        showToast('Network Error', 'Please check your connection and retry.', 'error');
        return { success: false, error: err.message };
      }
    },
    [user, cart, selectedCanteen, orderType, hostelDetails, appliedCoupon, clearCart, triggerCelebration, refreshOrders, showToast]
  );

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        canteens,
        selectedCanteen,
        setSelectedCanteen,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateSpecialInstructions,
        clearCart,
        orderType,
        setOrderType,
        hostelDetails,
        setHostelDetails,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        activeOrder,
        setActiveOrder,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        settings,
        refreshSettings,
        refreshOrders,
        refreshCanteens,
        placeOrder,
        toasts,
        showToast,
        removeToast,
        activeNavTab,
        setActiveNavTab,
        billingSummary,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
