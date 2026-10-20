import {createClient} from '@supabase/supabase-js';
import {products,categories,banners,blogPosts} from './demo';
import type {Product,Category,Banner,BlogPost} from './types';
export {products,categories,banners,blogPosts};
export const configured=!!(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY&& !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOURPROJECT'));
export const client=()=>configured?createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!):null;
export const serverAdmin=()=>{if(!configured||!process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error('Database is not configured');return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}})};
export async function catalog():Promise<{products:Product[];categories:Category[];banners:Banner[];blogPosts:BlogPost[];demo:boolean}>{const db=client();if(!db)return {products,categories,banners,blogPosts,demo:true};const [p,c,b]=await Promise.all([db.from('products').select('*').eq('active',true).order('created_at',{ascending:false}),db.from('categories').select('*').eq('active',true).order('sort_order'),db.from('banners').select('*').eq('active',true).order('sort_order')]);if(p.error||c.error||b.error)throw Error('Cannot load catalogue: '+(p.error?.message||c.error?.message||b.error?.message));return {products:(p.data as Product[])||products,categories:(c.data as Category[])||categories,banners:(b.data as Banner[])||banners,blogPosts,demo:false};}
