import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const res = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    // Do not reveal whether user exists
    if (res.rows.length === 0) {
      return NextResponse.json({ ok: true });
    }
    const user = res.rows[0];

    const token = jwt.sign(
      { userId: user.id, purpose: 'reset' },
      process.env.JWT_SECRET || 'memorie-digitala-secret-key-2024',
      { expiresIn: '30m' }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(user.email, user.name || 'User', resetUrl);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


