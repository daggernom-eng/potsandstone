'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, ChevronRight, Check } from 'lucide-react';
import { BannerItem } from '@/lib/data';
import { useCartStore } from '@/store/cartStore';

interface BannerCarouselProps {
  banners: BannerItem[];
  onApplyCoupon?: (code: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, onApplyCoupon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { applyCoupon } = useCartStore();

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleClaim = (code: string) => {
    setCopiedCode(code);
    applyCoupon(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#231b15] via-[#1a1410] to-[#f8f6f2] pt-2 pb-5 px-4">
      {/* Pots & Stones style banner card */}
      <div className="relative w-full aspect-[2.1/1] sm:aspect-[2.5/1] rounded-2xl overflow-hidden shadow-xl border border-amber-500/20 group">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
          style={{ backgroundImage: `url(${banners[currentIndex]?.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-4 z-10 text-white">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{banners[currentIndex]?.tag}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md tracking-tight">
              {banners[currentIndex]?.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5 max-w-[75%] line-clamp-1">
              {banners[currentIndex]?.subtitle}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleClaim(banners[currentIndex]?.badge || '')}
              className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg transition-all"
            >
              {copiedCode === banners[currentIndex]?.badge ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <span>ORDER NOW</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <span className="text-[10px] text-amber-200 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30 font-mono font-semibold">
              {banners[currentIndex]?.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="flex justify-center items-center space-x-1.5 mt-2.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-5 bg-amber-600' : 'w-1.5 bg-amber-900/40'
            }`}
          />
        ))}
      </div>

      {/* Free delivery badge strip */}
      <div className="mt-2.5 bg-white rounded-xl py-2 px-3 flex items-center justify-between shadow-xs border border-amber-100">
        <div className="flex items-center space-x-2">
          <span className="text-base">☕</span>
          <div>
            <p className="text-xs font-bold text-amber-950 leading-tight">Freshly Brewed & Free Delivery</p>
            <p className="text-[10px] text-gray-500">Add items worth ₹400 to get FREE delivery!</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-amber-700 shrink-0">Pots & Stones Cafe</span>
      </div>
    </div>
  );
};
export default BannerCarousel;
