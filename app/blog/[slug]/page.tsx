export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { catalog } from '@/lib/db';
import { Calendar, User, Clock, ArrowLeft, Share2, MessageCircle, ShoppingBag } from 'lucide-react';
import type { Metadata } from 'next';
import { WHATSAPP_NUMBER } from '@/components/store';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { blogPosts } = await catalog();
  const post = blogPosts.find(p => p.slug === slug);
  return {
    title: post ? `${post.title} | Hadi Islamic` : 'Article | Hadi Islamic',
    description: post?.excerpt || 'Islamic guide from Hadi Islamic'
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { blogPosts, products } = await catalog();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related products
  const featured = products.slice(0, 3);

  return (
    <article className="shell section blog-single-page">
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blog">Blog & Guides</Link>
        <span>/</span>
        <span className="current">{post.title}</span>
      </nav>

      <header className="article-header">
        <div className="article-badge">{post.category}</div>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span><User size={14} /> {post.author}</span>
          <span><Calendar size={14} /> {post.date}</span>
          <span><Clock size={14} /> {post.read_time}</span>
        </div>
      </header>

      <div className="article-hero-img">
        <img src={post.image_url} alt={post.title} />
      </div>

      <div className="article-layout">
        <div className="article-content">
          <p className="article-lead">{post.excerpt}</p>

          <div className="article-body">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="article-share-strip">
            <span>Share this guide:</span>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Check out this helpful Islamic guide: ${post.title}`)}`}
              target="_blank" 
              rel="noreferrer" 
              className="share-btn wa-share"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>

          <div className="article-author-card">
            <img src="/logo.png" alt="Hadi Islamic" className="author-card-logo" />
            <div>
              <h4>Hadi Islamic Editorial & Sunnah Research</h4>
              <p>
                Based at our Lahore flagship store, our team works directly with verified Madinah date growers, honey harvesters, and Ihram weavers to deliver authentic Sunnah goods across Pakistan.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="article-sidebar">
          <div className="sidebar-box">
            <h3>Related Products</h3>
            <div className="sidebar-products">
              {featured.map(item => (
                <div key={item.id} className="sidebar-product-card">
                  <img src={item.image_url || ''} alt={item.name} />
                  <div>
                    <h5><Link href={`/product/${item.slug}`}>{item.name}</Link></h5>
                    <p className="sidebar-prod-price">PKR {item.price.toLocaleString('en-PK')}</p>
                    <Link href={`/product/${item.slug}`} className="sidebar-prod-btn">View Item →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-wa-card">
            <h4>Need Personal Advice?</h4>
            <p>Our Lahore team can help you select the exact date variety or Umrah package size for your requirements.</p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Assalamualaikum, I read your article "${post.title}" and would like to ask a question.`)}`}
              target="_blank" 
              rel="noreferrer"
              className="btn btn-wa-sm w-full"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </article>
  );
}
