import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAuditLog } from '@/lib/db';

const DB_FILE_PATH = path.join(process.cwd(), 'canteen_bites_db.json');

export async function GET(req: NextRequest) {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      return NextResponse.json({ success: false, error: 'Database file not found' }, { status: 404 });
    }

    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const data = JSON.parse(raw);

    createAuditLog({
      userId: 'user-admin',
      userName: 'Yash Vardhan',
      userRole: 'ADMIN',
      action: 'DATABASE_BACKUP_DOWNLOADED',
      details: `Full database backup JSON exported at ${new Date().toISOString()}`,
    });

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="canteen_bites_backup_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.canteens || !body.orders || !body.users) {
      return NextResponse.json(
        { success: false, error: 'Invalid database backup structure' },
        { status: 400 }
      );
    }

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');

    createAuditLog({
      userId: 'user-admin',
      userName: 'Yash Vardhan',
      userRole: 'ADMIN',
      action: 'DATABASE_RESTORED',
      details: `Database restored from imported backup at ${new Date().toISOString()}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Database restored successfully! Refreshing campus records.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
