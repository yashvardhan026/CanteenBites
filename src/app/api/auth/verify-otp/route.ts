import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, otp } = body;

    if (!userId || !otp) {
      return NextResponse.json(
        { success: false, error: 'User ID and OTP are required' },
        { status: 400 }
      );
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // In demo environment, accept 123456 or any 6-digit OTP
    if (otp !== '123456' && otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code. Please enter 123456.' },
        { status: 400 }
      );
    }

    const updatedUser = updateUser(userId, { isVerified: true });

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully!',
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
