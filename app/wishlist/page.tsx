'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { useStore, getWhatsAppUrl } from '@/components/store';
import { money } from '@/lib/demo';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, add } = useStore();

  return (
    <div className="shell section wishlist-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="current">My Wishlist</span>
      </nav>

      <div className="wishlist-head">
        <div className="wishlist-title-box">
          <Heart size={26} className="text-red-fill" />
          <h1>My Saved Products ({wishlist.length})</h1>
        </div>
        <p className="wishlist-subtitle">
          Save your favourite date varieties, prayer mats, and Umrah essentials here for fast ordering anytime.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty-state">
          <Heart size={48} className="empty-heart-icon" />
          <h2>Your Wishlist is Empty</h2>
          <p>You haven't saved any items yet. Browse our collections and click the heart icon on any product.</p>
          <div className="empty-btns">
            <Link href="/category/dates" className="btn btn-gold">
              Explore Dates Collection
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(product => {
            const sale = product.compare_at_price && product.compare_at_price > product.price;
            const waOrderText = `Assalamualaikum! I would like to order from my wishlist:
*${product.name}*
Price: ${money(product.price)}
Package: ${product.package_size || `${product.weight_grams}g`}`;

            return (
              <div key={product.id} className="wishlist-card">
                <div className="wishlist-card-img">
                  <img src={product.image_url || ''} alt={product.name} />
                  {product.badge && <span className="card-badge">{product.badge}</span>}
                  <button 
                    className="wishlist-remove-btn"
                    onClick={() => toggleWishlist(product)}
                    title="Remove from wishlist"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="wishlist-card-info">
                  {product.package_size && <span className="size-chip">{product.package_size}</span>}
                  <h3>
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                  </h3>

                  <div className="card-price-row">
                    <span className="price-main">{money(product.price)}</span>
                    {sale && <del className="price-compare">{money(product.compare_at_price!)}</del>}
                  </div>

                  <div className="wishlist-actions">
                    <button 
                      className="btn-add w-full"
                      onClick={() => add(product, 1)}
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                    <a 
                      href={getWhatsAppUrl(waOrderText)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-wa-sm"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
