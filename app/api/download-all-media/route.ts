import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get all media for this event
    const mediaResult = await pool.query(
      `SELECT * FROM media_uploads WHERE event_id = $1 ORDER BY uploaded_at ASC`,
      [eventId]
    );

    const mediaItems = mediaResult.rows;

    if (mediaItems.length === 0) {
      return NextResponse.json(
        { error: 'No media found for this event' },
        { status: 404 }
      );
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    // Add files to archive
    for (const item of mediaItems) {
      if (item.file_url.startsWith('data:')) {
        // Handle base64 data URLs
        const base64Data = item.file_url.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        archive.append(buffer, { name: item.file_name });
      } else {
        // Handle S3 URLs
        try {
          const response = await fetch(item.file_url);
          const blob = await response.blob();
          const buffer = Buffer.from(await blob.arrayBuffer());
          archive.append(buffer, { name: item.file_name });
        } catch (error) {
          console.error(`Error downloading ${item.file_name}:`, error);
          // Skip this file if it can't be downloaded
        }
      }
    }

    // Finalize the archive
    archive.finalize();

    // Convert archive to buffer
    const chunks: Buffer[] = [];
    archive.on('data', (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      archive.on('end', resolve);
      archive.on('error', reject);
    });

    const zipBuffer = Buffer.concat(chunks);

    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=memories-${eventId}.zip`,
      },
    });
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    return NextResponse.json(
      { error: 'Error creating ZIP file' },
      { status: 500 }
    );
  }
}







