'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

export default function SiteChrome({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const isEditor=pathname.startsWith('/editor-artigos');
  if(isEditor) return <>{children}</>;
  return <><ScrollProgress/><Header/><main>{children}</main><Footer/></>;
}
