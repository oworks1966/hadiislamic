import Checkout from '@/components/checkout';import {configured} from '@/lib/db';export default function Page(){return <Checkout demo={!configured}/>}
