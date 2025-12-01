import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    await pool.query('SELECT NOW()');
    return NextResponse.json({ status: 'connected', message: 'Database connected successfully' });
  } catch (error) {
    return NextResponse.json({ 
      status: 'disconnected', 
      message: 'Database not connected. Using mock mode.',
      error: (error as Error).message 
    });
  }
}








