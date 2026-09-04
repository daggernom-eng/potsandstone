import { NextResponse } from 'next/server';
import { INITIAL_BANNERS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/data';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Try querying Prisma DB
    const [categories, products, banners] = await Promise.all([
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.product.findMany({ include: { category: true } }),
      prisma.banner.findMany({ where: { active: true } }),
    ]);

    if (categories.length > 0 && products.length > 0) {
      return NextResponse.json({
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          sortOrder: c.sortOrder,
        })),
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          isVeg: p.isVeg,
          badge: p.badge,
          categorySlug: p.category.slug,
        })),
        banners: banners.map((b) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle || '',
          tag: b.tag || 'OFFER',
          badge: b.badge || 'CLAIM',
          imageUrl: b.imageUrl,
        })),
      });
    }
  } catch (err) {
    console.warn('Prisma not available or empty, using structured menu fallback:', err);
  }

  // Instant fallback to Pots and Stones Coffee & Eatery menu data
  return NextResponse.json({
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    banners: INITIAL_BANNERS,
  });
}
