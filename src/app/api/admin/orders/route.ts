import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length > 0) {
      return NextResponse.json({ orders });
    }
  } catch (err) {
    console.warn('Prisma orders query fallback to memory:', err);
  }

  // Return fallback global orders
  return NextResponse.json({
    orders: globalThis.__GLOBAL_ORDERS__ || [],
  });
}
