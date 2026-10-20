import type {Product,Category,Banner} from './types';

export const categories:Category[]=[
  // Main Categories
  {
    id:'c-dates',
    name:'Premium Dates (Khajoor)',
    arabic_name:'تمور فاخرة',
    slug:'dates',
    parent_id:null,
    sort_order:1,
    active:true,
    image_url:'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=600&q=80',
    description:'Authentic Madinah Munawwarah & Saudi dates, handpicked for peak freshness, soft texture and Sunnah blessing.'
  },
  {
    id:'c-attar',
    name:'Attar & Fragrances',
    arabic_name:'عطور وزيوت نقية',
    slug:'attar-fragrances',
    parent_id:null,
    sort_order:2,
    active:true,
    image_url:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
    description:'100% non-alcoholic Arabian concentrated perfume oils, authentic Dehn Al Oud, Kasturi and White Musk.'
  },
  {
    id:'c-prayer',
    name:'Prayer Essentials',
    arabic_name:'مستلزمات الصلاة',
    slug:'prayer-essentials',
    parent_id:null,
    sort_order:3,
    active:true,
    image_url:'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&q=80',
    description:'Luxurious Turkish velvet Janamaz, orthopedic knee-cushion mats, digital smart tasbeeh and beads.'
  },
  {
    id:'c-sunnah-foods',
    name:'Honey & Sunnah Foods',
    arabic_name:'عسل وأغذية السنة',
    slug:'sunnah-foods',
    parent_id:null,
    sort_order:4,
    active:true,
    image_url:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    description:'Pure Berry & Sidr honey, original 5L Zamzam water, organic Kalonji oil and Ajwa seed powder.'
  },
  {
    id:'c-umrah',
    name:'Hajj & Umrah Essentials',
    arabic_name:'مستلزمات الحج والعمرة',
    slug:'hajj-umrah',
    parent_id:null,
    sort_order:5,
    active:true,
    image_url:'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&q=80',
    description:'Premium 100% cotton Ihram sets, anti-slip belts, unscented toiletries and travel packs for pilgrims.'
  },

  // Subcategories under Dates (Khajoor Varieties)
  {
    id:'sub-ajwa',
    name:'Ajwa Al-Madinah (عجوة)',
    arabic_name:'عجوة المدينة المنورة',
    slug:'ajwa-dates',
    parent_id:'c-dates',
    sort_order:1,
    active:true,
    image_url:'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=600&q=80',
    description:'The most sacred date mentioned in Sahih Hadith. Dark blackish, mildly sweet with fine white grain lines.'
  },
  {
    id:'sub-medjool',
    name:'Medjool Jumbo (مجدول)',
    arabic_name:'مجدول جامبو فاخر',
    slug:'medjool-dates',
    parent_id:'c-dates',
    sort_order:2,
    active:true,
    image_url:'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80',
    description:'The King of Dates. Remarkably large, plump, extraordinarily juicy with natural caramel-like sweetness.'
  },
  {
    id:'sub-mabroom',
    name:'Mabroom Saudi (مبروم)',
    arabic_name:'مبروم سعودي ممتاز',
    slug:'mabroom-dates',
    parent_id:'c-dates',
    sort_order:3,
    active:true,
    image_url:'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=600&q=80',
    description:'Slender, elongated shape with a pleasingly firm, chewy texture and subtle, balanced sweetness.'
  },
  {
    id:'sub-sukkari',
    name:'Sukkari Rutab (سكري)',
    arabic_name:'سكري رطب القصيم',
    slug:'sukkari-dates',
    parent_id:'c-dates',
    sort_order:4,
    active:true,
    image_url:'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=600&q=80',
    description:'Golden-amber color with a melt-in-mouth soft texture and sugary nectar flavor from Al-Qassim.'
  },
  {
    id:'sub-amber',
    name:'Amber Royal (عنبر)',
    arabic_name:'عنبر المدينة الملكي',
    slug:'amber-dates',
    parent_id:'c-dates',
    sort_order:5,
    active:true,
    image_url:'https://images.unsplash.com/photo-1590483863484-90f745774a1d?w=600&q=80',
    description:'One of the largest Saudi dates, soft and fleshy with a rich aroma and mild Sunnah sweetness.'
  },
  {
    id:'sub-safawi',
    name:'Safawi / Kalmi (صفاوي)',
    arabic_name:'صفاوي / قلمي المدينة',
    slug:'safawi-dates',
    parent_id:'c-dates',
    sort_order:6,
    active:true,
    image_url:'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=600&q=80',
    description:'Deep dark brown, chewy date renowned in Madinah for digestive wellness and rich mineral content.'
  },
  {
    id:'sub-sagai',
    name:'Sagai Saudi (صقعي)',
    arabic_name:'صقعي سعودي فاخر',
    slug:'sagai-dates',
    parent_id:'c-dates',
    sort_order:7,
    active:true,
    image_url:'https://images.unsplash.com/photo-1584285418504-0050ec44b4b7?w=600&q=80',
    description:'Unique two-tone date: crisp light-golden top with a wonderfully soft honeyed brown base.'
  }
];

