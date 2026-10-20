-- Run in a new Supabase project's SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.admin_users(user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.admin_users where user_id=auth.uid());$$;
revoke all on function public.is_admin() from public;grant execute on function public.is_admin() to anon,authenticated;
create table public.categories(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,parent_id uuid references public.categories(id),sort_order int not null default 0,active bool not null default true);
create table public.products(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text not null default '',sku text,price numeric(12,2) not null check(price>=0),compare_at_price numeric(12,2) check(compare_at_price>=0),category_id uuid references public.categories(id) on delete set null,image_url text,gallery text[] not null default '{}',weight_grams integer not null check(weight_grams>0),stock integer not null default 0 check(stock>=0),featured bool not null default false,active bool not null default false,created_at timestamptz not null default now());
create table public.banners(id uuid primary key default gen_random_uuid(),title text not null,subtitle text not null default '',image_url text,button_text text not null default 'Shop now',button_url text not null default '/shop',sort_order integer not null default 0,active bool not null default false);
create table public.coupons(id uuid primary key default gen_random_uuid(),code text not null unique,discount_type text not null check(discount_type in ('percent','fixed')),amount numeric(12,2) not null check(amount>0),min_subtotal numeric(12,2) not null default 0,max_uses integer check(max_uses>0),uses integer not null default 0,starts_at timestamptz,ends_at timestamptz,active bool not null default false);
create table public.shipping_zones(id uuid primary key default gen_random_uuid(),name text not null,provinces text[] not null default '{}',active bool not null default true);
create table public.shipping_rates(id uuid primary key default gen_random_uuid(),zone_id uuid not null references public.shipping_zones(id) on delete cascade,max_weight_grams integer not null check(max_weight_grams>0),price numeric(12,2) not null check(price>=0),unique(zone_id,max_weight_grams));
create table public.orders(id uuid primary key default gen_random_uuid(),created_at timestamptz not null default now(),customer_name text not null,phone text not null,email text,address text not null,city text not null,province text not null,postal_code text,payment_method text not null check(payment_method in ('cod','bank','jazz','easy')),payment_reference text,notes text,status text not null default 'new' check(status in ('new','confirmed','packed','shipped','delivered','cancelled')),payment_status text not null default 'pending' check(payment_status in ('pending','verified','refunded')),subtotal numeric(12,2) not null,discount numeric(12,2) not null,shipping numeric(12,2) not null,total numeric(12,2) not null,items jsonb not null);
create index products_category_idx on public.products(category_id);create index orders_created_idx on public.orders(created_at desc);
-- Enable RLS on all tables; the server RPC validates prices and stock.
alter table public.admin_users enable row level security;alter table public.categories enable row level security;alter table public.products enable row level security;alter table public.banners enable row level security;alter table public.coupons enable row level security;alter table public.shipping_zones enable row level security;alter table public.shipping_rates enable row level security;alter table public.orders enable row level security;
create policy "admin user reads own membership" on public.admin_users for select to authenticated using (user_id=auth.uid());
create policy "read active categories" on public.categories for select to anon,authenticated using (active or public.is_admin());
create policy "read active products" on public.products for select to anon,authenticated using (active or public.is_admin());
create policy "read active banners" on public.banners for select to anon,authenticated using (active or public.is_admin());
create policy "admins manage categories" on public.categories for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage products" on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage banners" on public.banners for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage coupons" on public.coupons for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage shipping zones" on public.shipping_zones for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage shipping rates" on public.shipping_rates for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "admins manage orders" on public.orders for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Restrict public access to non-catalogue data: policies give only admins access.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('product-images','product-images',true,5242880,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy "admin uploads product images" on storage.objects for insert to authenticated with check(bucket_id='product-images' and public.is_admin());
create policy "admin updates product images" on storage.objects for update to authenticated using(bucket_id='product-images' and public.is_admin()) with check(bucket_id='product-images' and public.is_admin());
create policy "admin deletes product images" on storage.objects for delete to authenticated using(bucket_id='product-images' and public.is_admin());
-- SECURITY DEFINER lets the backend place orders without granting public write access.
create or replace function public.place_order(payload jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare row_item jsonb; prod record; qty integer; sub numeric:=0; shipping_cost numeric; discount_amount numeric:=0; weight_total integer:=0; zone_id_found uuid; code_input text; coupon_rec record; v_items jsonb:='[]'::jsonb; new_id uuid; pay text; txt text;
begin
if jsonb_typeof(payload->'items')<>'array' or jsonb_array_length(payload->'items')=0 or jsonb_array_length(payload->'items')>40 then raise exception 'Invalid basket';end if;
for row_item in select * from jsonb_array_elements(payload->'items') loop
  qty:=(row_item->>'quantity')::int;
  if qty<1 or qty>99 then raise exception 'Invalid quantity';end if;
  select id,name,price,weight_grams,stock,active into prod from public.products where id=(row_item->>'product_id')::uuid for update;
  if not found or not prod.active then raise exception 'Product no longer available';end if;
  if prod.stock<qty then raise exception 'Insufficient stock for %',prod.name;end if;
  sub:=sub+prod.price*qty;weight_total:=weight_total+prod.weight_grams*qty;
  v_items:=v_items||jsonb_build_array(jsonb_build_object('product_id',prod.id,'name',prod.name,'unit_price',prod.price,'quantity',qty,'line_total',prod.price*qty));
end loop;
if sub<=0 then raise exception 'Invalid order subtotal';end if;
select z.id into zone_id_found from public.shipping_zones z where z.active and (payload->>'province')=any(z.provinces) order by z.id limit 1;
if zone_id_found is null then select z.id into zone_id_found from public.shipping_zones z where z.active and cardinality(z.provinces)=0 order by z.id limit 1;end if;
if zone_id_found is null then raise exception 'Delivery zone not configured';end if;
select r.price into shipping_cost from public.shipping_rates r where r.zone_id=zone_id_found and r.max_weight_grams>=weight_total order by r.max_weight_grams limit 1;
if shipping_cost is null then raise exception 'Shipping rate missing for this order weight';end if;
code_input:=upper(trim(coalesce(payload->>'coupon_code','')));
if code_input<>'' then
 select * into coupon_rec from public.coupons where upper(code)=code_input for update;
 if not found or not coupon_rec.active or (coupon_rec.starts_at is not null and now()<coupon_rec.starts_at) or (coupon_rec.ends_at is not null and now()>coupon_rec.ends_at) or (coupon_rec.max_uses is not null and coupon_rec.uses>=coupon_rec.max_uses) or sub<coupon_rec.min_subtotal then raise exception 'Coupon is not valid for this order';end if;
 if coupon_rec.discount_type='percent' then discount_amount:=round(sub*least(coupon_rec.amount,100)/100,2);else discount_amount:=least(sub,coupon_rec.amount);end if;
 update public.coupons set uses=uses+1 where id=coupon_rec.id;
end if;
pay:=payload->>'payment_method';if pay not in ('cod','bank','jazz','easy') then raise exception 'Payment method not available';end if;
if length(trim(coalesce(payload->>'customer_name','')))<2 or length(trim(coalesce(payload->>'phone','')))<10 or length(trim(coalesce(payload->>'address','')))<8 or length(trim(coalesce(payload->>'city','')))<2 or length(trim(coalesce(payload->>'province','')))<2 then raise exception 'Please provide complete delivery information';end if;
insert into public.orders(customer_name,phone,email,address,city,province,postal_code,payment_method,payment_reference,notes,subtotal,discount,shipping,total,items)
values(left(payload->>'customer_name',100),left(payload->>'phone',20),left(payload->>'email',200),left(payload->>'address',500),left(payload->>'city',100),left(payload->>'province',100),left(payload->>'postal_code',20),pay,left(payload->>'payment_reference',100),left(payload->>'notes',500),sub,discount_amount,shipping_cost,sub-discount_amount+shipping_cost,v_items) returning id into new_id;
for row_item in select * from jsonb_array_elements(v_items) loop update public.products set stock=stock-(row_item->>'quantity')::int where id=(row_item->>'product_id')::uuid;end loop;
return jsonb_build_object('order_id',new_id,'subtotal',sub,'discount',discount_amount,'shipping',shipping_cost,'total',sub-discount_amount+shipping_cost);
end;$$;
revoke all on function public.place_order(jsonb) from public,anon,authenticated;grant execute on function public.place_order(jsonb) to service_role;
-- Bootstrap an administrator AFTER signing up this email in Supabase Authentication:
-- insert into public.admin_users(user_id) select id from auth.users where email='atif1256@gmail.com';
