'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShoppingBag, Trash2, ArrowRight, Check, X } from 'lucide-react';
import { useStore, getWhatsAppUrl } from '@/components/store';
import { money } from '@/lib/demo';

export default function ComparePage() {
  const { compare, toggleCompare, add, clearCompare } = useStore();

  return (
    <div className="shell section compare-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="current">Product Comparison</span>
      </nav>

      <div className="compare-head">
        <div className="compare-title-row">
          <div className="compare-title-box">
            <Scale size={26} className="text-gold" />
            <h1>Compare Products ({compare.length}/4)</h1>
          </div>
          {compare.length > 0 && (
            <button onClick={clearCompare} className="btn-clear-compare">
              Clear All Items
            </button>
          )}
        </div>
        <p className="compare-subtitle">
          Compare specifications, origin, price, weight and health benefits side-by-side to make the best choice for your family.
        </p>
      </div>

      {compare.length === 0 ? (
        <div className="compare-empty-state">
          <Scale size={48} className="empty-compare-icon" />
          <h2>No Products Added to Comparison</h2>
          <p>
            You can add up to 4 products to compare simultaneously. Click the scale icon on any product card or quick view modal.
          </p>
          <div className="empty-btns">
            <Link href="/category/dates" className="btn btn-gold">
              Compare Date Varieties
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Shop All Collections
            </Link>
          </div>
        </div>
      ) : (
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="feature-col">Feature</th>
                {compare.map(p => (
                  <th key={p.id} className="prod-col">
                    <div className="compare-item-head">
                      <button 
                        className="compare-remove-btn" 
                        onClick={() => toggleCompare(p)}
                        title="Remove"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                      <img src={p.image_url || ''} alt={p.name} className="compare-thumb" />
                      <h4><Link href={`/product/${p.slug}`}>{p.name}</Link></h4>
                      <p className="compare-price">{money(p.price)}</p>
                      <button 
                        className="btn-add w-full"
                        onClick={() => add(p, 1)}
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="feature-label">Package Size / Weight</td>
                {compare.map(p => (
                  <td key={p.id}>{p.package_size || `${p.weight_grams}g`}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Origin / Region</td>
                {compare.map(p => (
                  <td key={p.id}>{p.origin || 'Imported'}</td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Availability</td>
                {compare.map(p => (
                  <td key={p.id}>
                    {p.stock > 0 ? (
                      <span className="stock-in"><Check size={14} /> In Stock ({p.stock} units)</span>
                    ) : (
                      <span className="stock-out"><X size={14} /> Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Customer Rating</td>
                {compare.map(p => (
                  <td key={p.id}>
                    <div className="rating-row">
                      <span className="stars">★★★★★</span>
                      <small>({p.review_count || 12} reviews)</small>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Key Benefits / Highlights</td>
                {compare.map(p => (
                  <td key={p.id}>
                    {p.benefits && p.benefits.length > 0 ? (
                      <ul className="compare-benefits-list">
                        {p.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>100% genuine product</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Description Summary</td>
                {compare.map(p => (
                  <td key={p.id} className="compare-desc-cell">
                    <p>{p.description.slice(0, 140)}...</p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="feature-label">Direct Order</td>
                {compare.map(p => (
                  <td key={p.id}>
                    <a 
                      href={getWhatsAppUrl(`Assalamualaikum, I want to order ${p.name} from comparison.`)}
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-wa-sm w-full"
                    >
                      WhatsApp Order
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
