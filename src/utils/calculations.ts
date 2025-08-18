import type { CartItem, CartTotals } from '../types/cart.types';
import { CONFIG } from '../constants/config';

export const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

export const calculateTotals = (cart: CartItem[]): CartTotals => {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * CONFIG.TAX_RATE;
  const shipping = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BG-${timestamp}-${random}`.toUpperCase();
};