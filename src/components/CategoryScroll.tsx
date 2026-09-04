'use client';

import React from 'react';
import { CategoryItem } from '@/lib/data';

interface CategoryScrollProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Category images matching Pots and Stones Coffee menu categories
  const categoryImages: Record<string, string> = {
    'asian-bites': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
    'summer-specials': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop&q=80',
    'classic-pizzas': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&auto=format&fit=crop&q=80',
    'craft-shakes': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&auto=format&fit=crop&q=80',
    'desserts': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&auto=format&fit=crop&q=80',
  };

  const categoryPriceBadges: Record<string, string> = {
    'asian-bites': '@349',
    'summer-specials': '@479',
    'classic-pizzas': '@429',
    'craft-shakes': '@299',
    'desserts': '@369',
  };

  return (
    <div className="bg-white py-3 border-b border-gray-100">
      <div className="px-4 mb-2 flex items-center justify-between">
        <h3 className="text-sm font-black text-[#231b15] tracking-tight">What are you craving today?</h3>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-[11px] font-bold text-amber-600 hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex overflow-x-auto space-x-3.5 px-4 pb-1 no-scrollbar">
        {/* All Items Bubble */}
        <button
          onClick={() => onSelectCategory('all')}
          className="flex flex-col items-center shrink-0 group focus:outline-none"
        >
          <div
            className={`w-16 h-16 rounded-full p-0.5 transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'ring-2 ring-amber-600 ring-offset-2 scale-105 shadow-md'
                : 'ring-1 ring-gray-200 group-hover:ring-gray-300'
            }`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#231b15] to-[#423126] flex flex-col items-center justify-center text-white relative overflow-hidden">
              <span className="text-xs font-black">ALL</span>
              <span className="text-[9px] font-medium text-amber-300">MENU</span>
            </div>
          </div>
          <span
            className={`mt-1.5 text-[11px] font-bold tracking-tight text-center ${
              selectedCategory === 'all' ? 'text-amber-700' : 'text-gray-700'
            }`}
          >
            All Items
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const bgImg = categoryImages[cat.slug] || '';
          const priceBadge = categoryPriceBadges[cat.slug];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="flex flex-col items-center shrink-0 group focus:outline-none"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 transition-all duration-200 relative ${
                  isSelected
                    ? 'ring-2 ring-amber-600 ring-offset-2 scale-105 shadow-md'
                    : 'ring-1 ring-gray-200 group-hover:ring-gray-300'
                }`}
              >
                <div
                  className="w-full h-full rounded-full bg-cover bg-center overflow-hidden relative shadow-inner"
                  style={{ backgroundImage: `url(${bgImg})` }}
                >
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {priceBadge && (
                      <span className="bg-[#231b15]/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full backdrop-blur-xs border border-amber-500/30">
                        {priceBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span
                className={`mt-1.5 text-[11px] font-bold tracking-tight text-center max-w-[75px] truncate ${
                  isSelected ? 'text-amber-700' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CategoryScroll;
