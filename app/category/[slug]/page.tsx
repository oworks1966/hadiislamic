export const dynamic = 'force-dynamic';

import { catalog } from '@/lib/db';
import { CategoryHubView } from '@/components/store';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await catalog();
  const cat = data.categories.find(c => c.slug === slug);
  return {
    title: cat ? `${cat.name} | Hadi Islamic` : 'Category | Hadi Islamic',
    description: cat?.description || 'Explore our authentic Islamic products at Hadi Islamic.'
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await catalog();
  
  const currentCategory = data.categories.find(c => c.slug === slug);
  if (!currentCategory) {
    notFound();
  }

  // Find subcategories if this is a parent category
  const subcategories = data.categories.filter(c => c.parent_id === currentCategory.id);
  
  // Find parent category if this is a subcategory
  const parentCategory = currentCategory.parent_id 
    ? (data.categories.find(c => c.id === currentCategory.parent_id) || null)
    : null;

  // Find all products that belong directly to this category or to any of its subcategories
  const subcategoryIds = new Set([currentCategory.id, ...subcategories.map(s => s.id)]);
  const categoryProducts = data.products.filter(p => p.category_id && subcategoryIds.has(p.category_id));

  return (
    <CategoryHubView
      category={currentCategory}
      subcategories={subcategories}
      parentCategory={parentCategory}
      products={categoryProducts}
      allCategories={data.categories}
    />
  );
}
