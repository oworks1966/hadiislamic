import type {Metadata} from 'next';import './globals.css';import {StoreProvider,Header,Footer} from '@/components/store';import {catalog} from '@/lib/db';
export const metadata:Metadata={
  title:{default:'Hadi Islamic | Premium Dates & Sunnah Essentials',template:'%s | Hadi Islamic'},
  description:'Discover authentic Madinah Ajwa dates, Medjool, pure Attar, prayer essentials, and Sunnah remedies. Delivery across Pakistan.',
  icons:{icon:'/favicon.png',apple:'/favicon.png'},
  openGraph:{title:'Hadi Islamic',description:'Premium Dates & Sunnah Essentials',type:'website',images:['/logo.png']},
  robots:{index:true,follow:true}
};
export default async function RootLayout({children}:{children:React.ReactNode}){let categories=[] as Awaited<ReturnType<typeof catalog>>['categories'];try{categories=(await catalog()).categories}catch{}return <html lang="en"><body><StoreProvider><Header categories={categories}/><main>{children}</main><Footer/></StoreProvider></body></html>}