const p=(
  id:string,
  name:string,
  slug:string,
  price:number,
  category_id:string,
  image_url:string,
  weight_grams:number,
  description:string,
  compare_at_price:number|null=null,
  badge?:string,
  package_size?:string,
  origin:string='Saudi Arabia (Madinah Munawwarah)',
  benefits:string[]=['100% Authentic Import','Naturally Sweet with Zero Added Sugar','Packed in hygienic sealed box']
):Product=>({
  id,
  name,
  slug,
  price,
  category_id,
  image_url,
  weight_grams,
  description,
  compare_at_price,
  stock:35,
  featured:true,
  active:true,
  gallery:[image_url],
  sku:`HADI-${id.toUpperCase()}`,
  badge,
  package_size,
  origin,
  benefits
});

export const products:Product[]=[
  // AJWA DATES
  p(
    'ajwa-500g',
    'Madinah Ajwa Dates VIP – 500g Gift Box',
    'madinah-ajwa-dates-500g',
    2500,
    'sub-ajwa',
    'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=800&q=85',
    500,
    'Authentic Grade-A Ajwa Dates sourced directly from certified orchards in Madinah Munawwarah. Soft, dark, deeply nourishing with classic white micro-grain lines. Packed in an air-tight food-grade box.',
    2850,
    'Sunnah Special',
    '500g Box',
    'Madinah Munawwarah, KSA',
    ['Direct from Madinah orchards','Mentioned in Hadith for barakah & protection','High in natural potassium, iron and dietary fiber']
  ),
  p(
    'ajwa-1kg',
    'Madinah Ajwa Dates Super Jumbo – 1kg Family Pack',
    'madinah-ajwa-dates-1kg',
    4700,
    'sub-ajwa',
    'https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=800&q=85',
    1000,
    'Large, hand-selected Jumbo Ajwa Khajoor. Ideal for daily family consumption or sacred gifting. 100% natural, pesticide-free, freshly harvested and preserved under controlled temperature.',
    5200,
    'Best Seller',
    '1kg Box',
    'Madinah Munawwarah, KSA',
    ['Premium Jumbo size selection','100% satisfaction guarantee','Sealed tamper-proof packaging']
  ),

  // MEDJOOL DATES
  p(
    'medjool-500g',
    'Medjool Dates Royal Large – 500g Box',
    'medjool-dates-royal-500g',
    2350,
    'sub-medjool',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=85',
    500,
    'Renowned globally as the "King of Dates", Medjool dates are prized for their grand size, velvety soft pulp, and sumptuous caramel sweetness that melts in your mouth.',
    2650,
    'Royal Treat',
    '500g Box',
    'Palestine / Jordan Valley',
    ['Exceptionally plump and soft','Rich notes of caramel and honey','Excellent natural energy booster']
  ),
  p(
    'medjool-1kg',
    'Medjool Dates Premium Jumbo – 1kg Luxury Pack',
    'medjool-dates-jumbo-1kg',
    4400,
    'sub-medjool',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=85',
    1000,
    'Full 1kg luxury box of Jumbo Grade Medjool dates. Luscious, dense and moist, perfect for Iftar tables, gifting and pre-workout nutrition.',
    4900,
    'Popular',
    '1kg Box',
    'Palestine / Jordan Valley',
    ['Hand-graded Jumbo size','Zero preservatives or syrup added','Fresh current season harvest']
  ),

  // MABROOM DATES
  p(
    'mabroom-500g',
    'Mabroom Saudi Dates Premium – 500g Pack',
    'mabroom-saudi-dates-500g',
    2100,
    'sub-mabroom',
    'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=85',
    500,
    'Slender, chewy, and moderately sweet Mabroom dates from Saudi Arabia. Highly favoured by those who prefer a firmer date with less sweetness.',
    2400,
    'Chewy & Rich',
    '500g Pack',
    'Al-Ula / Madinah, KSA',
    ['Slender elongated shape','Pleasantly firm, chewy texture','Mild, natural, non-cloying sweetness']
  ),
  p(
    'mabroom-1kg',
    'Mabroom Saudi Dates Premium – 1kg Value Box',
    'mabroom-saudi-dates-1kg',
    3950,
    'sub-mabroom',
    'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=800&q=85',
    1000,
    'Full 1kg family box of premium Saudi Mabroom Khajoor. Great shelf-life, dry skin and chewy flesh make it a favourite everyday snacking date.',
    4500,
    'Value Pack',
    '1kg Box',
    'Al-Ula / Madinah, KSA'
  ),

  // SUKKARI DATES
  p(
    'sukkari-1kg',
    'Sukkari Rutab Fresh Golden Dates – 1kg Box',
    'sukkari-rutab-golden-1kg',
    2150,
    'sub-sukkari',
    'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?w=800&q=85',
    1000,
    'Famous golden-yellow Sukkari dates from Al-Qassim. Luscious, melt-in-mouth sweet with a delightful honey cream profile. Beloved by date connoisseurs.',
    2450,
    'Sweet & Creamy',
    '1kg Box',
    'Al-Qassim, Saudi Arabia',
    ['Signature golden hue','Extremely soft and sugary','Authentic Al-Qassim harvest']
  ),

  // AMBER DATES
  p(
    'amber-500g',
    'Amber Al-Madinah Royal Large – 500g Box',
    'amber-madinah-dates-500g',
    3100,
    'sub-amber',
    'https://images.unsplash.com/photo-1590483863484-90f745774a1d?w=800&q=85',
    500,
    'One of the rarest and largest dates grown in Madinah. Thick fleshy pulp, subtle aroma and sophisticated taste make Amber a prized luxury gift.',
    3500,
    'Royal Rare',
    '500g Box',
    'Madinah Munawwarah, KSA',
    ['Extra large fruit size','Generous fleshy pulp','Premium gift packaging']
  ),

  // SAFAWI / KALMI DATES
  p(
    'safawi-1kg',
    'Safawi / Kalmi Dates Madinah – 1kg Box',
    'safawi-kalmi-dates-1kg',
    3300,
    'sub-safawi',
    'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=800&q=85',
    1000,
    'Dark, intensely flavored Kalmi/Safawi dates from Madinah. Plump, rich in iron and potassium, with texture similar to Ajwa at an accessible value.',
    3750,
    'Healthy Choice',
    '1kg Box',
    'Madinah Munawwarah, KSA',
    ['Similar profile to Ajwa','High nutritional density','Naturally rich flavor']
  ),

  // SAGAI DATES
  p(
    'sagai-1kg',
    'Sagai Saudi Two-Tone Dates – 1kg Box',
    'sagai-saudi-dates-1kg',
    2750,
    'sub-sagai',
    'https://images.unsplash.com/photo-1584285418504-0050ec44b4b7?w=800&q=85',
    1000,
    'Distinctive two-toned Saudi date with crisp yellow top and soft brown base. Combines crunch and honeyed softness in every single bite.',
    3100,
    'Two-Tone Unique',
    '1kg Box',
    'Riyadh Region, KSA'
  ),

  // ATTAR & PERFUMES
  p(
    'attar-oud-royal',
    'Dehn Al Oud Royal Concentrated Attar – 12ml',
    'dehn-al-oud-royal-12ml',
    2950,
    'c-attar',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85',
    120,
    'Deep, woody and opulent oriental fragrance crafted with aged Cambodian and Assam agarwood essence. Long-lasting, 100% non-alcoholic roll-on.',
    3500,
    'Long-Lasting',
    '12ml Crystal Bottle',
    'Dubai / UAE',
    ['100% Non-Alcoholic Concentrated Oil','Lasts over 24 hours on fabric','Includes velvet presentation pouch']
  ),
  p(
    'attar-white-musk',
    'Pure Tahara White Musk Attar – 12ml',
    'pure-tahara-white-musk-12ml',
    1450,
    'c-attar',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=85',
    120,
    'Thick, velvety creamy white musk renowned for fresh powdery fragrance, purity, and long-lasting subtlety. Perfect for daily prayer and personal hygiene.',
    1750,
    'Pure & Fresh',
    '12ml Bottle',
    'Saudi Arabia',
    ['Classic Misk Tahara formula','Gentle powdery floral scent','Suitable for both men and women']
  ),

  // PRAYER ESSENTIALS
  p(
    'prayer-mat-velvet',
    'Turkish Embossed Velvet Janamaz – Royal Emerald',
    'turkish-embossed-velvet-janamaz-emerald',
    1850,
    'c-prayer',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=85',
    950,
    'High-density plush Turkish velvet prayer mat with traditional Mihrab design and soft fringe. Gentle on knees and joints during prostration.',
    2200,
    'Top Quality',
    'Standard Adult 80×120cm',
    'Bursa, Turkey',
    ['Thick high-density velvet pile','Anti-slip back weave','Colorfast premium Turkish yarn']
  ),
  p(
    'tasbeeh-digital-smart',
    'Smart Digital Zikr Ring & Counter – OLED Display',
    'smart-digital-zikr-ring-counter',
    1250,
    'c-prayer',
    'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=85',
    90,
    'Ergonomic ring-style digital zikr tally counter with vibration feedback, bright OLED counter, and rechargeable lithium battery.',
    1600,
    'Modern Tech',
    'Universal Ring Fit',
    'Imported',
    ['Vibration alert at 33, 66, 99 counts','Rechargeable USB-C port','Lightweight waterproof design']
  ),

  // SUNNAH FOODS
  p(
    'honey-sidr-500g',
    'Pure Wild Sidr (Beri) Honey – 500g Glass Jar',
    'pure-wild-sidr-honey-500g',
    2800,
    'c-sunnah-foods',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=85',
    800,
    '100% Raw, unfiltered Sidr honey harvested from blooming wild Beri trees. Distinctive rich taste, golden amber shade, and recognized wellness qualities.',
    3200,
    '100% Pure Raw',
    '500g Jar',
    'Potohar / Karak Region',
    ['Laboratory tested for 100% purity','Cold-extracted without heating','Rich in antioxidants and natural enzymes']
  ),
  p(
    'zamzam-5l',
    'Original Makkah Zamzam Water – 5 Litres',
    'original-makkah-zamzam-water-5l',
    5900,
    'c-sunnah-foods',
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=85',
    5500,
    'Genuine King Abdullah Project Zamzam water in factory-sealed 5-litre carton. Shipped carefully with secure packaging to your doorstep across Pakistan.',
    6500,
    'Blessed Water',
    '5L Canister',
    'Makkah Al-Mukarramah, KSA',
    ['Tamper-proof King Abdullah Project seal','Tested and certified genuine','Delivered with care all over Pakistan']
  ),

  // HAJJ & UMRAH
  p(
    'ehram-toweling-cotton',
    'Luxury Pure Cotton Toweling Ehram – 1400g Set',
    'luxury-cotton-toweling-ehram-1400g',
    2400,
    'c-umrah',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=85',
    1400,
    'Heavyweight 1400g two-piece pure combed cotton toweling Ihram. Super-absorbent, non-transparent, cool in hot climate, and soft against the skin.',
    2800,
    'Hajj Season',
    '2-Piece Full Set',
    'Faisalabad, Pakistan',
    ['Zero synthetic blend','Superior sweat absorbency','Non-transparent heavy weave']
  )
];

export const banners:Banner[]=[
  {
    id:'b1',
    title:'Blessed Madinah Dates & Islamic Lifestyle Essentials',
    subtitle:'Directly imported Ajwa, Medjool, Mabroom and authentic Sunnah foods delivered with care to your doorstep anywhere in Pakistan.',
    image_url:'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1700&q=85',
    button_text:'Explore Date Varieties',
    button_url:'/category/dates',
    active:true,
    sort_order:1
  }
];

export const money=(n:number)=>'Rs. '+Math.round(n).toLocaleString('en-PK');
