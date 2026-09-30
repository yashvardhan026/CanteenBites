import { NextRequest, NextResponse } from 'next/server';
import { getCanteens, getCanteenById, updateCanteen, getCollege, getHostels, createAuditLog } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const canteen = getCanteenById(id);
      if (!canteen) {
        return NextResponse.json({ success: false, error: 'Canteen not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, canteen });
    }

    const canteens = getCanteens();
    const college = getCollege();
    const hostels = getHostels();

    return NextResponse.json({
      success: true,
      canteens,
      college,
      hostels,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates, adminUserId, adminName } = body;

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, error: 'Canteen ID and updates are required' },
        { status: 400 }
      );
    }

    const updated = updateCanteen(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Canteen not found' }, { status: 404 });
    }

    if (adminUserId) {
      createAuditLog({
        userId: adminUserId,
        userName: adminName || 'Admin',
        userRole: 'ADMIN',
        action: 'CANTEEN_SETTINGS_UPDATED',
        details: `Updated Canteen ${updated.name}: ${JSON.stringify(updates)}`,
      });
    }

    return NextResponse.json({ success: true, canteen: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
