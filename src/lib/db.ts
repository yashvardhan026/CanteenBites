import fs from 'fs';
import path from 'path';
import {
  AppSettings,
  AuditLog,
  Canteen,
  College,
  Coupon,
  Hostel,
  MenuItem,
  Notification,
  Order,
  User,
} from '@/types';
import {
  DEFAULT_APP_SETTINGS,
  INITIAL_COUPONS,
} from './constants';
import {
  SEED_CANTEENS,
  SEED_COLLEGE,
  SEED_HOSTELS,
  SEED_INITIAL_NOTIFICATIONS,
  SEED_INITIAL_ORDERS,
  SEED_MENU_ITEMS,
  SEED_USERS,
} from './seed-data';
import { recalculateQueuePositions } from './calculations';

interface DatabaseData {
  college: College;
  hostels: Hostel[];
  canteens: Canteen[];
  menuItems: MenuItem[];
  users: User[];
  orders: Order[];
  coupons: Coupon[];
  settings: AppSettings;
  notifications: Notification[];
  auditLogs: AuditLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'canteen_bites_db.json');

// In-memory cache for fast lookups
let cachedData: DatabaseData | null = null;

// Subscribers for real-time SSE updates
type Subscriber = (data: { type: string; payload: any }) => void;
const subscribers = new Set<Subscriber>();

export function subscribeToEvents(callback: Subscriber) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function broadcastEvent(type: string, payload: any) {
  subscribers.forEach((callback) => {
    try {
      callback({ type, payload });
    } catch (err) {
      console.error('Error broadcasting event:', err);
    }
  });
}

