import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/articles';
const slugify=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,80);
export async function GET(){return NextResponse.json(await getArticles())}
export async function POST(req:Request){
 try{
  if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Armazenamento ainda não conectado. Adicione BLOB_READ_WRITE_TOKEN no projeto Vercel.'},{status:503});
  const body=await req.json();
  if(!body.title||!body.excerpt||!body.content)return NextResponse.json({error:'Preencha título, resumo e conteúdo.'},{status:400});
  const now=new Date().toISOString(); const slug=slugify(body.slug||body.title);
  const article={slug,title:String(body.title).trim(),excerpt:String(body.excerpt).trim(),content:String(body.content).trim(),category:String(body.category||'Saúde da mulher').trim(),publishedAt:body.publishedAt||now,updatedAt:now};
  const {put}=await import('@vercel/blob');
  await put(`articles/${slug}.json`,JSON.stringify(article),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});
  return NextResponse.json(article,{status:201});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Erro ao publicar artigo.'},{status:500})}
}
