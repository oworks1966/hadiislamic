'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore, getWhatsAppUrl, WHATSAPP_NUMBER } from './store';
import { money } from '@/lib/demo';
import { Trash2, MessageCircle, ShieldCheck, Truck, Clock, CheckCircle2, ShoppingBag } from 'lucide-react';

const provinces = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu and Kashmir',
  'Gilgit-Baltistan'
];

export default function Checkout({ demo }: { demo: boolean }) {
  const { cart, quantity, clear } = useStore();
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: 'Punjab',
    postal_code: '',
    payment_method: 'cod',
    payment_reference: '',
    coupon_code: '',
    notes: ''
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ id: string; total: number } | null>(null);

  const subtotal = cart.reduce((s, x) => s + x.quantity * x.product.price, 0);
  const weight = cart.reduce((s, x) => s + x.quantity * x.product.weight_grams, 0);
  const shippingFee = subtotal >= 3000 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const update = (k: string, v: string) => setForm(x => ({ ...x, [k]: v }));

  const waCheckoutText = `*NEW ORDER - HADI ISLAMIC STORE LAHORE*
----------------------------------------
*Customer Name:* ${form.customer_name || 'Customer'}
*Mobile / WhatsApp:* ${form.phone || 'Provided upon inquiry'}
*Delivery Address:* ${form.address || 'Address'}, ${form.city || 'City'}, ${form.province}
*Payment Method:* ${form.payment_method === 'cod' ? 'Cash on Delivery (COD)' : form.payment_method.toUpperCase()}
${form.notes ? `*Order Notes:* ${form.notes}\n` : ''}
*Ordered Items:*
${cart.map((x, i) => `${i + 1}. ${x.product.name} ${x.selectedVariation ? `(${x.selectedVariation})` : ''} x ${x.quantity} = ${money(x.product.price * x.quantity)}`).join('\n')}

*Subtotal:* ${money(subtotal)}
*Shipping:* ${shippingFee === 0 ? 'FREE' : money(shippingFee)}
*Total Amount Payable:* ${money(grandTotal)}
----------------------------------------
Please confirm my order and share dispatch tracking.`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (demo) {
        // In demo mode or before full DB migration, generate instant simulated reference & WhatsApp option
        const simulatedOrderId = 'HADI-' + Math.floor(100000 + Math.random() * 900000);
        setSuccess({ id: simulatedOrderId, total: grandTotal });
        clear();
        return;
      }

      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map(x => ({ product_id: x.product.id, quantity: x.quantity }))
        })
      });

      const j = await r.json();
      if (!r.ok) throw Error(j.error || 'Unable to submit order');
      setSuccess({ id: j.order_id, total: j.total });
      clear();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="shell section">
        <div className="success-order-box">
          <CheckCircle2 size={56} className="text-green mx-auto mb-4" />
          <h1>JazakAllah Khair! Order Received</h1>
          <p className="order-ref-text">
            Your Order Reference ID is: <strong>{success.id}</strong>
          </p>
          <p className="order-amt-text">
            Confirmed Total Amount: <strong>{money(success.total)}</strong>
          </p>
          <p className="order-sub-note">
            Our dispatch desk in Lahore will contact you via WhatsApp/SMS to confirm shipment.
          </p>

          <div className="order-success-actions">
            <a 
              href={getWhatsAppUrl(`Assalamualaikum, my order reference is *${success.id}* for amount *${money(success.total)}*. Please confirm delivery details.`)}
              target="_blank" 
              rel="noreferrer"
              className="btn btn-wa-lg"
            >
              <MessageCircle size={18} /> Confirm Order on WhatsApp (+92 345 1579846)
            </a>

            <Link href="/shop" className="btn btn-outline">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell section checkout-section">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="current">Shopping Bag & Checkout</span>
      </nav>

      <div className="checkout-title-head">
        <p className="eyebrow">FAST & SECURE NATIONWIDE ORDERING</p>
        <h1>Basket & Express Checkout</h1>
        <p className="checkout-sub">
          Order online with Cash on Delivery (COD) or complete directly via our 24/7 WhatsApp helpline.
        </p>
      </div>

      {!cart.length ? (
        <div className="empty-cart-view">
          <ShoppingBag size={54} className="empty-cart-icon" />
          <h2>Your Shopping Basket is Empty</h2>
          <p>Explore our fresh Saudi dates, prayer mats, and Sunnah imports.</p>
          <Link className="btn btn-gold" href="/shop">
            Discover Products Catalogue
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="checkout-grid">
          {/* Left Column: Delivery Details */}
          <div className="panel checkout-form-panel">
            <h2>1. Delivery Details</h2>
            
            <div className="two-col">
              <div className="field">
                <label>Full Name *</label>
                <input 
                  required 
                  maxLength={100} 
                  placeholder="e.g. Muhammad Usman"
                  value={form.customer_name} 
                  onChange={e => update('customer_name', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Mobile Number (For Courier SMS / WhatsApp) *</label>
                <input 
                  required 
                  maxLength={20} 
                  value={form.phone} 
                  onChange={e => update('phone', e.target.value)} 
                  placeholder="03XX XXXXXXX"
                />
              </div>
            </div>

            <div className="field">
              <label>Email Address (Optional)</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={form.email} 
                onChange={e => update('email', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Complete Delivery Address (House/Street/Area) *</label>
              <textarea 
                required 
                rows={3}
                placeholder="House #, Street #, Mohallah / Society, Landmark"
                value={form.address} 
                onChange={e => update('address', e.target.value)}
              />
            </div>

            <div className="two-col">
              <div className="field">
                <label>City *</label>
                <input 
                  required 
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  value={form.city} 
                  onChange={e => update('city', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Province / Region *</label>
                <select value={form.province} onChange={e => update('province', e.target.value)}>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Postal Code (Optional)</label>
              <input 
                placeholder="e.g. 54000"
                value={form.postal_code} 
                onChange={e => update('postal_code', e.target.value)}
              />
            </div>

            <h2 style={{ marginTop: 32 }}>2. Payment Method</h2>
            
            <div className="payment-options-list">
              {[
                ['cod', 'Cash on Delivery (COD) - Recommended', 'Pay in cash when rider delivers to your doorstep'],
                ['bank', 'Direct Bank Transfer / Raast', 'Account details sent upon order confirmation'],
                ['jazz', 'JazzCash Transfer', 'Manual payment to verified merchant mobile account'],
                ['easy', 'Easypaisa Transfer', 'Manual payment to verified merchant mobile account']
              ].map(([id, title, desc]) => (
                <label key={id} className={`payment-option-card ${form.payment_method === id ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment_method"
                    checked={form.payment_method === id} 
                    onChange={() => update('payment_method', id)}
                  />
                  <div>
                    <strong>{title}</strong>
                    <small>{desc}</small>
                  </div>
                </label>
              ))}
            </div>

            <div className="field" style={{ marginTop: 20 }}>
              <label>Special Instructions or Delivery Notes (Optional)</label>
              <textarea 
                rows={2}
                placeholder="e.g. Deliver after 3 PM or call before arrival"
                value={form.notes} 
                onChange={e => update('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="panel checkout-summary-panel">
            <h2>Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)</h2>

            <div className="summary-items-list">
              {cart.map(x => (
                <div className="basket-line" key={x.product.id + (x.selectedVariation || '')}>
                  <img src={x.product.image_url || ''} alt={x.product.name} />
                  <div className="basket-line-info">
                    <strong>{x.product.name}</strong>
                    {x.selectedVariation && <span className="cart-var-tag">{x.selectedVariation}</span>}
                    <small>{money(x.product.price)} × {x.quantity}</small>
                    <div className="qty-row">
                      <button type="button" onClick={() => quantity(x.product, x.quantity - 1)}>−</button>
                      <span>{x.quantity}</span>
                      <button type="button" onClick={() => quantity(x.product, x.quantity + 1)}>+</button>
                      <button type="button" className="del-btn" onClick={() => quantity(x.product, 0)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <b>{money(x.product.price * x.quantity)}</b>
                </div>
              ))}
            </div>

            <div className="totals">
              <div>
                <span>Items Subtotal</span>
                <b>{money(subtotal)}</b>
              </div>
              <div>
                <span>Estimated Packed Weight</span>
                <b>{(weight / 1000).toFixed(2)} kg</b>
              </div>
              <div>
                <span>Shipping Delivery</span>
                <b>{shippingFee === 0 ? <span className="free-tag">FREE (Orders &gt; Rs. 3,000)</span> : money(shippingFee)}</b>
              </div>
              <div className="grand">
                <span>Total Amount</span>
                <span>{money(grandTotal)}</span>
              </div>
            </div>

            {error && <p className="error" role="alert">{error}</p>}

            <div className="checkout-submit-group">
              <button 
                type="submit" 
                className="btn btn-gold w-full btn-place-order" 
                disabled={busy}
              >
                {busy ? 'Placing order...' : `Place Order (${money(grandTotal)})`}
              </button>

              <a 
                href={getWhatsAppUrl(waCheckoutText)} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-wa-lg w-full"
              >
                <MessageCircle size={18} /> Instant Order via WhatsApp (+92 345 1579846)
              </a>
            </div>

            <div className="checkout-trust-badges">
              <div><Truck size={16} /> Fast Dispatch Across Pakistan</div>
              <div><ShieldCheck size={16} /> 100% Genuine Sunnah Products</div>
              <div><Clock size={16} /> Lahore Flagship Store: Open 24h</div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
