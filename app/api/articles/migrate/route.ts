import { NextResponse } from 'next/server';
import { list, put } from '@vercel/blob';
import articles from '@/data/articles.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Storage unavailable' }, { status: 503 });
  }
  try {
    const existing = await list({ prefix: 'articles/', limit: 1000 });
    const paths = new Set(existing.blobs.map(blob => blob.pathname));
    const migrated: string[] = [];
    const skipped: string[] = [];
    for (const article of articles) {
      const path = `articles/${article.slug}.json`;
      if (paths.has(path)) { skipped.push(article.slug); continue; }
      await put(path, JSON.stringify(article), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false
      });
      migrated.push(article.slug);
    }
    return NextResponse.json({ migrated, skipped });
  } catch (error) {
    console.error('Article migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
