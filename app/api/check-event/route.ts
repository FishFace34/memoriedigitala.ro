import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessKey = searchParams.get('accessKey');

    if (!accessKey) {
      return NextResponse.json(
        { error: 'Access key required' },
        { status: 400 }
      );
    }

    const eventResult = await pool.query(
      `SELECT * FROM events WHERE access_key = $1 AND status IN ('pending', 'paid')`,
      [accessKey]
    );

    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: eventResult.rows[0] });
  } catch (error) {
    console.error('Error checking event:', error);
    return NextResponse.json(
      { error: 'Error checking event' },
      { status: 500 }
    );
  }
}







