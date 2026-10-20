'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Menu, X, Instagram, Heart, ArrowRight, Plus, 
  Minus, Trash2, MessageCircle, CheckCircle2, ShieldCheck, Truck, 
  Clock, Sparkles, ChevronDown, Award, Star
} from 'lucide-react';
import type { Product, Category, CartLine, Banner } from '@/lib/types';
import { money } from '@/lib/demo';

const WHATSAPP_NUMBER = '923451579846';

type Store = {
  cart: CartLine[];
  add: (p: Product, qty?: number) => void;
  quantity: (p: Product, n: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const StoreContext = createContext<Store | null>(null);

export const useStore = () => {
  const s = useContext(StoreContext);
  if (!s) throw Error('Store context missing');
  return s;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem('hadi-cart') || '[]');
      if (Array.isArray(v)) setCart(v);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('hadi-cart', JSON.stringify(cart));
  }, [cart]);

  const quantity = (p: Product, n: number) => {
    setCart(prev => {
      if (n <= 0) return prev.filter(x => x.product.id !== p.id);
      const exists = prev.some(x => x.product.id === p.id);
      if (exists) {
        return prev.map(x => x.product.id === p.id ? { product: p, quantity: Math.min(99, n) } : x);
      }
      return [...prev, { product: p, quantity: Math.min(99, n) }];
    });
  };

  const add = (p: Product, qty: number = 1) => {
    const existing = cart.find(x => x.product.id === p.id)?.quantity || 0;
    quantity(p, existing + qty);
  };

  const count = cart.reduce((a, x) => a + x.quantity, 0);
  const total = cart.reduce((a, x) => a + (x.product.price * x.quantity), 0);

  return (
    <StoreContext.Provider value={{ cart, add, quantity, clear: () => setCart([]), count, total }}>
      {children}
    </StoreContext.Provider>
  );
}

