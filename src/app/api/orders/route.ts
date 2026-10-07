import { NextRequest, NextResponse } from 'next/server';
import {
  getOrders,
  createOrder,
  getCanteenById,
  getAppSettings,
  getCouponByCode,
  getMenuItems,
} from '@/lib/db';
import {
  calculateDeliveryCharge,
  calculatePlatformFee,
  calculateCouponDiscount,
  calculateSmartEstimatedTime,
} from '@/lib/calculations';
import { CartItem, OrderType, PaymentMethod } from '@/types';

// In-memory idempotency cache to prevent duplicate accidental double-taps
const recentOrderKeys = new Map<string, number>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const canteenId = searchParams.get('canteenId') || undefined;
    const status = searchParams.get('status') || undefined;
    const orderType = searchParams.get('orderType') || undefined;
    const deliveryStaffId = searchParams.get('deliveryStaffId') || undefined;

    const orders = getOrders({
      userId,
      canteenId,
      status,
      orderType,
      deliveryStaffId,
    });

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      studentName,
      studentPhone,
      studentRoll,
      studentType,
      collegeId,
      canteenId,
      items, // CartItem[]
      orderType, // 'CANTEEN_PICKUP' | 'HOSTEL_DELIVERY'
      deliveryDetails,
      paymentMethod,
      transactionId,
      couponCode,
      idempotencyKey,
    } = body;

    // Prevent duplicate submission within 4 seconds
    const dedupKey = idempotencyKey || `${userId}-${canteenId}-${JSON.stringify(items)}`;
    const lastSubmission = recentOrderKeys.get(dedupKey);
    const nowMs = Date.now();
    if (lastSubmission && nowMs - lastSubmission < 4000) {
      return NextResponse.json(
        { success: false, error: 'A duplicate order is currently processing. Please wait.' },
        { status: 429 }
      );
    }
    recentOrderKeys.set(dedupKey, nowMs);

    if (!userId || !canteenId || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty or required order info missing.' },
        { status: 400 }
      );
    }

    const canteen = getCanteenById(canteenId);
    if (!canteen) {
      return NextResponse.json({ success: false, error: 'Canteen not found.' }, { status: 404 });
    }

    if (canteen.status === 'CLOSED') {
      return NextResponse.json(
        { success: false, error: `${canteen.name} is currently closed.` },
        { status: 400 }
      );
    }

    // Verify hostel delivery availability
    if (orderType === 'HOSTEL_DELIVERY') {
      if (studentType !== 'HOSTELLER') {
        return NextResponse.json(
          { success: false, error: 'Hostel room delivery is only available for hostellers.' },
          { status: 400 }
        );
      }
      if (!canteen.hostelDeliveryEnabled) {
        return NextResponse.json(
          { success: false, error: `${canteen.name} currently does not provide hostel room delivery.` },
          { status: 400 }
        );
      }
      if (!deliveryDetails?.hostelName || !deliveryDetails?.roomNumber) {
        return NextResponse.json(
          { success: false, error: 'Please specify your Hostel and Room Number for delivery.' },
          { status: 400 }
        );
      }
    }

    // Fetch active settings and check item availability
    const settings = getAppSettings();
    const allCanteenMenu = getMenuItems(canteenId);

    let calculatedSubtotal = 0;
    let totalPrepMinutes = 0;

    const validatedItems = items.map((cartItem: CartItem) => {
      const dbItem = allCanteenMenu.find((m) => m.id === cartItem.menuItem.id);
      if (!dbItem || !dbItem.isAvailable) {
        throw new Error(
          `"${cartItem.menuItem.name}" is currently unavailable. Please remove it to proceed.`
        );
      }

      const itemTotal = dbItem.price * cartItem.quantity;
      calculatedSubtotal += itemTotal;
      totalPrepMinutes = Math.max(totalPrepMinutes, dbItem.prepTimeMinutes);

      return {
        menuItemId: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: cartItem.quantity,
        specialInstructions: cartItem.specialInstructions || '',
        isVeg: dbItem.isVeg,
        subtotal: itemTotal,
      };
    });

    if (calculatedSubtotal < settings.minOrderAmount) {
      return NextResponse.json(
        { success: false, error: `Minimum order amount is ₹${settings.minOrderAmount}.` },
        { status: 400 }
      );
    }

    if (calculatedSubtotal > settings.maxOrderAmount) {
      return NextResponse.json(
        { success: false, error: `Maximum order limit is ₹${settings.maxOrderAmount}.` },
        { status: 400 }
      );
    }

    // Platform Fee
    const platformFee = calculatePlatformFee(calculatedSubtotal, settings.platformFee);

    // Delivery Charge
    const isDelivery = orderType === 'HOSTEL_DELIVERY';
    const deliveryCharge = calculateDeliveryCharge(
      calculatedSubtotal,
      settings.deliveryPricingRules,
      isDelivery
    );

    // Coupon Discount
    let discount = 0;
    let validCouponCode = undefined;
    if (couponCode) {
      const couponObj = getCouponByCode(couponCode);
      const couponRes = calculateCouponDiscount(calculatedSubtotal, couponObj);
      if (couponRes.error) {
        return NextResponse.json({ success: false, error: couponRes.error }, { status: 400 });
      }
      discount = couponRes.discount;
      validCouponCode = couponObj?.code;
    }

    // Tax/GST
    let tax = 0;
    if (settings.serviceTaxEnabled && settings.taxGstPercentage > 0) {
      tax = Math.round((calculatedSubtotal * settings.taxGstPercentage) / 100);
    }

    const totalAmount = Math.max(0, calculatedSubtotal + platformFee + deliveryCharge + tax - discount);

    // Initial estimated time calculation
    const smartEta = calculateSmartEstimatedTime(
      canteen.currentQueueCount,
      validatedItems.length,
      canteen.avgPrepTimeMinutes
    );

    const newOrder = createOrder({
      userId,
      studentName,
      studentPhone: studentPhone || '+91 98765 00000',
      studentRoll: studentRoll || 'N/A',
      studentType: studentType || 'HOSTELLER',
      collegeId: collegeId || 'col-1',
      canteenId,
      canteenName: canteen.name,
      items: validatedItems,
      foodSubtotal: calculatedSubtotal,
      platformFee,
      deliveryCharge,
      discount,
      couponCode: validCouponCode,
      tax,
      totalAmount,
      orderType,
      deliveryDetails: isDelivery
        ? {
            hostelName: deliveryDetails.hostelName,
            block: deliveryDetails.block || deliveryDetails.hostelName,
            floor: deliveryDetails.floor || '1st Floor',
            roomNumber: deliveryDetails.roomNumber,
            deliveryStatus: 'PENDING_CANTEEN_CONFIRMATION',
          }
        : undefined,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod && paymentMethod.startsWith('CASH') ? 'PENDING' : 'COMPLETED',
      transactionId: transactionId || `TXN-${paymentMethod || 'UPI'}-${Date.now().toString().slice(-8)}`,
      status: 'PENDING_ACCEPTANCE',
      prepTimeMinutes: smartEta.minutesRemaining,
      estimatedReadyTime: smartEta.readyTimestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Order Placed Successfully 🎉',
      order: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
