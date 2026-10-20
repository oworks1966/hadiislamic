import type {Product,Category,Banner} from './types';
export const categories:Category[]=[
{id:'c-dates',name:'Premium Saudi Dates',slug:'premium-saudi-dates',parent_id:null,sort_order:1,active:true},
{id:'c-prayer',name:'Prayer Essentials',slug:'prayer-essentials',parent_id:null,sort_order:2,active:true},
{id:'c-umrah',name:'Hajj & Umrah',slug:'hajj-umrah',parent_id:null,sort_order:3,active:true},
{id:'c-clothing',name:'Arabic Clothing',slug:'arabic-clothing',parent_id:null,sort_order:4,active:true},
{id:'c-kids',name:'Kids & Family',slug:'kids-family',parent_id:null,sort_order:5,active:true}];
const img={dates:'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=850&q=85',prayer:'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=850&q=85',umrah:'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=850&q=85',cloth:'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=850&q=85',kid:'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=850&q=85'};
const p=(id:string,name:string,slug:string,price:number,category_id:string,image_url:string,weight_grams:number,description:string,compare_at_price:number|null=null):Product=>({id,name,slug,price,category_id,image_url,weight_grams,description,compare_at_price,stock:20,featured:true,active:true,gallery:[],sku:null});
export const products:Product[]=[
p('p1','Qalmi Dates – Premium Quality Khajoor','qalmi-dates',3500,'c-dates',img.dates,1000,'Premium Qalmi dates with a naturally rich flavour. Confirm package weight and origin before purchase.'),
p('p2','Sugh a i Dates – Premium Saudi Dates','sughai-dates',3500,'c-dates',img.dates,1000,'Premium Sugh a i dates, known for their distinctive two-tone appearance. Package weight subject to confirmation.'),
p('p3','Sukri Dates','sukri-dates',3500,'c-dates',img.dates,1000,'Naturally sweet Sukri dates. Package weight subject to confirmation.'),
p('p4','Mabroom Dates – Premium Saudi Khajoor','mabroom-dates',4800,'c-dates',img.dates,1000,'Premium Mabroom dates with their familiar elongated shape. Package weight subject to confirmation.'),
p('p5','Ajwa Dates – Premium Saudi Khajoor','ajwa-dates',4500,'c-dates',img.dates,1000,'Premium Ajwa dates with a distinctive deep colour. Package weight subject to confirmation.'),
p('p6','Velvet Prayer Mat – Classic','velvet-prayer-mat-classic',850,'c-prayer',img.prayer,1300,'Soft velvet prayer mat. Please confirm design and measurements before fulfilment.'),
p('p7','Velvet Prayer Mat – Premium','velvet-prayer-mat-premium',850,'c-prayer',img.prayer,1300,'Velvet prayer mat, approximately 80 × 120 cm; reported weight 1.3 kg.'),
p('p8','Premium Ihram Belt – Secure & Comfortable','premium-ihram-belt',800,'c-umrah',img.umrah,200,'Practical Ihram belt designed for carrying small essentials during travel.'),
p('p9','Premium Cotton Ihram – Exclusive Collection','premium-cotton-ihram',5500,'c-umrah',img.umrah,1500,'Premium textured cotton Ihram set. Final fabric specifications to be confirmed.'),
p('p10','Child Safety Lost Strap','child-safety-strap',750,'c-kids',img.kid,250,'Comfortable child safety wrist link with flexible coiled cord. Use only with responsible adult supervision.'),
p('p11','Zam Zam Water – 5 Litre','zam-zam-water-5-litre',6500,'c-umrah',img.umrah,5500,'Zam Zam water, 5-litre listing. Availability, provenance and delivery eligibility must be verified before sale.'),
p('p12','Iqal','iqal',750,'c-clothing',img.cloth,180,'Traditional Arabic headwear accessory.',1000),
p('p13','Arabic Romal','arabic-romal',750,'c-clothing',img.cloth,200,'Traditional Arabic scarf accessory.',1000),
p('p14','Kids Arabic / Saudi Dress Set','kids-arabic-saudi-dress',3450,'c-kids',img.kid,700,'Three-piece traditional dress set for children approximately 1 to 4 years. Confirm size before ordering.',4000)];
export const banners:Banner[]=[{id:'b1',title:'Rooted in Faith. Made for Everyday Life.',subtitle:'Explore thoughtful essentials for prayer, sacred journeys and meaningful gifting.',image_url:'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1700&q=85',button_text:'Explore Collection',button_url:'/shop',active:true,sort_order:1}];
export const money=(n:number)=>'Rs. '+Math.round(n).toLocaleString('en-PK');
