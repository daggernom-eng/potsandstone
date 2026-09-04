'use client';

import React, { useState } from 'react';
import { MapPin, ChevronDown, Search, User, Coffee } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, onOpenProfile }) => {
  const { deliveryMode, setDeliveryMode } = useCartStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#231b15] text-white shadow-md">
      {/* Top status bar: Location + Points + Profile */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="font-bold text-sm tracking-tight truncate">Pots & Stones, Kathgodam</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            </div>
            <p className="text-[11px] text-amber-200/80 truncate">171/2 Bareilly - Nainital Rd, opp. KFC</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Coffee points pill */}
          <div className="flex items-center space-x-1 bg-white/10 hover:bg-white/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <span className="text-amber-400">☕</span>
            <span className="text-amber-100">120/600</span>
          </div>

          {/* Search toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Search Menu"
          >
            <Search className="w-4 h-4 text-white" />
          </button>

          {/* Profile icon */}
          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Profile & Orders"
          >
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (expandable) */}
      {showSearch && (
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Search Dimsums, Ravioli, Margherita, Kitkat Shake..."
              className="w-full bg-white text-gray-800 placeholder-gray-400 text-xs rounded-full pl-9 pr-4 py-2 outline-none shadow-inner"
              autoFocus
            />
            {searchVal && (
              <button
                onClick={() => {
                  setSearchVal('');
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delivery / Takeaway / Dine-in Tabs */}
      <div className="px-3 pb-2.5">
        <div className="grid grid-cols-3 bg-black/40 p-1 rounded-xl backdrop-blur-xs text-xs font-medium border border-amber-900/30">
          <button
            onClick={() => setDeliveryMode('Delivery')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              deliveryMode === 'Delivery'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="block leading-tight">Delivery</span>
            <span className="text-[10px] opacity-90 font-normal">30-40 Mins</span>
          </button>

          <button
            onClick={() => setDeliveryMode('Takeaway')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              deliveryMode === 'Takeaway'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="block leading-tight">Takeaway</span>
            <span className="text-[10px] opacity-90 font-normal">Kerbside Pickup</span>
          </button>

          <button
            onClick={() => setDeliveryMode('Dine-in')}
            className={`py-1.5 px-2 rounded-lg text-center transition-all ${
              deliveryMode === 'Dine-in'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <span className="block leading-tight">Dine-in</span>
            <span className="text-[10px] opacity-90 font-normal">Table Order</span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
