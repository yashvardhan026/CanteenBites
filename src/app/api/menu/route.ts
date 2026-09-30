import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, createAuditLog } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const canteenId = searchParams.get('canteenId') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search')?.toLowerCase() || undefined;

    let items = getMenuItems(canteenId);

    if (category && category !== 'ALL') {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.canteenName && item.canteenName.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, canteenId, price, isVeg, prepTimeMinutes, category, description, image, user } = body;

    if (!name || !canteenId || price === undefined || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, Canteen ID, Price, and Category are required' },
        { status: 400 }
      );
    }

    const newItem = createMenuItem({
      name,
      canteenId,
      description: description || '',
      price: Number(price),
      isVeg: Boolean(isVeg),
      isAvailable: true,
      prepTimeMinutes: Number(prepTimeMinutes) || 10,
      category,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      calories: 300,
    });

    if (user) {
      createAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'MENU_ITEM_CREATED',
        details: `Created menu item "${newItem.name}" (₹${newItem.price}) for Canteen ${newItem.canteenId}`,
      });
    }

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates, user } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Item ID and updates required' }, { status: 400 });
    }

    const updated = updateMenuItem(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Menu item not found' }, { status: 404 });
    }

    if (user) {
      createAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'MENU_ITEM_UPDATED',
        details: `Updated menu item "${updated.name}": ${JSON.stringify(updates)}`,
      });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    const deleted = deleteMenuItem(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
