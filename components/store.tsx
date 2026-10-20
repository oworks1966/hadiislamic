'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Menu, X, Instagram, Facebook, Heart, ArrowRight, Plus, 
  Minus, Trash2, MessageCircle, CheckCircle2, ShieldCheck, Truck, 
  Clock, Sparkles, ChevronDown, Award, Star, MapPin, ExternalLink,
  Scale, Eye, User, Play, Check, RefreshCw, Send, ChevronRight, Lock
} from 'lucide-react';
import type { Product, Category, CartLine, Banner, BlogPost } from '@/lib/types';
import { money } from '@/lib/demo';

export const WHATSAPP_NUMBER = '923451579846';
export const WHATSAPP_CATALOG_URL = 'https://wa.me/c/225718499836004';
export const STORE_ADDRESS = 'Shop # G-5 Ground Floor, Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, 54000, Pakistan';
export const STORE_HOURS = 'Open 24 Hours (7 Days a Week)';
export const FREE_SHIPPING_THRESHOLD = 3000;

export const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49V8.65a8.28 8.28 0 0 0 4.84 1.54V6.75a4.83 4.83 0 0 1-.94-.06z" />
  </svg>
);

// Pre-fill WhatsApp URL helper
export function getWhatsAppUrl(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

type UserProfile = {
  name: string;
  email: string;
  phone?: string;
};

type StoreContextType = {
  cart: CartLine[];
  add: (p: Product, qty?: number, variation?: string) => void;
  quantity: (p: Product, n: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  total: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  compare: Product[];
  toggleCompare: (p: Product) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  compareCount: number;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  user: UserProfile | null;
  login: (name: string, email: string, phone?: string) => void;
  logout: () => void;
  waModalOpen: boolean;
  setWaModalOpen: (open: boolean) => void;
  videoModalOpen: boolean;
  setVideoModalOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const s = useContext(StoreContext);
  if (!s) throw Error('Store context missing');
  return s;
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Modals & Drawers state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('hadi-cart') || '[]');
      if (Array.isArray(savedCart)) setCart(savedCart);

      const savedWishlist = JSON.parse(localStorage.getItem('hadi-wishlist') || '[]');
      if (Array.isArray(savedWishlist)) setWishlist(savedWishlist);

      const savedCompare = JSON.parse(localStorage.getItem('hadi-compare') || '[]');
      if (Array.isArray(savedCompare)) setCompare(savedCompare);

      const savedUser = JSON.parse(localStorage.getItem('hadi-user') || 'null');
      if (savedUser) setUser(savedUser);
    } catch {}
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('hadi-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hadi-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('hadi-compare', JSON.stringify(compare));
  }, [compare]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hadi-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hadi-user');
    }
  }, [user]);

  // Cart operations
  const quantity = (p: Product, n: number) => {
    setCart(prev => {
      if (n <= 0) return prev.filter(x => x.product.id !== p.id);
      const exists = prev.some(x => x.product.id === p.id);
      if (exists) {
        return prev.map(x => x.product.id === p.id ? { ...x, quantity: Math.min(99, n) } : x);
      }
      return [...prev, { product: p, quantity: Math.min(99, n) }];
    });
  };

  const add = (p: Product, qty: number = 1, variation?: string) => {
    setCart(prev => {
      const existing = prev.find(x => x.product.id === p.id && x.selectedVariation === variation);
      if (existing) {
        return prev.map(x => 
          (x.product.id === p.id && x.selectedVariation === variation)
            ? { ...x, quantity: Math.min(99, x.quantity + qty) }
            : x
        );
      }
      return [...prev, { product: p, quantity: Math.min(99, qty), selectedVariation: variation }];
    });
    setCartDrawerOpen(true);
  };

  const remove = (productId: string) => {
    setCart(prev => prev.filter(x => x.product.id !== productId));
  };

  const clear = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (p: Product) => {
    setWishlist(prev => {
      const exists = prev.some(x => x.id === p.id);
      if (exists) {
        return prev.filter(x => x.id !== p.id);
      }
      return [...prev, p];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(x => x.id === productId);

  // Compare operations
  const toggleCompare = (p: Product) => {
    setCompare(prev => {
      const exists = prev.some(x => x.id === p.id);
      if (exists) {
        return prev.filter(x => x.id !== p.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return prev;
      }
      return [...prev, p];
    });
  };

  const clearCompare = () => setCompare([]);
  const isInCompare = (productId: string) => compare.some(x => x.id === productId);

  // Auth operations
  const login = (name: string, email: string, phone?: string) => {
    setUser({ name, email, phone });
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const count = cart.reduce((a, x) => a + x.quantity, 0);
  const total = cart.reduce((a, x) => a + (x.product.price * x.quantity), 0);

  return (
    <StoreContext.Provider value={{
      cart,
      add,
      quantity,
      remove,
      clear,
      count,
      total,
      cartDrawerOpen,
      setCartDrawerOpen,
      wishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length,
      compare,
      toggleCompare,
      clearCompare,
      isInCompare,
      compareCount: compare.length,
      quickViewProduct,
      setQuickViewProduct,
      authModalOpen,
      setAuthModalOpen,
      user,
      login,
      logout,
      waModalOpen,
      setWaModalOpen,
      videoModalOpen,
      setVideoModalOpen
    }}>
      {children}
      <FloatingSocialBar />
      {waModalOpen && <WhatsAppPopupModal onClose={() => setWaModalOpen(false)} />}
      {cartDrawerOpen && <CartDrawer />}
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      {videoModalOpen && <VideoShowcaseModal onClose={() => setVideoModalOpen(false)} />}
    </StoreContext.Provider>
  );
}

// ==========================================
// CART DRAWER (Altaiba-matching Slide-out)
// ==========================================
export function CartDrawer() {
  const { cart, quantity, remove, total, count, setCartDrawerOpen, clear } = useStore();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  const waCartText = `Assalamualaikum! I would like to place an order for the items in my cart:
${cart.map((x, i) => `${i + 1}. *${x.product.name}* ${x.selectedVariation ? `(${x.selectedVariation})` : ''} - Qty: ${x.quantity} - ${money(x.product.price * x.quantity)}`).join('\n')}

*Total Estimated Amount: ${money(total)}*
Delivery: ${total >= FREE_SHIPPING_THRESHOLD ? 'FREE Delivery' : 'Standard Shipping (Rs. 250)'}
Please confirm order and delivery schedule to my address.`;

  return (
    <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)} role="dialog" aria-modal="true">
      <div className="cart-drawer-card" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-head">
          <div className="drawer-title-row">
            <ShoppingBag size={20} className="text-gold" />
            <h3>Shopping Bag <span>({count})</span></h3>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={() => setCartDrawerOpen(false)} 
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="free-shipping-bar">
          <div className="free-shipping-msg">
            <Truck size={16} />
            {remainingForFreeShipping === 0 ? (
              <span className="free-ship-success">Congratulations! You unlocked <strong>FREE Standard Delivery</strong>!</span>
            ) : (
              <span>Add <strong>{money(remainingForFreeShipping)}</strong> more to enjoy <strong>FREE Shipping</strong>!</span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div 
              className={`shipping-progress-fill ${remainingForFreeShipping === 0 ? 'complete' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h4>Your bag is currently empty</h4>
              <p>Explore our fresh Madinah dates, prayer mats, and Sunnah imports.</p>
              <Link 
                href="/shop" 
                className="btn btn-gold btn-sm"
                onClick={() => setCartDrawerOpen(false)}
              >
                Start Shopping Now
              </Link>
            </div>
          ) : (
            <div className="cart-lines-list">
              {cart.map(line => (
                <div key={line.product.id + (line.selectedVariation || '')} className="cart-line-item">
                  <img src={line.product.image_url || ''} alt={line.product.name} className="cart-thumb" />
                  <div className="cart-line-info">
                    <Link 
                      href={`/product/${line.product.slug}`} 
                      className="cart-line-title"
                      onClick={() => setCartDrawerOpen(false)}
                    >
                      {line.product.name}
                    </Link>
                    {line.selectedVariation && (
                      <span className="cart-var-tag">Option: {line.selectedVariation}</span>
                    )}
                    <span className="cart-line-price">{money(line.product.price)}</span>
                    <div className="cart-qty-ctrl">
                      <button 
                        onClick={() => quantity(line.product, line.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{line.quantity}</span>
                      <button 
                        onClick={() => quantity(line.product, line.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                      <button 
                        className="cart-del-btn"
                        onClick={() => remove(line.product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-total">
                    {money(line.product.price * line.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout CTAs */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal-row">
              <span>Subtotal:</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="drawer-note">
              Taxes included. Nationwide delivery calculated at checkout.
            </p>

            <div className="drawer-action-buttons">
              <Link 
                href="/checkout" 
                className="btn btn-gold w-full btn-checkout-drawer"
                onClick={() => setCartDrawerOpen(false)}
              >
                Proceed to Checkout ({money(total)})
              </Link>

              <a 
                href={getWhatsAppUrl(waCartText)} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-wa-drawer w-full"
              >
                <MessageCircle size={16} /> Order Bag via WhatsApp
              </a>
            </div>

            <button className="clear-cart-link" onClick={clear}>
              Clear Shopping Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// QUICK VIEW MODAL
// ==========================================
export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useStore();
  const [selectedImg, setSelectedImg] = useState(product.image_url || '');
  const [qty, setQty] = useState(1);
  const [selectedVar, setSelectedVar] = useState<string>(
    product.variations && product.variations[0]?.options[0]?.label || ''
  );
  const [added, setAdded] = useState(false);

  const sale = product.compare_at_price && product.compare_at_price > product.price;

  const handleAdd = () => {
    add(product, qty, selectedVar || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const waQuickOrder = `Assalamualaikum! I would like to order:
*${product.name}*
${selectedVar ? `Variation: ${selectedVar}` : ''}
Quantity: ${qty}
Price: ${money(product.price * qty)}`;

  return (
    <div className="quickview-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quickview-card" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close Quick View">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Product Media */}
          <div className="quickview-media">
            <div className="quickview-main-img">
              <img src={selectedImg} alt={product.name} />
              {product.badge && <span className="card-badge">{product.badge}</span>}
              {sale && (
                <span className="sale-badge">
                  SAVE {Math.round((1 - product.price / product.compare_at_price!) * 100)}%
                </span>
              )}
            </div>
            {product.gallery.length > 1 && (
              <div className="quickview-thumbs">
                {product.gallery.map((img, i) => (
                  <button 
                    key={i} 
                    className={`qv-thumb ${selectedImg === img ? 'active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Form */}
          <div className="quickview-info">
            <div className="qv-tag-row">
              {product.package_size && <span className="size-chip">{product.package_size}</span>}
              {product.origin && <span className="origin-chip">📍 {product.origin}</span>}
            </div>

            <h2>{product.name}</h2>

            <div className="qv-rating-row">
              <span className="stars">★★★★★</span>
              <small>({product.review_count || 18} customer reviews)</small>
            </div>

            <div className="qv-price-row">
              <span className="price-main">{money(product.price)}</span>
              {sale && <del className="price-compare">{money(product.compare_at_price!)}</del>}
            </div>

            <p className="qv-desc">{product.description}</p>

            {/* Variations Picker */}
            {product.variations && product.variations.length > 0 && (
              <div className="qv-variations">
                <label>Select {product.variations[0].name}:</label>
                <div className="var-buttons">
                  {product.variations[0].options.map(opt => (
                    <button 
                      key={opt.label}
                      className={`var-chip ${selectedVar === opt.label ? 'active' : ''}`}
                      onClick={() => setSelectedVar(opt.label)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="qv-actions-row">
              <div className="qty-picker">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
                  <Minus size={15} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(99, qty + 1))} aria-label="Increase">
                  <Plus size={15} />
                </button>
              </div>

              <button 
                className={`btn btn-gold btn-qv-add ${added ? 'btn-added' : ''}`}
                onClick={handleAdd}
                disabled={product.stock === 0}
              >
                <ShoppingBag size={16} /> {added ? 'Added to Bag!' : 'Add to Bag'}
              </button>
            </div>

            <a 
              href={getWhatsAppUrl(waQuickOrder)} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-wa-outline w-full"
            >
              <MessageCircle size={16} /> Order Directly on WhatsApp
            </a>

            <div className="qv-footer-links">
              <Link href={`/product/${product.slug}`} onClick={onClose} className="qv-view-detail">
                View Full Product Specifications & Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CUSTOMER ACCOUNT / AUTH MODAL
// ==========================================
export function AuthModal({ onClose }: { onClose: () => void }) {
  const { user, login, logout } = useStore();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'register') {
      login(name || 'Valued Customer', email, phone);
    } else {
      login(name || email.split('@')[0] || 'Valued Customer', email, phone);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-head">
          <img src="/logo.png" alt="Hadi Islamic" className="auth-logo" />
          <h3>Hadi Islamic Account</h3>
          <p>Access your saved orders, wishlist, and express checkout details.</p>
        </div>

        {user ? (
          <div className="auth-logged-in">
            <div className="auth-user-badge">
              <User size={32} className="user-avatar-icon" />
              <div>
                <h4>Salam, {user.name}!</h4>
                <p>{user.email}</p>
                {user.phone && <small>Phone: {user.phone}</small>}
              </div>
            </div>

            <div className="auth-user-links">
              <Link href="/wishlist" onClick={onClose} className="auth-quick-link">
                <Heart size={16} /> View Saved Wishlist Items
              </Link>
              <Link href="/checkout" onClick={onClose} className="auth-quick-link">
                <ShoppingBag size={16} /> View Basket & Checkout
              </Link>
              <a 
                href={getWhatsAppUrl(`Salam! I need help with my account for ${user.email}`)}
                target="_blank" 
                rel="noreferrer" 
                className="auth-quick-link"
              >
                <MessageCircle size={16} /> Contact Account Support
              </a>
            </div>

            <button className="btn btn-outline w-full" onClick={logout}>
              Sign Out from Account
            </button>
          </div>
        ) : (
          <div className="auth-form-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
                onClick={() => setTab('signin')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={() => setTab('register')}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {tab === 'register' && (
                <div className="field">
                  <label>Full Name *</label>
                  <input 
                    required 
                    placeholder="Muhammad Ali" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
              )}

              <div className="field">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              {tab === 'register' && (
                <div className="field">
                  <label>Mobile Number (For WhatsApp Delivery Updates)</label>
                  <input 
                    placeholder="03XX XXXXXXX" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>
              )}

              <div className="field">
                <label>Password *</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn btn-gold w-full">
                {tab === 'signin' ? 'Sign In to Hadi Islamic' : 'Create Customer Account'}
              </button>

              <div className="auth-secure-note">
                <Lock size={12} /> 256-Bit SSL Encrypted & Private
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// VIDEO SHOWCASE MODAL
// ==========================================
export function VideoShowcaseModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="video-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="video-close-btn" onClick={onClose} aria-label="Close Video">
          <X size={22} />
        </button>

        <div className="video-container">
          <div className="video-placeholder-banner">
            <div className="video-header-badge">
              <Sparkles size={16} /> AUTHENTIC HARVEST & IMPORT PROCESS
            </div>
            <h3>Purity from the Blessed Lands</h3>
            <p>
              Witness how our certified Madinah Ajwa, Sukri, and Mabroom dates are selected, quality-checked in Saudi Arabia, and cold-chain transported to our Lahore flagship facility.
            </p>
            <div className="video-highlights-grid">
              <div className="v-highlight">
                <strong>1. Hand-Picked Quality</strong>
                <small>Graded by size, moisture & skin texture</small>
              </div>
              <div className="v-highlight">
                <strong>2. Hygienic Packaging</strong>
                <small>Food-grade vacuum sealed freshness</small>
              </div>
              <div className="v-highlight">
                <strong>3. Direct Haramain Heritage</strong>
                <small>100% genuine Zam Zam & pure Sidr honey</small>
              </div>
            </div>
            <a 
              href="https://www.tiktok.com/@hadi_islamic?_r=1&_t=ZS-9AbJ6raDmo0" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-wa-lg"
            >
              Watch Video Clips on our TikTok Channel <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// WHATSAPP POPUP MODAL
// ==========================================
export function WhatsAppPopupModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="wa-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="wa-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="wa-modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="wa-modal-header">
          <img src="/logo.png" alt="Hadi Islamic" className="wa-modal-logo" />
          <div className="wa-modal-head-text">
            <h3>Hadi Islamic Store</h3>
            <span className="wa-status-badge">
              <span className="online-dot" /> Open 24 Hours • Quick Replies
            </span>
          </div>
        </div>

        <div className="wa-modal-body">
          <p className="wa-modal-intro">
            Welcome to <strong>Hadi Islamic</strong>! Browse our complete WhatsApp Business Catalogue with images, weights, and live prices, or chat with our Lahore team right now.
          </p>

          <div className="wa-address-card">
            <div className="wa-addr-title">
              <MapPin size={16} /> <strong>Store Location:</strong>
            </div>
            <p className="wa-addr-text">
              Shop # G-5 Ground Floor, Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, 54000, Pakistan
            </p>
            <div className="wa-timing-pill">
              <Clock size={14} /> Open 24 Hours (7 Days a Week)
            </div>
          </div>

          <div className="wa-actions-group">
            <a 
              href={WHATSAPP_CATALOG_URL} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-wa-catalogue"
            >
              <ShoppingBag size={18} /> View WhatsApp Catalogue <ExternalLink size={14} />
            </a>

            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Assalamualaikum! I am inquiring about products at Hadi Islamic Store Lahore.')}`} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-wa-chat"
            >
              <MessageCircle size={18} /> Direct Chat / Order (+92 345 1579846)
            </a>
          </div>
        </div>

        <div className="wa-modal-footer">
          <span>Nationwide Cash on Delivery • 100% Genuine Sunnah Imports</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FLOATING SOCIAL DOCK
// ==========================================
export function FloatingSocialBar() {
  const { setWaModalOpen } = useStore();

  return (
    <aside className="floating-social-bar" aria-label="Quick social connections">
      <button 
        className="social-dock-btn wa-dock" 
        onClick={() => setWaModalOpen(true)}
        aria-label="WhatsApp Catalogue & Number"
      >
        <MessageCircle size={22} />
        <span className="dock-tooltip">WhatsApp & Catalogue</span>
      </button>

      <a 
        href="https://www.facebook.com/hadiislamic" 
        target="_blank" 
        rel="noreferrer" 
        className="social-dock-btn fb-dock"
        aria-label="Facebook Page"
      >
        <Facebook size={20} />
        <span className="dock-tooltip">Facebook</span>
      </a>

      <a 
        href="https://www.instagram.com/atifgulzar_wattoo?exln=MXMwYzNvZXZnbTJ6Zg==" 
        target="_blank" 
        rel="noreferrer" 
        className="social-dock-btn insta-dock"
        aria-label="Instagram Profile"
      >
        <Instagram size={20} />
        <span className="dock-tooltip">Instagram</span>
      </a>

      <a 
        href="https://www.tiktok.com/@hadi_islamic?_r=1&_t=ZS-9AbJ6raDmo0" 
        target="_blank" 
        rel="noreferrer" 
        className="social-dock-btn tt-dock"
        aria-label="TikTok Channel"
      >
        <TikTokIcon size={20} />
        <span className="dock-tooltip">TikTok</span>
      </a>
    </aside>
  );
}

// ==========================================
// HEADER (Altaiba-matching Layout & Badges)
// ==========================================
export function Header({ categories }: { categories: Category[] }) {
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [datesDropdown, setDatesDropdown] = useState(false);
  const { 
    count, 
    total, 
    setCartDrawerOpen, 
    wishlistCount, 
    compareCount, 
    setAuthModalOpen, 
    user 
  } = useStore();

  const mainCategories = categories.filter(c => !c.parent_id);
  const dateSubcategories = categories.filter(c => c.parent_id === 'c-dates');

  return (
    <>
      {/* Top Announcement Bar (Altaiba dark olive tone) */}
      <div className="top-banner">
        <div className="shell top-banner-inner">
          <div className="top-badge">
            <Truck size={14} /> Free Delivery Nationwide on orders above Rs. 3,000
          </div>
          <div className="top-links">
            <span className="top-pill">Cash On Delivery Available</span>
            <span className="top-hours"><Clock size={13} /> Lahore Store: Open 24h</span>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="top-wa">
              <MessageCircle size={14} /> WhatsApp Helpline: 0345 1579846
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

          {/* Official Provided Brand Logo */}
          <Link className="brand" href="/">
            <img src="/logo.png" alt="Hadi Islamic Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-title">HADI <b>ISLAMIC</b></span>
              <span className="brand-sub">PREMIUM DATES & SUNNAH ESSENTIALS</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form className="header-search" action="/shop" method="GET">
            <input 
              name="q" 
              placeholder="Search Qalmi dates, Sughai, Ihram, Janamaz, Sidr honey..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <Search size={18} /> Search
            </button>
          </form>

          {/* Action Icons: Account, Compare, Wishlist, Cart */}
          <div className="header-actions">
            {/* Account */}
            <button 
              className="header-icon-btn" 
              onClick={() => setAuthModalOpen(true)}
              aria-label="Customer Account"
              title={user ? `Signed in as ${user.name}` : 'Sign In / Register'}
            >
              <User size={21} />
              <span className="icon-label-sub">{user ? user.name.split(' ')[0] : 'Account'}</span>
            </button>

            {/* Compare */}
            <Link 
              className="header-icon-btn" 
              href="/compare"
              aria-label="Compare Products"
              title="Compare Products"
            >
              <Scale size={21} />
              {compareCount > 0 && <span className="action-badge">{compareCount}</span>}
              <span className="icon-label-sub">Compare</span>
            </Link>

            {/* Wishlist */}
            <Link 
              className="header-icon-btn" 
              href="/wishlist"
              aria-label="My Wishlist"
              title="Saved Items"
            >
              <Heart size={21} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
              <span className="icon-label-sub">Wishlist</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button 
              className="header-cart-btn" 
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Shopping Cart"
            >
              <div className="cart-icon-wrap">
                <ShoppingBag size={22} />
                <span className="cart-count">{count}</span>
              </div>
              <div className="cart-text-wrap">
                <small>My Bag</small>
                <strong>{money(total)}</strong>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {searchOpen && (
          <form className="mobile-search shell" action="/shop" method="GET">
            <input 
              name="q" 
              placeholder="Search dates, honey, ihram, prayer mat..." 
              autoFocus
            />
            <button type="submit" className="btn btn-gold">Search</button>
          </form>
        )}

        {/* Navigation Bar */}
        <nav className="main-nav">
          <div className="shell nav-inner">
            <Link href="/" className="nav-item">Home</Link>
            
            {/* Dates Mega Dropdown */}
            <div 
              className="nav-item has-dropdown"
              onMouseEnter={() => setDatesDropdown(true)}
              onMouseLeave={() => setDatesDropdown(false)}
            >
              <Link href="/category/dates" className="nav-link-dropdown">
                Saudi Dates (Khajoor) <ChevronDown size={14} />
              </Link>
              {datesDropdown && (
                <div className="mega-menu">
                  <div className="mega-col">
                    <h4>All Date Varieties</h4>
                    <Link href="/category/dates" className="mega-all-link">
                      View All Dates Collection →
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
                      alt="Saudi Dates" 
                    />
                    <h5>Qalmi & Sughai Harvest</h5>
                    <p>Directly imported soft Saudi dates with natural rich caramel flavor.</p>
                    <Link href="/category/dates" className="btn btn-sm btn-gold">Explore Dates</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Primary Categories */}
            {mainCategories.filter(c => c.slug !== 'dates').map(c => (
              <Link key={c.id} href={`/category/${c.slug}`} className="nav-item">
                {c.name}
              </Link>
            ))}

            <Link href="/shop" className="nav-item highlight">Shop All</Link>
            <Link href="/blog" className="nav-item">Blog / Guides</Link>
            <Link href="/about" className="nav-item">Our Story</Link>
            <Link href="/contact" className="nav-item">Contact & Store</Link>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {menu && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-head">
              <strong>Navigation Menu</strong>
              <button onClick={() => setMenu(false)} aria-label="Close menu"><X size={20} /></button>
            </div>
            <div className="mobile-nav-links">
              <Link onClick={() => setMenu(false)} href="/">Home</Link>
              <Link onClick={() => setMenu(false)} href="/category/dates" className="mobile-parent-link">
                Saudi Dates (All Varieties)
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
              <Link onClick={() => setMenu(false)} href="/blog">Blog & Islamic Guides</Link>
              <Link onClick={() => setMenu(false)} href="/wishlist">My Wishlist ({wishlistCount})</Link>
              <Link onClick={() => setMenu(false)} href="/compare">Compare Items ({compareCount})</Link>
              <Link onClick={() => setMenu(false)} href="/about">About Us</Link>
              <Link onClick={() => setMenu(false)} href="/contact">Lahore Flagship Store</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

// ==========================================
// PRODUCT CARD (Altaiba Presentation)
// ==========================================
export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, isInWishlist, toggleCompare, isInCompare, setQuickViewProduct } = useStore();
  const [added, setAdded] = useState(false);
  const sale = product.compare_at_price && product.compare_at_price > product.price;
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const waOrderText = `Assalamualaikum! I would like to order:
*${product.name}*
Price: ${money(product.price)}
Package: ${product.package_size || `${product.weight_grams}g`}
Please confirm availability and shipping.`;

  return (
    <article className="card">
      <div className="card-top">
        {/* Badges */}
        <div className="card-badge-cluster">
          {product.badge && <span className="card-badge">{product.badge}</span>}
          {sale && (
            <span className="sale-badge">
              SAVE {Math.round((1 - product.price / product.compare_at_price!) * 100)}%
            </span>
          )}
        </div>

        {/* Hover Quick Action Icons (Altaiba Feature) */}
        <div className="card-action-overlay">
          <button 
            className="action-icon-circle"
            title="Quick View"
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            aria-label="Quick View"
          >
            <Eye size={17} />
          </button>
          
          <button 
            className={`action-icon-circle ${inWish ? 'active-heart' : ''}`}
            title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Wishlist"
          >
            <Heart size={17} fill={inWish ? '#e11d48' : 'none'} color={inWish ? '#e11d48' : 'currentColor'} />
          </button>

          <button 
            className={`action-icon-circle ${inComp ? 'active-compare' : ''}`}
            title={inComp ? 'Remove from Compare' : 'Add to Compare'}
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product);
            }}
            aria-label="Compare"
          >
            <Scale size={17} color={inComp ? '#d4af37' : 'currentColor'} />
          </button>
        </div>

        <Link href={`/product/${product.slug}`} className="card-media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} loading="lazy" />
          ) : (
            <div className="empty-img">HADI ISLAMIC</div>
          )}
        </Link>
      </div>

      <div className="card-body">
        <div className="card-meta-line">
          {product.package_size && <span className="size-chip">{product.package_size}</span>}
          {product.origin && <span className="card-origin-text">📍 {product.origin}</span>}
        </div>
        
        <Link className="card-title" href={`/product/${product.slug}`} title={product.name}>
          {product.name}
        </Link>

        <div className="card-rating">
          <span className="stars">★★★★★</span>
          <small>({product.review_count || 14})</small>
        </div>

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
            <Plus size={15} /> {added ? 'Added!' : 'Add to Bag'}
          </button>
          
          <a 
            href={getWhatsAppUrl(waOrderText)} 
            target="_blank" 
            rel="noreferrer"
            className="btn-wa"
            title="Order directly via WhatsApp"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

// Subcategory Card
export function SubcategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link href={`/category/${category.slug}`} className="subcat-card">
      <div className="subcat-img-box">
        {category.image_url ? (
          <img src={category.image_url} alt={category.name} loading="lazy" />
        ) : (
          <div className="empty-img">HADI</div>
        )}
        <span className="subcat-count-badge">{count} Items</span>
      </div>
      <div className="subcat-details">
        {category.arabic_name && <small className="subcat-arabic">{category.arabic_name}</small>}
        <h3>{category.name}</h3>
        {category.description && <p>{category.description}</p>}
        <span className="subcat-cta">Explore Types →</span>
      </div>
    </Link>
  );
}

// ==========================================
// HOME VIEW (Altaiba Architecture & Layout)
// ==========================================
export function HomeView({
  products,
  categories,
  banners,
  blogPosts = []
}: {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  blogPosts?: BlogPost[];
  demo: boolean;
}) {
  const { setVideoModalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const mainBanner = banners[0];
  const dateSubcategories = categories.filter(c => c.parent_id === 'c-dates');
  const mainCategories = categories.filter(c => !c.parent_id);
  const featuredProducts = products.filter(p => p.featured).slice(0, 8);

  // Tab filtering for Best Sellers section
  const bestSellerProducts = products.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'dates') {
      return p.category_id === 'c-dates' || dateSubcategories.some(s => s.id === p.category_id);
    }
    if (activeTab === 'prayer') return p.category_id === 'c-prayer-mats';
    if (activeTab === 'umrah') return p.category_id === 'c-umrah' || p.category_id === 'c-ihram';
    if (activeTab === 'honey-attar') return p.category_id === 'c-honey' || p.category_id === 'c-attar';
    return true;
  }).slice(0, 8);

  return (
    <>
      {/* 1. HERO SLIDESHOW / HERO AREA */}
      <section className="hero">
        <div 
          className="hero-backdrop"
          style={{ backgroundImage: `url('${mainBanner?.image_url || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1700&q=85'}')` }}
        />
        <div className="hero-overlay" />
        <div className="shell hero-content">
          <span className="hero-badge"><Sparkles size={14} /> BLESSED BY SUNNAH • AUTHENTIC SAUDI IMPORTS</span>
          <h1>{mainBanner?.title || 'Blessed Madinah Dates & Sunnah Essentials'}</h1>
          <p>{mainBanner?.subtitle || 'Directly imported Qalmi, Sughai, Sukri, and Umrah essentials delivered safely to your doorstep anywhere in Pakistan.'}</p>
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
              <MessageCircle size={16} /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>

      {/* 2. TOP CATEGORIES SECTION (With Product Count Badges - Altaiba Style) */}
      <section className="shell top-categories-section">
        <div className="section-header center">
          <p className="kicker">SHOP BY DEPARTMENT</p>
          <h2>Explore Top Categories</h2>
          <p className="section-desc">Hand-selected imported goods directly from Saudi Arabia and artisan workshops.</p>
        </div>
        <div className="top-categories-grid">
          {mainCategories.map(cat => {
            const count = products.filter(p => 
              p.category_id === cat.id || 
              dateSubcategories.some(s => s.parent_id === cat.id && p.category_id === s.id)
            ).length;

            return (
              <Link href={`/category/${cat.slug}`} key={cat.id} className="top-cat-card">
                <div className="top-cat-img-box">
                  <img src={cat.image_url || ''} alt={cat.name} loading="lazy" />
                  <span className="cat-count-pill">{count || 6} Items</span>
                </div>
                <div className="top-cat-text">
                  <h3>{cat.name}</h3>
                  {cat.arabic_name && <small className="cat-arabic">{cat.arabic_name}</small>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS COLLECTION */}
      <section className="shell section featured-section">
        <div className="section-header between">
          <div>
            <p className="kicker">CURATED BY HADI ISLAMIC</p>
            <h2>Featured Sunnah Essentials</h2>
          </div>
          <Link href="/shop" className="link-arrow">
            View All Collection →
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER MASONRY (Altaiba Visual Grid) */}
      <section className="shell promo-masonry-section">
        <div className="promo-masonry-grid">
          {/* Main Large Banner */}
          <div className="promo-tile promo-tile-large">
            <div className="promo-tile-bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=900&q=80')` }} />
            <div className="promo-tile-content">
              <span className="tile-badge">UMRAH EXCLUSIVE</span>
              <h3>100% Cotton Ihram & Travel Gear</h3>
              <p>Heavyweight 1400g combed cotton with zero transparency, non-slip belts and child safety straps.</p>
              <Link href="/category/umrah-essentials" className="btn btn-gold btn-sm">
                Shop Umrah Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="promo-tile promo-tile-small">
            <div className="promo-tile-bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1603048719539-9ecb0b239e5c?w=700&q=80')` }} />
            <div className="promo-tile-content">
              <span className="tile-badge">FRESH IMPORT</span>
              <h3>Saudi Qalmi & Sughai</h3>
              <p>Naturally sweet, soft bite, rich in potassium and clean fiber.</p>
              <Link href="/category/dates" className="tile-text-link">Explore Varieties →</Link>
            </div>
          </div>

          {/* Banner 3 */}
          <div className="promo-tile promo-tile-small">
            <div className="promo-tile-bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&q=80')` }} />
            <div className="promo-tile-content">
              <span className="tile-badge">PURE HEALING</span>
              <h3>Wild Sidr Honey & Zam Zam</h3>
              <p>Original 5L Makkah Zam Zam & raw unpasteurised Sidr honey.</p>
              <Link href="/category/pure-honey" className="tile-text-link">View Nutrition →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DATES VARIETIES SHOWCASE (Subcategory Hub Grid) */}
      <section className="dates-showcase">
        <div className="shell">
          <div className="section-header center">
            <span className="kicker-badge">ROYAL KHAJOOR SELECTION</span>
            <h2>Select Your Favourite Date Variety</h2>
            <p className="section-desc">
              Every variety has its own distinctive flavor profile, texture, origin and health benefits. Click below to view pack sizes and weights.
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

      {/* 6. BEST-SELLING PRODUCTS (With Category Filter Tabs) */}
      <section className="shell section best-sellers-section">
        <div className="section-header center">
          <p className="kicker">MOST POPULAR ORDERS</p>
          <h2>Best-Selling Products</h2>
          <p className="section-desc">Filtered by category for quick browsing and instant delivery.</p>
        </div>

        {/* Filter Tabs */}
        <div className="bestseller-tabs">
          <button 
            className={`bs-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Best Sellers
          </button>
          <button 
            className={`bs-tab ${activeTab === 'dates' ? 'active' : ''}`}
            onClick={() => setActiveTab('dates')}
          >
            Saudi Dates
          </button>
          <button 
            className={`bs-tab ${activeTab === 'prayer' ? 'active' : ''}`}
            onClick={() => setActiveTab('prayer')}
          >
            Prayer Mats
          </button>
          <button 
            className={`bs-tab ${activeTab === 'umrah' ? 'active' : ''}`}
            onClick={() => setActiveTab('umrah')}
          >
            Umrah & Ihram
          </button>
          <button 
            className={`bs-tab ${activeTab === 'honey-attar' ? 'active' : ''}`}
            onClick={() => setActiveTab('honey-attar')}
          >
            Honey & Fragrance
          </button>
        </div>

        <div className="product-grid">
          {bestSellerProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. VIDEO & PRODUCT SHOWCASE (Altaiba Feature) */}
      <section className="video-showcase-section">
        <div className="shell video-showcase-inner">
          <div className="video-preview-col">
            <div className="video-thumb-box" onClick={() => setVideoModalOpen(true)}>
              <img 
                src="https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1000&q=80" 
                alt="Video showcase preview" 
              />
              <div className="play-btn-circle">
                <Play size={28} fill="currentColor" />
              </div>
              <span className="video-play-hint">Click to watch harvest & authenticity video</span>
            </div>
          </div>

          <div className="video-text-col">
            <span className="kicker-white">GUARANTEE OF AUTHENTICITY</span>
            <h2>Selected with Reverence from Blessed Groves</h2>
            <p>
              At Hadi Islamic, every single box of Qalmi, Sughai, and Sukri dates is inspected for softness, texture, and natural freshness before being hygienically sealed in food-grade packaging.
            </p>
            <div className="video-perks">
              <div className="v-perk"><CheckCircle2 size={18} /> 100% Genuine Direct Import from Saudi Arabia</div>
              <div className="v-perk"><CheckCircle2 size={18} /> Sealed to Preserve Natural Sweetness & Moisture</div>
              <div className="v-perk"><CheckCircle2 size={18} /> Open 24 Hours at Shalimar Square Mall Lahore</div>
            </div>
            <div className="video-action-row">
              <button className="btn btn-gold" onClick={() => setVideoModalOpen(true)}>
                <Play size={16} /> Watch Showcase
              </button>
              <Link href="/about" className="btn btn-outline-white">
                Learn Our Heritage
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BLOG / NEWS SECTION (Altaiba Style 3 Cards) */}
      <section className="shell section blog-showcase-section">
        <div className="section-header between">
          <div>
            <p className="kicker">SUNNAH GUIDES & ARTICLES</p>
            <h2>Latest From Our Blog</h2>
          </div>
          <Link href="/blog" className="link-arrow">
            View All Guides →
          </Link>
        </div>

        <div className="blog-grid">
          {blogPosts.slice(0, 3).map(post => (
            <article key={post.id} className="blog-card">
              <Link href={`/blog/${post.slug}`} className="blog-img-link">
                <img src={post.image_url} alt={post.title} loading="lazy" />
                <span className="blog-category-badge">{post.category}</span>
              </Link>
              <div className="blog-body">
                <div className="blog-meta">
                  <span>{post.date}</span> • <span>{post.read_time}</span>
                </div>
                <h3>
                  <Link href={`/blog/${post.slug}`} className="blog-title-link">
                    {post.title}
                  </Link>
                </h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="blog-read-more">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 9. CUSTOMER TRUST & REVIEWS */}
      <section className="shell section reviews-section">
        <div className="section-header center">
          <p className="kicker">TESTIMONIALS</p>
          <h2>Loved by Families Across Pakistan</h2>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"The Qalmi and Sughai dates were exceptionally fresh, soft, and packaged very cleanly. Arrived in Lahore within 24 hours."</p>
            <strong>Muhammad Usman</strong>
            <small>Lahore, Pakistan</small>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"Ordered the 1400g Premium Cotton Ihram and velvet Janamaz. The cloth thickness and quality were superb for Umrah."</p>
            <strong>Syed Tariq Shah</strong>
            <small>Islamabad, Pakistan</small>
          </div>
          <div className="review-card">
            <div className="stars">★★★★★</div>
            <p>"Best quality Sidr honey and original Zam Zam 5L bottle. Ordering via WhatsApp was quick and the staff answered all questions immediately."</p>
            <strong>Farhan Ahmed</strong>
            <small>Karachi, Pakistan</small>
          </div>
        </div>
      </section>

      {/* 10. 12/6 & 24/7 SUPPORT STRIP (Altaiba 4 Pillars) */}
      <section className="trust-strip">
        <div className="shell trust-grid">
          <div className="trust-item">
            <ShieldCheck size={28} className="trust-icon" />
            <div>
              <strong>100% Authentic Quality</strong>
              <small>Certified Saudi imports & pure Sunnah items</small>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={28} className="trust-icon" />
            <div>
              <strong>Cash on Delivery (COD)</strong>
              <small>Serving all cities & towns across Pakistan</small>
            </div>
          </div>
          <div className="trust-item">
            <Clock size={28} className="trust-icon" />
            <div>
              <strong>Open 24 Hours • Fast Dispatch</strong>
              <small>Lahore store open 24/7; 24-48h dispatch</small>
            </div>
          </div>
          <div className="trust-item">
            <MessageCircle size={28} className="trust-icon" />
            <div>
              <strong>Instant WhatsApp Help</strong>
              <small>Direct replies on +92 345 1579846</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ==========================================
// CATEGORY HUB VIEW
// ==========================================
export function CategoryHubView({
  category,
  subcategories,
  parentCategory,
  products
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

      {/* Subcategory Grid (For Categories with Subtypes) */}
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

// ==========================================
// PRODUCT DETAIL VIEW
// ==========================================
export function DetailView({
  product,
  category
}: {
  product: Product;
  category?: Category;
}) {
  const { add, toggleWishlist, isInWishlist, toggleCompare, isInCompare, setCartDrawerOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(product.image_url || '');
  const [selectedVar, setSelectedVar] = useState<string>(
    product.variations && product.variations[0]?.options[0]?.label || ''
  );
  const [added, setAdded] = useState(false);

  const sale = product.compare_at_price && product.compare_at_price > product.price;
  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);

  const handleAddToCart = () => {
    add(product, qty, selectedVar || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    add(product, qty, selectedVar || undefined);
    setCartDrawerOpen(true);
  };

  const waOrderText = `Assalamualaikum!
I want to order:
*${product.name}*
${selectedVar ? `Variation: ${selectedVar}` : ''}
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
          <div className="detail-header-tags">
            {product.package_size && <span className="detail-chip">{product.package_size}</span>}
            {product.stock > 0 ? (
              <span className="detail-stock in"><Check size={14} /> In Stock ({product.stock} units)</span>
            ) : (
              <span className="detail-stock out">Out of Stock</span>
            )}
          </div>

          <h1>{product.name}</h1>

          <div className="detail-subline">
            {product.origin && (
              <p className="detail-origin">📍 Origin: <strong>{product.origin}</strong></p>
            )}
            <div className="detail-rating">
              <span className="stars">★★★★★</span>
              <small>({product.review_count || 16} Verified Reviews)</small>
            </div>
          </div>

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

          {/* Variations selector if available */}
          {product.variations && product.variations.length > 0 && (
            <div className="detail-variation-picker">
              <label>Select {product.variations[0].name}:</label>
              <div className="var-buttons">
                {product.variations[0].options.map(opt => (
                  <button 
                    key={opt.label}
                    className={`var-chip ${selectedVar === opt.label ? 'active' : ''}`}
                    onClick={() => setSelectedVar(opt.label)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <ShoppingBag size={18} /> {added ? 'Added to Bag!' : 'Add to Bag'}
            </button>

            <button 
              className="btn btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          {/* Secondary Actions: Wishlist and Compare */}
          <div className="detail-secondary-actions">
            <button 
              className="detail-action-link"
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={16} fill={inWish ? '#e11d48' : 'none'} color={inWish ? '#e11d48' : 'currentColor'} />
              <span>{inWish ? 'In Your Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button 
              className="detail-action-link"
              onClick={() => toggleCompare(product)}
            >
              <Scale size={16} color={inComp ? '#d4af37' : 'currentColor'} />
              <span>{inComp ? 'In Compare List' : 'Add to Compare'}</span>
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

// ==========================================
// SHOP VIEW
// ==========================================
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

// ==========================================
// FOOTER (Altaiba Multi-Column Structure)
// ==========================================
export function Footer() {
  const { setWaModalOpen } = useStore();

  return (
    <>
      <footer className="footer">
        <div className="shell foot-grid">
          <div>
            <div className="footer-logo">
              <img src="/logo.png" alt="Hadi Islamic Logo" className="footer-logo-img" />
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
              <a aria-label="Facebook" target="_blank" rel="noreferrer" href="https://www.facebook.com/hadiislamic">
                <Facebook size={18} />
              </a>
              <a aria-label="Instagram" target="_blank" rel="noreferrer" href="https://www.instagram.com/atifgulzar_wattoo?exln=MXMwYzNvZXZnbTJ6Zg==">
                <Instagram size={18} />
              </a>
              <a aria-label="TikTok" target="_blank" rel="noreferrer" href="https://www.tiktok.com/@hadi_islamic?_r=1&_t=ZS-9AbJ6raDmo0">
                <TikTokIcon size={18} />
              </a>
              <button aria-label="WhatsApp" onClick={() => setWaModalOpen(true)} className="social-wa-btn">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          <div>
            <h4>Date Varieties (Khajoor)</h4>
            <Link href="/category/qalmi-dates">Qalmi Dates</Link>
            <Link href="/category/sughai-dates">Sughai Dates</Link>
            <Link href="/category/sukri-dates">Sukri Dates</Link>
            <Link href="/category/mabroom-dates">Mabroom Dates</Link>
            <Link href="/category/ajwa-dates">Ajwa Al-Madinah</Link>
            <Link href="/category/amber-dates">Amber Royal</Link>
            <Link href="/category/dates">All Date Varieties →</Link>
          </div>

          <div>
            <h4>Collections</h4>
            <Link href="/category/dates">All Dates</Link>
            <Link href="/category/prayer-mats">Prayer Mats (Janamaz)</Link>
            <Link href="/category/umrah-essentials">Umrah Essentials</Link>
            <Link href="/category/ihram">Ihram Collection</Link>
            <Link href="/category/zam-zam-water">Zam Zam Water</Link>
            <Link href="/category/pure-honey">Pure Sidr Honey</Link>
            <Link href="/category/attar">Attar & Fragrance</Link>
            <Link href="/shop">Full Catalogue</Link>
          </div>

          <div>
            <h4>Physical Store & Helpline</h4>
            <div className="contact-box">
              <div className="store-address-card">
                <p className="addr-row">
                  <MapPin size={16} className="text-gold" />
                  <span>
                    <strong>Lahore Flagship Store:</strong><br />
                    Shop # G-5 Ground Floor, Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, 54000, Pakistan
                  </span>
                </p>
                <p className="timing-row">
                  <Clock size={16} className="text-gold" />
                  <span>
                    <strong>Hours:</strong> <span className="open-pill">Open 24 Hours</span> (7 Days a Week)
                  </span>
                </p>
                <p className="phone-row">
                  <MessageCircle size={16} className="text-gold" />
                  <span>
                    <strong>Phone / WhatsApp:</strong> <a href={`https://wa.me/${WHATSAPP_NUMBER}`}>+92 345 1579846</a>
                  </span>
                </p>
              </div>

              <button 
                onClick={() => setWaModalOpen(true)}
                className="btn-footer-catalogue"
              >
                <ShoppingBag size={14} /> Open WhatsApp Catalogue
              </button>
            </div>
            <div className="policy-links">
              <Link href="/policies/shipping">Shipping Policy</Link>
              <Link href="/policies/returns">Returns & Refunds</Link>
              <Link href="/policies/terms">Terms & Conditions</Link>
              <Link href="/policies/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="copyright shell">
          <span>© {new Date().getFullYear()} Hadi Islamic Store (Pakistan). All rights reserved.</span>
          <span>Cash On Delivery • Easy Bank Transfer • Raast • JazzCash</span>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button (Bottom Right) */}
      <button 
        aria-label="Chat on WhatsApp" 
        className="whatsapp-float" 
        onClick={() => setWaModalOpen(true)}
      >
        <span className="wa-tooltip">WhatsApp Catalogue & Order (Open 24h)</span>
        <MessageCircle size={30} />
      </button>
    </>
  );
}
