import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (newPassword.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'memorie-digitala-secret-key-2024');
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (!payload || payload.purpose !== 'reset') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, payload.userId]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


