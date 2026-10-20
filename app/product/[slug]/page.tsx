export const dynamic='force-dynamic';
import {catalog} from '@/lib/db';
import {DetailView} from '@/components/store';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug} = await params;
  const p = (await catalog()).products.find(x => x.slug === slug);
  return {title: p?.name || 'Product', description: p?.description || ''};
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug} = await params;
  const data = await catalog();
  const p = data.products.find(x => x.slug === slug);
  if (!p) notFound();
  return <DetailView product={p} category={data.categories.find(x => x.id === p.category_id)} />;
}
