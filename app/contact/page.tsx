'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, Clock, MessageCircle, Phone, Mail, ShoppingBag, 
  ExternalLink, Navigation, ShieldCheck, Truck 
} from 'lucide-react';
import { 
  WHATSAPP_NUMBER, WHATSAPP_CATALOG_URL, STORE_ADDRESS, 
  STORE_HOURS, useStore 
} from '@/components/store';

export default function ContactPage() {
  const { setWaModalOpen } = useStore();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, Pakistan')}`;

  return (
    <div className="shell contact-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="current">Contact Us & Store Location</span>
      </nav>

      <div className="contact-hero">
        <p className="kicker">VISIT US OR GET IN TOUCH</p>
        <h1>Contact Hadi Islamic Store</h1>
        <p className="contact-subtitle">
          Visit our Lahore outlet or order online with nationwide Cash on Delivery. We are open 24 hours a day to assist you.
        </p>
      </div>

      <div className="contact-grid">
        {/* Physical Store Box */}
        <div className="contact-card highlight-card">
          <div className="card-badge-row">
            <span className="timing-badge">● Open 24 Hours</span>
            <span className="flagship-badge">Physical Outlet</span>
          </div>

          <div className="card-header-icon">
            <MapPin size={28} className="text-green" />
            <div>
              <h2>Lahore Flagship Store</h2>
              <small>Singhpura / Shalimar Link Road</small>
            </div>
          </div>

          <div className="address-details">
            <p className="full-address">
              <strong>Address:</strong><br />
              Shop # G-5 Ground Floor, Shalimar Square Mall, Shalimar Link Road, Singhpura, Lahore, 54000, Pakistan
            </p>

            <div className="hours-block">
              <Clock size={18} className="text-gold" />
              <div>
                <strong>Operating Hours:</strong>
                <p>Open 24 Hours • 7 Days a Week (Including Fridays & Public Holidays)</p>
              </div>
            </div>
          </div>

          <div className="contact-btn-row">
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-map"
            >
              <Navigation size={16} /> Open in Google Maps <ExternalLink size={14} />
            </a>

            <button 
              onClick={() => setWaModalOpen(true)}
              className="btn btn-wa-cat"
            >
              <ShoppingBag size={16} /> View WhatsApp Catalogue
            </button>
          </div>
        </div>

        {/* Online Orders & Customer Support */}
        <div className="contact-card">
          <div className="card-header-icon">
            <MessageCircle size={28} className="text-green" />
            <div>
              <h2>Customer Support & Orders</h2>
              <small>Online Delivery & Inquiries</small>
            </div>
          </div>

          <div className="support-list">
            <div className="support-item">
              <MessageCircle size={18} className="text-green" />
              <div>
                <strong>WhatsApp Order & Helpline:</strong>
                <p><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">+92 345 1579846</a></p>
                <small className="text-muted">Instant replies for stock, dates varieties, and bulk gift packing.</small>
              </div>
            </div>

            <div className="support-item">
              <ShoppingBag size={18} className="text-gold" />
              <div>
                <strong>WhatsApp Business Catalogue:</strong>
                <p><a href={WHATSAPP_CATALOG_URL} target="_blank" rel="noreferrer">wa.me/c/225718499836004</a></p>
                <small className="text-muted">Browse full collection with live images directly inside WhatsApp.</small>
              </div>
            </div>

            <div className="support-item">
              <Mail size={18} className="text-muted" />
              <div>
                <strong>Email Address:</strong>
                <p><a href="mailto:atif1256@gmail.com">atif1256@gmail.com</a></p>
              </div>
            </div>
          </div>

          <div className="trust-pills">
            <span><Truck size={14} /> TCS / Leopard Express COD</span>
            <span><ShieldCheck size={14} /> 100% Genuine Sunnah Products</span>
          </div>
        </div>
      </div>
    </div>
  );
}
