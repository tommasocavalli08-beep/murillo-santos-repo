import Image from 'next/image';
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

      <div className="article-body">{a.content.split('\n').map((p,i)=>p.trim()?<p key={i}>{p}</p>:null)}</div>

      {videoId&&<div className="article-video"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`Vídeo: ${a.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>}

      <aside className="medical-note">Este conteúdo é informativo e não substitui avaliação médica individual.</aside>
    </article>
  </>
}
