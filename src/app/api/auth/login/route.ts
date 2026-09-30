import { NextRequest, NextResponse } from 'next/server';
import { getUsers, getUserById, getUserByEmail, getUserByPhone } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, userId, role } = body;

    // Quick role switch by userId or role
    if (userId) {
      const user = getUserById(userId);
      if (user) {
        return NextResponse.json({ success: true, user });
      }
    }

    if (role) {
      const users = getUsers();
      const match = users.find((u) => u.role === role);
      if (match) {
        return NextResponse.json({ success: true, user: match });
      }
    }

    // Login via email or phone
    if (identifier) {
      const user = getUserByEmail(identifier) || getUserByPhone(identifier);
      if (user) {
        return NextResponse.json({ success: true, user });
      }
      return NextResponse.json({ success: false, error: 'User not found. Please register first.' }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: 'Invalid login parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
