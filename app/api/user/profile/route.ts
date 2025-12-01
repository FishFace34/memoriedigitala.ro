import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if ('status' in (auth as any)) return auth as any;
  const { user } = auth as any;
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [user.userId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: result.rows[0] });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if ('status' in (auth as any)) return auth as any;
  const { user } = auth as any;
  try {
    const body = await request.json();
    const name = (body?.name || '').trim();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email', [name, user.userId]);
    return NextResponse.json({ user: result.rows[0] });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





