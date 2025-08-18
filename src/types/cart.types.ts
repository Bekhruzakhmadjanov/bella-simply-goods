import type { Product } from "./product.types";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}