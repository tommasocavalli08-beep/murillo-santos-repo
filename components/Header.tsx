'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { whatsapp } from '@/lib/site';
export default function Header(){
  const [open,setOpen]=useState(false);
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" href="/"><span className="brand-mark">MS</span><span>Dr. Murillo Santos<small>Ginecologia · Obstetrícia</small></span></Link>
    <nav className={open?'nav open':'nav'}>
      <Link href="/sobre" onClick={()=>setOpen(false)}>Sobre</Link><Link href="/tratamentos" onClick={()=>setOpen(false)}>Tratamentos</Link><Link href="/artigos" onClick={()=>setOpen(false)}>Artigos</Link><Link href="/contato" onClick={()=>setOpen(false)}>Contato</Link>
      <a className="nav-cta" href={whatsapp()} target="_blank">Agendar consulta</a>
    </nav>
    <button className="menu" aria-label="Abrir menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div></header>
}
