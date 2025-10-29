import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ('status' in (auth as any)) return auth as any;
  const { user } = auth as any;
  try {
    const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [user.userId]);
    if (userRes.rows.length === 0) return NextResponse.json({ orders: [] });
    const email = userRes.rows[0].email as string;

    const result = await pool.query(
      `SELECT o.*, e.event_name, e.event_id
       FROM orders o
       JOIN events e ON e.event_id = o.event_id
       WHERE o.host_email = $1
       ORDER BY o.created_at DESC`,
      [email]
    );

    return NextResponse.json({ orders: result.rows });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


