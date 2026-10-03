import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ connected: false, readable: false });
  }
  try {
    const result = await list({ prefix: 'articles/', limit: 1 });
    return NextResponse.json({ connected: true, readable: true, countAtLeastOne: result.blobs.length > 0 });
  } catch (error) {
    console.error('Article storage check failed:', error);
    return NextResponse.json({ connected: true, readable: false }, { status: 503 });
  }
}
