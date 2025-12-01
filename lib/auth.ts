import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export interface AuthPayload {
  userId: number;
  email: string;
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'memorie-digitala-secret-key-2024'
    ) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.replace('Bearer ', '') || null;
}

/**
 * Authenticate request - returns user data or null
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthPayload | null> {
  const token = extractToken(request);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Middleware to check authentication
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthPayload } | NextResponse> {
  const user = await authenticateRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    );
  }
  
  return { user };
}

/**
 * Check if user owns the event
 */
export async function checkEventOwnership(
  eventId: string,
  userId: number
): Promise<boolean> {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const result = await pool.query(
      `SELECT e.* FROM events e
       JOIN users u ON u.email = e.host_email
       WHERE e.event_id = $1 AND u.id = $2`,
      [eventId, userId]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking event ownership:', error);
    return false;
  }
}






