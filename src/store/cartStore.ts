import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // generated from productId-size-crust
  productId: string;
  name: string;
  price: number; // final unit price with size and crust modifier
  basePrice: number;
  size: 'Regular' | 'Medium' | 'Large' | 'Standard';
  crust: string;
  quantity: number;
  image: string;
  isVeg: boolean;
}

interface CartStore {
  items: CartItem[];
  deliveryMode: 'Delivery' | 'Takeaway' | 'Dine-in';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  appliedCoupon: string | null;
  discountAmount: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryMode: (mode: 'Delivery' | 'Takeaway' | 'Dine-in') => void;
  setCustomerInfo: (info: { name?: string; phone?: string; address?: string }) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Computed helpers
  getTotalCount: () => number;
  getSubtotal: () => number;
  getTaxes: () => number;
  getDeliveryFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryMode: 'Delivery',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      deliveryAddress: '171/2, Bareilly - Nainital Rd, opp. KFC, Kathgodam, Haldwani',
      appliedCoupon: null,
      discountAmount: 0,

      addItem: (itemData) => {
        const id = `${itemData.productId}-${itemData.size}-${itemData.crust.replace(/\s+/g, '-').toLowerCase()}`;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += itemData.quantity || 1;
          set({ items: updated });
        } else {
          set({ items: [...currentItems, { ...itemData, id, quantity: itemData.quantity || 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          });
        }
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, discountAmount: 0 });
      },

      setDeliveryMode: (deliveryMode) => {
        set({ deliveryMode });
      },

      setCustomerInfo: (info) => {
        set((state) => ({
          customerName: info.name !== undefined ? info.name : state.customerName,
          customerPhone: info.phone !== undefined ? info.phone : state.customerPhone,
          deliveryAddress: info.address !== undefined ? info.address : state.deliveryAddress,
        }));
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();

        if (subtotal <= 0) {
          return { success: false, message: 'Your cart is empty' };
        }

        if (cleanCode === 'POTS20') {
          const discount = Math.min(150, Math.round(subtotal * 0.20));
          set({ appliedCoupon: cleanCode, discountAmount: discount });
          return { success: true, message: `Pots & Stones 20% offer applied! Saved ₹${discount}` };
        }

        if (cleanCode === 'SUMMERFEAST') {
          if (subtotal < 400) {
            return { success: false, message: 'Minimum cart value of ₹400 required for SUMMERFEAST' };
          }
          const discount = 120;
          set({ appliedCoupon: cleanCode, discountAmount: discount });
          return { success: true, message: `Summer Feast offer applied! Saved ₹120` };
        }

        if (cleanCode === 'STONES100') {
          if (subtotal < 500) {
            return { success: false, message: 'Minimum cart value of ₹500 required for STONES100' };
          }
          const discount = 100;
          set({ appliedCoupon: cleanCode, discountAmount: discount });
          return { success: true, message: 'Flat ₹100 discount applied!' };
        }

        return { success: false, message: 'Invalid coupon code. Try POTS20, SUMMERFEAST or STONES100' };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, discountAmount: 0 });
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTaxes: () => {
        const subtotal = get().getSubtotal();
        // 5% GST
        return Math.round(subtotal * 0.05);
      },

      getDeliveryFee: () => {
        const { deliveryMode } = get();
        if (deliveryMode !== 'Delivery') return 0;
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free delivery over ₹400, else ₹40
        return subtotal >= 400 ? 0 : 40;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const taxes = get().getTaxes();
        const delivery = get().getDeliveryFee();
        const discount = get().discountAmount;
        return Math.max(0, subtotal + taxes + delivery - discount);
      },
    }),
    {
      name: 'potsandstones-cart-storage',
    }
  )
);
