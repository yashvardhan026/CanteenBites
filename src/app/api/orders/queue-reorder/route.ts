import { NextRequest, NextResponse } from 'next/server';
import { reorderQueue } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { canteenId, orderIds, user } = body;

    if (!canteenId || !orderIds || !Array.isArray(orderIds)) {
      return NextResponse.json(
        { success: false, error: 'Canteen ID and array of order IDs are required.' },
        { status: 400 }
      );
    }

    if (!user || !['CANTEEN_STAFF', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only Canteen Staff or Admins can reorder queues.' },
        { status: 403 }
      );
    }

    const updatedOrders = reorderQueue(canteenId, orderIds, user);

    return NextResponse.json({
      success: true,
      message: 'Queue priority updated and logged in audit trail.',
      orders: updatedOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
