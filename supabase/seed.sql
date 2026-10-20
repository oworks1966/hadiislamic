-- Optional seed. Temporary images and provisional product weights MUST be replaced before launch.
insert into public.categories (name,slug,sort_order,active) values
('Premium Saudi Dates','premium-saudi-dates',1,true),('Prayer Essentials','prayer-essentials',2,true),('Hajj & Umrah','hajj-umrah',3,true),('Arabic Clothing','arabic-clothing',4,true),('Kids & Family','kids-family',5,true) on conflict(slug) do nothing;
with data(name,slug,price,cat,weight,description,compare_price) as (values
('Qalmi Dates – Premium Quality Khajoor','qalmi-dates',3500,'premium-saudi-dates',1000,'Premium dates; confirm packed weight and provenance.',null::numeric),
('Sugh a i Dates – Premium Saudi Dates','sughai-dates',3500,'premium-saudi-dates',1000,'Premium Saudi dates; confirm packaging.',null::numeric),
('Sukri Dates','sukri-dates',3500,'premium-saudi-dates',1000,'Naturally sweet dates; confirm weight.',null::numeric),
('Mabroom Dates – Premium Saudi Khajoor','mabroom-dates',4800,'premium-saudi-dates',1000,'Premium Mabroom dates.',null::numeric),
('Ajwa Dates – Premium Saudi Khajoor','ajwa-dates',4500,'premium-saudi-dates',1000,'Premium Ajwa dates.',null::numeric),
('Velvet Prayer Mat – Classic','velvet-prayer-mat-classic',850,'prayer-essentials',1300,'Velvet prayer mat, classic design.',null::numeric),
('Velvet Prayer Mat – Premium','velvet-prayer-mat-premium',850,'prayer-essentials',1300,'Velvet prayer mat, approximately 80 × 120 cm.',null::numeric),
('Premium Ihram Belt – Secure & Comfortable','premium-ihram-belt',800,'hajj-umrah',200,'Practical Ihram belt.',null::numeric),
('Premium Cotton Ihram – Exclusive Collection','premium-cotton-ihram',5500,'hajj-umrah',1500,'Premium cotton Ihram.',null::numeric),
('Child Safety Lost Strap','child-safety-strap',750,'kids-family',250,'Child safety wrist link; always supervise use.',null::numeric),
('Zam Zam Water – 5 Litre','zam-zam-water-5-litre',6500,'hajj-umrah',5500,'Zam Zam water, 5 litres; verify sourcing.',null::numeric),
('Iqal','iqal',750,'arabic-clothing',180,'Arabic headwear accessory.',1000::numeric),
('Arabic Romal','arabic-romal',750,'arabic-clothing',200,'Traditional Arabic scarf.',1000::numeric),
('Kids Arabic / Saudi Dress Set','kids-arabic-saudi-dress',3450,'kids-family',700,'Three-piece dress set for children approximately 1–4 years.',4000::numeric))
insert into public.products (name,slug,price,category_id,weight_grams,description,compare_at_price,stock,active,featured,image_url)
select d.name,d.slug,d.price,c.id,d.weight,d.description,d.compare_price,0,false,true,case when d.cat='premium-saudi-dates' then 'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=850&q=85' when d.cat='prayer-essentials' then 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=850&q=85' when d.cat='hajj-umrah' then 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=850&q=85' when d.cat='arabic-clothing' then 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=850&q=85' else 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=850&q=85' end from data d join public.categories c on c.slug=d.cat on conflict(slug) do nothing;
insert into public.banners(title,subtitle,image_url,button_text,button_url,active) values('Rooted in Faith. Made for Everyday Life.','Discover thoughtful essentials for prayer, sacred journeys and meaningful gifts.','https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1700&q=85','Explore Collection','/shop',true);
-- Demonstration shipping amounts only. Replace with approved courier tariffs.
insert into public.shipping_zones(name,provinces,active) values ('Pakistan - Default',array[]::text[],false);
insert into public.shipping_rates(zone_id,max_weight_grams,price) select id,1000,250 from public.shipping_zones where name='Pakistan - Default';
insert into public.shipping_rates(zone_id,max_weight_grams,price) select id,3000,450 from public.shipping_zones where name='Pakistan - Default';
insert into public.shipping_rates(zone_id,max_weight_grams,price) select id,6000,800 from public.shipping_zones where name='Pakistan - Default';
insert into public.shipping_rates(zone_id,max_weight_grams,price) select id,15000,1800 from public.shipping_zones where name='Pakistan - Default';
