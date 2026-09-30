import { NextRequest, NextResponse } from 'next/server';
import {
  getOrderById,
  updateOrder,
  getAppSettings,
  createNotification,
  createAuditLog,
} from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const body = await req.json();
    const { action, payload, user } = body;

    const settings = getAppSettings();
    let updates: any = {};
    const now = new Date();

    switch (action) {
      case 'ACCEPT': {
        const prepMins = Number(payload?.prepTimeMinutes) || 15;
        const readyTime = new Date(now.getTime() + prepMins * 60000).toISOString();
        updates = {
          status: 'ACCEPTED' as OrderStatus,
          prepTimeMinutes: prepMins,
          estimatedReadyTime: readyTime,
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Order Accepted ✅',
          message: `${order.canteenName} accepted your order. Estimated preparation time: ${prepMins} minutes.`,
          type: 'ORDER',
        });
        break;
      }

      case 'REJECT': {
        const reason = payload?.reason || 'Canteen is at maximum capacity';
        updates = {
          status: 'REJECTED' as OrderStatus,
          rejectionReason: reason,
          refundAmount: order.totalAmount,
          refundStatus: 'INITIATED',
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Order Rejected ❌',
          message: `Sorry, your order was rejected by ${order.canteenName}. Reason: ${reason}. A full refund of ₹${order.totalAmount} has been initiated.`,
          type: 'ORDER',
        });
        break;
      }

      case 'PREPARE': {
        updates = {
          status: 'PREPARING' as OrderStatus,
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Cooking Started 🍳',
          message: `The kitchen is now preparing your fresh order.`,
          type: 'ORDER',
        });
        break;
      }

      case 'READY': {
        updates = {
          status: 'READY' as OrderStatus,
        };

        if (order.orderType === 'CANTEEN_PICKUP') {
          createNotification({
            userId: order.userId,
            role: 'STUDENT',
            orderId: order.id,
            title: 'Order is Ready! 🛎️',
            message: `Your food is hot and ready! Please collect your order from the ${order.canteenName} pickup counter.`,
            type: 'ORDER',
          });
        } else {
          createNotification({
            userId: order.userId,
            role: 'STUDENT',
            orderId: order.id,
            title: 'Order is Ready for Delivery! 📦',
            message: `Your food is ready and waiting for the delivery agent to pick it up.`,
            type: 'DELIVERY',
          });
        }
        break;
      }

      case 'DELAY': {
        const extraMinutes = Number(payload?.extraMinutes) || 10;
        const delayReason = payload?.reason || 'High kitchen rush';
        const currentReadyMs = new Date(order.estimatedReadyTime).getTime();
        const newReady = new Date(
          (isNaN(currentReadyMs) ? now.getTime() : Math.max(now.getTime(), currentReadyMs)) +
            extraMinutes * 60000
        ).toISOString();

        updates = {
          estimatedReadyTime: newReady,
          delayMinutes: (order.delayMinutes || 0) + extraMinutes,
          delayReason,
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Order Delay Notice ⏳',
          message: `Your order is taking slightly longer than expected due to: ${delayReason}. New estimated ready time updated.`,
          type: 'ORDER',
        });
        break;
      }

      case 'PICKUP': {
        updates = {
          status: 'PICKED_UP' as OrderStatus,
        };
        // Auto mark completed
        setTimeout(() => {
          updateOrder(order.id, { status: 'COMPLETED' });
        }, 1500);

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Order Picked Up ✨',
          message: `Thank you for picking up your order from ${order.canteenName}. Enjoy your food!`,
          type: 'ORDER',
        });
        break;
      }

      case 'ACCEPT_DELIVERY': {
        updates = {
          deliveryDetails: {
            ...order.deliveryDetails!,
            deliveryStatus: 'ACCEPTED',
          },
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Hostel Delivery Accepted 🚪',
          message: `Your hostel room delivery request to ${order.deliveryDetails?.hostelName}, Room ${order.deliveryDetails?.roomNumber} has been accepted.`,
          type: 'DELIVERY',
        });
        break;
      }

      case 'REJECT_DELIVERY': {
        // Canteen rejects room delivery. Delivery charge is refunded, order switches to pickup
        const deliveryRefund = order.deliveryCharge || 0;
        updates = {
          orderType: 'CANTEEN_PICKUP',
          totalAmount: Math.max(0, order.totalAmount - deliveryRefund),
          deliveryCharge: 0,
          deliveryDetails: {
            ...order.deliveryDetails!,
            deliveryStatus: 'REJECTED',
          },
          refundAmount: (order.refundAmount || 0) + deliveryRefund,
          refundStatus: deliveryRefund > 0 ? 'INITIATED' : 'NONE',
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Hostel Delivery Declined ⚠️',
          message: `The canteen has rejected hostel room delivery for this order due to capacity. Your order is now set for Canteen Pickup${
            deliveryRefund > 0 ? ` and ₹${deliveryRefund} delivery charge has been refunded.` : '.'
          }`,
          type: 'DELIVERY',
        });
        break;
      }

      case 'ASSIGN_DELIVERY': {
        const { staffId, staffName, staffPhone } = payload;
        updates = {
          deliveryDetails: {
            ...order.deliveryDetails!,
            deliveryStatus: 'ASSIGNED',
            deliveryStaffId: staffId,
            deliveryStaffName: staffName,
            deliveryStaffPhone: staffPhone,
          },
        };

        createNotification({
          userId: staffId,
          role: 'DELIVERY_STAFF',
          orderId: order.id,
          title: 'New Delivery Assigned 🛵',
          message: `Order ${order.id} for Room ${order.deliveryDetails?.roomNumber} has been assigned to you.`,
          type: 'DELIVERY',
        });
        break;
      }

      case 'OUT_FOR_DELIVERY': {
        updates = {
          status: 'OUT_FOR_DELIVERY' as OrderStatus,
          deliveryDetails: {
            ...order.deliveryDetails!,
            deliveryStatus: 'OUT_FOR_DELIVERY',
          },
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Out for Delivery 🛵',
          message: `Your food has been picked up by ${order.deliveryDetails?.deliveryStaffName || 'delivery agent'} and is on its way to your room!`,
          type: 'DELIVERY',
        });
        break;
      }

      case 'DELIVERED': {
        updates = {
          status: 'DELIVERED' as OrderStatus,
          deliveryDetails: {
            ...order.deliveryDetails!,
            deliveryStatus: 'DELIVERED',
            deliveredAt: now.toISOString(),
          },
        };

        // Auto mark completed
        setTimeout(() => {
          updateOrder(order.id, { status: 'COMPLETED' });
        }, 1500);

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Delivered Successfully 🎉',
          message: `Your order has been delivered to ${order.deliveryDetails?.roomNumber}. Enjoy your meal! Please rate your experience.`,
          type: 'DELIVERY',
        });
        break;
      }

      case 'CANCEL': {
        const policy = settings.cancellationPolicy;
        const isPreparingOrLater = ['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
          order.status
        );

        if (isPreparingOrLater && policy.disableAfterPreparingStarts) {
          return NextResponse.json(
            {
              success: false,
              error: 'Order cannot be cancelled once cooking or preparation has started.',
            },
            { status: 400 }
          );
        }

        if (order.status === 'ACCEPTED' && !policy.allowAfterAcceptance) {
          return NextResponse.json(
            {
              success: false,
              error: 'Order cannot be cancelled once accepted by the canteen.',
            },
            { status: 400 }
          );
        }

        let refund = order.totalAmount;
        if (order.status === 'ACCEPTED') {
          // Deduct cancellation fee or apply refund %
          const deductFee = policy.cancellationFee || 0;
          const percentageRefund = Math.round((order.totalAmount * (policy.refundPercentage || 100)) / 100);
          refund = Math.max(0, Math.min(percentageRefund, order.totalAmount - deductFee));
        }

        updates = {
          status: 'CANCELLED' as OrderStatus,
          cancellationReason: payload?.reason || 'Cancelled by student',
          refundAmount: refund,
          refundStatus: refund > 0 ? 'INITIATED' : 'NONE',
        };

        createNotification({
          userId: order.userId,
          role: 'STUDENT',
          orderId: order.id,
          title: 'Order Cancelled',
          message: `Your order ${order.id} has been cancelled.${
            refund > 0 ? ` Refund of ₹${refund} has been initiated.` : ''
          }`,
          type: 'ORDER',
        });
        break;
      }

      case 'RATE': {
        const { foodRating, canteenRating, deliveryRating, reviewText } = payload;
        updates = {
          rating: {
            foodRating: Number(foodRating) || 5,
            canteenRating: Number(canteenRating) || 5,
            deliveryRating: deliveryRating ? Number(deliveryRating) : undefined,
            reviewText: reviewText || '',
            createdAt: now.toISOString(),
          },
        };
        break;
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    const updated = updateOrder(params.id, updates);

    if (user) {
      createAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: `ORDER_${action}`,
        details: `Order ${params.id} updated via action ${action}. Updates: ${JSON.stringify(updates)}`,
      });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