function loadInitialData(): DatabaseData {
  return {
    college: SEED_COLLEGE,
    hostels: SEED_HOSTELS,
    canteens: SEED_CANTEENS,
    menuItems: SEED_MENU_ITEMS,
    users: SEED_USERS,
    orders: SEED_INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    settings: DEFAULT_APP_SETTINGS,
    notifications: SEED_INITIAL_NOTIFICATIONS,
    auditLogs: [
      {
        id: 'audit-init',
        userId: 'user-admin',
        userName: 'Yash Vardhan',
        userRole: 'ADMIN',
        action: 'SYSTEM_INITIALIZED',
        details: 'CanteenBites system initialized with default configuration and seed data',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function getDb(): DatabaseData {
  if (cachedData) {
    return cachedData;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      cachedData = JSON.parse(raw);
      return cachedData!;
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  cachedData = loadInitialData();
  saveDb(cachedData);
  return cachedData;
}

function saveDb(data: DatabaseData): void {
  cachedData = data;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file to disk:', err);
  }
}

// ----------------- COLLEGES & HOSTELS -----------------
export function getCollege(): College {
  return getDb().college;
}

export function getHostels(): Hostel[] {
  return getDb().hostels;
}

// ----------------- CANTEENS -----------------
export function getCanteens(): Canteen[] {
  const db = getDb();
  // Sync queue count dynamically with active orders
  return db.canteens.map((c) => {
    const activeCount = db.orders.filter(
      (o) => o.canteenId === c.id && ['PENDING_ACCEPTANCE', 'ACCEPTED', 'PREPARING'].includes(o.status)
    ).length;
    return {
      ...c,
      currentQueueCount: activeCount,
    };
  });
}

export function getCanteenById(id: string): Canteen | null {
  const canteens = getCanteens();
  return canteens.find((c) => c.id === id) || null;
}

export function updateCanteen(id: string, updates: Partial<Canteen>): Canteen | null {
  const db = getDb();
  const index = db.canteens.findIndex((c) => c.id === id);
  if (index === -1) return null;

  db.canteens[index] = { ...db.canteens[index], ...updates };
  saveDb(db);
  broadcastEvent('CANTEEN_UPDATED', db.canteens[index]);
  return db.canteens[index];
}

// ----------------- USERS -----------------
export function getUsers(): User[] {
  return getDb().users;
}

export function getUserById(id: string): User | null {
  return getDb().users.find((u) => u.id === id) || null;
}

export function getUserByPhone(phone: string): User | null {
  return getDb().users.find((u) => u.phone === phone) || null;
}

export function getUserByEmail(email: string): User | null {
  return getDb().users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const db = getDb();
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  db.users[index] = { ...db.users[index], ...updates };
  saveDb(db);
  return db.users[index];
}

// ----------------- MENU ITEMS -----------------
export function getMenuItems(canteenId?: string): MenuItem[] {
  const db = getDb();
  if (canteenId) {
    return db.menuItems.filter((item) => item.canteenId === canteenId);
  }
  return db.menuItems;
}

export function getMenuItemById(id: string): MenuItem | null {
  return getDb().menuItems.find((item) => item.id === id) || null;
}

export function createMenuItem(itemData: Omit<MenuItem, 'id'>): MenuItem {
  const db = getDb();
  const newItem: MenuItem = {
    ...itemData,
    id: `item-${Date.now()}`,
  };
  db.menuItems.push(newItem);
  saveDb(db);
  broadcastEvent('MENU_UPDATED', { action: 'CREATED', item: newItem });
  return newItem;
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const db = getDb();
  const index = db.menuItems.findIndex((item) => item.id === id);
  if (index === -1) return null;

  db.menuItems[index] = { ...db.menuItems[index], ...updates };
  saveDb(db);
  broadcastEvent('MENU_UPDATED', { action: 'UPDATED', item: db.menuItems[index] });
  return db.menuItems[index];
}

export function deleteMenuItem(id: string): boolean {
  const db = getDb();
  const initialLength = db.menuItems.length;
  db.menuItems = db.menuItems.filter((item) => item.id !== id);
  if (db.menuItems.length < initialLength) {
    saveDb(db);
    broadcastEvent('MENU_UPDATED', { action: 'DELETED', id });
    return true;
  }
  return false;
}

// ----------------- ORDERS -----------------
export function getOrders(filters?: {
  userId?: string;
  canteenId?: string;
  status?: string;
  orderType?: string;
  deliveryStaffId?: string;
}): Order[] {
  const db = getDb();
  let result = [...db.orders];

  if (filters?.userId) {
    result = result.filter((o) => o.userId === filters.userId);
  }
  if (filters?.canteenId) {
    result = result.filter((o) => o.canteenId === filters.canteenId);
  }
  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status);
  }
  if (filters?.orderType) {
    result = result.filter((o) => o.orderType === filters.orderType);
  }
  if (filters?.deliveryStaffId) {
    result = result.filter(
      (o) => o.deliveryDetails?.deliveryStaffId === filters.deliveryStaffId
    );
  }

  // Recalculate queue positions
  return recalculateQueuePositions(result).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | null {
  const db = getDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;

  // Compute live queue position for this order
  const canteenOrders = db.orders.filter((o) => o.canteenId === order.canteenId);
  const updatedList = recalculateQueuePositions(canteenOrders);
  return updatedList.find((o) => o.id === id) || order;
}

export function createOrder(orderData: Omit<Order, 'id' | 'queuePosition' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
  const db = getDb();
  
  // Format Order ID: CB-YYYYMMDD-XXXXX
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `CB-${yyyymmdd}-${randomSuffix}`;

  const initialTimeline = [
    {
      status: orderData.status,
      timestamp: now.toISOString(),
      note: 'Order placed by student',
    },
  ];

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    queuePosition: 1, // Will be computed
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    timeline: initialTimeline,
  };

  db.orders.unshift(newOrder);

  // Recalculate queue positions for canteen
  const canteenOrders = db.orders.filter((o) => o.canteenId === newOrder.canteenId);
  const recomputed = recalculateQueuePositions(canteenOrders);
  
  // Update orders in db
  recomputed.forEach((rec) => {
    const idx = db.orders.findIndex((o) => o.id === rec.id);
    if (idx !== -1) db.orders[idx] = rec;
  });

  saveDb(db);

  // Create notifications
  createNotification({
    userId: newOrder.userId,
    role: 'STUDENT',
    orderId: newOrder.id,
    title: 'Order Placed Successfully 🎉',
    message: `Your order ${newOrder.id} for ₹${newOrder.totalAmount} has been sent to ${newOrder.canteenName}.`,
    type: 'ORDER',
  });

  // Notify Canteen Staff
  const canteenStaffList = db.users.filter(
    (u) => u.role === 'CANTEEN_STAFF' && u.canteenId === newOrder.canteenId
  );
  canteenStaffList.forEach((staff) => {
    createNotification({
      userId: staff.id,
      role: 'CANTEEN_STAFF',
      orderId: newOrder.id,
      title: 'New Order Received 🔔',
      message: `${newOrder.studentName} placed order ${newOrder.id} (${newOrder.items.length} items, ₹${newOrder.totalAmount}).`,
      type: 'ORDER',
    });
  });

  broadcastEvent('ORDER_CREATED', newOrder);
  return getOrderById(orderId) || newOrder;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | null {
  const db = getDb();
  const index = db.orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const prevOrder = db.orders[index];
  const now = new Date().toISOString();

  // If status changed, push to timeline
  let timeline = [...prevOrder.timeline];
  if (updates.status && updates.status !== prevOrder.status) {
    let note = '';
    if (updates.status === 'ACCEPTED') note = `Accepted. Prep time: ${updates.prepTimeMinutes || prevOrder.prepTimeMinutes} mins`;
    if (updates.status === 'REJECTED') note = `Rejected: ${updates.rejectionReason || 'Canteen capacity full'}`;
    if (updates.status === 'PREPARING') note = 'Kitchen started cooking';
    if (updates.status === 'READY') note = 'Order is ready for pickup/delivery';
    if (updates.status === 'OUT_FOR_DELIVERY') note = 'Delivery agent is on the way';
    if (updates.status === 'DELIVERED') note = 'Order delivered to room';
    if (updates.status === 'PICKED_UP') note = 'Picked up at canteen counter';
    if (updates.status === 'COMPLETED') note = 'Order completed';
    if (updates.status === 'CANCELLED') note = `Cancelled: ${updates.cancellationReason || 'Student request'}`;
    if (updates.status === 'REFUND_INITIATED') note = `Refund initiated: ₹${updates.refundAmount || prevOrder.totalAmount}`;
    if (updates.status === 'REFUNDED') note = 'Refund credited to original payment method';

    timeline.push({
      status: updates.status,
      timestamp: now,
      note,
    });
  }

  const updatedOrder: Order = {
    ...prevOrder,
    ...updates,
    timeline,
    updatedAt: now,
  };

  db.orders[index] = updatedOrder;

  // Recalculate queue positions
  const canteenOrders = db.orders.filter((o) => o.canteenId === updatedOrder.canteenId);
  const recomputed = recalculateQueuePositions(canteenOrders);
  recomputed.forEach((rec) => {
    const idx = db.orders.findIndex((o) => o.id === rec.id);
    if (idx !== -1) db.orders[idx] = rec;
  });

  saveDb(db);

  const finalOrder = getOrderById(id) || updatedOrder;
  broadcastEvent('ORDER_UPDATED', finalOrder);
  return finalOrder;
}

// ----------------- QUEUE RE-ORDERING -----------------
export function reorderQueue(
  canteenId: string,
  newOrderIdsOrder: string[],
  adminUser: { id: string; name: string; role: any }
): Order[] {
  const db = getDb();
  
  // Audit log entry
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    userId: adminUser.id,
    userName: adminUser.name,
    userRole: adminUser.role,
    action: 'QUEUE_PRIORITY_ADJUSTED',
    details: `Manual queue adjustment for Canteen ${canteenId}. New Order Sequence: ${newOrderIdsOrder.join(', ')}`,
    timestamp: new Date().toISOString(),
  });

  // Re-assign queue positions
  newOrderIdsOrder.forEach((orderId, index) => {
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      db.orders[orderIndex].queuePosition = index + 1;
    }
  });

  saveDb(db);
  broadcastEvent('QUEUE_REORDERED', { canteenId, orderIds: newOrderIdsOrder });
  return getOrders({ canteenId });
}

