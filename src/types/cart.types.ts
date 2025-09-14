// src/types/cart.types.ts - Updated to use string IDs consistently

import type { Product } from './product.types';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  totals: CartTotals;
  itemCount: number;
}