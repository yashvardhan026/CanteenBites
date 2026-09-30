import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserByPhone, getCollege, getHostels } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      studentId,
      studentType,
      hostelId,
      hostelName,
      block,
      floor,
      roomNumber,
    } = body;

    if (!name || !email || !phone || !studentId || !studentType) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required registration fields.' },
        { status: 400 }
      );
    }

    if (studentType === 'HOSTELLER') {
      if (!hostelName || !roomNumber) {
        return NextResponse.json(
          { success: false, error: 'Hostellers must provide Hostel Name and Room Number.' },
          { status: 400 }
        );
      }
    }

    // Check duplicate
    if (getUserByEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }
    if (getUserByPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'An account with this mobile number already exists.' },
        { status: 400 }
      );
    }

    const college = getCollege();
    const demoOtp = '123456';

    const newUser = createUser({
      name,
      email,
      phone,
      role: 'STUDENT',
      collegeId: college.id,
      collegeName: college.name,
      studentId,
      studentType,
      hostelDetails:
        studentType === 'HOSTELLER'
          ? {
              hostelId: hostelId || 'hostel-1',
              hostelName: hostelName,
              block: block || hostelName,
              floor: floor || '1st Floor',
              roomNumber,
            }
          : undefined,
      isVerified: false, // requires OTP verification
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent to mobile number',
      demoOtp, // Provided for user convenience
      userId: newUser.id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
