import { NextRequest, NextResponse } from 'next/server';
import { getCoupons, getCouponByCode, createCoupon, updateCoupon, createAuditLog } from '@/lib/db';
import { calculateCouponDiscount } from '@/lib/calculations';

export async function GET() {
  try {
    const coupons = getCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, subtotal, coupon, user } = body;

    // Validate coupon code against subtotal
    if (action === 'VALIDATE') {
      if (!code) {
        return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 });
      }

      const match = getCouponByCode(code);
      if (!match) {
        return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 });
      }

      const res = calculateCouponDiscount(Number(subtotal) || 0, match);
      if (res.error) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        coupon: match,
        discount: res.discount,
        message: `Applied ${match.code}! Saved ₹${res.discount}`,
      });
    }

    // Admin creates new coupon
    if (action === 'CREATE') {
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Only admins can create coupons' }, { status: 403 });
      }

      const newCoupon = createCoupon(coupon);
      createAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: 'ADMIN',
        action: 'COUPON_CREATED',
        details: `Created coupon ${newCoupon.code} (${newCoupon.discountValue}% / ₹${newCoupon.discountValue})`,
      });

      return NextResponse.json({ success: true, coupon: newCoupon });
    }

    // Admin updates coupon
    if (action === 'UPDATE') {
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ success: false, error: 'Only admins can update coupons' }, { status: 403 });
      }

      const updated = updateCoupon(code, coupon);
      return NextResponse.json({ success: true, coupon: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
