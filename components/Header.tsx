'use client';
import Link from 'next/link';
import { Instagram, MapPin, Menu, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { site, whatsapp } from '@/lib/site';

export default function Header(){
  const [open,setOpen]=useState(false);
  return <>
    <div className="contact-strip">
      <div className="contact-strip-inner">
        <a href={site.maps} target="_blank" rel="noreferrer"><MapPin size={13}/><span>{site.address}</span></a>
        <div className="contact-strip-actions">
          <a href={whatsapp()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={14}/><span>WhatsApp</span></a>
          <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={14}/><span>Instagram</span></a>
        </div>
      </div>
    </div>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/">
        <span className="brand-logo"><img src="/images/murillo-logo.svg" alt="Logo Dr. Murillo Santos"/></span>
        <span>Dr. Murillo Santos<small>Ginecologia · Obstetrícia</small></span>
      </Link>
      <nav className={open?'nav open':'nav'}>
        <Link href="/sobre" onClick={()=>setOpen(false)}>Sobre</Link>
        <Link href="/tratamentos" onClick={()=>setOpen(false)}>Tratamentos</Link>
        <Link href="/artigos" onClick={()=>setOpen(false)}>Artigos</Link>
        <Link href="/contato" onClick={()=>setOpen(false)}>Contato</Link>
        <a className="nav-cta" href={whatsapp()} target="_blank" rel="noreferrer">Agendar consulta</a>
      </nav>
      <button className="menu" aria-label={open?'Fechar menu':'Abrir menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div></header>
  </>
}
