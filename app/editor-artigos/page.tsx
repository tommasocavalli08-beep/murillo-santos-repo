'use client';
import { useEffect, useState } from 'react';

export default function Editor(){
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [storage,setStorage]=useState<'checking'|'connected'|'missing'>('checking');

  useEffect(()=>{fetch('/api/articles/status').then(r=>r.json()).then(j=>setStorage(j.connected?'connected':'missing')).catch(()=>setStorage('missing'))},[]);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setBusy(true);
    setStatus('Publicando…');
    const form=e.currentTarget;
    const payload=Object.fromEntries(new FormData(form).entries());
    try{
      const r=await fetch('/api/articles',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const j=await r.json();
      if(r.ok){setStatus(`Publicado com sucesso: /artigos/${j.slug}`);form.reset()}
      else setStatus(j.error||'Erro ao publicar.');
    }catch{setStatus('Não foi possível conectar ao servidor.')}
    finally{setBusy(false)}
  }

  return <div className="editor-shell">
    <div className="editor-topbar"><strong>Murillo Santos</strong><span>Editor de conteúdo</span></div>
    <div className="editor-card">
      <div className="editor-intro">
        <div><span className="kicker">Artigos</span><h1>Novo artigo</h1><p>Crie e publique conteúdos que aparecerão automaticamente na área de artigos do site.</p></div>
        <div className={`storage-badge ${storage}`}>{storage==='checking'?'Verificando armazenamento…':storage==='connected'?'Armazenamento conectado':'Armazenamento desconectado'}</div>
      </div>
      <form onSubmit={submit}>
        <label>Título<input name="title" required/></label>
        <label>Categoria<input name="category" defaultValue="Saúde da mulher"/></label>
        <label>Resumo<textarea name="excerpt" rows={3} required/></label>
        <label>Conteúdo<textarea name="content" rows={16} required placeholder="Escreva em parágrafos. Use uma linha em branco entre eles."/></label>
        <label>Slug opcional<input name="slug" placeholder="gerado-automaticamente"/></label>
        <button className="btn primary" disabled={busy||storage!=='connected'}>{busy?'Publicando…':'Publicar artigo'}</button>
        <div className="editor-status">{status}</div>
      </form>
    </div>
  </div>
}
