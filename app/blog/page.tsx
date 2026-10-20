export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { catalog } from '@/lib/db';
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Islamic Guides | Hadi Islamic Lahore',
  description: 'Expert guides on Hajj & Umrah essentials, authentic Madinah date varieties, Sunnah foods, and prayer essentials from Hadi Islamic.'
};

export default async function BlogPage() {
  const { blogPosts } = await catalog();

  return (
    <div className="shell section blog-listing-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="current">Blog & Islamic Guides</span>
      </nav>

      <div className="blog-head">
        <div className="blog-head-kicker">
          <BookOpen size={16} /> SUNNAH INSIGHTS & PILGRIMAGE ADVICE
        </div>
        <h1>Hadi Islamic Journal & Guides</h1>
        <p className="blog-subtitle">
          Practical advice on selecting authentic Saudi dates, choosing the right 1400g cotton Ihram, pure Sidr honey benefits, and worship essentials.
        </p>
      </div>

      <div className="blog-grid">
        {blogPosts.map(post => (
          <article key={post.id} className="blog-card">
            <Link href={`/blog/${post.slug}`} className="blog-img-link">
              <img src={post.image_url} alt={post.title} loading="lazy" />
              <span className="blog-category-badge">{post.category}</span>
            </Link>

            <div className="blog-body">
              <div className="blog-meta">
                <span><Calendar size={13} /> {post.date}</span>
                <span><Clock size={13} /> {post.read_time}</span>
              </div>

              <h2>
                <Link href={`/blog/${post.slug}`} className="blog-title-link">
                  {post.title}
                </Link>
              </h2>

              <p className="blog-excerpt">{post.excerpt}</p>

              <div className="blog-card-foot">
                <span className="blog-author"><User size={13} /> {post.author}</span>
                <Link href={`/blog/${post.slug}`} className="blog-read-more">
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
