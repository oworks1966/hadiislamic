# Hadi Islamic: premium e-commerce website

Next.js / TypeScript / Tailwind storefront, optional Supabase catalogue, protected admin area and server-validated checkout. Intended for GitHub and Vercel.

## Important launch status

**This is a source-code project, not an already deployed or payment-certified store.** Placeholder stock photography and provisional shipping weights are included. In preview mode (without Supabase credentials), storefront pages work, while administration login and order submission are disabled. The initial seed deliberately marks all products **inactive and out of stock**, and its sample shipping zone **inactive** until data is verified. DO NOT activate ordering before product images, product provenance, packed weights, stock counts, courier tariffs and policy content have been checked.

Live card, JazzCash and Easypaisa gateway integrations are **not yet implemented**. Checkout offers COD and manual Bank/Raast/JazzCash/Easypaisa payment selections only, without exposing financial account details or accepting card data. Never mark a manual payment as verified without independent confirmation.

## Local setup

1. Install Node.js 20.9+ (22 LTS recommended).
2. Run `npm install` and then `npm run dev`.
3. Visit http://localhost:3000. Without database credentials, you will see a demonstration storefront.
4. Create a Supabase project in a suitable region, and run `supabase/schema.sql` in its SQL Editor.
5. Optionally run `supabase/seed.sql` to create categories and inactive product records. Verify all names and prices against your original WhatsApp Business catalogue; mock imagery is not a representation of the actual product.
6. Copy `.env.example` to `.env.local` and fill in **your own** Supabase Project URL, public anon key and secret service role key. The service role key must NEVER be prefixed with `NEXT_PUBLIC_`, put in the Git repository, or sent to a browser.
7. Restart `npm run dev`.
8. In Supabase Dashboard → Authentication → Users, create/invite the first user with email `atif1256@gmail.com`. Assign a strong password through Supabase's secure workflow. Then run this SQL as the Supabase SQL Editor administrator:
   ```sql
   insert into public.admin_users(user_id)
   select id from auth.users where email = 'atif1256@gmail.com'
   on conflict do nothing;
   ```
9. Go to `/admin`, sign in, and edit products, images, banners, stock, categories, shipping zones/rates and coupons. Upload original product images via the media field. This stores files in the Supabase public `product-images` bucket.
10. Activate a correctly configured shipping zone, with weight brackets covering your heaviest permitted order, and enter real courier rates. Verify accurate per-item **packed weights** (not product net weight).
11. Review refund, return, shipping and privacy pages with the business's approved operating policies before accepting orders. Test order placement, discount calculations, stock deduction and administrative order status management end to end.

## Deploy to Vercel

1. Push this folder to a private GitHub repository (do not commit `.env.local`).
2. On Vercel select **Add New → Project**, import the repository, Framework Preset **Next.js**.
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (your final HTTPS domain).
4. Deploy, then connect `hadiislamic.com` using the domain and DNS instructions shown by Vercel. Domain DNS settings depend on your registrar.
5. Confirm SSL, order API, navigation, mobile layout and all third-party media URLs on the production preview deployment before launch.
6. Store all business passwords, merchant keys and gateway credentials in provider dashboards or encrypted environment variables, never in GitHub or a client-side component.

## Admin guide

- **Products:** create/edit names, slugs, price, compare-at price (for discount badges), stock, packed weight, images and category. Publish a product by setting `active=true` after verifying its details.
- **Categories:** create categories and optionally select their parent for subcategories. The catalogue data model supports hierarchy; the initial storefront navigation displays top-level categories, with basic category filtering. Nested category-specific navigation can be extended.
- **Banners:** create promotions; order by `sort_order`. Current homepage uses the first active banner.
- **Coupons:** percentage or fixed amount, optional minimum subtotal and maximum uses. Coupon validation occurs inside an SQL transaction on order placement.
- **Shipping zones:** add provinces to a zone, or use an empty-province active zone for the national fallback. Use province spelling exactly as shown in checkout. Add weight brackets in **grams** to Shipping Rates.
- **Orders:** see order details, update fulfilment and manually verify payment status after checking with your bank/wallet provider. No courier API is connected yet.
- **Images:** upload the official logo yourself in a later update. The existing header uses a temporary typographic logo. Product images can be replaced at any time through admin. Supported upload types: JPEG, PNG, WebP (up to 5 MB).

## Customer accounts

Guest checkout works once store configured. The Supabase Auth foundation is installed for administrator sign-in; a dedicated customer registration, sign-in, order history and password-reset UI is **not yet provided**. Customer-account functionality should be completed before describing registered checkout as operational. The current checkout is guest checkout.

## Security and production hardening

- Product and order tables use Row Level Security. Catalogue reads are public, edits require authorised admin accounts.
- Order API uses a server-held service role key. The `place_order` SQL function locks stock rows, calculates prices, shipping and coupon discounts server-side, stores order snapshots, and decrements inventory transactionally.
- Before advertising or public launch, add API rate limiting / bot protection, abuse and fraud checks, transactional notifications, order cancellation stock-restocking controls, storage housekeeping and monitoring. These are not provided here.
- Admin accounts should have MFA enabled in your authentication workflow. Do not treat `admin_users` email as proof of identity without Supabase Auth.
- For regulated or sensitive products such as Zam Zam water, independently verify sourcing, labelling and courier eligibility.
- Check applicable Pakistani e-commerce, consumer, tax and privacy obligations with a local professional.

## Public links

WhatsApp: `https://wa.me/923451579846`
Instagram: `https://www.instagram.com/atifgulzar_wattoo`
TikTok: `https://www.tiktok.com/@hadi_islamic`
Email: `atif1256@gmail.com`

## Brand assets

The existing logo at hadiislamic.com could not be obtained. Replace the temporary text mark in `components/store.tsx` with your original logo when provided. Image URLs are illustrative and should not be interpreted as photographs of Hadi Islamic stock.
