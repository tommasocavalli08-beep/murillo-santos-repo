import Image from 'next/image';
import type { ReactNode } from 'react';
import { getArticle } from '@/lib/articles';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
export const dynamic='force-dynamic';
export const revalidate=0;

const base=process.env.NEXT_PUBLIC_SITE_URL||'https://drmurillosantos.com.br';

function youtubeEmbed(url?:string){
  if(!url)return null;
  try{
    const u=new URL(url);
    if(u.hostname.includes('youtu.be')) return u.pathname.replace('/','');
    if(u.hostname.includes('youtube.com')) return u.searchParams.get('v')||u.pathname.split('/').filter(Boolean).pop()||null;
  }catch{}
  return null;
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('https://') || part.startsWith('http://')) {
      const url = part.replace(/[.,;]+$/, '');
      return <span key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a>{part.slice(url.length)}</span>;
    }
    return part;
  });
}

function renderContent(content: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let items: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  const flush = () => {
    if (paragraph.length) {
      blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>);
      paragraph = [];
    }
    if (items.length) {
      const entries = items.map((item, index) => <li key={index}>{inline(item)}</li>);
      blocks.push(listType === 'ol'
        ? <ol key={blocks.length}>{entries}</ol>
        : <ul key={blocks.length}>{entries}</ul>);
      items = [];
      listType = null;
    }
  };
  for (const raw of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      blocks.push(heading[1].length === 3
        ? <h3 key={blocks.length}>{inline(heading[2])}</h3>
        : <h2 key={blocks.length}>{inline(heading[2])}</h2>);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (bullet || numbered) {
      const nextType = bullet ? 'ul' : 'ol';
      if (paragraph.length || (listType && listType !== nextType)) flush();
      listType = nextType;
      items.push((bullet || numbered)![1]);
      continue;
    }
    if (items.length) flush();
    paragraph.push(line);
  }
  flush();
  return blocks;
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const a=await getArticle(slug);if(!a)return{};
  return{
    title:a.title,
    description:a.excerpt,
    alternates:{canonical:`/artigos/${slug}`},
    openGraph:{type:'article',title:a.title,description:a.excerpt,publishedTime:a.publishedAt,modifiedTime:a.updatedAt,authors:[site.fullName],images:a.image?[{url:a.image}]:undefined}
  }
}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const a=await getArticle(slug);
  if(!a)notFound();
  const videoId=youtubeEmbed(a.youtube);
  const schema={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.excerpt,image:a.image?[a.image]:undefined,datePublished:a.publishedAt,dateModified:a.updatedAt,author:{'@type':'Person',name:site.fullName,url:`${base}/sobre`},publisher:{'@type':'Person',name:site.fullName},mainEntityOfPage:`${base}/artigos/${slug}`};

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    <article className="article-page container">
      <span className="kicker">{a.category}</span>
      <h1>{a.title}</h1>
      <p className="article-lead">{a.excerpt}</p>
      <div className="article-meta">Por {site.fullName} · {new Date(a.publishedAt).toLocaleDateString('pt-BR')}</div>

      {a.image&&<div className="article-cover"><Image src={a.image} alt={a.title} fill sizes="(max-width:900px) 100vw, 900px" unoptimized/></div>}

      <div className="article-body">{renderContent(a.content)}</div>

      {videoId&&<div className="article-video"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${a.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>}

      <aside className="medical-note">Este conteúdo é informativo e não substitui avaliação médica individual.</aside>
    </article>
  </>
}
