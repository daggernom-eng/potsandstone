import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Pots and Stones Coffee & Eatery database...');

  // Clear existing records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.banner.deleteMany();

  // 1. Create Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Asian Bites & Dimsums',
        subtitle: 'Get 20% OFF on Dimsums & Small Bites',
        tag: 'CHEF SPECIAL',
        badge: 'Use: POTS20',
        imageUrl: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
        active: true,
      },
      {
        title: 'Summer Specials Feast',
        subtitle: 'Watermelon Feta Salad & Stuffed Ravioli',
        tag: 'SEASONAL TREAT',
        badge: 'Use: SUMMERFEAST',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
        active: true,
      },
      {
        title: 'Classic Thin Crust Pizzas',
        subtitle: 'Flat ₹100 OFF on Orders Above ₹500',
        tag: 'COFFEE & BITES',
        badge: 'Use: STONES100',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
        active: true,
      },
    ],
  });

  // 2. Create Categories
  const asianBitesCat = await prisma.category.create({
    data: {
      name: 'Asian Small Bites',
      slug: 'asian-bites',
      icon: '🥟',
      sortOrder: 1,
    },
  });

  const summerSpecialsCat = await prisma.category.create({
    data: {
      name: 'Summer Specials',
      slug: 'summer-specials',
      icon: '🥗',
      sortOrder: 2,
    },
  });

  const classicPizzasCat = await prisma.category.create({
    data: {
      name: 'Thin Crust Pizzas',
      slug: 'classic-pizzas',
      icon: '🍕',
      sortOrder: 3,
    },
  });

  const craftShakesCat = await prisma.category.create({
    data: {
      name: 'Artisanal Shakes',
      slug: 'craft-shakes',
      icon: '🥤',
      sortOrder: 4,
    },
  });

  const dessertsCat = await prisma.category.create({
    data: {
      name: 'Desserts & Bakery',
      slug: 'desserts',
      icon: '🍰',
      sortOrder: 5,
    },
  });

  // 3. Create Products
  const products = [
    // Asian Small Bites
    {
      name: 'Classic Veggie Dimsums',
      description: 'Soft steamed dumplings stuffed with finely chopped garden vegetables and aromatic seasoning',
      price: 399,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Bestseller',
      categoryId: asianBitesCat.id,
    },
    {
      name: 'Chilli Oil Chicken Dimsums',
      description: 'Tender chicken dimsums tossed with house-made fiery chili garlic oil',
      price: 459,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
      isVeg: false,
      badge: 'Popular',
      categoryId: asianBitesCat.id,
    },
    {
      name: 'Chilli Oil Mutton Dimsums',
      description: 'Succulent minced mutton dumplings topped with signature crispy chilli garlic oil',
      price: 659,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
      isVeg: false,
      badge: 'Chef Special',
      categoryId: asianBitesCat.id,
    },

    // Summer Specials
    {
      name: 'Watermelon Feta Salad',
      description: 'Light crisp hydrating watermelon cubes, crumbled feta cheese, mint sprigs & balsamic drizzle',
      price: 479,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Refreshing',
      categoryId: summerSpecialsCat.id,
    },
    {
      name: 'Spinach Ricotta Ravioli',
      description: 'Delicate handmade ravioli stuffed with spinach & ricotta with light house-made pomodoro puree',
      price: 659,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Signature',
      categoryId: summerSpecialsCat.id,
    },

    // Thin Crust Pizzas
    {
      name: 'Classic Margherita',
      description: 'Classic thin crust pizza with basil, tomato sauce & 100% mozzarella cheese',
      price: 429,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Classic',
      categoryId: classicPizzasCat.id,
    },
    {
      name: 'Butter Chicken Pizza',
      description: 'Indian fusion delight topped with rich creamy butter chicken gravy & cheese',
      price: 539,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
      isVeg: false,
      badge: 'Chef Special',
      categoryId: classicPizzasCat.id,
    },

    // Shakes & Desserts
    {
      name: 'Kitkat Shake',
      description: 'Chocolate milkshake blended with KitKat chocolate bars & cocoa crunch',
      price: 339,
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Bestseller',
      categoryId: craftShakesCat.id,
    },
    {
      name: 'Baked Cheesecake',
      description: 'Classic velvety New York style baked cheesecake on a buttery crust',
      price: 379,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
      isVeg: true,
      badge: 'Must Try',
      categoryId: dessertsCat.id,
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod,
    });
  }

  // Seed sample initial orders for Admin display
  await prisma.order.create({
    data: {
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      deliveryAddress: '171/2, Bareilly - Nainital Rd, opp. KFC, Kathgodam, Haldwani',
      deliveryType: 'Delivery',
      totalAmount: 938,
      status: 'Preparing',
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: 'Classic Veggie Dimsums' } }))!.id,
            name: 'Classic Veggie Dimsums',
            size: 'Standard',
            crust: 'Standard',
            quantity: 1,
            price: 399,
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: 'Butter Chicken Pizza' } }))!.id,
            name: 'Butter Chicken Pizza',
            size: 'Regular',
            crust: 'Classic Thin Crust',
            quantity: 1,
            price: 539,
          },
        ],
      },
    },
  });

  console.log(`Seeded successfully: ${products.length} products, 3 banners.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
