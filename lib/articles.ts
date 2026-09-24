import seed from '@/data/articles.json';

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  youtube?: string;
  publishedAt: string;
  updatedAt: string;
};

export async function getArticles(): Promise<Article[]> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return seed as Article[];
    const { list } = await import('@vercel/blob');
    const result = await list({ prefix: 'articles/' });
    const rows = await Promise.all(result.blobs.filter(b => b.pathname.endsWith('.json')).map(async b => {
      const r = await fetch(b.url, { cache: 'no-store' });
      return r.json() as Promise<Article>;
    }));
    return rows.sort((a,b)=>+new Date(b.publishedAt)-+new Date(a.publishedAt));
  } catch { return seed as Article[]; }
}

export async function getArticle(slug:string): Promise<Article|undefined> {
  const all = await getArticles();
  return all.find(a=>a.slug===slug);
}
