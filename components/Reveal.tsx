'use client';
import { motion } from 'framer-motion';
export default function Reveal({children,delay=0,className=''}:{children:React.ReactNode,delay?:number,className?:string}){
 return <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.75,delay,ease:[.2,.7,.2,1]}}>{children}</motion.div>
}
