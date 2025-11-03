// src/types/common.types.ts
export type Route = 'home' | 'products' | 'product-detail' | 'cart' | 'checkout' | 'tracking' | 'confirmation' | 'leave-review' | 'admin';

export interface State {
  code: string;
  name: string;
}