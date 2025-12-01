import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { eventId, eventName } = await request.json();
    if (!eventId || !eventName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const res = await pool.query(
      'UPDATE events SET event_name = $1 WHERE event_id = $2 RETURNING event_id, event_name',
      [eventName, eventId]
    );
    if (res.rowCount === 0) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event: res.rows[0] });
  } catch (e) {
    console.error('update-event error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





