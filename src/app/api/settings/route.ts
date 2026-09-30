import { NextRequest, NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings, getAuditLogs } from '@/lib/db';

export async function GET() {
  try {
    const settings = getAppSettings();
    const auditLogs = getAuditLogs();
    return NextResponse.json({ success: true, settings, auditLogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { updates, user } = body;

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only platform administrator can update settings.' },
        { status: 403 }
      );
    }

    const updated = updateAppSettings(updates, user);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
