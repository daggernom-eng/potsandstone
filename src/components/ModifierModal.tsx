'use client';

import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import VegNonVegIcon from './VegNonVegIcon';
import { ProductItem } from '@/lib/data';
import { useCartStore } from '@/store/cartStore';

interface ModifierModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export type PizzaSize = 'Regular' | 'Medium' | 'Large';

export interface CrustOption {
  name: string;
  priceModifier: {
    Regular: number;
    Medium: number;
    Large: number;
  };
  description: string;
}

const CRUST_OPTIONS: CrustOption[] = [
  {
    name: 'Classic Thin Crust',
    priceModifier: { Regular: 0, Medium: 0, Large: 0 },
    description: 'Light, crunchy wafer-thin artisanal crust baked till golden brown',
  },
  {
    name: 'Cheese Melt Crust',
    priceModifier: { Regular: 60, Medium: 90, Large: 120 },
    description: 'Artisanal crust stuffed with rich oozing molten cheese blend',
  },
  {
    name: 'Herb Infused Crust',
    priceModifier: { Regular: 40, Medium: 60, Large: 80 },
    description: 'Handcrafted dough infused with fresh basil, oregano & garlic butter',
  },
];

export const ModifierModal: React.FC<ModifierModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('Regular');
  const [selectedCrust, setSelectedCrust] = useState<string>('Classic Thin Crust');
  const [quantity, setQuantity] = useState<number>(1);
  const [extraCheese, setExtraCheese] = useState<boolean>(false);

  if (!isOpen || !product) return null;

  const isPizza = product.categorySlug === 'classic-pizzas';

  // Base price calculation based on size:
  // Regular = basePrice, Medium = basePrice + 120, Large = basePrice + 220
  const sizePriceAddon = {
    Regular: 0,
    Medium: 120,
    Large: 220,
  }[selectedSize];

  const currentCrustObj = CRUST_OPTIONS.find((c) => c.name === selectedCrust) || CRUST_OPTIONS[0];
  const crustPrice = isPizza ? currentCrustObj.priceModifier[selectedSize] : 0;
  const extraCheesePrice = extraCheese ? 50 : 0;

  const unitPrice = product.price + (isPizza ? sizePriceAddon + crustPrice : 0) + extraCheesePrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: unitPrice,
      basePrice: product.price,
      size: isPizza ? selectedSize : 'Standard',
      crust: isPizza ? (extraCheese ? `${selectedCrust} (+ Extra Cheese)` : selectedCrust) : 'Standard',
      quantity,
      image: product.image,
      isVeg: product.isVeg,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-amber-100 bg-[#231b15] text-white">
          <div className="flex items-center space-x-2">
            <VegNonVegIcon isVeg={product.isVeg} size="md" />
            <h3 className="font-extrabold text-base leading-tight text-white">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Customization Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-6 flex-1 text-sm">
          {/* Product quick summary */}
          <div className="flex space-x-3.5 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm font-black text-gray-900">₹{unitPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{unitPrice + 50}</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  Save ₹50
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Choose Size (for Pizzas) */}
          {isPizza && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider">
                  1. Select Size <span className="text-red-500">*</span>
                </h4>
                <span className="text-[11px] font-semibold text-gray-500">Pick 1 option</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {(['Regular', 'Medium', 'Large'] as PizzaSize[]).map((size) => {
                  const isSelected = selectedSize === size;
                  const priceDiff = size === 'Regular' ? product.price : size === 'Medium' ? product.price + 120 : product.price + 220;
                  const serves = size === 'Regular' ? 'Serves 1' : size === 'Medium' ? 'Serves 2' : 'Serves 4';

                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/70 ring-2 ring-amber-700 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`font-black text-xs ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                            {size}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-700 bg-amber-700 text-white' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{serves}</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 mt-2">₹{priceDiff}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Choose Crust (for Pizzas) */}
          {isPizza && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-black text-xs text-gray-900 uppercase tracking-wider">
                  2. Select Crust Style <span className="text-red-500">*</span>
                </h4>
                <span className="text-[11px] font-semibold text-gray-500">Pick 1 option</span>
              </div>

              <div className="space-y-2">
                {CRUST_OPTIONS.map((crust) => {
                  const isSelected = selectedCrust === crust.name;
                  const addedCost = crust.priceModifier[selectedSize];

                  return (
                    <button
                      key={crust.name}
                      onClick={() => setSelectedCrust(crust.name)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/50 ring-1 ring-amber-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5 pr-2">
                        <div
                          className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-amber-700 bg-amber-700 text-white' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-gray-900">{crust.name}</span>
                            {crust.name === 'Classic Thin Crust' && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                ⭐ Chef Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{crust.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-gray-900 shrink-0">
                        {addedCost === 0 ? 'Included' : `+₹${addedCost}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Extra Cheese Topping */}
          {isPizza && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🧀</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Extra Artisanal Mozzarella</p>
                  <p className="text-[10px] text-gray-600">Rich layer of gourmet mozzarella</p>
                </div>
              </div>
              <button
                onClick={() => setExtraCheese(!extraCheese)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  extraCheese
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                }`}
              >
                {extraCheese ? 'Added (+₹50)' : '+ ₹50'}
              </button>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="font-bold text-xs text-gray-700">Quantity</span>
            <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1.5 rounded-xl">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 rounded-md bg-white text-gray-700 font-bold flex items-center justify-center shadow-xs hover:bg-gray-50 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm text-gray-900 w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 rounded-md bg-white text-gray-700 font-bold flex items-center justify-center shadow-xs hover:bg-gray-50"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer sticky Add to cart button */}
        <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={handleAddToCart}
            className="w-full bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-md transition-all"
          >
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider font-semibold">
                {quantity} Item{quantity > 1 ? 's' : ''} Selected
              </span>
              <span className="text-base font-black">₹{totalPrice}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-black tracking-wide">ADD TO ORDER</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ModifierModal;
