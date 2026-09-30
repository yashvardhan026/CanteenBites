import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getUsers, getCanteens, getMenuItems } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const orders = getOrders();
    const users = getUsers();
    const canteens = getCanteens();
    const menuItems = getMenuItems();

    const students = users.filter((u) => u.role === 'STUDENT');
    const totalOrdersCount = orders.length;

    // Financial aggregation
    let grossOrderValue = 0;
    let totalPlatformFees = 0;
    let totalDeliveryRevenue = 0;
    let totalRefunds = 0;
    let totalDiscounts = 0;

    // Today's orders
    const todayStr = new Date().toISOString().slice(0, 10);
    let todayOrdersCount = 0;
    let todayGOV = 0;
    let pendingOrdersCount = 0;

    // Item popularity map
    const itemPopularity: Record<string, { name: string; count: number; revenue: number; isVeg: boolean }> = {};

    // Canteen breakdown map
    const canteenRevenueMap: Record<string, { name: string; orders: number; revenue: number }> = {};
    canteens.forEach((c) => {
      canteenRevenueMap[c.id] = { name: c.name, orders: 0, revenue: 0 };
    });

    // Hourly distribution (0 to 23)
    const hourlyOrders: number[] = new Array(24).fill(0);

    orders.forEach((o) => {
      grossOrderValue += o.foodSubtotal;
      totalPlatformFees += o.platformFee;
      totalDeliveryRevenue += o.deliveryCharge;
      totalDiscounts += o.discount;

      if (o.refundAmount && (o.refundStatus === 'INITIATED' || o.refundStatus === 'COMPLETED')) {
        totalRefunds += o.refundAmount;
      }

      if (o.status === 'PENDING_ACCEPTANCE') {
        pendingOrdersCount++;
      }

      const orderDateStr = o.createdAt.slice(0, 10);
      if (orderDateStr === todayStr) {
        todayOrdersCount++;
        todayGOV += o.totalAmount;
      }

      const orderHour = new Date(o.createdAt).getHours();
      if (orderHour >= 0 && orderHour < 24) {
        hourlyOrders[orderHour]++;
      }

      if (canteenRevenueMap[o.canteenId]) {
        canteenRevenueMap[o.canteenId].orders++;
        canteenRevenueMap[o.canteenId].revenue += o.foodSubtotal;
      }

      o.items.forEach((item) => {
        if (!itemPopularity[item.name]) {
          itemPopularity[item.name] = {
            name: item.name,
            count: 0,
            revenue: 0,
            isVeg: item.isVeg,
          };
        }
        itemPopularity[item.name].count += item.quantity;
        itemPopularity[item.name].revenue += item.subtotal;
      });
    });

    // Net CanteenBites revenue: Platform fees + Delivery revenue - Platform portion of refunds
    const netPlatformRevenue = totalPlatformFees + totalDeliveryRevenue;

    const popularItems = Object.values(itemPopularity)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Peak hours analysis
    let maxHour = 12;
    let maxHourOrders = 0;
    hourlyOrders.forEach((count, hour) => {
      if (count > maxHourOrders) {
        maxHourOrders = count;
        maxHour = hour;
      }
    });

    const formatHour = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 || 12;
      return `${formatted} ${ampm}`;
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalStudents: students.length,
        totalCanteens: canteens.length,
        totalMenuItems: menuItems.length,
        totalOrders: totalOrdersCount,
        todayOrders: todayOrdersCount,
        todayGOV,
        pendingOrders: pendingOrdersCount,
        financials: {
          grossOrderValue,
          totalPlatformFees,
          totalDeliveryRevenue,
          totalDiscounts,
          totalRefunds,
          netPlatformRevenue,
        },
        peakHour: `${formatHour(maxHour)} (${maxHourOrders} orders)`,
      },
      popularItems,
      canteenBreakdown: Object.values(canteenRevenueMap),
      hourlyDistribution: hourlyOrders.map((count, hour) => ({
        hour: formatHour(hour),
        count,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
