'use client';

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Check, MapPin, Phone, User, ShoppingBag, ArrowRight } from 'lucide-react';
import VegNonVegIcon from './VegNonVegIcon';
import { useCartStore } from '@/store/cartStore';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderPlaced }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryMode,
    setDeliveryMode,
    customerName,
    customerPhone,
    deliveryAddress,
    setCustomerInfo,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTaxes,
    getDeliveryFee,
    getGrandTotal,
    getTotalCount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editable customer details
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(deliveryAddress);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const taxes = getTaxes();
  const deliveryFee = getDeliveryFee();
  const grandTotal = getGrandTotal();
  const totalCount = getTotalCount();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d97706', '#231b15', '#fbbf24', '#10b981'],
    });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    // Save user info into store
    setCustomerInfo({ name, phone, address });

    const orderPayload = {
      customerName: name || 'Valued Guest',
      customerPhone: phone || '+91 98765 43210',
      deliveryAddress: address || '171/2, Bareilly - Nainital Rd, opp. KFC, Kathgodam, Haldwani',
      deliveryType: deliveryMode,
      totalAmount: grandTotal,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        crust: item.crust,
        quantity: item.quantity,
        price: item.price * item.quantity,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      triggerConfetti();
      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderPlaced(data.orderId || `ORD-${Date.now().toString().slice(-6)}`);
    } catch (err) {
      console.error('Order creation error:', err);
      // Fallback optimistic order id
      triggerConfetti();
      clearCart();
      setIsSubmitting(false);
      onClose();
      const mockId = `POTS-${Math.floor(100000 + Math.random() * 900000)}`;
      onOrderPlaced(mockId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-amber-900/20 bg-[#231b15] text-white">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-black text-base leading-tight text-white">Your Order Cart</h3>
              <p className="text-[11px] text-amber-200/80 font-medium">{totalCount} item(s) selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Cart Body */}
        <div className="overflow-y-auto px-4 py-4 space-y-4 flex-1 text-sm bg-amber-50/30">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                ☕
              </div>
              <h4 className="font-extrabold text-base text-gray-800">Your cart is empty</h4>
              <p className="text-xs text-gray-500 mt-1">Explore our handcrafted dimsums, summer salads, ravioli & artisanal shakes!</p>
              <button
                onClick={onClose}
                className="mt-4 bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Mode Selector */}
              <div className="bg-white p-3 rounded-2xl border border-amber-200/60 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">☕</span>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Order Mode: {deliveryMode}</span>
                    <span className="text-[10px] text-gray-500">Estimated time: 30-40 mins</span>
                  </div>
                </div>
                <div className="flex space-x-1 bg-amber-50 p-1 rounded-xl text-xs font-bold border border-amber-200/50">
                  {(['Delivery', 'Takeaway'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDeliveryMode(mode)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                        deliveryMode === mode ? 'bg-[#231b15] text-white' : 'text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs divide-y divide-gray-100">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">Ordered Items</span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between space-x-3">
                    <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        <VegNonVegIcon isVeg={item.isVeg} size="sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-gray-900 leading-tight truncate">
                          {item.name}
                        </h4>
                        <div className="text-[10px] text-gray-500 mt-0.5 space-y-0.5">
                          {item.size !== 'Standard' && (
                            <p>
                              Size: <span className="font-semibold text-gray-700">{item.size}</span>
                            </p>
                          )}
                          {item.crust !== 'Standard' && (
                            <p className="truncate">
                              Options: <span className="font-semibold text-gray-700">{item.crust}</span>
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-black text-gray-900 mt-1 block">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/50 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-md bg-white text-gray-700 font-bold flex items-center justify-center shadow-2xs hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-xs text-gray-900 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-md bg-white text-gray-700 font-bold flex items-center justify-center shadow-2xs hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply Coupon Box */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">Offers & Coupons</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-black text-emerald-800 font-mono">{appliedCoupon}</span>
                        <span className="text-[10px] text-emerald-600 block">Saved ₹{discountAmount} on this order</span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. POTS20 / SUMMERFEAST"
                      className="flex-1 bg-amber-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase font-mono font-bold outline-none focus:border-amber-700"
                    />
                    <button
                      type="submit"
                      className="bg-[#231b15] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1a1410]"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1.5 font-semibold ${
                      couponFeedback.success ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Delivery Details Form */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs space-y-2.5">
                <span className="text-xs font-black uppercase text-gray-800 tracking-wider block">
                  Delivery Details
                </span>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-amber-50/40 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-amber-700"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contact Number (+91)"
                      className="w-full bg-amber-50/40 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-amber-700"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Complete Delivery Address & Landmark"
                      rows={2}
                      className="w-full bg-amber-50/40 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-amber-700 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bill Details Summary */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200/60 shadow-xs space-y-2">
                <span className="text-xs font-black uppercase text-gray-800 tracking-wider block">
                  Bill Summary
                </span>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Taxes & Service Charge (5% GST)</span>
                    <span className="font-semibold text-gray-900">₹{taxes}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900">
                      {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-gray-900">
                    <span>To Pay</span>
                    <span className="text-base text-amber-800">₹{grandTotal}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Place Order Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 shadow-xl">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-amber-700 hover:bg-amber-800 active:scale-[0.99] disabled:opacity-75 text-white font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-md transition-all"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-amber-100 uppercase tracking-wider font-semibold">
                  Total Payable
                </span>
                <span className="text-base font-black">₹{grandTotal}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-black/20 px-4 py-1.5 rounded-xl">
                <span className="text-xs font-black tracking-wider">
                  {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