// Generate pre-filled WhatsApp link
export function getWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function Header({ categories }: { categories: Category[] }) {
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [datesDropdown, setDatesDropdown] = useState(false);
  const { count } = useStore();

  const mainCategories = categories.filter(c => !c.parent_id);
  const dateSubcategories = categories.filter(c => c.parent_id === 'c-dates');

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-banner">
        <div className="shell top-banner-inner">
          <div className="top-badge">
            <Truck size={14} /> Free Delivery Nationwide on orders above Rs. 3,000
          </div>
          <div className="top-links">
            <span>Cash On Delivery (COD) Available</span>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="top-wa">
              <MessageCircle size={14} /> Helpline & Order: +92 345 1579846
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="shell header-row">
          <button 
            aria-label="Toggle menu" 
            className="mobile-toggle" 
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Logo */}
          <Link className="brand" href="/">
            <span className="brand-emblem">ه</span>
            <div className="brand-text">
              <span className="brand-title">HADI <b>ISLAMIC</b></span>
              <span className="brand-sub">PREMIUM DATES & SUNNAH ESSENTIALS</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form className="header-search" action="/shop" method="GET">
            <input 
              name="q" 
              placeholder="Search Ajwa dates, Medjool, Attar, Janamaz..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={18} /> Search
            </button>
          </form>

          {/* Header Action Icons */}
          <div className="header-actions">
            <a 
              href={getWhatsAppUrl('Assalamualaikum, I want to inquire about products at Hadi Islamic.')}
              target="_blank" 
              rel="noreferrer" 
              className="wa-header-btn"
            >
              <MessageCircle size={18} />
              <div className="wa-btn-text">
                <small>Order on WhatsApp</small>
                <strong>0345 1579846</strong>
              </div>
            </a>

            <button 
              className="search-mobile-btn" 
              aria-label="Search" 
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={22} />
            </button>

            <Link className="cart-badge" href="/checkout" aria-label="Cart">
              <ShoppingBag size={22} />
              <span className="cart-count">{count}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <form className="mobile-search shell" action="/shop" method="GET">
            <input 
              name="q" 
              placeholder="Search dates, honey, attar, janamaz..." 
              autoFocus
            />
            <button type="submit" className="btn">Search</button>
          </form>
        )}

        {/* Navigation Bar */}
        <nav className="main-nav">
          <div className="shell nav-inner">
            <Link href="/" className="nav-item">Home</Link>
            
            {/* Dates Mega / Dropdown */}
            <div 
              className="nav-item has-dropdown"
              onMouseEnter={() => setDatesDropdown(true)}
              onMouseLeave={() => setDatesDropdown(false)}
            >
              <Link href="/category/dates" className="nav-link-dropdown">
                Dates (Khajoor) <ChevronDown size={14} />
              </Link>
              {datesDropdown && (
                <div className="mega-menu">
                  <div className="mega-col">
                    <h4>Browse by Variety</h4>
                    <Link href="/category/dates" className="mega-all-link">
                      View All Dates Varieties →
                    </Link>
                    <div className="mega-list">
                      {dateSubcategories.map(s => (
                        <Link key={s.id} href={`/category/${s.slug}`} className="mega-item">
                          <span>{s.name}</span>
                          <small>{s.arabic_name}</small>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mega-col mega-feature">
                    <img 
                      src="https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=400&q=80" 
                      alt="Madinah Ajwa Dates" 
                    />
                    <h5>Blessed Madinah Ajwa</h5>
                    <p>Authentic Seven Dates from certified Madinah orchards.</p>
                    <Link href="/category/ajwa-dates" className="btn btn-sm">Explore Ajwa</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Categories */}
            {mainCategories.filter(c => c.slug !== 'dates').map(c => (
              <Link key={c.id} href={`/category/${c.slug}`} className="nav-item">
                {c.name}
              </Link>
            ))}

            <Link href="/shop" className="nav-item highlight">All Products</Link>
            <Link href="/about" className="nav-item">Our Story</Link>
            <Link href="/contact" className="nav-item">Contact</Link>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {menu && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-head">
              <strong>Categories</strong>
              <button onClick={() => setMenu(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="mobile-nav-links">
              <Link onClick={() => setMenu(false)} href="/">Home</Link>
              <Link onClick={() => setMenu(false)} href="/category/dates" className="mobile-parent-link">
                Dates (All Varieties)
              </Link>
              <div className="mobile-sub-links">
                {dateSubcategories.map(s => (
                  <Link onClick={() => setMenu(false)} key={s.id} href={`/category/${s.slug}`}>
                    • {s.name}
                  </Link>
                ))}
              </div>
              {mainCategories.filter(c => c.slug !== 'dates').map(c => (
                <Link onClick={() => setMenu(false)} key={c.id} href={`/category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
              <Link onClick={() => setMenu(false)} href="/shop">Shop All Products</Link>
              <Link onClick={() => setMenu(false)} href="/about">About Us</Link>
              <Link onClick={() => setMenu(false)} href="/contact">Contact & Delivery</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="shell foot-grid">
          <div>
            <div className="footer-logo">
              <span className="brand-emblem">ه</span>
              <div>
                <h3>HADI ISLAMIC</h3>
                <small>AUTHENTIC SUNNAH & LIFESTYLE</small>
              </div>
            </div>
            <p className="foot-desc">
              Dedicated to bringing pure, authentic Madinah Dates, natural Sunnah remedies, prayer essentials, and fragrance to Muslim homes across Pakistan.
            </p>
            <div className="foot-trust">
              <span>✓ 100% Genuine Imported Products</span>
              <span>✓ Cash on Delivery Nationwide</span>
              <span>✓ Secure & Clean Food Packaging</span>
            </div>
            <div className="social">
              <a aria-label="Instagram" target="_blank" rel="noreferrer" href="https://www.instagram.com/atifgulzar_wattoo?exln=MXMwYzNvZXZnbTJ6Zg==">
                <Instagram size={18} />
              </a>
              <a aria-label="WhatsApp" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4>Date Varieties (Khajoor)</h4>
            <Link href="/category/ajwa-dates">Ajwa Al-Madinah</Link>
            <Link href="/category/medjool-dates">Medjool Jumbo</Link>
            <Link href="/category/mabroom-dates">Mabroom Saudi</Link>
            <Link href="/category/sukkari-dates">Sukkari Rutab</Link>
            <Link href="/category/amber-dates">Amber Royal</Link>
            <Link href="/category/safawi-dates">Safawi / Kalmi</Link>
            <Link href="/category/sagai-dates">Sagai Dates</Link>
          </div>

          <div>
            <h4>Collections</h4>
            <Link href="/category/dates">All Dates</Link>
            <Link href="/category/attar-fragrances">Attar & Perfumes</Link>
            <Link href="/category/prayer-essentials">Prayer Mats & Tasbeeh</Link>
            <Link href="/category/sunnah-foods">Sidr Honey & Sunnah Foods</Link>
            <Link href="/category/hajj-umrah">Hajj & Umrah Essentials</Link>
            <Link href="/shop">Full Catalogue</Link>
          </div>

          <div>
            <h4>Customer Helpline</h4>
            <div className="contact-box">
              <p><strong>Phone / WhatsApp:</strong><br/><a href={`https://wa.me/${WHATSAPP_NUMBER}`}>+92 345 1579846</a></p>
              <p><strong>Email Support:</strong><br/><a href="mailto:atif1256@gmail.com">atif1256@gmail.com</a></p>
              <p><strong>Delivery Coverage:</strong><br/>All Cities & Districts of Pakistan via Express Courier</p>
            </div>
            <div className="policy-links">
              <Link href="/policies/shipping">Shipping Policy</Link>
              <Link href="/policies/returns">Returns & Refunds</Link>
              <Link href="/policies/privacy">Privacy & Terms</Link>
            </div>
          </div>
        </div>

        <div className="copyright shell">
          <span>© {new Date().getFullYear()} Hadi Islamic Store (Pakistan). All rights reserved.</span>
          <span>Cash On Delivery • Easy Bank Transfer • Raast • JazzCash</span>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a 
        aria-label="Chat on WhatsApp" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noreferrer" 
        href={getWhatsAppUrl('Assalamualaikum, I am visiting Hadi Islamic and would like to place an order or ask a question.')}
      >
        <span className="wa-tooltip">Order on WhatsApp</span>
        <MessageCircle size={30} />
      </a>
    </>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useStore();
  const [added, setAdded] = useState(false);
  const sale = product.compare_at_price && product.compare_at_price > product.price;

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const waOrderText = `Assalamualaikum! I would like to order:
*${product.name}*
Price: ${money(product.price)}
Package: ${product.package_size || `${product.weight_grams}g`}
Please confirm availability and shipping.`;

  return (
    <article className="card">
      <div className="card-top">
        {product.badge && <span className="card-badge">{product.badge}</span>}
        {sale && (
          <span className="sale-badge">
            SAVE {Math.round((1 - product.price / product.compare_at_price!) * 100)}%
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="card-media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} loading="lazy" />
          ) : (
            <div className="empty-img">HADI ISLAMIC</div>
          )}
        </Link>
      </div>

      <div className="card-body">
        {product.package_size && <span className="size-chip">{product.package_size}</span>}
        
        <Link className="card-title" href={`/product/${product.slug}`} title={product.name}>
          {product.name}
        </Link>

        {product.origin && (
          <p className="card-origin">📍 {product.origin}</p>
        )}

        <div className="card-price-row">
          <span className="price-main">{money(product.price)}</span>
          {sale && <del className="price-compare">{money(product.compare_at_price!)}</del>}
        </div>

        <div className="card-actions">
          <button 
            className={`btn-add ${added ? 'btn-added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <Plus size={16} /> {added ? 'Added!' : 'Add to Cart'}
          </button>
          
          <a 
            href={getWhatsAppUrl(waOrderText)} 
            target="_blank" 
            rel="noreferrer"
            className="btn-wa"
            title="Order directly via WhatsApp"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

// Subcategory Grid Card
export function SubcategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link href={`/category/${category.slug}`} className="subcat-card">
      <div className="subcat-img-box">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} />
        ) : (
          <div className="empty-img">HADI</div>
        )}
        <span className="subcat-count-badge">{count} Items</span>
      </div>
      <div className="subcat-details">
        {category.arabic_name && <small className="subcat-arabic">{category.arabic_name}</small>}
        <h3>{category.name}</h3>
        {category.description && <p>{category.description}</p>}
        <span className="subcat-cta">View Products →</span>
      </div>
    </Link>
  );
}

// Category Hub Page View
export function CategoryHubView({
  category,
  subcategories,
  parentCategory,
  products,
  allCategories
}: {
  category: Category;
  subcategories: Category[];
  parentCategory: Category | null;
  products: Product[];
  allCategories: Category[];
}) {
  const [activeSub, setActiveSub] = useState<string>('all');

  const filteredProducts = activeSub === 'all'
    ? products
    : products.filter(p => p.category_id === activeSub);

  return (
    <div className="shell category-hub">
      {/* Breadcrumb */}
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        {parentCategory && (
          <>
            <Link href={`/category/${parentCategory.slug}`}>{parentCategory.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="current">{category.name}</span>
      </nav>

      {/* Hero Category Banner */}
      <div className="cat-hero">
        <div className="cat-hero-text">
          {category.arabic_name && <p className="cat-arabic-kicker">{category.arabic_name}</p>}
          <h1>{category.name}</h1>
          <p className="cat-hero-desc">
            {category.description || 'Explore our carefully inspected, 100% genuine collection.'}
          </p>
        </div>
      </div>

      {/* Subcategory Grid First (For categories like Dates that have types) */}
      {subcategories.length > 0 && (
        <section className="variety-section">
          <div className="section-title-box">
            <div>
              <p className="title-kicker">SELECT A VARIETY</p>
              <h2>Explore Types of {category.name}</h2>
            </div>
            <p className="title-sub">
              Click any date type below to view its specific pack sizes, grades and prices.
            </p>
          </div>

          <div className="subcategory-grid">
            {subcategories.map(sub => {
              const count = products.filter(p => p.category_id === sub.id).length;
              return (
                <SubcategoryCard key={sub.id} category={sub} count={count} />
              );
            })}
          </div>
        </section>
      )}

      {/* Products Section with Filter Chips */}
      <section className="cat-products-section">
        <div className="products-head">
          <div>
            <h3>All Products in {category.name}</h3>
            <p className="products-count">Showing {filteredProducts.length} items</p>
          </div>

          {/* Quick Subcategory Filter Chips */}
          {subcategories.length > 0 && (
            <div className="filter-chips">
              <button 
                className={`chip ${activeSub === 'all' ? 'active' : ''}`}
                onClick={() => setActiveSub('all')}
              >
                All Varieties ({products.length})
              </button>
              {subcategories.map(sub => (
                <button
                  key={sub.id}
                  className={`chip ${activeSub === sub.id ? 'active' : ''}`}
                  onClick={() => setActiveSub(sub.id)}
                >
                  {sub.name} ({products.filter(p => p.category_id === sub.id).length})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-grid">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty-box">
            <p>No products found in this selection.</p>
          </div>
        )}
      </section>

      {/* WhatsApp Help Banner */}
      <div className="wa-help-banner">
        <div>
          <h3>Need Special Packaging or Bulk Wholesale Orders?</h3>
          <p>We provide custom gift hampers, Ramadan corporate packs and wholesale cartons across Pakistan.</p>
        </div>
        <a 
          href={getWhatsAppUrl(`Assalamualaikum, I am interested in bulk/wholesale orders for ${category.name}.`)}
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-wa-lg"
        >
          <MessageCircle size={20} /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

// Home Page View
export function HomeView({
  products,
  categories,
  banners,
  demo
}: {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  demo: boolean;
}) {
  const mainBanner = banners[0];
  const dateSubcategories = categories.filter(c => c.parent_id === 'c-dates');
  const mainCategories = categories.filter(c => !c.parent_id);
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-backdrop"
          style={{ backgroundImage: `url('${mainBanner?.image_url || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1700&q=85'}')` }}
        />
        <div className="hero-overlay" />
        <div className="shell hero-content">
          <span className="hero-badge"><Sparkles size={14} /> BLESSED BY SUNNAH • AUTHENTIC IMPORTS</span>
          <h1>{mainBanner?.title || 'Blessed Madinah Dates & Sunnah Essentials'}</h1>
          <p>{mainBanner?.subtitle || 'Directly imported Ajwa, Medjool, Mabroom and authentic Sunnah foods delivered to your doorstep anywhere in Pakistan.'}</p>
          <div className="hero-btn-row">
            <Link href="/category/dates" className="btn btn-gold">
              Explore Date Varieties <ArrowRight size={16} />
            </Link>
            <a 
              href={getWhatsAppUrl('Assalamualaikum, I want to inquire about your fresh dates arrival.')}
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-wa-outline"
            >
              <MessageCircle size={16} /> WhatsApp Order
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar (Similar to IslamicMart) */}
      <section className="trust-strip">
        <div className="shell trust-grid">
          <div className="trust-item">
            <ShieldCheck size={28} className="trust-icon" />
            <div>
              <strong>100% Authentic Quality</strong>
              <small>Genuine Madinah imports & pure products</small>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={28} className="trust-icon" />
            <div>
              <strong>Cash on Delivery (COD)</strong>
              <small>Serving all cities across Pakistan</small>
            </div>
          </div>
          <div className="trust-item">
            <Clock size={28} className="trust-icon" />
            <div>
              <strong>Fast 24-48h Dispatch</strong>
              <small>Delivered via top express couriers</small>
            </div>
          </div>
          <div className="trust-item">
            <MessageCircle size={28} className="trust-icon" />
            <div>
              <strong>Instant WhatsApp Help</strong>
              <small>Quick replies on +92 345 1579846</small>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Category Strip (Just like IslamicMart) */}
      <section className="shell category-strip-section">
        <div className="section-header">
          <p className="kicker">SHOP BY CATEGORY</p>
          <h2>Popular Collections</h2>
        </div>
        <div className="circle-cats">
          {mainCategories.map(cat => (
            <Link href={`/category/${cat.slug}`} key={cat.id} className="circle-cat-card">
              <div className="circle-cat-img">
                <img src={cat.image_url || ''} alt={cat.name} />
              </div>
              <span className="circle-cat-title">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DATE VARIETIES SHOWCASE (Subcategory Grid First) */}
      <section className="dates-showcase">
        <div className="shell">
          <div className="section-header center">
            <span className="kicker-badge">SUNNAH DELICACIES</span>
            <h2>Select Your Favourite Date Variety</h2>
            <p className="section-desc">
              Every variety has its own distinctive flavor profile, texture, origin and health benefits. Click below to see all options and weights.
            </p>
          </div>

          <div className="subcategory-grid">
            {dateSubcategories.map(sub => {
              const count = products.filter(p => p.category_id === sub.id).length;
              return (
                <SubcategoryCard key={sub.id} category={sub} count={count} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="shell section">
        <div className="section-header between">
          <div>
            <p className="kicker">HANDPICKED FOR YOU</p>
            <h2>Best-Selling Essentials</h2>
          </div>
          <Link href="/shop" className="link-arrow">
            View All Catalogue →
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo Band */}
      <section className="promo-band">
        <div className="shell promo-inner">
          <div className="promo-text">
            <span className="kicker-white">AUTHENTIC HADITH SUNNAH</span>
            <h2>Ajwa Al-Madinah: Seven Dates in the Morning</h2>
            <p>
              "Whoever has seven Ajwa dates every morning he will not be harmed on that day by poison or magic." (Sahih Bukhari). Sourced straight from certified orchards in the blessed city of Madinah.
            </p>
            <div className="promo-btns">
              <Link href="/category/ajwa-dates" className="btn btn-gold">Order Authentic Ajwa</Link>
              <a href={getWhatsAppUrl('Assalamualaikum, please tell me about Ajwa dates pack sizes and prices.')} className="btn btn-wa-outline">
                <MessageCircle size={16} /> WhatsApp Inquiry
              </a>
            </div>
          </div>
          <div className="promo-image">
            <img 
              src="https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=900&q=85" 
              alt="Ajwa Dates" 
            />
          </div>
        </div>
      </section>

      {/* Customer Trust & Reviews */}
      <section className="shell section reviews-section">
        <div className="section-header center">
          <p className="kicker">TESTIMONIALS</p>
          <h2>Loved by Customers Across Pakistan</h2>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"The Ajwa dates were super fresh, soft and authentic with the distinct white lines. Delivered in Lahore within 2 days in a sealed box."</p>
            <strong>Muhammad Usman</strong>
            <small>Lahore, Pakistan</small>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"Ordered Medjool jumbo dates and Turkish velvet Janamaz. The quality exceeded my expectations. Ordering via WhatsApp was very smooth."</p>
            <strong>Syed Tariq Shah</strong>
            <small>Islamabad, Pakistan</small>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"Best quality Sidr honey and Dehn Al Oud. 100% genuine fragrance and pure honey. Highly recommended for authentic Islamic items."</p>
            <strong>Farhan Ahmed</strong>
            <small>Karachi, Pakistan</small>
          </div>
        </div>
      </section>
    </>
  );
}

// Product Detail Page View
export function DetailView({
  product,
  category
}: {
  product: Product;
  category?: Category;
}) {
  const { add } = useStore();
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(product.image_url || '');
  const [added, setAdded] = useState(false);

  const sale = product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waOrderText = `Assalamualaikum!
I want to order:
*${product.name}*
Quantity: ${qty}
Package: ${product.package_size || `${product.weight_grams}g`}
Total Price: ${money(product.price * qty)}

Please confirm order details and delivery to my city.`;

  return (
    <div className="shell detail-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="current">{product.name}</span>
      </nav>

      <div className="detail-layout">
        {/* Images */}
        <div className="detail-gallery">
          <div className="detail-main-img">
            {mainImg ? (
              <img src={mainImg} alt={product.name} />
            ) : (
              <div className="empty-img">HADI ISLAMIC</div>
            )}
            {product.badge && <span className="card-badge">{product.badge}</span>}
          </div>
          {product.gallery.length > 1 && (
            <div className="detail-thumbs">
              {product.gallery.map((img, i) => (
                <button 
                  key={i} 
                  className={`thumb ${mainImg === img ? 'active' : ''}`}
                  onClick={() => setMainImg(img)}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="detail-info">
          {product.package_size && (
            <span className="detail-chip">{product.package_size}</span>
          )}

          <h1>{product.name}</h1>

          {product.origin && (
            <p className="detail-origin">📍 Origin: <strong>{product.origin}</strong></p>
          )}

          <div className="detail-price-box">
            <span className="detail-price-num">{money(product.price)}</span>
            {sale && (
              <>
                <del className="detail-compare">{money(product.compare_at_price!)}</del>
                <span className="save-tag">
                  SAVE {Math.round((1 - product.price / product.compare_at_price!) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          {/* Key Product Highlights */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="detail-highlights">
              <h4>Product Highlights</h4>
              <ul>
                {product.benefits.map((b, i) => (
                  <li key={i}><CheckCircle2 size={16} /> {b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="purchase-panel">
            <div className="qty-picker">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                <Minus size={16} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase">
                <Plus size={16} />
              </button>
            </div>

            <button 
              className={`btn btn-cart-lg ${added ? 'btn-added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag size={18} /> {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>

          {/* Direct WhatsApp Instant Order Button */}
          <a 
            href={getWhatsAppUrl(waOrderText)} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-wa-buy"
          >
            <MessageCircle size={20} /> Order Instantly via WhatsApp
          </a>

          {/* Assurances */}
          <div className="detail-assurances">
            <div><Truck size={18} /> Cash on Delivery Available Nationwide</div>
            <div><ShieldCheck size={18} /> 100% Genuine Sunnah Product Guarantee</div>
            <div><Clock size={18} /> Orders dispatched within 24–48 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shop View
export function ShopView({
  products,
  categories,
  initialQuery = '',
  initialCategory = ''
}: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState('featured');

  const filtered = products
    .filter(p => {
      const matchesCat = !cat || p.category_id === cat || 
        categories.find(c => c.id === p.category_id)?.parent_id === cat;
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="shell section">
      <div className="shop-header">
        <h1>All Products Catalogue</h1>
        <p>Browse our complete inventory of authentic dates, fragrances and essentials.</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          <button 
            className={`side-link ${!cat ? 'active' : ''}`}
            onClick={() => setCat('')}
          >
            All Products <span>({products.length})</span>
          </button>
          {categories.map(c => (
            <button 
              key={c.id}
              className={`side-link ${c.parent_id ? 'side-sub' : ''} ${cat === c.id ? 'active' : ''}`}
              onClick={() => setCat(c.id)}
            >
              {c.parent_id ? `↳ ${c.name}` : c.name}
              <span>({products.filter(p => p.category_id === c.id).length})</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <div>
          <div className="filter-bar">
            <input 
              placeholder="Search by keyword..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          <p className="result-count">Showing {filtered.length} products</p>

          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty-box">
              <p>No products match your search. Try different keywords or select another category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