// ----------------- SETTINGS & RULES -----------------
export function getAppSettings(): AppSettings {
  return getDb().settings;
}

export function updateAppSettings(updates: Partial<AppSettings>, adminUser?: { id: string; name: string; role: any }): AppSettings {
  const db = getDb();
  db.settings = { ...db.settings, ...updates };

  if (adminUser) {
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: adminUser.role,
      action: 'SYSTEM_SETTINGS_UPDATED',
      details: `Updated settings: ${Object.keys(updates).join(', ')}`,
      timestamp: new Date().toISOString(),
    });
  }

  saveDb(db);
  broadcastEvent('SETTINGS_UPDATED', db.settings);
  return db.settings;
}

// ----------------- COUPONS -----------------
export function getCoupons(): Coupon[] {
  return getDb().coupons;
}

export function getCouponByCode(code: string): Coupon | null {
  const cleaned = code.trim().toUpperCase();
  return getDb().coupons.find((c) => c.code.toUpperCase() === cleaned) || null;
}

export function createCoupon(coupon: Coupon): Coupon {
  const db = getDb();
  db.coupons.push(coupon);
  saveDb(db);
  return coupon;
}

export function updateCoupon(code: string, updates: Partial<Coupon>): Coupon | null {
  const db = getDb();
  const index = db.coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
  if (index === -1) return null;
  db.coupons[index] = { ...db.coupons[index], ...updates };
  saveDb(db);
  return db.coupons[index];
}

// ----------------- NOTIFICATIONS -----------------
export function getNotifications(userId?: string, role?: string): Notification[] {
  const db = getDb();
  let list = [...db.notifications];
  if (userId) {
    list = list.filter((n) => n.userId === userId);
  } else if (role) {
    list = list.filter((n) => n.role === role);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createNotification(notifData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification {
  const db = getDb();
  const newNotif: Notification = {
    ...notifData,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(newNotif);
  saveDb(db);
  broadcastEvent('NOTIFICATION_CREATED', newNotif);
  return newNotif;
}

export function markNotificationAsRead(id: string): boolean {
  const db = getDb();
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- AUDIT LOGS -----------------
export function getAuditLogs(): AuditLog[] {
  return [...getDb().auditLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
  const db = getDb();
  const newLog: AuditLog = {
    ...log,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog);
  saveDb(db);
  return newLog;
}
