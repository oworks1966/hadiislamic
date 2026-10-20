export const dynamic='force-dynamic';
import {catalog} from '@/lib/db';import {HomeView} from '@/components/store';
export default async function Home(){const data=await catalog();return <HomeView {...data}/>}
