import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Global in-memory order store fallback for instant reactivity
declare global {
  var __GLOBAL_ORDERS__: Array<any> | undefined;
}

if (!globalThis.__GLOBAL_ORDERS__) {
  globalThis.__GLOBAL_ORDERS__ = [
    {
      id: 'POTS-70192',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      deliveryAddress: '171/2, Bareilly - Nainital Rd, opp. KFC, Kathgodam, Haldwani',
      deliveryType: 'Delivery',
      totalAmount: 938,
      status: 'Preparing',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      items: [
        {
          id: 'i1',
          name: 'Classic Veggie Dimsums',
          size: 'Standard',
          crust: 'Standard',
          quantity: 1,
          price: 399,
        },
        {
          id: 'i2',
          name: 'Butter Chicken Pizza',
          size: 'Regular',
          crust: 'Classic Thin Crust',
          quantity: 1,
          price: 539,
        },
      ],
    },
    {
      id: 'POTS-70193',
      customerName: 'Priya Patel',
      customerPhone: '+91 91234 56789',
      deliveryAddress: 'Kathgodam Railway Station Rd, Haldwani',
      deliveryType: 'Takeaway',
      totalAmount: 898,
      status: 'Pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      items: [
        {
          id: 'i3',
          name: 'Spinach Ricotta Ravioli',
          size: 'Standard',
          crust: 'Standard',
          quantity: 1,
          price: 659,
        },
        {
          id: 'i4',
          name: 'Kitkat Shake',
          size: 'Standard',
          crust: 'Standard',
          quantity: 1,
          price: 339,
        },
      ],
    },
  ];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, deliveryAddress, deliveryType, totalAmount, items } = body;

    const newOrderId = `POTS-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: newOrderId,
      customerName: customerName || 'Valued Guest',
      customerPhone: customerPhone || '+91 98765 43210',
      deliveryAddress: deliveryAddress || '171/2, Bareilly - Nainital Rd, opp. KFC, Kathgodam, Haldwani',
      deliveryType: deliveryType || 'Delivery',
      totalAmount: Number(totalAmount) || 0,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      items: items.map((it: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        name: it.name,
        size: it.size || 'Standard',
        crust: it.crust || 'Standard',
        quantity: it.quantity || 1,
        price: it.price || 0,
      })),
    };

    // Try saving to Prisma DB
    try {
      await prisma.order.create({
        data: {
          id: newOrder.id,
          customerName: newOrder.customerName,
          customerPhone: newOrder.customerPhone,
          deliveryAddress: newOrder.deliveryAddress,
          deliveryType: newOrder.deliveryType,
          totalAmount: newOrder.totalAmount,
          status: newOrder.status,
          items: {
            create: newOrder.items.map((it: any) => ({
              name: it.name,
              size: it.size,
              crust: it.crust,
              quantity: it.quantity,
              price: it.price,
              productId: 'prod-veggie-dimsums', // fallback relational ID
            })),
          },
        },
      });
    } catch (dbErr) {
      console.warn('Prisma order save fallback to memory:', dbErr);
    }

    // Save to global in-memory list
    globalThis.__GLOBAL_ORDERS__?.unshift(newOrder);

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
