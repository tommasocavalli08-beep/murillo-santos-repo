import { NextResponse } from 'next/server';
import { del, list, put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ connected: false, readable: false });
  }
  try {
    const articles = await list({ prefix: 'articles/', limit: 1 });
    const result: Record<string, unknown> = {
      connected: true,
      readable: true,
      countAtLeastOne: articles.blobs.length > 0
    };
    if (new URL(request.url).searchParams.get('write') === '1') {
      const path = `article-healthcheck/${crypto.randomUUID()}.json`;
      let url: string | undefined;
      try {
        const blob = await put(path, JSON.stringify({ check: true }), {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false,
          allowOverwrite: true
        });
        url = blob.url;
        const [response, listed] = await Promise.all([
          fetch(url, { cache: 'no-store' }),
          list({ prefix: path, limit: 1 })
        ]);
        result.writeTest = response.ok ? 'ok' : 'readback-failed';
        result.listAfterWrite = listed.blobs.some(b => b.pathname === path);
        if (!response.ok) console.error('Blob healthcheck readback failed:', response.status);
      } catch (error) {
        result.writeTest = 'failed';
        console.error('Blob healthcheck write failed:', error);
      } finally {
        if (url) {
          try { await del(url); } catch (error) { console.error('Blob healthcheck cleanup failed:', error); }
        }
      }
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Article storage check failed:', error);
    return NextResponse.json({ connected: true, readable: false }, { status: 503 });
  }
}
