import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getArticle } from '@/lib/articles';

export async function PUT(req:Request,{params}:{params:Promise<{slug:string}>}){
 try{
  if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Armazenamento ainda não conectado.'},{status:503});
  const {slug}=await params;
  const current=await getArticle(slug);
  if(!current)return NextResponse.json({error:'Artigo não encontrado.'},{status:404});
  const body=await req.json();
  if(!body.title||!body.excerpt||!body.content)return NextResponse.json({error:'Preencha título, resumo e conteúdo.'},{status:400});
  const article={
    ...current,
    title:String(body.title).trim(),
    excerpt:String(body.excerpt).trim(),
    content:String(body.content).trim(),
    category:String(body.category||'Saúde da mulher').trim(),
    image:body.image?String(body.image):undefined,
    youtube:body.youtube?String(body.youtube).trim():undefined,
    updatedAt:new Date().toISOString()
  };
  const {put}=await import('@vercel/blob');
  await put(`articles/${slug}.json`,JSON.stringify(article),{access:'public',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});
  revalidatePath('/');
  revalidatePath('/artigos');
  revalidatePath(`/artigos/${slug}`);
  return NextResponse.json(article);
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Erro ao atualizar artigo.'},{status:500})}
}

export async function DELETE(_req:Request,{params}:{params:Promise<{slug:string}>}){
 try{
  if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Armazenamento ainda não conectado.'},{status:503});
  const {slug}=await params;
  const {list,del}=await import('@vercel/blob');
  const result=await list({prefix:`articles/${slug}.json`});
  const target=result.blobs.find(b=>b.pathname===`articles/${slug}.json`);
  if(!target)return NextResponse.json({error:'Artigo não encontrado.'},{status:404});
  await del(target.url);
  revalidatePath('/');
  revalidatePath('/artigos');
  revalidatePath(`/artigos/${slug}`);
  return NextResponse.json({ok:true});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Erro ao excluir artigo.'},{status:500})}
}
