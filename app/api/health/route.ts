import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getS3Client } from '@/lib/storage';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      storage: 'unknown',
    },
    uptime: process.uptime(),
  };

  try {
    // Check database connection
    await pool.query('SELECT 1');
    health.services.database = 'connected';
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = 'disconnected';
  }

  try {
    // Check S3/Storage
    const s3Client = getS3Client();
    health.services.storage = s3Client ? 'configured' : 'not configured';
  } catch (error) {
    health.services.storage = 'error';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}






